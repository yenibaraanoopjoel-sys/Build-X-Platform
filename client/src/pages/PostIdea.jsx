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
            "https://build-x-platform.onrender.com/api/ai",
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
        minHeight: "100vh",

        background:
          "linear-gradient(135deg, #050816 0%, #0B1023 40%, #1E1B4B 100%)",

        color: "white",

        overflow: "hidden",

        position: "relative",
      }}
    >
      {/* Glow Effects */}
      <div
        style={{
          position: "absolute",

          width: "500px",

          height: "500px",

          background:
            "rgba(59,130,246,0.10)",

          borderRadius: "50%",

          filter: "blur(140px)",

          top: "-180px",

          left: "-120px",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "450px",

          height: "450px",

          background:
            "rgba(124,58,237,0.12)",

          borderRadius: "50%",

          filter: "blur(130px)",

          bottom: "-150px",

          right: "-100px",
        }}
      />

      {/* Navbar */}
      <Navbar />

      <div
        style={{
          display: "flex",

          position: "relative",

          zIndex: 2,
        }}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* MAIN */}
        <div
          style={{
            flex: 1,

            padding: "42px",

            display: "flex",

            justifyContent:
              "center",
          }}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",

              maxWidth: "850px",

              padding: "48px",

              position: "relative",

              overflow: "hidden",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",

                width: "260px",

                height: "260px",

                background:
                  "rgba(91,95,255,0.10)",

                borderRadius: "50%",

                filter: "blur(90px)",

                top: "-70px",

                right: "-40px",
              }}
            />

            {/* HEADER */}
            <div
              style={{
                marginBottom: "36px",

                position: "relative",

                zIndex: 2,
              }}
            >
              <h1
                className="welcome-title"
                style={{
                  fontSize: "48px",

                  marginBottom:
                    "18px",

                  lineHeight:
                    "1.3",
                }}
              >
                AI STARTUP BUILDER
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "17px",

                  lineHeight:
                    "2",

                  maxWidth:
                    "760px",
                }}
              >
                Create, enhance,
                optimize, and share
                futuristic startup
                ideas using BuildX
                AI-powered innovation
                systems.
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                submitHandler
              }
              style={{
                position: "relative",

                zIndex: 2,
              }}
            >
              {/* TITLE */}
              <div
                style={{
                  marginBottom: "26px",
                }}
              >
                <label
                  style={{
                    color:
                      "#E2E8F0",

                    fontSize: "15px",

                    fontWeight:
                      "600",
                  }}
                >
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

                    marginTop: "10px",

                    padding: "16px",

                    borderRadius:
                      "16px",

                    fontSize:
                      "15px",
                  }}
                />
              </div>

              {/* DESCRIPTION */}
              <div
                style={{
                  marginBottom: "26px",
                }}
              >
                <label
                  style={{
                    color:
                      "#E2E8F0",

                    fontSize: "15px",

                    fontWeight:
                      "600",
                  }}
                >
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

                    marginTop: "10px",

                    padding: "18px",

                    borderRadius:
                      "16px",

                    resize:
                      "none",

                    lineHeight:
                      "1.9",

                    fontSize:
                      "15px",
                  }}
                />
              </div>

              {/* AI BUTTON */}
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

                  padding: "16px",

                  borderRadius:
                    "18px",

                  marginBottom:
                    "26px",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  color:
                    "white",

                  fontSize:
                    "15px",

                  fontWeight:
                    "600",

                  boxShadow:
                    "0 0 24px rgba(124,58,237,0.24)",
                }}
              >
                {aiLoading
                  ? "Enhancing Idea..."
                  : "Enhance with AI"}
              </button>

              {/* TECH STACK */}
              <div
                style={{
                  marginBottom: "32px",
                }}
              >
                <label
                  style={{
                    color:
                      "#E2E8F0",

                    fontSize: "15px",

                    fontWeight:
                      "600",
                  }}
                >
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

                    marginTop: "10px",

                    padding: "16px",

                    borderRadius:
                      "16px",

                    fontSize:
                      "15px",
                  }}
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={
                  loading
                }
                style={{
                  width: "100%",

                  padding: "16px",

                  borderRadius:
                    "18px",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  color:
                    "white",

                  fontSize:
                    "15px",

                  fontWeight:
                    "600",

                  boxShadow:
                    "0 0 24px rgba(124,58,237,0.24)",
                }}
              >
                {loading
                  ? "Posting Idea..."
                  : "Post Idea"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostIdea;