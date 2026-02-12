import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isStrongPassword = (password) => {
        const strongRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return strongRegex.test(password);
        };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        setLoading(true);
        setError("");

        if (!isStrongPassword(password)) {
            setError(
                "Password must be at least 8 characters and include uppercase, lowercase, and a number"
            );
            return;
        }

        if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
        }

        await api.post("/auth/register", {
            name,
            email,
            password,
        });

        navigate("/verify", { state: { email } });
        } catch (err) {
        setError(
            err.response?.data?.message || "Registration failed"
        );
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center">
        <div className="container">
            <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4">

                <div className="card shadow border-0 p-4">

                <div className="text-center mb-4">
                    <h4 className="fw-bold mb-1">DevDesk</h4>
                    <small className="text-muted">
                    Create your account
                    </small>
                </div>

                {error && (
                    <div className="alert alert-danger py-2">
                    {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} method="post" autoComplete="on">
                    <div className="mb-3">
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                name="name"
                                autoComplete="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="username"
                                autoComplete="username"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                            <label className="form-label">New Password</label>

                            <div className="input-group">
                                <input
                                    type="password"
                                    name="new-password"
                                    autoComplete="new-password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                                    type="password"
                                    name="confirm-password"
                                    autoComplete="new-password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
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

                    <button
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                    >
                    {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className="text-center">
                    <small className="text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="text-decoration-none fw-medium">
                        Login
                    </Link>
                    </small>
                </div>

                </div>

            </div>
            </div>
        </div>
        </div>
    );
};

export default Register;
