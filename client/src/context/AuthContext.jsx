import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

/**
 * Context for handling authentication state.
 */
export const AuthContext = createContext();

/**
 * Provider component to wrap the app and make auth state available.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check session on initial load
    useEffect(() => {
        // We no longer check for a token in localStorage.
        // Instead, we optimistically ask the server if we are logged in.
        // The browser will automatically send the HttpOnly cookie.
        api.get("/auth/me")
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                // If it fails (no cookie, or expired cookie that couldn't be refreshed)
                setUser(null);
            });
    }, []);


    /**
     * Logs in the user with email and password.
     * @param {string} email 
     * @param {string} password 
     */
    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        // The server sets the HttpOnly cookies automatically. We just save the user data.
        setUser(res.data.user);
    };

    const completeLogin = (data) => {
        // For auto-login after registration
        setUser(data.user);
    };

    /**
     * Clears user session and token.
     */
    const logout = async () => {
        try {
            // Tell the server to clear the HttpOnly cookies
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed on server:", error);
        } finally {
            // Always clear the local user state
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, completeLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
