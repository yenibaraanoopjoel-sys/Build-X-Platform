import {
  useEffect,
  useState,
  useCallback,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

function ProjectWorkspace() {
  //
  // STATES
  //
  const [projects, setProjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  //
  // TOKEN
  //
  const token =
    localStorage.getItem(
      "token"
    ) || "";

  //
  // FETCH PROJECTS
  //
  const fetchProjects =
    useCallback(async () => {
      try {
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
          response?.data?.success
        ) {
          setProjects(
            Array.isArray(
              response?.data
                ?.projects
            )
              ? response.data
                  .projects
              : []
          );
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.log(
          "PROJECT FETCH ERROR:",
          error?.response?.data ||
            error.message
        );

        setProjects([]);
      }
    }, [token]);

  //
  // FETCH TASKS
  //
  const fetchTasks =
    useCallback(async () => {
      try {
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
              response?.data
                ?.tasks
            )
              ? response.data
                  .tasks
              : []
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
      }
    }, [token]);

  //
  // INITIAL LOAD
  //
  useEffect(() => {
    const loadData =
      async () => {
        try {
          setLoading(true);

          await fetchProjects();

          await fetchTasks();
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    loadData();
  }, [
    fetchProjects,
    fetchTasks,
  ]);

  //
  // CALCULATIONS
  //
  const totalProjects =
    Array.isArray(projects)
      ? projects.length
      : 0;

  const totalTasks =
    Array.isArray(tasks)
      ? tasks.length
      : 0;

  const completedProjects =
    Array.isArray(projects)
      ? projects.filter(
          (project) =>
            project?.status ===
            "Completed"
        ).length
      : 0;

  //
  // CONTRIBUTORS
  //
  const contributors =
    new Set(
      Array.isArray(projects)
        ? projects.flatMap(
            (project) =>
              Array.isArray(
                project?.members
              )
                ? project.members.map(
                    (member) =>
                      member?._id
                  )
                : []
          )
        : []
    ).size;

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
              PROJECT WORKSPACE
            </h1>

            <p
              style={{
                color: "#CBD5E1",
                fontSize: "18px",
                lineHeight: "1.8",
              }}
            >
              Manage projects,
              collaboration systems,
              productivity workflows,
              and futuristic teamwork
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
            {/* TOTAL PROJECTS */}
            <div
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
                  fontSize: "18px",
                  color: "#CBD5E1",
                  marginBottom:
                    "10px",
                }}
              >
                Total Projects
              </h3>

              <h1
                style={{
                  fontSize: "48px",
                }}
              >
                {totalProjects}
              </h1>
            </div>

            {/* TOTAL TASKS */}
            <div
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
                  fontSize: "18px",
                  color: "#CBD5E1",
                  marginBottom:
                    "10px",
                }}
              >
                Total Tasks
              </h3>

              <h1
                style={{
                  fontSize: "48px",
                }}
              >
                {totalTasks}
              </h1>
            </div>

            {/* COMPLETED PROJECTS */}
            <div
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
                  fontSize: "18px",
                  color: "#CBD5E1",
                  marginBottom:
                    "10px",
                }}
              >
                Completed Projects
              </h3>

              <h1
                style={{
                  fontSize: "48px",
                }}
              >
                {completedProjects}
              </h1>
            </div>

            {/* CONTRIBUTORS */}
            <div
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
                  fontSize: "18px",
                  color: "#CBD5E1",
                  marginBottom:
                    "10px",
                }}
              >
                Contributors
              </h3>

              <h1
                style={{
                  fontSize: "48px",
                }}
              >
                {contributors}
              </h1>
            </div>
          </div>

          {/* PROJECTS */}
          <div
            style={{
              padding: "36px",
              borderRadius:
                "28px",
              background:
                "rgba(255,255,255,0.05)",
              marginBottom:
                "40px",
            }}
          >
            <h2
              style={{
                fontSize: "42px",
                marginBottom:
                  "28px",
              }}
            >
              Your Projects
            </h2>

            {!Array.isArray(
              projects
            ) ||
            projects.length ===
              0 ? (
              <div
                style={{
                  textAlign:
                    "center",
                  padding:
                    "50px",
                }}
              >
                <h2>
                  No Projects Found
                  🚀
                </h2>
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
                  (project) => (
                    <div
                      key={
                        project?._id
                      }
                      style={{
                        padding:
                          "24px",
                        borderRadius:
                          "22px",
                        background:
                          "rgba(255,255,255,0.05)",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <h2
                        style={{
                          fontSize:
                            "26px",
                          marginBottom:
                            "12px",
                        }}
                      >
                        {project?.title ||
                          "Untitled Project"}
                      </h2>

                      <p
                        style={{
                          color:
                            "#CBD5E1",
                          lineHeight:
                            "1.7",
                          marginBottom:
                            "16px",
                        }}
                      >
                        {project?.description ||
                          "No description available."}
                      </p>

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          marginBottom:
                            "14px",
                        }}
                      >
                        <span>
                          Status
                        </span>

                        <span>
                          {project?.status ||
                            "Pending"}
                        </span>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          marginBottom:
                            "14px",
                        }}
                      >
                        <span>
                          Progress
                        </span>

                        <span>
                          {project?.completionPercentage ||
                            0}
                          %
                        </span>
                      </div>

                      {/* PROGRESS BAR */}
                      <div
                        style={{
                          width:
                            "100%",
                          height:
                            "10px",
                          borderRadius:
                            "999px",
                          background:
                            "rgba(255,255,255,0.08)",
                          overflow:
                            "hidden",
                          marginBottom:
                            "18px",
                        }}
                      >
                        <div
                          style={{
                            width:
                              (project?.completionPercentage ||
                                0) +
                              "%",
                            height:
                              "100%",
                            background:
                              "linear-gradient(135deg, #8B5CF6, #EC4899)",
                          }}
                        />
                      </div>

                      <p
                        style={{
                          color:
                            "#94A3B8",
                        }}
                      >
                        👥 Members:{" "}
                        {Array.isArray(
                          project?.members
                        )
                          ? project
                              .members
                              .length
                          : 0}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* TASKS */}
          <div
            style={{
              padding: "36px",
              borderRadius:
                "28px",
              background:
                "rgba(255,255,255,0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "42px",
                marginBottom:
                  "28px",
              }}
            >
              Recent Tasks
            </h2>

            {!Array.isArray(
              tasks
            ) ||
            tasks.length ===
              0 ? (
              <div
                style={{
                  textAlign:
                    "center",
                  padding:
                    "50px",
                }}
              >
                <h2>
                  No Tasks Found 📋
                </h2>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "18px",
                }}
              >
                {tasks.map(
                  (task) => (
                    <div
                      key={
                        task?._id
                      }
                      style={{
                        padding:
                          "24px",
                        borderRadius:
                          "22px",
                        background:
                          "rgba(255,255,255,0.05)",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        flexWrap:
                          "wrap",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            marginBottom:
                              "10px",
                          }}
                        >
                          {task?.title ||
                            "Untitled Task"}
                        </h3>

                        <p
                          style={{
                            color:
                              "#94A3B8",
                          }}
                        >
                          {task?.description ||
                            "No description"}
                        </p>
                      </div>

                      <div
                        style={{
                          padding:
                            "10px 18px",
                          borderRadius:
                            "999px",
                          background:
                            task?.status ===
                            "Completed"
                              ? "rgba(34,197,94,0.2)"
                              : task?.status ===
                                "In Progress"
                              ? "rgba(234,179,8,0.2)"
                              : "rgba(239,68,68,0.2)",
                        }}
                      >
                        {task?.status ||
                          "Pending"}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectWorkspace;