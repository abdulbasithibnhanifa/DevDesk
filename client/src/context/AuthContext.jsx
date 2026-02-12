import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

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


    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
    };

    const completeLogin = (data) => {
        localStorage.setItem("token", data.token);
        setUser(data.user);
    };

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
