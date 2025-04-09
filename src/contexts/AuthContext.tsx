import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    token: string | null;
    user: any | null;
    login: (token: string, userData: any) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Here you could make a call to verify the token on the server
            // and set user data based on the response.
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = (newToken: string, userData: any) => {
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};