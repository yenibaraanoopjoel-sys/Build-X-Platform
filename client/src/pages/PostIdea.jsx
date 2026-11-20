import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { createIdea } from "../services/dataService";
import { askJarvisAI } from "../services/aiService";
import {
  Lightbulb,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const CATEGORIES = [
  "Technology",
  "Artificial Intelligence",
  "Web3 & Blockchain",
  "EdTech & Learning",
  "FinTech",
  "Design & UI/UX",
  "Health & Wellness",
  "Open Source",
  "SaaS & Productivity",
];

function PostIdea() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technology",
    requiredSkills: "React, Firebase, UI/UX Design",
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // AI Idea Enhancer
  const handleEnhanceWithAI = async () => {
    if (!formData.title && !formData.description) {
      setError("Please provide a title or draft description before requesting AI enhancement.");
      return;
    }

    try {
      setAiLoading(true);
      setError("");

      const prompt = `You are JARVIS, an expert startup advisor inside BuildX.
Enhance and structure this project idea:
Title: "${formData.title}"
Rough Draft: "${formData.description}"

Provide:
1. A refined, compelling 2-sentence value proposition.
2. 3 essential recommended skills or tech stacks.`;

      const response = await askJarvisAI({ message: prompt });
      const reply = response.reply;

      if (reply) {
        setFormData((prev) => ({
          ...prev,
          description: prev.description
            ? `${prev.description}\n\n[JARVIS Insights]:\n${reply}`
            : reply,
        }));
        setSuccess("Idea enriched with JARVIS AI insights!");
      }
    } catch (err) {
      console.error("AI enhancement error:", err);
      setError("AI service unavailable. You can continue publishing manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      setLoading(true);
      const user = userProfile || {
        uid: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
        role: "Creator",
      };

      await createIdea(formData, user);
      setSuccess("Idea published successfully! Redirecting to Ideas Hub...");
      setTimeout(() => {
        navigate("/ideas");
      }, 1000);
    } catch (err) {
      console.error("Error creating idea:", err);
      setError(err.message || "Failed to publish idea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        {/* BACK LINK */}
        <button
          onClick={() => navigate("/ideas")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            color: "#94A3B8",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "24px",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Ideas Hub</span>
        </button>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "28px",
            padding: "40px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#F59E0B", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
                <Lightbulb size={16} />
                <span>STARTUP & PROJECT CREATOR</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#FFFFFF" }}>
                Publish an Idea
              </h1>
              <p style={{ margin: "4px 0 0", color: "#94A3B8", fontSize: "14px" }}>
                Share your vision with developers, designers, and collaborators worldwide.
              </p>
            </div>

            <button
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={aiLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                color: "#A5B4FC",
                fontSize: "13px",
                fontWeight: "600",
                cursor: aiLoading ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              <Sparkles size={15} color="#818CF8" />
              <span>{aiLoading ? "Consulting JARVIS..." : "AI Enhance"}</span>
            </button>
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

          {/* FORM */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            {/* Title */}
            <div>
              <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                Idea Title *
              </label>
              <input
                type="text"
                required
                name="title"
                placeholder="e.g. AI-Powered Medical Diagnostic Assistant"
                value={formData.title}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "#0F172A",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                Description & Vision *
              </label>
              <textarea
                required
                name="description"
                rows={6}
                placeholder="Explain the problem you are solving, target users, and why you are excited to build this..."
                value={formData.description}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Required Skills */}
            <div>
              <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                Skills Needed from Collaborators (Comma separated)
              </label>
              <input
                type="text"
                name="requiredSkills"
                placeholder="React, PyTorch, UX Research, Mobile"
                value={formData.requiredSkills}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
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
              }}
            >
              <span>{loading ? "Publishing to BuildX..." : "Publish Idea"}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PostIdea;
