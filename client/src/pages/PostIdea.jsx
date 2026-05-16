import { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import API from "../services/api";

function PostIdea() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      techStack: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [aiLoading, setAiLoading] =
    useState(false);

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // AI Idea Enhancer
  const enhanceIdea =
    async () => {
      if (
        !formData.title ||
        !formData.description
      ) {
        alert(
          "Please enter title and description first"
        );

        return;
      }

      try {
        setAiLoading(true);

        const response =
          await axios.post(
            "http://localhost:5000/api/ai",
            {
              message: `
Enhance this startup/project idea professionally.

Idea Title:
${formData.title}

Idea Description:
${formData.description}

Provide:
1. Improved Idea Description
2. Key Features
3. Monetization Strategy
4. Suggested Roadmap
5. Best Technologies
`,
            }
          );

        setFormData((prev) => ({
          ...prev,

          description:
            response.data.reply,
        }));
      } catch (error) {
        console.log(error);

        alert(
          "AI enhancement failed"
        );
      } finally {
        setAiLoading(false);
      }
    };

  // Submit Idea
  const submitHandler = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      await API.post(
        "/ideas",
        {
          title:
            formData.title,

          description:
            formData.description,

          techStack:
            formData.techStack.split(
              ","
            ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Idea Posted Successfully 🚀"
      );

      navigate("/ideas");
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Failed to post idea"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom right, #020617, #0F172A)",

        minHeight: "100vh",

        color: "white",
      }}
    >
      {/* Navbar */}
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          style={{
            flex: 1,

            padding: "40px",

            display: "flex",

            justifyContent:
              "center",
          }}
        >
          <div
            style={{
              width: "100%",

              maxWidth: "750px",

              background:
                "rgba(255,255,255,0.05)",

              padding: "40px",

              borderRadius: "28px",

              backdropFilter:
                "blur(15px)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <h1
                style={{
                  fontSize: "40px",

                  marginBottom:
                    "10px",
                }}
              >
                AI Startup Builder 🚀
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "16px",
                }}
              >
                Create, enhance,
                and share your
                startup ideas with
                AI-powered
                assistance.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={
                submitHandler
              }
            >
              {/* Title */}
              <div
                style={{
                  marginBottom: "22px",
                }}
              >
                <label>
                  Idea Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter startup idea title"
                  value={
                    formData.title
                  }
                  onChange={
                    changeHandler
                  }
                  required
                  style={{
                    width: "100%",

                    marginTop: "8px",

                    padding: "14px",

                    borderRadius:
                      "12px",

                    border: "none",

                    outline: "none",

                    background:
                      "#1E293B",

                    color:
                      "white",
                  }}
                />
              </div>

              {/* Description */}
              <div
                style={{
                  marginBottom: "22px",
                }}
              >
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe your startup or project idea..."
                  value={
                    formData.description
                  }
                  onChange={
                    changeHandler
                  }
                  required
                  rows="10"
                  style={{
                    width: "100%",

                    marginTop: "8px",

                    padding: "16px",

                    borderRadius:
                      "12px",

                    border: "none",

                    outline: "none",

                    background:
                      "#1E293B",

                    color:
                      "white",

                    resize:
                      "none",

                    lineHeight:
                      "1.7",
                  }}
                />
              </div>

              {/* AI Enhance Button */}
              <button
                type="button"
                onClick={
                  enhanceIdea
                }
                disabled={
                  aiLoading
                }
                style={{
                  width: "100%",

                  padding: "15px",

                  border: "none",

                  borderRadius:
                    "14px",

                  cursor:
                    "pointer",

                  marginBottom:
                    "22px",

                  background:
                    "linear-gradient(to right, #F59E0B, #EF4444)",

                  color:
                    "white",

                  fontSize:
                    "16px",

                  fontWeight:
                    "bold",

                  boxShadow:
                    "0 8px 25px rgba(245,158,11,0.3)",
                }}
              >
                {aiLoading
                  ? "JARVIS Enhancing Idea..."
                  : "✨ Enhance with JARVIS"}
              </button>

              {/* Tech Stack */}
              <div
                style={{
                  marginBottom: "30px",
                }}
              >
                <label>
                  Tech Stack
                </label>

                <input
                  type="text"
                  name="techStack"
                  placeholder="React, Node.js, MongoDB..."
                  value={
                    formData.techStack
                  }
                  onChange={
                    changeHandler
                  }
                  required
                  style={{
                    width: "100%",

                    marginTop: "8px",

                    padding: "14px",

                    borderRadius:
                      "12px",

                    border: "none",

                    outline: "none",

                    background:
                      "#1E293B",

                    color:
                      "white",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  loading
                }
                style={{
                  width: "100%",

                  padding: "15px",

                  border: "none",

                  borderRadius:
                    "14px",

                  cursor:
                    "pointer",

                  background:
                    "linear-gradient(to right, #2563EB, #7C3AED)",

                  color:
                    "white",

                  fontSize:
                    "16px",

                  fontWeight:
                    "bold",

                  boxShadow:
                    "0 8px 25px rgba(37,99,235,0.35)",
                }}
              >
                {loading
                  ? "Posting Idea..."
                  : "🚀 Post Idea"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostIdea;