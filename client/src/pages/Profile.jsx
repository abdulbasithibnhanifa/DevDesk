import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {

    const { user, setUser, logout } = useContext(AuthContext);

    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setMessage("");

            if (password && password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            await api.put("/auth/profile", {
                name,
                password,
            });

            const updatedUser = await api.get("/auth/me");

            setUser(updatedUser.data);
            setName(updatedUser.data.name);
            setPassword("");

            setConfirmPassword("");

            setMessage("Profile updated successfully");

        } catch (err) {
            setError(
                err.response?.data?.message || "Update failed"
            );
        }
    };


    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">

                        <div className="card shadow p-4 border-0">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="fw-bold mb-0">My Profile</h4>

                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => navigate("/")}
                                >
                                    Back
                                </button>
                            </div>

                            {message && (
                                <div className="alert alert-success">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} method="post" autoComplete="on">
                                <div className="mb-3">
                                    <label>Name</label>
                                    <input
                                        name="name"
                                        autoComplete="name"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">New Password</label>

                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="new-password"
                                            autoComplete="new-password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Confirm New Password</label>

                                    <div className="input-group">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirm-new-password"
                                            autoComplete="new-password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>


                                <button className="btn btn-primary">
                                    Update
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger ms-2"
                                    onClick={async () => {
                                        if (!window.confirm("Are you sure you want to delete your account?")) {
                                            return;
                                        }

                                        try {
                                            await api.delete("/auth/profile");
                                            logout();
                                            navigate("/register", { replace: true });
                                        } catch (err) {
                                            setError("Failed to delete account");
                                        }
                                    }}
                                >
                                    Delete Account
                                </button>


                                <button
                                    type="button"
                                    className="btn btn-outline-danger ms-2"
                                    onClick={() => {
                                        logout();
                                        navigate("/login", { replace: true });
                                    }}
                                >
                                    Logout
                                </button>
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
