import api from '../../../../shared/infrastructure/api';
import { PaymentMethod } from '../../domain/models/PaymentMethod';

export class PaymentMethodService {
    /**
     * Get user's saved payment methods
     * @param userId User's ID
     * @returns Array of payment methods
     * @description Get user's saved payment methods
     * @example
     * ```typescript
     * const paymentMethods = await paymentMethodService.getUserPaymentMethods('user_1');
     * console.log(paymentMethods);
     * // Output: [{ id: 'pm_1', ... }, { id: 'pm_2', ... }]
     * ```
     */
    async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
        const response = await api.get(`/v1/payment-methods/user/${userId}`);

        if (response.status === 200) {
            return response.data.map((item: any) => ({
                id: item.paymentMethodId.toString(),
                type: item.details?.type,
                cardNumber: item.details?.cardNumber,
                lastFour: item.details?.lastFour,
                cardholderName: item.details?.token?.cardholderName,
                expiryMonth: item.details?.token?.expiryMonth,
                expiryYear: item.details?.token?.expiryYear,
                brand: item.details?.brand,
                isDefault: item.isDefault || false,
                isExpired: false
            }));
        }

        // Mock data for saved payment methods
        return [
            {
                id: 'pm_1',
                type: 'credit',
                cardNumber: '4111111111111111',
                lastFour: '1111',
                cardholderName: 'Yovany Suárez Silva',
                expiryMonth: '12',
                expiryYear: '25',
                brand: 'visa',
                isDefault: true,
                isExpired: false
            },
            {
                id: 'pm_2',
                type: 'credit',
                cardNumber: '5555555555554444',
                lastFour: '4444',
                cardholderName: 'Yovany Suárez Silva',
                expiryMonth: '10',
                expiryYear: '24',
                brand: 'mastercard',
                isDefault: false,
                isExpired: false
            },
            {
                id: 'pm_3',
                type: 'debit',
                cardNumber: '4111111111112222',
                lastFour: '2222',
                cardholderName: 'Yovany Suárez Silva',
                expiryMonth: '03',
                expiryYear: '23',
                brand: 'visa',
                isDefault: false,
                isExpired: true
            }
        ];
    }

    /**
     * Process payment with a saved payment method
     * @param paymentMethodId Payment method ID
     * @param amount Amount to pay
     * @param productId Product ID
     * @param quantity Quantity of products
     * @param userId User's ID
     * @returns Payment result
     * @description Process payment with a saved payment method
     * @example
     * ```typescript
     * const paymentResult = await paymentMethodService.processPaymentWithSavedMethod('pm_1', 100, 1, 1, 'user_1');
     * console.log(paymentResult);
     * // Output: { status: 'approved', transactionId: 'txn_123456789', errorMessage: undefined }
     * ```
     */
    async processPaymentWithSavedMethod(
        paymentMethodId: string,
        amount: number,
        productId: number,
        quantity: number,
        userId: string
    ) {
        // This would make an API call to process the payment
        // For this example, we'll simulate a successful payment after a delay
        console.log('Processing payment with method:', paymentMethodId, 'for amount:', amount);
        console.log('Product ID:', productId);
        console.log('Quantity:', quantity);
        console.log('User ID:', userId);
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            status: 'approved',
            transactionId: `txn_${Math.random().toString(36).substring(2, 10)}`,
            errorMessage: undefined
        };
    }
}