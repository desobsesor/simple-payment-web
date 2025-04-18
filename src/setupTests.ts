// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Vite environment variables for tests
process.env.VITE_API_URL = 'http://localhost:3000';
process.env.VITE_API_TIMEOUT = '5000';
process.env.VITE_ENV = 'test';

// Mock for localStorage
class LocalStorageMock {
    store: Record<string, string>;

    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key: string) {
        return this.store[key] || null;
    }

    setItem(key: string, value: string) {
        this.store[key] = String(value);
    }

    removeItem(key: string) {
        delete this.store[key];
    }
}

// Configure global localStorage mock
Object.defineProperty(window, 'localStorage', {
    value: new LocalStorageMock(),
});

// Silence console warnings during tests
global.console = {
    ...console,
    // Disable warning messages during tests
    warn: jest.fn(),
    error: jest.fn(),
    // Keep log for debugging if needed
    log: jest.fn(),
};