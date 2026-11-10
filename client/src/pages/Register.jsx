import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Code2,
  Compass,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const ROLES = [
  "Developer",
  "Designer",
  "Idea Creator",
  "Entrepreneur",
  "Student",
  "Learner",
  "Investor",
  "Project Collaborator",
];

function Register() {
  const navigate = useNavigate();
  const { registerWithEmail, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Developer",
    skills: "React, JavaScript, Node.js",
    skillsToLearn: "AI Integration, Cloud Architecture",
    areasOfInterest: "Full-Stack Development, Startup Innovation",
    bio: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill out all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    try {
      setLoading(true);

      const parsedSkills = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedSkillsToLearn = formData.skillsToLearn
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedAreas = formData.areasOfInterest
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await registerWithEmail(formData.email, formData.password, {
        name: formData.name.trim(),
        role: formData.role,
        skills: parsedSkills,
        skillsToLearn: parsedSkillsToLearn,
        areasOfInterest: parsedAreas,
        bio: formData.bio || `Passionate ${formData.role} building the future on BuildX.`,
      });

      setSuccess("Account successfully created! Redirecting to your dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email address already exists. Please log in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format provided.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      setGoogleLoading(true);
      const user = await loginWithGoogle();
      if (user) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google sign up error:", err);
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        // Silent — user closed popup
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked. Redirecting to Google sign-in...");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("An account with this email already exists. Try logging in with email/password.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Check your connection and try again.");
      } else {
        setError("Google sign-up failed: " + (err.message || "Please try again."));
      }
    } finally {
      setGoogleLoading(false);
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
        padding: "36px 20px",
        position: "relative",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(59, 130, 246, 0.12)",
          filter: "blur(150px)",
          top: "5%",
          left: "10%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "rgba(139, 92, 246, 0.12)",
          filter: "blur(150px)",
          bottom: "5%",
          right: "10%",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "28px",
          padding: "40px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "900",
              fontSize: "22px",
              marginBottom: "10px",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
            }}
          >
            X
          </div>
          <h2 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: "800", margin: "0 0 6px" }}>
            Join BuildX
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

        {/* GOOGLE SIGNUP */}
        <button
          type="button"
          onClick={handleGoogleSignup}
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
            marginBottom: "24px",
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
          <span>{googleLoading ? "Connecting with Google..." : "Sign up with Google"}</span>
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
          <span>OR FILL DETAILS</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* REGISTRATION FORM */}
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Full Name */}
            <div>
              <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                Full Name *
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <User size={16} color="#94A3B8" />
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="Sarah Connor"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                User Role *
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <Briefcase size={16} color="#94A3B8" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} style={{ background: "#0F172A", color: "white" }}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
              Email Address *
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <Mail size={16} color="#94A3B8" />
              <input
                type="email"
                required
                name="email"
                placeholder="innovator@buildx.io"
                value={formData.email}
                onChange={handleChange}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  width: "100%",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Password */}
            <div>
              <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                Password *
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <Lock size={16} color="#94A3B8" />
                <input
                  type="password"
                  required
                  name="password"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                Confirm Password *
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <Lock size={16} color="#94A3B8" />
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  placeholder="Match password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    width: "100%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
              My Skills (Comma separated)
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <Code2 size={16} color="#94A3B8" />
              <input
                type="text"
                name="skills"
                placeholder="React, Python, TypeScript, Figma"
                value={formData.skills}
                onChange={handleChange}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  width: "100%",
                }}
              />
            </div>
          </div>

          {/* Skills to Learn */}
          <div>
            <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
              Skills I Want to Learn (For Skill Swap)
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <Compass size={16} color="#94A3B8" />
              <input
                type="text"
                name="skillsToLearn"
                placeholder="AI Models, Cloud Infrastructure, Docker"
                value={formData.skillsToLearn}
                onChange={handleChange}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#FFFFFF",
                  fontSize: "13px",
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
              marginTop: "10px",
              transition: "all 0.2s",
            }}
          >
            <span>{loading ? "Creating Profile..." : "Create BuildX Account"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#94A3B8", fontSize: "14px", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#38BDF8", fontWeight: "600", textDecoration: "none" }}>
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
