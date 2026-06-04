import type { ReactNode } from 'react';

import { createContext, useState, useEffect } from 'react';

interface User {
    token: string,
}

interface AuthContextValue {
    user: User | null,
    saveUser: (token: string) => void,
    logout: () => void
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('token');
        if(stored) setUser({ token: stored});
    }, []);

    const saveUser = (token: string) => {
        localStorage.setItem('token', token);
        setUser({ token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, saveUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

