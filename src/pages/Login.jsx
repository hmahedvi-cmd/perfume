import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Auth.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please verify your credentials.");
      toast.error("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    toast.info(`${platform} login is simulated for demonstration!`);
  };

  return (
    <div className="auth-page-container">
      {/* Left Column: Premium Branding Banner */}
      <div className="auth-visual-col">
        <span>HOUSE OF LUXURY</span>
        <h2>Aura Parfums</h2>
        <p>
          Indulge in an exclusive sensory experience. Sign in to retrieve your personal 
          olfactory drawer, manage your orders, and access your custom scent profile.
        </p>
      </div>

      {/* Right Column: Glassmorphism Login Card */}
      <div className="auth-form-col">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="auth-logo">
            AURA <span>PARFUMS</span>
          </Link>
          
          <h3>Customer Login</h3>
          <p className="auth-subtitle">Please enter your credentials to log in.</p>

          {error && <div className="auth-error-msg">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-field-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  placeholder="e.g. user@luxescent.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Password</label>
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="auth-options-row">
              <label className="remember-me-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Password reset link simulated.");
                }}
                className="forgot-password-link"
              >
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="auth-submit-btn primary" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          {/* Social Logins */}
          <div className="social-divider">Or continue with</div>
          <div className="social-buttons-grid">
            <button className="social-btn" onClick={() => handleSocialLogin("Google")} aria-label="Google">
              <FaGoogle />
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin("Facebook")} aria-label="Facebook">
              <FaFacebookF />
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin("Apple")} aria-label="Apple">
              <FaApple />
            </button>
          </div>

          <p className="auth-redirect-text">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
