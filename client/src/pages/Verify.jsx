import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const passedEmail = location.state?.email || "";

    const [email] = useState(passedEmail);

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { completeLogin } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");

            const res = await api.post("/auth/verify", { email, otp });

            // Save token
            completeLogin(res.data);

            // Redirect to dashboard
            navigate("/", { replace: true });

        } catch (err) {
            setError("Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4">

                        <div className="card shadow-sm border-0 p-4">

                            <div className="text-center mb-4">
                                <h4 className="fw-bold mb-1">Verify Email</h4>
                                <small className="text-muted">
                                    Enter the OTP sent to your email
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
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        disabled
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Verifying..." : "Verify"}
                                </button>
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;
