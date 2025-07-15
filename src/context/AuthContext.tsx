import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types'; // Assuming types are defined in ../types

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (accessToken: string, refreshToken: string | null, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [accessToken, setAccessToken] = useState<string | null>(() => {
        return localStorage.getItem('accessToken');
    });

    const [refreshToken, setRefreshToken] = useState<string | null>(() => {
        return localStorage.getItem('refreshToken');
    });

    // If user exists but tokens were cleared separately, keep consistency
    useEffect(() => {
        if (!accessToken) {
            const storedAccessToken = localStorage.getItem('accessToken');
            if (storedAccessToken) setAccessToken(storedAccessToken);
        }
        if (!refreshToken) {
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (storedRefreshToken) setRefreshToken(storedRefreshToken);
        }
    }, []);

    const login = (newAccessToken: string, newRefreshToken: string | null, userData: User) => {
        setAccessToken(newAccessToken);
        if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
            localStorage.setItem('refreshToken', newRefreshToken);
        }
        setUser(userData);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    const isAuthenticated = !!accessToken;

    return (
        <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, isAuthenticated }}>
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