import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, loginWithGoogle, quickDemoLogin, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email or password. Please verify and try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please reset your password or wait a few minutes.");
      } else {
        setError(err.message || "Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      setGoogleLoading(true);
      const user = await loginWithGoogle();
      // If redirect flow was triggered, user will be undefined (page redirects)
      if (user) {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        // User closed the popup themselves — silent, no error
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked. Redirecting to Google sign-in...");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with this email using a different sign-in method. Try email/password login.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection and try again.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized. Please contact support.");
      } else {
        setError("Google sign-in failed: " + (err.message || "Unknown error. Please try again."));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleQuickDemo = () => {
    quickDemoLogin();
    navigate(redirectPath, { replace: true });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Please enter your email to receive a password reset link.");
      return;
    }

    try {
      setResetLoading(true);
      await resetPassword(resetEmail);
      setSuccess("Password reset instructions sent! Check your inbox.");
      setShowForgotModal(false);
    } catch (err) {
      setError("Failed to send reset email: " + err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #050816 0%, #0B1023 50%, #1E1B4B 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
      }}
    >
      {/* Glow Effects */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "rgba(59, 130, 246, 0.12)",
          filter: "blur(140px)",
          top: "10%",
          left: "15%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(139, 92, 246, 0.12)",
          filter: "blur(140px)",
          bottom: "10%",
          right: "15%",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* BRAND HEADER */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "900",
              fontSize: "24px",
              marginBottom: "12px",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
            }}
          >
            X
          </div>
          <h2 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: "800", margin: "0 0 8px" }}>
            Welcome Back
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "14px", margin: 0 }}>
            Connect. Collaborate. Create. Grow.
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              padding: "12px 14px",
              color: "#FCA5A5",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "12px",
              padding: "12px 14px",
              color: "#6EE7B7",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* GOOGLE SIGN IN BUTTON */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "12px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "12px",
            transition: "all 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? "Connecting with Google..." : "Continue with Google"}</span>
        </button>

        {/* 1-CLICK INSTANT DEMO ACCESS */}
        <button
          type="button"
          onClick={handleQuickDemo}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
            border: "1px solid rgba(139, 92, 246, 0.4)",
            color: "#A78BFA",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "20px",
            transition: "all 0.2s",
          }}
        >
          <span>⚡ Instant Demo Access (Skip Sign-In)</span>
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "24px",
            color: "#64748B",
            fontSize: "12px",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          <span>OR SIGN IN WITH EMAIL</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* EMAIL & PASSWORD FORM */}
        <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
              Email Address
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <Mail size={18} color="#94A3B8" />
              <input
                type="email"
                required
                placeholder="developer@buildx.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ color: "#CBD5E1", fontSize: "13px", fontWeight: "500" }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setShowForgotModal(true);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#38BDF8",
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot Password?
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <Lock size={18} color="#94A3B8" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              border: "none",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: "700",
              cursor: loading ? "default" : "pointer",
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
              marginTop: "8px",
              transition: "all 0.2s",
            }}
          >
            <span>{loading ? "Authenticating..." : "Sign In to BuildX"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: "14px", marginTop: "28px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#38BDF8", fontWeight: "600", textDecoration: "none" }}>
            Create one here
          </Link>
        </p>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#0F172A",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "20px",
              padding: "30px",
            }}
          >
            <h3 style={{ margin: "0 0 10px", color: "white", fontSize: "20px" }}>Reset Password</h3>
            <p style={{ color: "#94A3B8", fontSize: "13px", lineHeight: "1.5", marginBottom: "20px" }}>
              Enter your registered email address and Firebase will dispatch a secure password reset link.
            </p>

            <form onSubmit={handlePasswordReset}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  marginBottom: "20px",
                }}
              >
                <Mail size={18} color="#94A3B8" />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    fontSize: "14px",
                    width: "100%",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    color: "#94A3B8",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    border: "none",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
