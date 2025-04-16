import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import * as UserContextModule from '../UserContext';

// Extract the components and hooks from the module
const { UserProvider } = UserContextModule;
const useUser = UserContextModule.default;

// Helper component to wrap the hook call with the provider
const wrapper = ({ children }: { children: ReactNode }) => {
    return <UserProvider>{children}</UserProvider>;
};

describe('UserContext', () => {
    it('should provide initial state with empty user object', () => {
        // Render the hook within the provider using the wrapper
        const { result } = renderHook(() => useUser(), { wrapper });

        // Assert initial state
        expect(result.current.user).toEqual({});
        expect(typeof result.current.setUser).toBe('function');
    });

    it('should update user when setUser is called', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => useUser(), { wrapper });

        // Assert initial state is empty object
        expect(result.current.user).toEqual({});

        // Call the setter function within act() to handle state updates
        const userData = {
            id: 'user-123',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'customer'
        };

        act(() => {
            result.current.setUser(userData);
        });

        // Assert the state has been updated
        expect(result.current.user).toEqual(userData);
    });

    it('should update user when setUser is called multiple times', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => useUser(), { wrapper });

        // Set first user data
        const firstUserData = { id: 'user-123', name: 'John Doe' };
        act(() => {
            result.current.setUser(firstUserData);
        });
        expect(result.current.user).toEqual(firstUserData);

        // Update with second user data
        const secondUserData = { id: 'user-456', name: 'Jane Smith' };
        act(() => {
            result.current.setUser(secondUserData);
        });
        expect(result.current.user).toEqual(secondUserData);

        // Update with additional properties
        const updatedUserData = { ...secondUserData, email: 'jane@example.com' };
        act(() => {
            result.current.setUser(updatedUserData);
        });
        expect(result.current.user).toEqual(updatedUserData);
    });

    it('should throw error when useUser is used outside of UserProvider', () => {
        // Attempt to use the hook without a provider
        try {
            renderHook(() => useUser());
            const { result } = renderHook(() => useUser()) as unknown as any;
            // Expect an error to be thrown
            expect(result.error).toEqual(Error('useUser must be used within a UserProvider'));
        } catch (error) {
            expect(error).toEqual(Error('useUser must be used within a UserProvider'));
        }

    });
});