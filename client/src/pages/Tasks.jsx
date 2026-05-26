import {
  useEffect,
  useState,
  useCallback,
} from "react";

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
  // TOKEN
  //
  const token =
    localStorage.getItem(
      "token"
    ) || "";

  //
  // FETCH TASKS
  //
  const fetchTasks =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await API.get(
            "/tasks",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (
          response?.data?.success
        ) {
          setTasks(
            Array.isArray(
              response?.data?.tasks
            )
              ? response.data.tasks
              : []
          );
        } else if (
          Array.isArray(
            response?.data
          )
        ) {
          setTasks(
            response.data
          );
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.log(
          "TASK FETCH ERROR:",
          error?.response?.data ||
            error.message
        );

        setTasks([]);
      } finally {
        setLoading(false);
      }
    }, [token]);

  //
  // INITIAL LOAD
  //
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchTasks();
      } catch (error) {
        console.log(
          "UPDATE TASK ERROR:",
          error?.response?.data ||
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
          `/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchTasks();
      } catch (error) {
        console.log(
          "DELETE TASK ERROR:",
          error?.response?.data ||
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
          "Please enter a project idea"
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

Include:
- frontend tasks
- backend tasks
- database tasks
- testing tasks
- deployment tasks
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

          priority:
            "Medium",
        };

        setTasks((prev) => [
          aiTask,
          ...(Array.isArray(prev)
            ? prev
            : []),
        ]);
      } catch (error) {
        console.log(
          "AI TASK ERROR:",
          error?.response?.data ||
            error.message
        );

        alert(
          "AI Task Generation Failed"
        );
      } finally {
        setAiLoading(false);
      }
    };

  //
  // COUNTS
  //
  const completedTasks =
    Array.isArray(tasks)
      ? tasks.filter(
          (task) =>
            task?.status ===
            "Completed"
        ).length
      : 0;

  const pendingTasks =
    Array.isArray(tasks)
      ? tasks.filter(
          (task) =>
            task?.status ===
            "Pending"
        ).length
      : 0;

  const inProgressTasks =
    Array.isArray(tasks)
      ? tasks.filter(
          (task) =>
            task?.status ===
            "In Progress"
        ).length
      : 0;

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
      }}
    >
      {/* NAVBAR */}
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN */}
        <div
          style={{
            flex: 1,
            padding: "40px",
          }}
        >
          {/* HERO */}
          <div
            style={{
              padding: "40px",
              borderRadius:
                "28px",
              background:
                "rgba(255,255,255,0.05)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              marginBottom:
                "35px",
            }}
          >
            <h1
              style={{
                fontSize: "58px",
                fontWeight: "800",
                marginBottom:
                  "16px",
              }}
            >
              AI TASK BOARD
            </h1>

            <p
              style={{
                color: "#CBD5E1",
                fontSize: "18px",
                lineHeight: "1.8",
              }}
            >
              Organize tasks,
              automate workflows,
              and manage futuristic
              productivity systems
              inside BuildX.
            </p>
          </div>

          {/* STATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              marginBottom:
                "40px",
            }}
          >
            {[
              {
                title:
                  "Total Tasks",
                value:
                  tasks.length,
              },
              {
                title:
                  "Completed",
                value:
                  completedTasks,
              },
              {
                title:
                  "Pending",
                value:
                  pendingTasks,
              },
              {
                title:
                  "In Progress",
                value:
                  inProgressTasks,
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "28px",
                  borderRadius:
                    "24px",
                  background:
                    "rgba(255,255,255,0.05)",
                }}
              >
                <h3
                  style={{
                    fontSize:
                      "18px",
                    color:
                      "#CBD5E1",
                    marginBottom:
                      "10px",
                  }}
                >
                  {item.title}
                </h3>

                <h1
                  style={{
                    fontSize:
                      "48px",
                  }}
                >
                  {item.value}
                </h1>
              </div>
            ))}
          </div>

          {/* AI TASK GENERATOR */}
          <div
            style={{
              padding: "32px",
              borderRadius:
                "24px",
              background:
                "rgba(255,255,255,0.05)",
              marginBottom:
                "40px",
            }}
          >
            <h2
              style={{
                fontSize: "34px",
                marginBottom:
                  "18px",
              }}
            >
              AI Task Generator
            </h2>

            <textarea
              value={projectIdea}
              onChange={(e) =>
                setProjectIdea(
                  e.target.value
                )
              }
              placeholder="Describe your project idea..."
              style={{
                width: "100%",
                minHeight:
                  "140px",
                borderRadius:
                  "18px",
                padding:
                  "20px",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                background:
                  "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                marginBottom:
                  "20px",
                fontSize: "16px",
              }}
            />

            <button
              onClick={
                generateTasks
              }
              disabled={
                aiLoading
              }
              style={{
                padding:
                  "14px 28px",
                borderRadius:
                  "14px",
                border: "none",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #8B5CF6, #EC4899)",
                color: "white",
                fontWeight:
                  "700",
                fontSize:
                  "16px",
              }}
            >
              {aiLoading
                ? "Generating..."
                : "Generate AI Tasks"}
            </button>
          </div>

          {/* TASK LIST */}
          <div>
            {!Array.isArray(
              tasks
            ) ||
            tasks.length ===
              0 ? (
              <div
                style={{
                  padding: "50px",
                  borderRadius:
                    "24px",
                  background:
                    "rgba(255,255,255,0.05)",
                  textAlign:
                    "center",
                }}
              >
                <h2>
                  No Tasks Found 📋
                </h2>
              </div>
            ) : (
              tasks.map(
                (task) => (
                  <div
                    key={
                      task?._id
                    }
                    style={{
                      marginBottom:
                        "24px",
                    }}
                  >
                    <TaskCard
                      task={task}
                    />

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "12px",
                        marginTop:
                          "12px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateTaskStatus(
                            task?._id,
                            "Pending",
                            0
                          )
                        }
                        style={
                          buttonStyle
                        }
                      >
                        Pending
                      </button>

                      <button
                        onClick={() =>
                          updateTaskStatus(
                            task?._id,
                            "In Progress",
                            50
                          )
                        }
                        style={
                          buttonStyle
                        }
                      >
                        In Progress
                      </button>

                      <button
                        onClick={() =>
                          updateTaskStatus(
                            task?._id,
                            "Completed",
                            100
                          )
                        }
                        style={
                          buttonStyle
                        }
                      >
                        Completed
                      </button>

                      <button
                        onClick={() =>
                          deleteTask(
                            task?._id
                          )
                        }
                        style={{
                          ...buttonStyle,
                          background:
                            "linear-gradient(135deg, #DC2626, #F43F5E)",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 18px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background:
    "linear-gradient(135deg, #2563EB, #7C3AED)",
  color: "white",
  fontWeight: "700",
};

export default Tasks;