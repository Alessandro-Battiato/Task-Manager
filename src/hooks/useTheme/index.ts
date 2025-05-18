import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

const LOCAL_STORAGE_KEY = "theme";

function useTheme(defaultTheme: Theme = "light") {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as Theme | null;
        if (saved === "light" || saved === "dark") {
            setTheme(saved);
            return;
        }
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        setTheme(mql.matches ? "dark" : "light");

        const handler = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? "dark" : "light");
        };
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    }, [theme]);

    const toggle = useCallback(() => {
        setTheme((current) => (current === "light" ? "dark" : "light"));
    }, []);

    return { theme, setTheme, toggle };
}

export default useTheme;
