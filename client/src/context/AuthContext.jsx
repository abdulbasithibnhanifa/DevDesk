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

    // Restore session on refresh
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            api.get("/auth/me")
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    setUser(null);
                });
        }
    }, []);


    /**
     * Logs in the user with email and password.
     * @param {string} email 
     * @param {string} password 
     */
    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
    };

    const completeLogin = (data) => {
        localStorage.setItem("token", data.token);
        setUser(data.user);
    };

    /**
     * Clears user session and token.
     */
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, completeLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
