import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Auth.css";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: "", color: "" });

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: "", color: "" });
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        setStrength({ score, label: "Weak", color: "#E74C3C" });
        break;
      case 2:
        setStrength({ score, label: "Fair", color: "#F39C12" });
        break;
      case 3:
        setStrength({ score, label: "Good", color: "#3498DB" });
        break;
      case 4:
      default:
        setStrength({ score, label: "Strong", color: "#2ECC71" });
        break;
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms and Conditions.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Failed to create account. " + err.message);
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Column: Premium Branding Banner */}
      <div className="auth-visual-col">
        <span>HOUSE OF LUXURY</span>
        <h2>Aura Parfums</h2>
        <p>
          Join our exclusive circle. Create an account to receive curated fragrance suggestions, 
          manage your wishlists, and track your orders. Grasse-matured perfection awaits you.
        </p>
      </div>

      {/* Right Column: Register Card */}
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
          
          <h3>Customer Registration</h3>
          <p className="auth-subtitle">Fill in the fields below to register.</p>

          {error && <div className="auth-error-msg">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-field-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  placeholder="e.g. customer@luxescent.com"
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
                  placeholder="Min. 6 characters"
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

              {/* Password strength meter */}
              {password && (
                <div className="password-strength-container">
                  <div className="strength-bar-bg">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: `${(strength.score / 4) * 100}%`,
                        backgroundColor: strength.color,
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: strength.color }}>
                    Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="input-field-group">
              <label>Confirm Password</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-options-row">
              <label className="remember-me-checkbox">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>I accept the Terms & Conditions</span>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn primary" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-redirect-text">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
