import { act, renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { PaymentMethod } from '../../core/products/domain/models/PaymentMethod';
import { defaultMockPaymentMethods } from '../../core/products/infrastructure/mocks/PaymentMethodMocks';
import * as PaymentMethodContextModule from '../PaymentMethodContext';

// Extract the components and hooks from the module
const { PaymentMethodProvider } = PaymentMethodContextModule;
const usePaymentMethod = PaymentMethodContextModule.default;

// Mock payment methods for testing
const mockCreditCard: PaymentMethod = {
    id: 'card-123',
    type: 'credit',
    cardNumber: '1234567890123456',
    lastFour: '1234',
    cardholderName: 'John Doe',
    expiryMonth: '12',
    expiryYear: '25',
    brand: 'visa',
    isDefault: false,
    isExpired: false
};

const mockDebitCard: PaymentMethod = {
    id: 'card-456',
    type: 'debit',
    cardNumber: '9876543210987654',
    lastFour: '7654',
    cardholderName: 'Jane Smith',
    expiryMonth: '06',
    expiryYear: '24',
    brand: 'mastercard',
    isDefault: true,
    isExpired: false
};

const mockExpiredCard: PaymentMethod = {
    id: 'card-789',
    type: 'credit',
    cardNumber: '5555555555554444',
    lastFour: '4444',
    cardholderName: 'Alex Johnson',
    expiryMonth: '01',
    expiryYear: '22',
    brand: 'visa',
    isDefault: false,
    isExpired: true
};

// Helper component to wrap the hook call with the provider
const wrapper = ({ children }: { children: ReactNode }) => {
    return React.createElement(PaymentMethodProvider, null, children);
};

describe('PaymentMethodContext', () => {
    it('should provide initial state with null selectedPaymentMethod', () => {
        // Render the hook within the provider using the wrapper
        const { result } = renderHook(() => usePaymentMethod(), { wrapper });

        // Assert initial state
        expect(result.current.selectedPaymentMethod).toBeNull();
        expect(typeof result.current.setSelectedPaymentMethod).toBe('function');
    });

    it('should update selectedPaymentMethod when setSelectedPaymentMethod is called with credit card', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => usePaymentMethod(), { wrapper });

        // Assert initial state is null
        expect(result.current.selectedPaymentMethod).toBeNull();

        // Call the setter function within act() to handle state updates
        act(() => {
            result.current.setSelectedPaymentMethod(mockCreditCard);
        });

        // Assert the state has been updated
        expect(result.current.selectedPaymentMethod).toEqual(mockCreditCard);
        expect(result.current.selectedPaymentMethod?.type).toBe('credit');
        expect(result.current.selectedPaymentMethod?.isExpired).toBe(false);

        // Test setting back to null
        act(() => {
            result.current.setSelectedPaymentMethod(null);
        });

        // Assert the state is null again
        expect(result.current.selectedPaymentMethod).toBeNull();
    });

    it('should update selectedPaymentMethod when setSelectedPaymentMethod is called with debit card', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => usePaymentMethod(), { wrapper });

        // Call the setter function within act() to handle state updates
        act(() => {
            result.current.setSelectedPaymentMethod(mockDebitCard);
        });

        // Assert the state has been updated with correct properties
        expect(result.current.selectedPaymentMethod).toEqual(mockDebitCard);
        expect(result.current.selectedPaymentMethod?.type).toBe('debit');
        expect(result.current.selectedPaymentMethod?.isDefault).toBe(true);
        expect(result.current.selectedPaymentMethod?.brand).toBe('mastercard');
    });

    it('should handle expired cards correctly', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => usePaymentMethod(), { wrapper });

        // Set an expired card
        act(() => {
            result.current.setSelectedPaymentMethod(mockExpiredCard);
        });

        // Assert the state has been updated with expired card
        expect(result.current.selectedPaymentMethod).toEqual(mockExpiredCard);
        expect(result.current.selectedPaymentMethod?.isExpired).toBe(true);
    });

    it('should throw an error when usePaymentMethod is used outside of PaymentMethodProvider', () => {
        // Suppress console.error output for this expected error
        const originalError = console.error;
        console.error = jest.fn();

        // Render the hook *without* the provider wrapper
        // We expect renderHook to catch the error thrown by the hook
        try {
            // Attempt to render the hook without the provider
            // This should throw an error
            // @ts-ignore
            renderHook(() => usePaymentMethod());
            // If the hook throws an error, it should be caught by renderHook
            // and the error should be accessible in the result object
            const { result } = renderHook(() => usePaymentMethod()) as any;

            // Assert that an error was caught and it has the correct message
            expect(result.error).toBeInstanceOf(Error);
            expect(result.error?.message).toBe('usePaymentMethod must be used within a PaymentMethodProvider');
        } catch (error: any) {
            expect(error).toBeInstanceOf(Error);
            expect(error?.message).toBe('usePaymentMethod must be used within a PaymentMethodProvider');
        }


        // Restore console.error
        console.error = originalError;
    });

    // Optional: Test memoization (though harder to prove definitively without complex scenarios)
    // This test checks if the context value object reference remains the same
    // if the state hasn't changed, which useMemo helps with.
    it('should maintain the same context value object reference if state does not change', () => {
        const { result, rerender } = renderHook(() => usePaymentMethod(), { wrapper });
        const initialValue = result.current;

        // Rerender the hook without any state changes
        rerender();

        // The object reference should ideally be the same due to useMemo
        expect(result.current).toBe(initialValue);

        // Now change the state
        act(() => {
            result.current.setSelectedPaymentMethod(mockCreditCard);
        });

        const updatedValue = result.current;
        // After state change, the object reference *should* be different
        expect(updatedValue).not.toBe(initialValue);
        expect(updatedValue.selectedPaymentMethod).toEqual(mockCreditCard);

        // Rerender again after state change
        rerender();

        // The reference should now remain stable again until the next state change
        expect(result.current).toBe(updatedValue);
    });

    it('should handle switching between different payment methods', () => {
        const { result } = renderHook(() => usePaymentMethod(), { wrapper });

        // Set first payment method
        act(() => {
            result.current.setSelectedPaymentMethod(mockCreditCard);
        });
        expect(result.current.selectedPaymentMethod).toEqual(mockCreditCard);

        // Switch to another payment method
        act(() => {
            result.current.setSelectedPaymentMethod(mockDebitCard);
        });
        expect(result.current.selectedPaymentMethod).toEqual(mockDebitCard);
        expect(result.current.selectedPaymentMethod?.id).toBe('card-456');

        // Switch to expired card
        act(() => {
            result.current.setSelectedPaymentMethod(mockExpiredCard);
        });
        expect(result.current.selectedPaymentMethod).toEqual(mockExpiredCard);
        expect(result.current.selectedPaymentMethod?.isExpired).toBe(true);
    });

    it('should work with real mock data from PaymentMethodMocks', () => {
        const { result } = renderHook(() => usePaymentMethod(), { wrapper });

        // Test with default card from mocks
        act(() => {
            result.current.setSelectedPaymentMethod(defaultMockPaymentMethods[0]);
        });

        // Verify default card properties
        expect(result.current.selectedPaymentMethod?.id).toBe('pm_mock1');
        expect(result.current.selectedPaymentMethod?.isDefault).toBe(true);
        expect(result.current.selectedPaymentMethod?.brand).toBe('visa');

        // Test with expired card from mocks
        act(() => {
            result.current.setSelectedPaymentMethod(defaultMockPaymentMethods[2]);
        });

        // Verify expired card properties
        expect(result.current.selectedPaymentMethod?.id).toBe('pm_mock3');
        expect(result.current.selectedPaymentMethod?.isExpired).toBe(true);
        expect(result.current.selectedPaymentMethod?.type).toBe('debit');
    });
});
