import { createContext, useState, ReactNode, useContext } from 'react';

type ErrorContextType = {
    error: string | null;
    setError: (message: string) => void;
    clearError: () => void;
};

const ErrorContext = createContext<ErrorContextType>({} as ErrorContextType);

/**
 * Provides error state and functions to set and clear the error.
 */
export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [error, setErrorState] = useState<string | null>(null);

    const setError = (message: string) => setErrorState(message);
    const clearError = () => setErrorState(null);

    return (
        <ErrorContext.Provider value={{ error, setError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);