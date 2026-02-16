import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * Manages the global theme state (light/dark) and persists it to localStorage.
 */
export const ThemeProvider = ({ children }) => {
    // Default to light, or check local storage
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        // Apply theme to html tag
        document.documentElement.setAttribute("data-bs-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
