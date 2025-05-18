import { useState, useEffect, useCallback } from "react";

const LOCAL_STORAGE_KEY = "theme";

function useTheme() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved === "light" || saved === "dark") {
            return saved;
        }
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        return mql.matches ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    }, [theme]);

    const toggle = useCallback(() => {
        setTheme((t) => (t === "light" ? "dark" : "light"));
    }, []);

    return { theme, setTheme, toggle };
}

export default useTheme;
