import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedThemeMode = "light" | "dark";

interface ThemeModeContextValue {
    /** The user's explicit choice ('system' means follow OS). */
    mode: ThemeMode;
    /** The actual mode used for rendering ('light' or 'dark', after resolving 'system'). */
    resolvedMode: ResolvedThemeMode;
    setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "muse-theme-mode";

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readStoredMode(): ThemeMode {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system") {
            return stored;
        }
    } catch {
        // localStorage unavailable (SSR, privacy mode, etc.)
    }
    return "system";
}

function getSystemMode(): ResolvedThemeMode {
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
    const [systemMode, setSystemMode] = useState<ResolvedThemeMode>(getSystemMode);

    // React to OS theme changes in real time
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            setSystemMode(e.matches ? "dark" : "light");
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const setMode = useCallback((next: ThemeMode) => {
        setModeState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // ignore
        }
    }, []);

    const resolvedMode: ResolvedThemeMode = mode === "system" ? systemMode : mode;

    const value = useMemo(
        () => ({ mode, resolvedMode, setMode }),
        [mode, resolvedMode, setMode],
    );

    return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeModeContextValue {
    const ctx = useContext(ThemeModeContext);
    if (!ctx) {
        throw new Error("useThemeMode must be used within ThemeModeProvider");
    }
    return ctx;
}
