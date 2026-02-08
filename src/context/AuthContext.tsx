import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { me as fetchMe } from '../services/authService';
import { User } from '../types'; // Assuming types are defined in ../types

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (accessToken: string, refreshToken: string | null, userData?: User | null) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
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

    const login = (newAccessToken: string, newRefreshToken: string | null, userData?: User | null) => {
        setAccessToken(newAccessToken);
        if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
            localStorage.setItem('refreshToken', newRefreshToken);
        }
        if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }
        localStorage.setItem('accessToken', newAccessToken);
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    const { data: meData, isFetching: isAuthLoading, error: meError } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: fetchMe,
        enabled: !!accessToken,
        retry: 0,
    });

    useEffect(() => {
        if (meData) {
            setUser(meData);
            localStorage.setItem('user', JSON.stringify(meData));
        }
    }, [meData]);

    useEffect(() => {
        if (meError) {
            // Token invalid -> clear session
            logout();
        }
    }, [meError]);

    const isAuthenticated = !!accessToken && (!!user || !!meData);

    return (
        <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, isAuthenticated, isAuthLoading }}>
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