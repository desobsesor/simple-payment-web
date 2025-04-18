import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import * as ErrorContextModule from '../ErrorContext';

// Extract the components and hooks from the module
const { ErrorProvider } = ErrorContextModule;
const useError = ErrorContextModule.useError;

// Helper component to wrap the hook call with the provider
const wrapper = ({ children }: { children: ReactNode }) => {
    return <ErrorProvider>{children}</ErrorProvider>;
};

describe('ErrorContext', () => {
    it('should provide initial state with null error', () => {
        // Render the hook within the provider using the wrapper
        const { result } = renderHook(() => useError(), { wrapper });

        // Assert initial state
        expect(result.current.error).toBeNull();
        expect(typeof result.current.setError).toBe('function');
        expect(typeof result.current.clearError).toBe('function');
    });

    it('should update error when setError is called with a message', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => useError(), { wrapper });

        // Assert initial state is null
        expect(result.current.error).toBeNull();

        // Call the setter function within act() to handle state updates
        const errorMessage = 'Something went wrong';
        act(() => {
            result.current.setError(errorMessage);
        });

        // Assert the state has been updated
        expect(result.current.error).toEqual(errorMessage);
    });

    it('should clear error when clearError is called', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => useError(), { wrapper });

        // Set an error first
        act(() => {
            result.current.setError('Test error message');
        });

        // Assert the error is set
        expect(result.current.error).toBe('Test error message');

        // Call clearError to reset the error state
        act(() => {
            result.current.clearError();
        });

        // Assert the error is cleared (null)
        expect(result.current.error).toBeNull();
    });

    it('should update error when setError is called multiple times', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => useError(), { wrapper });

        // Set first error
        act(() => {
            result.current.setError('First error');
        });
        expect(result.current.error).toBe('First error');

        // Update with second error
        act(() => {
            result.current.setError('Second error');
        });
        expect(result.current.error).toBe('Second error');

        // Clear error
        act(() => {
            result.current.clearError();
        });
        expect(result.current.error).toBeNull();

        // Set third error after clearing
        act(() => {
            result.current.setError('Third error');
        });
        expect(result.current.error).toBe('Third error');
    });
});