"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { },
    setTheme: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("truevision-theme") as Theme;
        if (stored) {
            setThemeState(stored);
            document.documentElement.classList.toggle("dark", stored === "dark");
        }
    }, []);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        localStorage.setItem("truevision-theme", t);
        document.documentElement.classList.toggle("dark", t === "dark");
    };

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    if (!mounted) return <>{children}</>;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
