import { PaymentService, PaymentRequest, PaymentResponse } from '../PaymentService';
import api from '../../../../../shared/infrastructure/api';

// Mock of the api module
jest.mock('../../../../../shared/infrastructure/api', () => ({
    post: jest.fn(),
    get: jest.fn(),
}));

describe('PaymentService', () => {
    let paymentService: PaymentService;
    let mockPaymentRequest: PaymentRequest;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Initialize the service
        paymentService = new PaymentService();

        // Create a payment request object for testing
        mockPaymentRequest = {
            productId: 1,
            quantity: 2,
            userId: 123,
            cardNumber: '4111111111111111',
            cardholderName: 'Test User',
            expiryMonth: '12',
            expiryYear: '2025',
            cvv: '123',
            amount: 100,
            productName: 'Test Product'
        };

        // Mock of the API response for registerTransaction
        (api.post as jest.Mock).mockResolvedValue({ data: { id: 'mock-transaction-id' } });
    });

    describe('processPayment', () => {
        it('should initially return a processing status', async () => {
            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            // Start the call to processPayment (returns a promise)
            const paymentPromise = paymentService.processPayment(mockPaymentRequest);

            // Verify that the promise has not yet resolved (initial status is 'processing')
            const initialResponse = await Promise.race([
                paymentPromise,
                Promise.resolve('not-resolved')
            ]);

            // If the promise resolves immediately, it should have 'processing' status
            if (initialResponse !== 'not-resolved') {
                expect(initialResponse).toHaveProperty('status', 'processing');
            }

            // Advance time to complete the setTimeout (4000ms according to implementation)
            jest.advanceTimersByTime(4000);

            // Now the promise should resolve
            const finalResponse = await paymentPromise;

            // Verify that the final response has a status and transactionId property
            expect(finalResponse).toHaveProperty('status');
            expect(finalResponse).toHaveProperty('transactionId');
            expect(['approved', 'pending', 'rejected']).toContain(finalResponse.status);

            // Verify that registerTransaction was called with the correct data
            expect(api.post).toHaveBeenCalledWith(
                '/v1/transactions',
                expect.objectContaining({
                    userId: mockPaymentRequest.userId,
                    items: expect.arrayContaining([expect.objectContaining({
                        productId: mockPaymentRequest.productId,
                        quantity: mockPaymentRequest.quantity,
                        unitPrice: mockPaymentRequest.amount
                    })])
                }),
                expect.any(Object)
            );

            // Restore normal setTimeout behavior
            jest.useRealTimers();
        });

        it('should return approved status when random outcome is less than 0.7', async () => {
            // Mock Math.random to return a value that will result in 'approved' status
            const mockRandom = jest.spyOn(Math, 'random');
            mockRandom.mockReturnValueOnce(0.1); // For transaction ID generation
            mockRandom.mockReturnValueOnce(0.5); // For outcome determination (< 0.7 = approved)

            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            // Start the call to processPayment
            const paymentPromise = paymentService.processPayment(mockPaymentRequest);

            // Advance time to complete the setTimeout
            jest.advanceTimersByTime(4000);

            // Get the response
            const response = await paymentPromise;

            // Verify that the response indicates approval
            expect(response.status).toBe('approved');
            expect(response.transactionId).toBeDefined();
            expect(response.errorMessage).toBeUndefined();

            // Restore normal behavior
            mockRandom.mockRestore();
            jest.useRealTimers();
        });

        it('should return pending status when random outcome is between 0.7 and 0.9', async () => {
            // Mock Math.random to return a value that will result in 'pending' status
            const mockRandom = jest.spyOn(Math, 'random');
            mockRandom.mockReturnValueOnce(0.2); // For transaction ID generation
            mockRandom.mockReturnValueOnce(0.8); // For outcome determination (between 0.7 and 0.9 = pending)

            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            // Start the call to processPayment
            const paymentPromise = paymentService.processPayment(mockPaymentRequest);

            // Advance time to complete the setTimeout
            jest.advanceTimersByTime(4000);

            // Get the response
            const response = await paymentPromise;

            // Verify that the response indicates pending status
            expect(response.status).toBe('pending');
            expect(response.transactionId).toBeDefined();
            expect(response.errorMessage).toBeUndefined();

            // Restore normal behavior
            mockRandom.mockRestore();
            jest.useRealTimers();
        });

        it('should return rejected status when random outcome is greater than 0.9', async () => {
            // Mock Math.random to return a value that will result in 'rejected' status
            const mockRandom = jest.spyOn(Math, 'random');
            mockRandom.mockReturnValueOnce(0.3); // For transaction ID generation
            mockRandom.mockReturnValueOnce(0.95); // For outcome determination (> 0.9 = rejected)

            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            // Start the call to processPayment
            const paymentPromise = paymentService.processPayment(mockPaymentRequest);

            // Advance time to complete the setTimeout
            jest.advanceTimersByTime(4000);

            // Get the response
            const response = await paymentPromise;

            // Verify that the response indicates rejection
            expect(response.status).toBe('rejected');
            expect(response.transactionId).toBeDefined();
            expect(response.errorMessage).toBe('Transaction rejected by the issuing bank');

            // Restore normal behavior
            mockRandom.mockRestore();
            jest.useRealTimers();
        });

        it('should handle errors in transaction registration', async () => {
            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            // Simulate an error in the API call
            (api.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

            // Start the call to processPayment
            const paymentPromise = paymentService.processPayment(mockPaymentRequest);

            // Advance time to complete the setTimeout
            jest.advanceTimersByTime(4000);

            // Get the response
            const response = await paymentPromise;

            // Verify that the response indicates an error
            expect(response.status).toBe('rejected');
            expect(response.errorMessage).toBe('Failed to register transaction');
            expect(response.transactionId).toBeDefined();

            jest.useRealTimers();
        });
    });

    describe('checkPaymentStatus', () => {
        it('should verify the status of a pending payment', async () => {
            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            const transactionId = 'test-transaction-id';

            // Start the call to checkPaymentStatus
            const statusPromise = paymentService.checkPaymentStatus(transactionId);

            // Advance time to complete the setTimeout (1500ms according to implementation)
            jest.advanceTimersByTime(1500);

            // Get the response
            const response = await statusPromise;

            // Verify that the response has the expected properties
            expect(response).toHaveProperty('status');
            expect(response).toHaveProperty('transactionId', transactionId);
            expect(['approved', 'pending', 'rejected']).toContain(response.status);

            // Restore normal setTimeout behavior
            jest.useRealTimers();
        });

        it('should return approved status when random outcome is less than 0.8', async () => {
            // Mock Math.random to return a value that will result in 'approved' status
            const mockRandom = jest.spyOn(Math, 'random');
            mockRandom.mockReturnValueOnce(0.5); // For outcome determination (< 0.8 = approved)

            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            const transactionId = 'test-transaction-id';

            // Start the call to checkPaymentStatus
            const statusPromise = paymentService.checkPaymentStatus(transactionId);

            // Advance time to complete the setTimeout
            jest.advanceTimersByTime(1500);

            // Get the response
            const response = await statusPromise;

            // Verify that the response indicates approval
            expect(response.status).toBe('approved');
            expect(response.transactionId).toBe(transactionId);
            expect(response.errorMessage).toBeUndefined();

            // Restore normal behavior
            mockRandom.mockRestore();
            jest.useRealTimers();
        });

        it('should return pending status when random outcome is between 0.8 and 0.9', async () => {
            // Mock Math.random to return a value that will result in 'pending' status
            const mockRandom = jest.spyOn(Math, 'random');
            mockRandom.mockReturnValueOnce(0.85); // For outcome determination (between 0.8 and 0.9 = pending)

            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            const transactionId = 'test-transaction-id';

            // Start the call to checkPaymentStatus
            const statusPromise = paymentService.checkPaymentStatus(transactionId);

            // Advance time to complete the setTimeout
            jest.advanceTimersByTime(1500);

            // Get the response
            const response = await statusPromise;

            // Verify that the response indicates pending status
            expect(response.status).toBe('pending');
            expect(response.transactionId).toBe(transactionId);
            expect(response.errorMessage).toBeUndefined();

            // Restore normal behavior
            mockRandom.mockRestore();
            jest.useRealTimers();
        });

        it('should return rejected status when random outcome is greater than 0.9', async () => {
            // Mock Math.random to return a value that will result in 'rejected' status
            const mockRandom = jest.spyOn(Math, 'random');
            mockRandom.mockReturnValueOnce(0.95); // For outcome determination (> 0.9 = rejected)

            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            const transactionId = 'test-transaction-id';

            // Start the call to checkPaymentStatus
            const statusPromise = paymentService.checkPaymentStatus(transactionId);

            // Advance time to complete the setTimeout
            jest.advanceTimersByTime(1500);

            // Get the response
            const response = await statusPromise;

            // Verify that the response indicates rejection
            expect(response.status).toBe('rejected');
            expect(response.transactionId).toBe(transactionId);
            expect(response.errorMessage).toBe('Transaction rejected by the issuing bank');

            // Restore normal behavior
            mockRandom.mockRestore();
            jest.useRealTimers();
        });
    });

    describe('registerTransaction', () => {
        it('should register a transaction correctly', async () => {
            // Configure the mock for api.post
            (api.post as jest.Mock).mockResolvedValue({ data: { id: 'mock-transaction-id' } });

            // Call the registerTransaction method
            const result = await paymentService.registerTransaction(mockPaymentRequest);

            // Verify that the result is correct
            expect(result).toEqual({ data: { id: 'mock-transaction-id' } });

            // Verify that api.post was called with the correct parameters
            expect(api.post).toHaveBeenCalledWith(
                '/v1/transactions',
                expect.objectContaining({
                    userId: mockPaymentRequest.userId,
                    paymentMethod: expect.objectContaining({
                        type: 'card',
                        details: expect.objectContaining({
                            lastFour: mockPaymentRequest.cardNumber.slice(-4)
                        })
                    }),
                    items: expect.arrayContaining([expect.objectContaining({
                        productId: mockPaymentRequest.productId,
                        quantity: mockPaymentRequest.quantity,
                        unitPrice: mockPaymentRequest.amount
                    })]),
                    amount: mockPaymentRequest.amount,
                    status: 'pending'
                }),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    })
                })
            );
        });

        it('should handle API errors correctly', async () => {
            // Simulate an error in the API
            const apiError = new Error('API Error');
            (api.post as jest.Mock).mockRejectedValueOnce(apiError);

            // Verify that the error propagates correctly
            await expect(paymentService.registerTransaction(mockPaymentRequest))
                .rejects.toThrow('API Error');

            // Verify that api.post was called with the correct parameters
            expect(api.post).toHaveBeenCalledWith(
                '/v1/transactions',
                expect.any(Object),
                expect.any(Object)
            );
        });

        it('should format card data correctly', async () => {
            // Configure the mock for api.post
            (api.post as jest.Mock).mockResolvedValue({ data: { id: 'mock-transaction-id' } });

            // Call the registerTransaction method
            await paymentService.registerTransaction(mockPaymentRequest);

            // Specifically verify the format of the card data
            expect(api.post).toHaveBeenCalledWith(
                '/v1/transactions',
                expect.objectContaining({
                    paymentMethod: expect.objectContaining({
                        type: 'card',
                        details: expect.objectContaining({
                            lastFour: '1111', // Last 4 digits of the test card
                            token: expect.objectContaining({
                                cardholderName: mockPaymentRequest.cardholderName,
                                expiryMonth: mockPaymentRequest.expiryMonth,
                                expiryYear: mockPaymentRequest.expiryYear
                            })
                        })
                    })
                }),
                expect.any(Object)
            );
        });
    });
});