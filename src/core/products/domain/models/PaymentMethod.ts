export interface PaymentMethod {
    id: string;
    type: 'credit' | 'debit';
    cardNumber: string;
    lastFour: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    brand: 'visa' | 'mastercard' | 'amex' | 'other';
    isDefault?: boolean;
    isExpired?: boolean;
}