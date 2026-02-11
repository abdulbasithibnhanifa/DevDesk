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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        setLoading(true);
        setError("");

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

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    </div>

                    <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>

                    <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
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
