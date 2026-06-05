import type { ReactNode } from 'react';

import { createContext, useState, useEffect } from 'react';

interface User {
    token: string,
}

interface AuthContextValue {
    user: User | null,
    saveUser: (token: string) => void,
    logout: () => void,
    isAuthenticated: boolean
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('token');
        return stored ? { token: stored } : null;
    });


    const saveUser = (token: string) => {
        localStorage.setItem('token', token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, saveUser, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

