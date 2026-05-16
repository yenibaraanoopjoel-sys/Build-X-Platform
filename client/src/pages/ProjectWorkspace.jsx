import { useEffect, useState } from "react";

import axios from "axios";

import "@fontsource/dancing-script";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

function ProjectWorkspace() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [meetingNotes, setMeetingNotes] =
    useState("");

  const [summary, setSummary] =
    useState("");

  const [aiLoading, setAiLoading] =
    useState(false);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await API.get(
          "/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setProjects(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // AI Summary
  const generateSummary =
    async () => {
      if (!meetingNotes) {
        alert(
          "Enter meeting notes first"
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
Create a professional meeting summary from these notes.

Meeting Notes:
${meetingNotes}

Provide:
1. Summary
2. Key Decisions
3. Action Items
4. Next Steps
`,
            }
          );

        setSummary(
          response.data.reply
        );
      } catch (error) {
        console.log(error);

        alert(
          "AI Summary failed"
        );
      } finally {
        setAiLoading(false);
      }
    };

  // Loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom right, #12071F, #1E0B36, #0F172A)",

        minHeight: "100vh",

        color: "white",

        overflow: "hidden",

        position: "relative",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",

          width: "500px",

          height: "500px",

          background:
            "rgba(168,85,247,0.12)",

          borderRadius: "50%",

          filter: "blur(120px)",

          top: "-120px",

          right: "-100px",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "450px",

          height: "450px",

          background:
            "rgba(236,72,153,0.12)",

          borderRadius: "50%",

          filter: "blur(120px)",

          bottom: "-100px",

          left: "-100px",
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

        {/* Main */}
        <div
          style={{
            flex: 1,

            padding: "40px",
          }}
        >
          {/* Header */}
          <div
            style={{
              marginBottom: "42px",
            }}
          >
            <h1
              style={{
                fontSize: "72px",

                fontFamily:
                  "'Dancing Script', cursive",

                marginBottom: "14px",

                background:
                  "linear-gradient(to right, #C084FC, #F472B6)",

                WebkitBackgroundClip:
                  "text",

                WebkitTextFillColor:
                  "transparent",
              }}
            >
              Project Workspace ✨
            </h1>

            <p
              style={{
                color: "#E9D5FF",

                fontSize: "19px",

                lineHeight: "1.8",

                maxWidth: "850px",
              }}
            >
              Manage projects,
              AI meetings,
              collaboration workflows,
              and futuristic team
              productivity inside
              BuildX.
            </p>
          </div>

          {/* AI Meeting Summary */}
          <div
            style={{
              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: "30px",

              padding: "34px",

              marginBottom: "42px",

              backdropFilter:
                "blur(16px)",

              boxShadow:
                "0 10px 40px rgba(168,85,247,0.10)",
            }}
          >
            <h2
              style={{
                marginBottom: "22px",

                fontSize: "50px",

                fontFamily:
                  "'Dancing Script', cursive",

                background:
                  "linear-gradient(to right, #F5D0FE, #F9A8D4)",

                WebkitBackgroundClip:
                  "text",

                WebkitTextFillColor:
                  "transparent",
              }}
            >
              🤖 AI Meeting Summary
            </h2>

            <textarea
              placeholder="Paste meeting notes here..."
              value={meetingNotes}
              onChange={(e) =>
                setMeetingNotes(
                  e.target.value
                )
              }
              rows="7"
              style={{
                width: "100%",

                padding: "20px",

                borderRadius:
                  "20px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                outline: "none",

                resize: "none",

                background:
                  "rgba(255,255,255,0.05)",

                color: "white",

                lineHeight: "1.8",

                marginBottom: "24px",

                fontSize: "16px",

                backdropFilter:
                  "blur(10px)",
              }}
            />

            <button
              onClick={
                generateSummary
              }
              disabled={aiLoading}
              style={{
                padding:
                  "16px 30px",

                border: "none",

                borderRadius:
                  "18px",

                cursor:
                  "pointer",

                background:
                  "linear-gradient(to right, #9333EA, #EC4899)",

                color:
                  "white",

                fontWeight:
                  "bold",

                fontSize:
                  "17px",

                marginBottom:
                  "24px",

                boxShadow:
                  "0 10px 30px rgba(236,72,153,0.25)",
              }}
            >
              {aiLoading
                ? "🤖 JARVIS Generating..."
                : "🚀 Generate Summary"}
            </button>

            {/* Output */}
            {summary && (
              <div
                style={{
                  background:
                    "rgba(255,255,255,0.04)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  borderRadius:
                    "24px",

                  padding: "26px",

                  lineHeight: "1.9",

                  whiteSpace:
                    "pre-wrap",

                  color: "#E9D5FF",
                }}
              >
                <h3
                  style={{
                    marginBottom:
                      "16px",

                    color: "#F472B6",

                    fontSize: "24px",
                  }}
                >
                  ✨ AI Meeting Report
                </h3>

                {summary}
              </div>
            )}
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",

              gap: "24px",
            }}
          >
            {[
              {
                title:
                  "Active Projects",
                value:
                  projects.length,
                icon: "🛠️",
              },

              {
                title:
                  "Contributors",
                value: 24,
                icon: "👥",
              },

              {
                title:
                  "Pending Tasks",
                value: 18,
                icon: "📌",
              },

              {
                title:
                  "Meetings Today",
                value: 6,
                icon: "🎥",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background:
                    "rgba(255,255,255,0.05)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  borderRadius:
                    "28px",

                  padding: "30px",

                  backdropFilter:
                    "blur(16px)",

                  boxShadow:
                    "0 10px 35px rgba(168,85,247,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    marginBottom:
                      "16px",
                  }}
                >
                  <h3
                    style={{
                      color:
                        "#D8B4FE",

                      fontSize:
                        "18px",
                    }}
                  >
                    {item.title}
                  </h3>

                  <span
                    style={{
                      fontSize:
                        "30px",
                    }}
                  >
                    {item.icon}
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: "48px",

                    background:
                      "linear-gradient(to right, #C084FC, #F472B6)",

                    WebkitBackgroundClip:
                      "text",

                    WebkitTextFillColor:
                      "transparent",
                  }}
                >
                  {item.value}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectWorkspace;