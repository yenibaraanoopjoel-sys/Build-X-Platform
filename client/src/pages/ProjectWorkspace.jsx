import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

function ProjectWorkspace() {
  // STATES
  const [projects, setProjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [meetingNotes, setMeetingNotes] =
    useState("");

  const [summary, setSummary] =
    useState("");

  const [aiLoading, setAiLoading] =
    useState(false);

  // FETCH PROJECTS
  const fetchProjects =
    async () => {
      try {
        setLoading(true);

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

        if (
          response.data.success
        ) {
          setProjects(
            response.data.projects
          );
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.log(
          "PROJECT ERROR:",
          error.response?.data ||
            error.message
        );

        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

  // FETCH TASKS
  const fetchTasks =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

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
          response.data.success
        ) {
          setTasks(
            response.data.tasks
          );
        }
      } catch (error) {
        console.log(
          "TASK ERROR:",
          error.response?.data ||
            error.message
        );

        setTasks([]);
      }
    };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // AI SUMMARY
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
            "https://build-x-platform.onrender.com/api/ai",
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

  // CALCULATIONS
  const totalProjects =
    projects.length;

  const totalTasks =
    tasks.length;

  const completedProjects =
    projects.filter(
      (project) =>
        project.status ===
        "Completed"
    ).length;

  const contributors =
    new Set(
      projects.flatMap(
        (project) =>
          project.members?.map(
            (member) =>
              member._id
          ) || []
      )
    ).size;

  // LOADER
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
      {/* Glow */}
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

      {/* NAVBAR */}
      <Navbar />

      <div
        style={{
          display: "flex",

          position: "relative",

          zIndex: 2,
        }}
      >
        {/* SIDEBAR */}
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
                PROJECT WORKSPACE
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "18px",

                  lineHeight: "2",

                  maxWidth: "820px",
                }}
              >
                Manage projects,
                AI-powered meetings,
                collaboration systems,
                productivity workflows,
                and futuristic teamwork
                inside BuildX.
              </p>
            </div>
          </div>

          {/* PROJECTS SECTION */}
          <div
            className="glass-card"
            style={{
              padding: "36px",

              marginBottom: "42px",
            }}
          >
            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom: "28px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  fontSize: "42px",
                }}
              >
                Your Projects
              </h2>
            </div>

            {/* EMPTY STATE */}
            {projects.length ===
            0 ? (
              <div
                style={{
                  textAlign:
                    "center",

                  padding:
                    "60px 20px",

                  borderRadius:
                    "22px",

                  background:
                    "rgba(255,255,255,0.04)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "70px",

                    marginBottom:
                      "20px",
                  }}
                >
                  🚀
                </div>

                <h2
                  style={{
                    fontSize:
                      "34px",

                    marginBottom:
                      "14px",
                  }}
                >
                  No Projects Yet
                </h2>

                <p
                  style={{
                    color:
                      "#CBD5E1",

                    lineHeight:
                      "1.9",

                    fontSize:
                      "16px",
                  }}
                >
                  Start building your
                  first futuristic
                  project inside
                  BuildX.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(320px, 1fr))",

                  gap: "24px",
                }}
              >
                {projects.map(
                  (
                    project,
                    index
                  ) => (
                    <div
                      key={index}
                      className="glass-card"
                      style={{
                        padding:
                          "28px",

                        border:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <h2
                        style={{
                          fontSize:
                            "28px",

                          marginBottom:
                            "14px",
                        }}
                      >
                        {
                          project.title
                        }
                      </h2>

                      <p
                        style={{
                          color:
                            "#CBD5E1",

                          lineHeight:
                            "1.9",

                          marginBottom:
                            "20px",
                        }}
                      >
                        {project.description ||
                          "No description"}
                      </p>

                      {/* STATUS */}
                      <div
                        style={{
                          display:
                            "flex",

                          justifyContent:
                            "space-between",

                          alignItems:
                            "center",

                          marginBottom:
                            "18px",
                        }}
                      >
                        <span
                          style={{
                            color:
                              "#A5B4FC",
                          }}
                        >
                          📅{" "}
                          {
                            project.status
                          }
                        </span>

                        <span
                          style={{
                            color:
                              "#34D399",
                          }}
                        >
                          {
                            project
                              .completionPercentage
                          }
                          % Complete
                        </span>
                      </div>

                      {/* PROGRESS BAR */}
                      <div
                        style={{
                          width: "100%",

                          height: "10px",

                          background:
                            "rgba(255,255,255,0.08)",

                          borderRadius:
                            "20px",

                          overflow:
                            "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${project.completionPercentage}%`,

                            height:
                              "100%",

                            background:
                              "linear-gradient(135deg, #2563EB, #7C3AED)",

                            borderRadius:
                              "20px",
                          }}
                        />
                      </div>

                      {/* TASK INFO */}
                      <div
                        style={{
                          marginTop:
                            "18px",

                          color:
                            "#CBD5E1",

                          fontSize:
                            "14px",

                          lineHeight:
                            "1.8",
                        }}
                      >
                        <div>
                          Total Tasks:{" "}
                          {
                            project.totalTasks
                          }
                        </div>

                        <div>
                          Completed
                          Tasks:{" "}
                          {
                            project.completedTasks
                          }
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* AI SUMMARY */}
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
              AI Meeting Summary
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

                padding: "22px",

                borderRadius:
                  "18px",

                resize: "none",

                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "white",

                lineHeight: "1.9",

                marginBottom: "24px",

                fontSize: "15px",

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

                borderRadius:
                  "16px",

                border: "none",

                background:
                  "linear-gradient(135deg, #2563EB, #7C3AED)",

                color:
                  "white",

                fontWeight:
                  "600",

                fontSize:
                  "15px",

                cursor:
                  "pointer",

                marginBottom:
                  "24px",

                boxShadow:
                  "0 0 24px rgba(124,58,237,0.24)",
              }}
            >
              {aiLoading
                ? "Generating..."
                : "Generate Summary"}
            </button>

            {/* OUTPUT */}
            {summary && (
              <div
                style={{
                  background:
                    "rgba(255,255,255,0.04)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  borderRadius:
                    "22px",

                  padding: "28px",

                  lineHeight: "2",

                  whiteSpace:
                    "pre-wrap",

                  color: "#CBD5E1",
                }}
              >
                <h3
                  style={{
                    marginBottom:
                      "18px",

                    fontSize: "30px",

                    color: "white",
                  }}
                >
                  AI Meeting Report
                </h3>

                {summary}
              </div>
            )}
          </div>

          {/* REAL STATS */}
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
                  "Projects",
                value:
                  totalProjects,
                icon: "🛠️",
              },

              {
                title:
                  "Contributors",
                value:
                  contributors,
                icon: "👥",
              },

              {
                title:
                  "Tasks",
                value:
                  totalTasks,
                icon: "📌",
              },

              {
                title:
                  "Completed",
                value:
                  completedProjects,
                icon: "✅",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card"
                style={{
                  padding: "30px",

                  position:
                    "relative",

                  overflow:
                    "hidden",
                }}
              >
                {/* Glow */}
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
                      "16px",

                    position:
                      "relative",

                    zIndex: 2,
                  }}
                >
                  <h2
                    style={{
                      fontSize: "28px",

                      color:
                        "white",
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
                    fontSize: "48px",

                    color: "white",

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
        </div>
      </div>
    </div>
  );
}

export default ProjectWorkspace;