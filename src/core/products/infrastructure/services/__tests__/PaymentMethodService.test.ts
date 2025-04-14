import api from '../../../../../shared/infrastructure/api';
import { PaymentMethodService } from '../PaymentMethodService';

// Mock of the api module
jest.mock('../../../../../shared/infrastructure/api', () => ({
    get: jest.fn(),
}));

describe('PaymentMethodService', () => {
    let paymentMethodService: PaymentMethodService;
    const mockUserId = 'user_123';

    // Mock API response
    const mockApiResponse = {
        status: 200,
        data: [
            {
                paymentMethodId: 1,
                isDefault: true,
                details: {
                    type: 'credit',
                    cardNumber: '4111111111111111',
                    lastFour: '1111',
                    brand: 'visa',
                    token: {
                        cardholderName: 'Yovany Suárez Silva',
                        expiryMonth: '12',
                        expiryYear: '25'
                    }
                }
            },
            {
                paymentMethodId: 2,
                isDefault: false,
                details: {
                    type: 'credit',
                    cardNumber: '5555555555554444',
                    lastFour: '4444',
                    brand: 'mastercard',
                    token: {
                        cardholderName: 'Yovany Suárez Silva',
                        expiryMonth: '10',
                        expiryYear: '24'
                    }
                }
            }
        ]
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Initialize the service
        paymentMethodService = new PaymentMethodService();

        // Configure the mock for api.get
        (api.get as jest.Mock).mockResolvedValue(mockApiResponse);
    });

    describe('getUserPaymentMethods', () => {
        it('should get the user payment methods from the API', async () => {
            // Call the getUserPaymentMethods method
            const result = await paymentMethodService.getUserPaymentMethods(mockUserId);

            // Verify that api.get was called with the correct parameters
            expect(api.get).toHaveBeenCalledWith(`/v1/payment-methods/user/${mockUserId}`);

            // Verify that the result is correct
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(expect.objectContaining({
                id: '1',
                type: 'credit',
                cardNumber: '4111111111111111',
                lastFour: '1111',
                cardholderName: 'Yovany Suárez Silva',
                expiryMonth: '12',
                expiryYear: '25',
                brand: 'visa',
                isDefault: true,
                isExpired: false
            }));
        });

        it('should return mock data when the API does not return valid data', async () => {
            // Configure the mock for api.get to simulate an unsuccessful response
            (api.get as jest.Mock).mockResolvedValue({ status: 404, data: [] });

            // Call the getUserPaymentMethods method
            const result = await paymentMethodService.getUserPaymentMethods(mockUserId);

            // Verify that api.get was called with the correct parameters
            expect(api.get).toHaveBeenCalledWith(`/v1/payment-methods/user/${mockUserId}`);

            // Verify that mock data is returned
            expect(result).toHaveLength(3); // The mock data has 3 payment methods
            expect(result[0]).toEqual(expect.objectContaining({
                id: 'pm_1',
                type: 'credit',
                lastFour: '1111',
                isDefault: true
            }));
            expect(result[2]).toEqual(expect.objectContaining({
                id: 'pm_3',
                isExpired: true
            }));
        });

        it('should handle the case when item.details is undefined', async () => {
            // Configure the mock for api.get to simulate a response with item.details undefined
            (api.get as jest.Mock).mockResolvedValue({
                status: 200,
                data: [{
                    paymentMethodId: 'pm_4',
                    details: undefined,
                    isDefault: false
                }]
            });

            // Call the getUserPaymentMethods method
            const result = await paymentMethodService.getUserPaymentMethods(mockUserId);

            // Verify that api.get was called with the correct parameters
            expect(api.get).toHaveBeenCalledWith(`/v1/payment-methods/user/${mockUserId}`);

            // Verify that the result correctly handles the case of item.details undefined
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(expect.objectContaining({
                id: 'pm_4',
                type: undefined,
                cardNumber: undefined,
                lastFour: undefined,
                cardholderName: undefined,
                expiryMonth: undefined,
                expiryYear: undefined,
                brand: undefined,
                isDefault: false,
                isExpired: false
            }));
        });

        /*
        it('should handle API errors correctly', async () => {
            // Simulate an API error
            const apiError = new Error('API Error');
            (api.get as jest.Mock).mockRejectedValueOnce(apiError);

            // Call the getUserPaymentMethods method
            const result = await paymentMethodService.getUserPaymentMethods(mockUserId);

            // Verify that api.get was called with the correct parameters
            expect(api.get).toHaveBeenCalledWith(`/v1/payment-methods/user/${mockUserId}`);

            // Verify that mock data is returned in case of error
            expect(result).toHaveLength(3);
            expect(result[0].id).toBe('pm_1');
        });
        */
    });

    describe('processPaymentWithSavedMethod', () => {
        it('should process a payment with a saved method correctly', async () => {
            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            // Spy on console.log
            const consoleSpy = jest.spyOn(console, 'log');

            // Parameters for the method
            const paymentMethodId = 'pm_1';
            const amount = 100;
            const productId = 1;
            const quantity = 2;
            const userId = 'user_123';

            // Start the call to processPaymentWithSavedMethod
            const paymentPromise = paymentMethodService.processPaymentWithSavedMethod(
                paymentMethodId,
                amount,
                productId,
                quantity,
                userId
            );

            // Advance time to complete the setTimeout (2000ms according to implementation)
            jest.advanceTimersByTime(2000);

            // Get the response
            const response = await paymentPromise;

            // Verify that console.log was called with the correct parameters
            expect(consoleSpy).toHaveBeenCalledWith('Processing payment with method:', paymentMethodId, 'for amount:', amount);
            expect(consoleSpy).toHaveBeenCalledWith('Product ID:', productId);
            expect(consoleSpy).toHaveBeenCalledWith('Quantity:', quantity);
            expect(consoleSpy).toHaveBeenCalledWith('User ID:', userId);

            // Verify that the response has the expected properties
            expect(response).toHaveProperty('status', 'approved');
            expect(response).toHaveProperty('transactionId');
            expect(response.transactionId).toMatch(/^txn_[a-z0-9]+$/);
            expect(response.errorMessage).toBeUndefined();

            // Restore normal behavior of setTimeout and console.log
            jest.useRealTimers();
            consoleSpy.mockRestore();
        });

        it('should generate a unique transaction ID for each payment', async () => {
            // Configure jest to spy on setTimeout
            jest.useFakeTimers();

            // Parameters for the method
            const paymentMethodId = 'pm_1';
            const amount = 100;
            const productId = 1;
            const quantity = 1;
            const userId = 'user_123';

            // Process two consecutive payments
            const paymentPromise1 = paymentMethodService.processPaymentWithSavedMethod(
                paymentMethodId, amount, productId, quantity, userId
            );

            jest.advanceTimersByTime(2000);
            const response1 = await paymentPromise1;

            const paymentPromise2 = paymentMethodService.processPaymentWithSavedMethod(
                paymentMethodId, amount, productId, quantity, userId
            );

            jest.advanceTimersByTime(2000);
            const response2 = await paymentPromise2;

            // Verify that the transaction IDs are different
            expect(response1.transactionId).not.toBe(response2.transactionId);
            expect(response1.status).toBe('approved');
            expect(response2.status).toBe('approved');

            // Restore normal behavior of setTimeout
            jest.useRealTimers();
        });
    });
});