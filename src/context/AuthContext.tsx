import type { ReactNode } from 'react';

import { createContext, useState } from 'react';

import { logoutRequest, registerRequest } from '@/services/authService';

interface User {
    token: string,
    id: number,
    nickname: string,
    email: string,
}

interface AuthContextValue {
    user: User | null,
    saveUser: (token: string, userData: Omit<User, 'token'>) => void,
    register: (email: string, nickname: string, password: string, confirmPassword: string) => Promise<void>,
    logout: () => Promise<void>,
    isAuthenticated: boolean
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        if (stored && storedUser) {
            return { token: stored, ...JSON.parse(storedUser) };
        }
        return null;
    });
    
    const saveUser = async (token: string, userData: Omit<User, 'token'>) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        setUser({ token, ...userData });
    };

    const register = async (email: string, nickname: string, password: string, confirmPassword: string) => {
        const { token, user, } = await registerRequest(email, nickname, password, confirmPassword);
        saveUser(token, {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        });
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            console.error('Error with logging out, thrown in AuthContext');
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setUser(null);
        }
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, saveUser, register, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

