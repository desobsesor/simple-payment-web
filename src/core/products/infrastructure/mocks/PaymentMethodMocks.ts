import { PaymentMethod } from '../../domain/models/PaymentMethod';

/**
 * Mock data for payment methods
 * This file contains mock data for payment methods used in the application
 */

/**
 * Default mock payment methods with three cards (two valid, one expired)
 */
export const defaultMockPaymentMethods: PaymentMethod[] = [
    {
        id: 'pm_mock1',
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
        id: 'pm_mock2',
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
        id: 'pm_mock3',
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

/**
 * Fallback mock payment methods with two valid cards
 * Used when there's an error loading payment methods
 */
export const fallbackMockPaymentMethods: PaymentMethod[] = [
    {
        id: 'pm_mock1',
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
        id: 'pm_mock2',
        type: 'credit',
        cardNumber: '5555555555554444',
        lastFour: '4444',
        cardholderName: 'Yovany Suárez Silva',
        expiryMonth: '10',
        expiryYear: '24',
        brand: 'mastercard',
        isDefault: false,
        isExpired: false
    }
];