import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import * as AuthContextModule from '../AuthContext';

// Extract the components and hooks from the module
const { AuthProvider, useAuth } = AuthContextModule;

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

// Mock user data for testing
const mockUserData = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'customer'
};

// Helper component to wrap the hook call with the provider
const wrapper = ({ children }: { children: ReactNode }) => {
    return <AuthProvider>{children}</AuthProvider>;
};

describe('AuthContext', () => {
    // Setup localStorage mock before each test
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });
        mockLocalStorage.clear();
        jest.clearAllMocks();
    });

    it('should provide initial state with null token and user when localStorage is empty', () => {
        // Render the hook within the provider using the wrapper
        const { result } = renderHook(() => useAuth(), { wrapper });

        // Assert initial state
        expect(result.current.token).toBeNull();
        expect(result.current.user).toBeNull();
        expect(typeof result.current.login).toBe('function');
        expect(typeof result.current.logout).toBe('function');
    });

    it('should initialize with token from localStorage if available', () => {
        // Setup localStorage with a token
        mockLocalStorage.getItem.mockReturnValueOnce('test-token');

        // Render the hook within the provider
        const { result } = renderHook(() => useAuth(), { wrapper });

        // Assert initial state with token from localStorage
        expect(result.current.token).toBe('test-token');
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('should update token and user when login is called', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => useAuth(), { wrapper });

        // Assert initial state is null
        expect(result.current.token).toBeNull();
        expect(result.current.user).toBeNull();

        // Call the login function within act() to handle state updates
        act(() => {
            result.current.login('new-token', mockUserData);
        });

        // Assert the state has been updated
        expect(result.current.token).toBe('new-token');
        expect(result.current.user).toEqual(mockUserData);
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
    });

    it('should clear token and user when logout is called', () => {
        // Setup initial state with token and user
        mockLocalStorage.getItem.mockReturnValueOnce('test-token');
        const { result } = renderHook(() => useAuth(), { wrapper });

        // Call login to set user
        act(() => {
            result.current.login('test-token', mockUserData);
        });

        // Assert state before logout
        expect(result.current.token).toBe('test-token');
        expect(result.current.user).toEqual(mockUserData);

        // Call the logout function within act()
        act(() => {
            result.current.logout();
        });

        // Assert the state has been cleared
        expect(result.current.token).toBeNull();
        expect(result.current.user).toBeNull();
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('should store token in localStorage when token changes', () => {
        // Render the hook within the provider
        const { result } = renderHook(() => useAuth(), { wrapper });

        // Call login to set token
        act(() => {
            result.current.login('new-token', mockUserData);
        });

        // Assert localStorage was updated
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
    });

    it('should remove token from localStorage when token is set to null', () => {
        // Setup initial state with token
        mockLocalStorage.getItem.mockReturnValueOnce('test-token');
        const { result } = renderHook(() => useAuth(), { wrapper });

        // Call logout to clear token
        act(() => {
            result.current.logout();
        });

        // Assert localStorage item was removed
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('should throw error when useAuth is used outside of AuthProvider', () => {
        // Attempt to use the hook without a provider
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            renderHook(() => useAuth());
        }).toThrow('useAuth must be used within an AuthProvider');

        consoleErrorSpy.mockRestore();
    });
});