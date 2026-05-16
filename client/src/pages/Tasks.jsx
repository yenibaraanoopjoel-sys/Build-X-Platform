import { useEffect, useState } from "react";

import axios from "axios";

import "@fontsource/dancing-script";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";

import API from "../services/api";

function Tasks() {
  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [projectIdea, setProjectIdea] =
    useState("");

  const [aiLoading, setAiLoading] =
    useState(false);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await API.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // AI Generator
  const generateTasks =
    async () => {
      if (!projectIdea) {
        alert(
          "Enter project idea first"
        );

        return;
      }

      try {
        setAiLoading(true);

        const response =
          await axios.post(
            "https://build-x-platform.onrender.com",
            {
              message: `
Generate professional software development tasks for this project idea:

${projectIdea}

Provide:
- frontend tasks
- backend tasks
- database tasks
- testing tasks
- deployment tasks

Keep it beginner-friendly and structured.
`,
            }
          );

        const aiTask = {
          _id: Date.now(),

          title:
            "AI Generated Task Plan",

          description:
            response.data.reply,

          status: "Pending",
        };

        setTasks((prev) => [
          aiTask,
          ...prev,
        ]);
      } catch (error) {
        console.log(error);

        alert(
          "AI task generation failed"
        );
      } finally {
        setAiLoading(false);
      }
    };

  // Loading
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
      {/* Glow Effects */}
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
          {/* Hero */}
          <div
            style={{
              marginBottom: "40px",
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
              AI Task Board ✨
            </h1>

            <p
              style={{
                color: "#E9D5FF",

                fontSize: "19px",

                lineHeight: "1.8",

                maxWidth: "800px",
              }}
            >
              Generate futuristic
              AI-powered productivity
              workflows and manage
              your project execution
              with luxury BuildX task
              intelligence.
            </p>
          </div>

          {/* AI Generator */}
          <div
            style={{
              background:
                "rgba(255,255,255,0.05)",

              padding: "36px",

              borderRadius: "32px",

              border:
                "1px solid rgba(255,255,255,0.08)",

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

                fontSize: "48px",

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
              ✨ JARVIS AI Generator
            </h2>

            <textarea
              placeholder="Describe your futuristic project idea..."
              value={projectIdea}
              onChange={(e) =>
                setProjectIdea(
                  e.target.value
                )
              }
              rows="6"
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

                marginBottom: "24px",

                lineHeight: "1.9",

                fontSize: "17px",

                backdropFilter:
                  "blur(10px)",
              }}
            />

            <button
              onClick={
                generateTasks
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

                boxShadow:
                  "0 10px 30px rgba(236,72,153,0.25)",
              }}
            >
              {aiLoading
                ? "🤖 JARVIS Generating..."
                : "🚀 Generate AI Tasks"}
            </button>
          </div>

          {/* Empty State */}
          {tasks.length === 0 ? (
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "60px",

                borderRadius: "30px",

                textAlign:
                  "center",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(16px)",

                boxShadow:
                  "0 10px 40px rgba(168,85,247,0.10)",
              }}
            >
              <h2
                style={{
                  fontSize: "48px",

                  marginBottom: "18px",

                  fontFamily:
                    "'Dancing Script', cursive",

                  background:
                    "linear-gradient(to right, #C084FC, #F472B6)",

                  WebkitBackgroundClip:
                    "text",

                  WebkitTextFillColor:
                    "transparent",
                }}
              >
                No Tasks Yet 🚀
              </h2>

              <p
                style={{
                  color: "#D8B4FE",

                  fontSize: "18px",
                }}
              >
                Generate futuristic
                AI workflows or create
                tasks from your BuildX
                workspace.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",

                flexDirection:
                  "column",

                gap: "26px",
              }}
            >
              {tasks.map((task) => (
                <div
                  key={task._id}
                  style={{
                    background:
                      "rgba(255,255,255,0.05)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    borderRadius:
                      "28px",

                    padding: "24px",

                    backdropFilter:
                      "blur(16px)",

                    boxShadow:
                      "0 10px 35px rgba(168,85,247,0.08)",
                  }}
                >
                  <TaskCard
                    task={task}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;