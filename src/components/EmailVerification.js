import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../CSS/EmailVerification.css"; // Import custom CSS

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [name, setName] = useState(location.state?.name || "");
  const [password, setPassword] = useState(location.state?.password || "");
  const [role, setRole] = useState(location.state?.role || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Resend OTP
  const handleResendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/otp/resend",
        { email }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error while sending OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and Register User
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/otp/verify-and-register",
        {
          name,
          email,
          password,
          role,
          otp,
        }
      );

      if (response.data.success) {
        toast.success("Account successfully created and verified!");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error while verifying OTP and creating account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <h2 className="verification-title">Email Verification</h2>

        {email ? (
          <>
            <form onSubmit={handleVerifyAndRegister} className="verification-form">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                maxLength="6"
                className="verification-input"
              />

              <Button
                type="submit"
                disabled={loading}
                className="verification-button"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>

            <div className="resend-section">
              <p>
                Didn’t receive the OTP?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="resend-button"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="error-message">
            <p className="error-text">Verification link is invalid or expired.</p>
            <p>
              Please go back to the{" "}
              <Link to="/register" className="link-text">
                registration page
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
