"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export type UserRole = "admin" | "agent";

export interface User {
    id: string;
    org_id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    area?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Move supabase outside to ensure it's a singleton and doesn't trigger effect re-runs
const supabase = createClient();

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchAndSetUserProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                setUser(null);
            } else if (data) {
                setUser({
                    id: data.id,
                    org_id: data.org_id,
                    email: data.email,
                    name: data.full_name,
                    role: data.role as UserRole,
                    avatar: data.avatar_url,
                    area: data.assigned_area
                });
            }
        } catch {
            // Profile fetch failed — user will remain null
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        async function initAuth() {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    if (mounted) await fetchAndSetUserProfile(session.user.id);
                } else {
                    if (mounted) {
                        setUser(null);
                        setLoading(false);
                    }
                }
            } catch (err) {
                // Auth init failed — user will remain null
                if (mounted) {
                    setUser(null);
                    setLoading(false);
                }
            }
        }

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
                // Fetch profile to ensure we have the latest role and data
                await fetchAndSetUserProfile(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
            } else if (event === 'USER_UPDATED' && session?.user) {
                await fetchAndSetUserProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [fetchAndSetUserProfile]);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                setLoading(false);
                return { success: false, error: result.error || "Login failed" };
            }

            // The login was successful. Profile fetching will trigger via onAuthStateChange.
            // We return success so the calling component can execute a hard redirect 
            // to re-initialize the server session cookies properly.

            return { success: true };
        } catch (err) {
            setLoading(false);
            return { success: false, error: "Login failed" };
        }
    }, [router]);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.refresh();
            setLoading(false);
            router.push("/login");
        } catch (err) {
            // Logout failed silently
            setLoading(false);
        }
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
