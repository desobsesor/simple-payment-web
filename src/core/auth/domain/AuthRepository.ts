export interface AuthRepository {
    login(email: string, password: string): Promise<string>;
    logout(): Promise<void>;
    refreshToken(): Promise<string>;
}
