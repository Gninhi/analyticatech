import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ThemeMode } from '../../types/index';

type ResolvedTheme = ThemeMode.DARK | ThemeMode.LIGHT;
type ThemeSetting = ResolvedTheme | 'system';

interface ThemeContextType {
    theme: ThemeSetting;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: ThemeSetting) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'analytica_theme';

function getSystemTheme(): ResolvedTheme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeMode.DARK
        : ThemeMode.LIGHT;
}

function applyTheme(resolved: ResolvedTheme) {
    const root = document.documentElement;
    if (resolved === ThemeMode.DARK) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeSetting>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === ThemeMode.DARK || saved === ThemeMode.LIGHT) return saved;
        return 'system';
    });

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === ThemeMode.DARK || saved === ThemeMode.LIGHT) return saved;
        return getSystemTheme();
    });

    // Sync with system preference changes when in 'system' mode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                const resolved = e.matches ? ThemeMode.DARK : ThemeMode.LIGHT;
                setResolvedTheme(resolved);
                applyTheme(resolved);
            }
        };
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [theme]);

    // Apply theme to DOM on every change
    useEffect(() => {
        applyTheme(resolvedTheme);
    }, [resolvedTheme]);

    const setTheme = useCallback((newTheme: ThemeSetting) => {
        setThemeState(newTheme);
        if (newTheme === 'system') {
            localStorage.removeItem(STORAGE_KEY);
            const resolved = getSystemTheme();
            setResolvedTheme(resolved);
        } else {
            localStorage.setItem(STORAGE_KEY, newTheme);
            setResolvedTheme(newTheme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};
