import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <p>Checking authentication...</p>;

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
