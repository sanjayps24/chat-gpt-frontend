import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";

// ChatGPT / OpenAI Logo SVG Component
const ChatGPTLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.67.416a6.02 6.02 0 00-5.755 4.218 5.987 5.987 0 00-3.996 2.9 6.042 6.042 0 00.744 7.087 5.98 5.98 0 00.516 4.911 6.04 6.04 0 006.51 2.9A6.07 6.07 0 0013.33 23.584a6.02 6.02 0 005.755-4.218 5.985 5.985 0 003.996-2.9 6.042 6.042 0 00-.799-6.645z"
      fill="#10a37f"
    />
    <path d="M13.33 22.396a4.472 4.472 0 01-2.876-1.05l.143-.082 4.775-2.758a.773.773 0 00.391-.677v-6.737l2.019 1.166a.071.071 0 01.039.054v5.576a4.504 4.504 0 01-4.491 4.508z" fill="#fff"/>
    <path d="M3.463 18.267a4.494 4.494 0 01-.537-3.018l.143.085 4.775 2.758a.782.782 0 00.782 0l5.832-3.367v2.332a.074.074 0 01-.03.06L9.58 19.906a4.506 4.506 0 01-6.117-1.639z" fill="#fff"/>
    <path d="M2.34 7.896a4.485 4.485 0 012.366-1.973v5.682a.773.773 0 00.391.676l5.832 3.367-2.019 1.166a.074.074 0 01-.07.006L3.992 13.93A4.504 4.504 0 012.34 7.872v.024z" fill="#fff"/>
    <path d="M18.837 12.006l-5.832-3.367 2.019-1.166a.074.074 0 01.07-.006l4.848 2.798a4.494 4.494 0 01-.676 8.105v-5.682a.773.773 0 00-.391-.676l-.038-.006z" fill="#fff"/>
    <path d="M20.537 8.75l-.143-.085-4.775-2.758a.782.782 0 00-.782 0L8.997 9.274V6.942a.074.074 0 01.03-.06l4.848-2.798a4.494 4.494 0 016.662 4.666z" fill="#fff"/>
    <path d="M8.005 13.274l-2.019-1.166a.071.071 0 01-.039-.054V6.478a4.494 4.494 0 017.367-3.456l-.143.082-4.775 2.758a.773.773 0 00-.391.677v6.735z" fill="#fff"/>
  </svg>
);

// Simple email validation
const validateEmail = (email) => {
  if (!email) return "";
  if (!email.includes("@")) return "Email must contain an @ symbol";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
  return "";
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const navigate = useNavigate();

  // Check if user already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time email validation
    if (name === "email") {
      if (emailTouched) {
        setEmailError(validateEmail(value));
      }
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(formData.email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email before submit
    const emailErr = validateEmail(formData.email);
    if (emailErr) {
      setEmailError(emailErr);
      setEmailTouched(true);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userEmail", data.user?.email);

        setIsLoggedIn(true);
        setMessage("Login successful!");
        setMessageType("success");

        // Redirect to dashboard/home
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setMessage(data.detail || "Invalid credentials.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="auth-page">
      {/* Animated Background Layers */}
      <div className="auth-bg-mesh" />
      <div className="auth-bg-orbs">
        <div className="auth-orb" />
        <div className="auth-orb" />
        <div className="auth-orb" />
        <div className="auth-orb" />
        <div className="auth-orb" />
        <div className="auth-orb" />
      </div>
      <div className="auth-bg-particles">
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
      </div>
      <div className="auth-bg-grid" />

      <div className="auth-card">

        {/* ChatGPT Logo */}
        <Link to="/" className="auth-logo" title="Go to Home">
          <ChatGPTLogo />
        </Link>

        <h1 className="auth-title">
          {isLoggedIn ? "You are logged in" : "Welcome back"}
        </h1>

        {!isLoggedIn ? (
          <>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label className="auth-label">Email address</label>
                <input
                  className={`auth-input ${emailTouched && emailError ? "input-error" : ""} ${emailTouched && !emailError && formData.email ? "input-success" : ""}`}
                  type="text"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  required
                  autoComplete="email"
                />
                {emailTouched && emailError && (
                  <span className="auth-field-error">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zm.75 6.25a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
                    </svg>
                    {emailError}
                  </span>
                )}
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <input
                  className="auth-input"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className={`auth-submit-btn ${loading ? "loading" : ""}`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <><span className="auth-spinner"></span>Signing in...</>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            {message && (
              <div className={`auth-message ${messageType}`}>
                {messageType === "success" ? "✓" : "⚠"} {message}
              </div>
            )}

            <p className="auth-footer">
              Don't have an account?{" "}
              <Link to="/signup" className="auth-footer-link">
                Sign up
              </Link>
            </p>
          </>
        ) : (
          <div className="auth-logged-in">
            <p>
              Logged in as: <strong>{localStorage.getItem("userEmail")}</strong>
            </p>

            <button
              className="auth-submit-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
