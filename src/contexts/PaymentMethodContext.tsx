import React, { createContext, ReactNode, useContext, useState } from 'react';
import { PaymentMethod } from '../core/products/domain/models/PaymentMethod';

interface PaymentMethodContextType {
    selectedPaymentMethod: PaymentMethod | null;
    setSelectedPaymentMethod: (paymentMethod: PaymentMethod | null) => void;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

/**
 * Provider for the payment method context.
 */
export const PaymentMethodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const value = React.useMemo(
        () => ({ selectedPaymentMethod, setSelectedPaymentMethod }),
        [selectedPaymentMethod]
    );

    return (
        <PaymentMethodContext.Provider value={value}>
            {children}
        </PaymentMethodContext.Provider>
    );
};

/**
 * Hook for accessing the payment method context.
 */
const usePaymentMethod = () => {
    const context = useContext(PaymentMethodContext);
    if (context === undefined) {
        throw new Error('usePaymentMethod must be used within a PaymentMethodProvider');
    }
    return context;
};

export default usePaymentMethod;