import api from '../../../../shared/infrastructure/api';
// import { JwtService } from '../../../../shared/infrastructure/JwtService';
import { PaymentStatus } from '../../presentation/components/PaymentSummary';

export interface PaymentResponse {
    status: PaymentStatus;
    transactionId?: string;
    errorMessage?: string;
}

export interface PaymentRequest {
    productId: number;
    quantity: number;
    userId: number;
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    amount: number;
    productName?: string;
}

export class PaymentService {
    // private jwtService: JwtService;

    constructor() {
        //this.jwtService = new JwtService();
    }
    /**
     * Process a payment transaction
     * @param paymentData Payment information
     * @returns Promise with payment response
     */
    async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
        // In a real implementation, this would call the payment API
        // For simulation purposes, we'll use setTimeout to mimic API latency

        // First, return processing status immediately
        const processingResponse: PaymentResponse = {
            status: 'processing'
        };

        // Simulate API call with random outcomes
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate a random transaction ID
                const transactionId = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

                // Simulate different payment outcomes
                const randomOutcome = Math.random();

                // Determine payment status based on random outcome
                let status: PaymentStatus;
                let responseData: PaymentResponse;

                if (randomOutcome < 0.7) {
                    // 70% chance of approval
                    status = 'approved';
                    responseData = { status, transactionId };
                } else if (randomOutcome < 0.9) {
                    // 20% chance of pending
                    status = 'pending';
                    responseData = { status, transactionId };
                } else {
                    // 10% chance of rejection
                    status = 'rejected';
                    responseData = {
                        status,
                        transactionId,
                        errorMessage: 'Transaction rejected by the issuing bank'
                    };
                }

                this.registerTransaction(paymentData)
                    .then(() => resolve(responseData))
                    .catch(error => {
                        // Handle API errors gracefully
                        console.error('Transaction registration failed:', error);
                        resolve({
                            status: 'rejected',
                            transactionId,
                            errorMessage: 'Failed to register transaction'
                        });
                    });
            }, 4000);
        });
    }

    /**
     * Check the status of a pending payment
     * @param transactionId The transaction ID to check
     * @returns Promise with updated payment status
     */
    async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
        // In a real implementation, this would call the payment API to check status
        // For simulation, we'll just return a random status

        return new Promise((resolve) => {
            setTimeout(() => {
                const randomOutcome = Math.random();

                if (randomOutcome < 0.8) {
                    // 80% chance it's now approved
                    resolve({
                        status: 'approved',
                        transactionId
                    });
                } else {
                    // 20% chance it's still pending
                    resolve({
                        status: 'pending',
                        transactionId
                    });
                }
            }, 1500);
        });
    }

    /**
     * Register a transaction in the transactions API
     * @param amount The transaction amount
     * @param transactionId The transaction ID
     * @param userId The user ID
     * @returns Promise with the API response
     */
    async registerTransaction(paymentData: PaymentRequest): Promise<any> {
        const transactionData = {
            userId: paymentData.userId, // Use the provided user ID as a parameter
            paymentMethod: {
                type: "card",
                details: {
                    type: 'Visa',
                    lastFour: paymentData.cardNumber.substring(paymentData.cardNumber.length - 4),
                    token: /*this.jwtService.sign(*/{
                        cardholderName: paymentData.cardholderName,
                        expiryMonth: paymentData.expiryMonth,
                        expiryYear: paymentData.expiryYear
                    }/*, 'secret-key'),*/
                }
            },
            items: [
                {
                    productId: paymentData.productId,
                    quantity: paymentData.quantity,
                    unitPrice: paymentData.amount
                }
            ],
            amount: paymentData.amount,
            status: "pending"
        };

        return api.post('/v1/transactions', transactionData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });
    }
}