import api from '../../../../shared/infrastructure/api';
import { PaymentStatus } from '../../../../types/types';

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
    selectedPaymentMethod?: {
        cardNumber: string;
        cardholderName: string;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
        type: string;
        brand: string;
        lastFour: string;
        token: string;
    }
}

export class PaymentService {
    constructor() {
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
                } else if (randomOutcome < 0.9) {
                    // 10% chance it's still pending
                    resolve({
                        status: 'pending',
                        transactionId
                    });
                } else {
                    // 10% chance it's rejected
                    resolve({
                        status: 'rejected',
                        transactionId,
                        errorMessage: 'Transaction rejected by the issuing bank'
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
            userId: paymentData.userId,
            paymentMethod: {
                type: "card",
                details: {
                    type: paymentData.selectedPaymentMethod?.brand,
                    lastFour: paymentData.selectedPaymentMethod?.cardNumber.substring(paymentData.selectedPaymentMethod?.cardNumber.length - 4),
                    token: /*this.jwtService.sign(*/{
                        cardholderName: paymentData.selectedPaymentMethod?.cardholderName,
                        expiryMonth: paymentData.selectedPaymentMethod?.expiryMonth,
                        expiryYear: paymentData.selectedPaymentMethod?.expiryYear
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
            products: [
                {
                    productId: paymentData.productId,
                    quantity: paymentData.quantity,
                    unitPrice: paymentData.amount
                }
            ],
            totalAmount: paymentData.amount,
            status: "pending"
        };

        return api.post('/v1/transactions/process-payment', transactionData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });
    }
}