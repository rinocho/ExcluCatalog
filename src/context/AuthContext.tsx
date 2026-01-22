"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check local storage for session on mount
        const session = localStorage.getItem("auth_session");
        if (session === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => {
        localStorage.setItem("auth_session", "true");
        document.cookie = "auth_token=true; path=/; max-age=86400"; // 1 day
        setIsAuthenticated(true);
        router.push("/catalogo");
    };

    const logout = () => {
        localStorage.removeItem("auth_session");
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        setIsAuthenticated(false);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
