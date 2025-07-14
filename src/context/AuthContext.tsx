import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types'; // Assuming types are defined in ../types

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        // On component mount, try to load user data from localStorage
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setAccessToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (token: string, userData: User) => {
        setAccessToken(token);
        setUser(userData);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    };

    const isAuthenticated = !!accessToken;

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 