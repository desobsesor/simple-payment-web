import api from "../../../shared/infrastructure/api";

/**
 * Sets up error interceptors for API requests
 * @param showError - A callback function that displays error messages to the user
 * @description This function configures axios interceptors to handle API response errors.
 * It will display error messages using the provided showError callback and reject the promise.
 * @example
 * ```typescript
 * setupErrorInterceptors((message) => {
 *   console.error(message);
 * });
 * ```
 */
export const setupErrorInterceptors = (showError: (message: string) => void) => {
    api.interceptors.response.use(
        response => response,
        error => {
            showError(error.message);
            return Promise.reject(error);
        }
    );
};