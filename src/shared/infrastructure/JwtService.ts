import { jwtDecode } from 'jwt-decode';

export interface IJwtService {
    decode(token: string): any;
    verify(token: string, secret: string): any;
    sign(payload: any, secret: string, options?: any): string;
}

/**
 * Service for handling JWT related operations
 * Note: This implementation uses jwt-decode which only supports decoding tokens
 * Verification and signing should be handled by the backend
 */
export class JwtService implements IJwtService {
    /**
     * Decodes a JWT token without verifying its signature
     * @param token JWT token to decode
     * @returns Decoded payload or null if there's an error
     */
    decode(token: string): any {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    }

    /**
     * Verifies and decodes a JWT token
     * Note: This is a client-side implementation and does not actually verify the token
     * Real verification should be done on the server
     * @param token JWT token to verify
     * @param secret Secret key to verify the signature (not used in client implementation)
     * @returns Decoded payload or null if there's an error
     */
    verify(token: string, secret: string): any {
        console.warn('Client-side token verification is not secure. Token should be verified on the server.');
        try {
            // In browser environment, we can only decode the token, not verify it
            return this.decode(token);
        } catch (error) {
            console.error('Error verifying JWT token:', error);
            return null;
        }
    }

    /**
     * Generates a new JWT token
     * Note: This is a client-side implementation and should not be used for actual token generation
     * Token generation should be done on the server
     * @param payload Data to include in the token
     * @param secret Secret key to sign the token (not used in client implementation)
     * @param options Additional options for token generation (not used in client implementation)
     * @returns Error as this operation should be performed on the server
     */
    sign(payload: any, secret: string, options?: any): string {
        // In browser environment, we cannot generate tokens
        // This method should be called on the server
        //NOTE: This is a client-side implementation and should not be used for actual token generation
        console.error('JWT token generation should be performed on the server, not in the browser');
        throw new Error('JWT token generation is not supported in the browser environment');
    }
}