import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        setError("");
        await login(email, password);
        navigate("/");
    } catch (err) {
        setError(
    err.response?.data?.message || "Login failed"
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
                    <small className="text-muted">Login to your account</small>
                    </div>

                    {error && (
                    <div className="alert alert-danger py-2">
                        {error}
                    </div>
                    )}

                    <form onSubmit={handleSubmit}>
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    </form>

                    <div className="text-center">
                    <small className="text-muted">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-decoration-none fw-medium">
                        Register
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

export default Login;
