import { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";

import API from "../services/api";

function Tasks() {
  //
  // STATES
  //
  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [projectIdea, setProjectIdea] =
    useState("");

  const [aiLoading, setAiLoading] =
    useState(false);

  //
  // FETCH TASKS
  //
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response =
        await API.get("/tasks");

      if (
        response?.data
          ?.success
      ) {
        setTasks(
          response?.data
            ?.tasks || []
        );
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error(
        "TASK FETCH ERROR:",
        error.response?.data ||
          error.message
      );

      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  //
  // INITIAL LOAD
  //
  useEffect(() => {
    fetchTasks();
  }, []);

  //
  // UPDATE TASK STATUS
  //
  const updateTaskStatus =
    async (
      taskId,
      status,
      progress
    ) => {
      try {
        await API.put(
          `/tasks/${taskId}`,
          {
            status,
            progress,
          }
        );

        fetchTasks();
      } catch (error) {
        console.log(
          "TASK UPDATE ERROR:",
          error.response?.data ||
            error.message
        );
      }
    };

  //
  // DELETE TASK
  //
  const deleteTask =
    async (taskId) => {
      try {
        await API.delete(
          `/tasks/${taskId}`
        );

        fetchTasks();
      } catch (error) {
        console.log(
          "DELETE TASK ERROR:",
          error.response?.data ||
            error.message
        );
      }
    };

  //
  // AI TASK GENERATOR
  //
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
            "https://build-x-platform.onrender.com/api/ai",
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
            response?.data
              ?.reply ||
            "No AI response generated",

          status:
            "Pending",

          progress: 0,
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

  //
  // COUNTS
  //
  const completedTasks =
    tasks?.filter(
      (task) =>
        task?.status ===
        "Completed"
    )?.length || 0;

  const pendingTasks =
    tasks?.filter(
      (task) =>
        task?.status ===
        "Pending"
    )?.length || 0;

  const inProgressTasks =
    tasks?.filter(
      (task) =>
        task?.status ===
        "In Progress"
    )?.length || 0;

  //
  // LOADING
  //
  if (loading) {
    return <Loader />;
  }

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
          }}
        >
          {/* HERO */}
          <div
            className="glass-card"
            style={{
              padding: "48px",

              marginBottom: "42px",

              position: "relative",

              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",

                width: "250px",

                height: "250px",

                background:
                  "rgba(91,95,255,0.10)",

                borderRadius: "50%",

                filter: "blur(90px)",

                top: "-70px",

                right: "-50px",
              }}
            />

            <div
              style={{
                position: "relative",

                zIndex: 2,
              }}
            >
              <h1
                className="welcome-title"
                style={{
                  fontSize: "52px",

                  marginBottom: "22px",

                  lineHeight: "1.3",
                }}
              >
                AI TASK BOARD
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "18px",

                  lineHeight: "2",

                  maxWidth: "820px",
                }}
              >
                Generate AI-powered
                workflows, organize
                project execution,
                manage productivity,
                and streamline
                development pipelines
                inside BuildX.
              </p>
            </div>
          </div>

          {/* STATS */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",

              gap: "24px",

              marginBottom: "42px",
            }}
          >
            {[
              {
                title:
                  "Total Tasks",

                value:
                  tasks?.length ||
                  0,

                icon: "📌",
              },

              {
                title:
                  "Completed",

                value:
                  completedTasks,

                icon: "✅",
              },

              {
                title:
                  "Pending",

                value:
                  pendingTasks,

                icon: "⏳",
              },

              {
                title:
                  "In Progress",

                value:
                  inProgressTasks,

                icon: "🚀",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card"
                style={{
                  padding: "28px",

                  position:
                    "relative",

                  overflow:
                    "hidden",
                }}
              >
                <div
                  style={{
                    position:
                      "absolute",

                    width: "180px",

                    height:
                      "180px",

                    background:
                      "rgba(124,58,237,0.08)",

                    borderRadius:
                      "50%",

                    filter:
                      "blur(70px)",

                    top: "-60px",

                    right: "-60px",
                  }}
                />

                <div
                  style={{
                    display: "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    marginBottom:
                      "14px",

                    position:
                      "relative",

                    zIndex: 2,
                  }}
                >
                  <h2
                    style={{
                      fontSize:
                        "26px",
                    }}
                  >
                    {item.title}
                  </h2>

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
                    fontSize:
                      "48px",

                    position:
                      "relative",

                    zIndex: 2,
                  }}
                >
                  {item.value}
                </h1>
              </div>
            ))}
          </div>

          {/* AI GENERATOR */}
          <div
            className="glass-card"
            style={{
              padding: "36px",

              marginBottom: "42px",
            }}
          >
            <h2
              className="section-title"
              style={{
                fontSize: "42px",

                marginBottom: "26px",
              }}
            >
              AI Task Generator
            </h2>

            <textarea
              placeholder="Describe your project idea..."
              value={projectIdea}
              onChange={(e) =>
                setProjectIdea(
                  e.target.value
                )
              }
              rows="6"
              style={{
                width: "100%",

                padding: "22px",

                borderRadius:
                  "18px",

                resize: "none",

                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "white",

                marginBottom: "24px",

                lineHeight: "1.9",

                fontSize: "15px",

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

                borderRadius:
                  "16px",

                background:
                  "linear-gradient(135deg, #2563EB, #7C3AED)",

                color:
                  "white",

                fontWeight:
                  "600",

                fontSize:
                  "15px",

                border: "none",

                cursor:
                  "pointer",

                boxShadow:
                  "0 0 24px rgba(124,58,237,0.24)",
              }}
            >
              {aiLoading
                ? "Generating..."
                : "Generate AI Tasks"}
            </button>
          </div>

          {/* EMPTY */}
          {tasks?.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: "70px",

                textAlign: "center",
              }}
            >
              <h2
                className="section-title"
                style={{
                  fontSize: "42px",

                  marginBottom:
                    "22px",
                }}
              >
                No Tasks Yet
              </h2>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "17px",

                  lineHeight:
                    "1.9",
                }}
              >
                Generate AI workflows
                or create professional
                task pipelines inside
                BuildX.
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
              {tasks?.map(
                (task) => (
                  <div
                    key={
                      task?._id
                    }
                    className="glass-card"
                    style={{
                      padding:
                        "24px",
                    }}
                  >
                    <TaskCard
                      task={task}
                      updateTaskStatus={
                        updateTaskStatus
                      }
                      deleteTask={
                        deleteTask
                      }
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;