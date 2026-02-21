"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "agent";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    area?: string;
}

// Mock users for demo
const MOCK_USERS: Record<string, User> = {
    "admin@truevision.com": {
        id: "1",
        name: "Shan Admin",
        email: "admin@truevision.com",
        role: "admin",
    },
    "agent@truevision.com": {
        id: "2",
        name: "Agent Rahul",
        email: "agent@truevision.com",
        role: "agent",
        area: "Whitefield",
    },
};

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Hydrate user from localStorage after mount to avoid SSR mismatch
    useEffect(() => {
        const stored = localStorage.getItem("truevision_user");
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        // Simulate API delay
        await new Promise((r) => setTimeout(r, 800));

        const mockUser = MOCK_USERS[email.toLowerCase()];
        if (!mockUser || password.length < 4) {
            setLoading(false);
            return { success: false, error: "Invalid email or password" };
        }

        setUser(mockUser);
        localStorage.setItem("truevision_user", JSON.stringify(mockUser));
        setLoading(false);

        if (mockUser.role === "admin") {
            router.push("/admin/dashboard");
        } else {
            router.push("/agent/dashboard");
        }

        return { success: true };
    }, [router]);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("truevision_user");
        router.push("/login");
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
