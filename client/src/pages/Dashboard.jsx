import {
  useState,
  useEffect,
  useCallback,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  //
  // TOKEN
  //
  const token =
    localStorage.getItem(
      "token"
    );

  //
  // STATS
  //
  const [stats, setStats] =
    useState([
      {
        title: "Projects",
        value: 0,
        icon: "🛠️",
      },

      {
        title: "Ideas",
        value: 0,
        icon: "💡",
      },

      {
        title: "Tasks",
        value: 0,
        icon: "✅",
      },

      {
        title: "Messages",
        value: 0,
        icon: "💬",
      },
    ]);

  //
  // ANALYTICS
  //
  const [
    analytics,
    setAnalytics,
  ] = useState({
    completedTasks: 0,

    pendingTasks: 0,

    completionRate: 0,

    activeUsers: 0,

    totalProjects: 0,

    totalIdeas: 0,

    totalTasks: 0,
  });

  //
  // LOADING
  //
  const [loading, setLoading] =
    useState(true);

  //
  // FETCH DASHBOARD DATA
  //
  const fetchDashboard =
    useCallback(
      async () => {
        try {
          setLoading(true);

          //
          // SAFE REQUESTS
          //
          const requests = [
            API.get(
              "/projects",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ).catch(() => ({
              data: {},
            })),

            API.get(
              "/ideas",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ).catch(() => ({
              data: {},
            })),

            API.get(
              "/tasks",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ).catch(() => ({
              data: {},
            })),

            API.get(
              "/messages",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ).catch(() => ({
              data: {},
            })),
          ];

          const [
            projectsRes,
            ideasRes,
            tasksRes,
            messagesRes,
          ] =
            await Promise.all(
              requests
            );

          //
          // SAFE ARRAYS
          //
          const projects =
            Array.isArray(
              projectsRes
                ?.data
                ?.projects
            )
              ? projectsRes
                  .data
                  .projects
              : [];

          const ideas =
            Array.isArray(
              ideasRes?.data
                ?.ideas
            )
              ? ideasRes
                  .data
                  .ideas
              : [];

          const tasks =
            Array.isArray(
              tasksRes?.data
                ?.tasks
            )
              ? tasksRes
                  .data
                  .tasks
              : [];

          const messages =
            Array.isArray(
              messagesRes
                ?.data
                ?.messages
            )
              ? messagesRes
                  .data
                  .messages
              : [];

          //
          // STATS
          //
          setStats([
            {
              title:
                "Projects",

              value:
                projects.length,

              icon: "🛠️",
            },

            {
              title:
                "Ideas",

              value:
                ideas.length,

              icon: "💡",
            },

            {
              title:
                "Tasks",

              value:
                tasks.length,

              icon: "✅",
            },

            {
              title:
                "Messages",

              value:
                messages.length,

              icon: "💬",
            },
          ]);

          //
          // TASK ANALYTICS
          //
          const completedTasks =
            tasks.filter(
              (task) =>
                task?.status ===
                "Completed"
            ).length;

          const pendingTasks =
            tasks.filter(
              (task) =>
                task?.status !==
                "Completed"
            ).length;

          const completionRate =
            tasks.length === 0
              ? 0
              : Math.round(
                  (completedTasks /
                    tasks.length) *
                    100
                );

          //
          // UNIQUE USERS
          //
          const activeUsers =
            new Set(
              projects.flatMap(
                (
                  project
                ) =>
                  Array.isArray(
                    project?.members
                  )
                    ? project.members.map(
                        (
                          member
                        ) =>
                          member?._id
                      )
                    : []
              )
            ).size;

          //
          // SAVE ANALYTICS
          //
          setAnalytics({
            completedTasks,

            pendingTasks,

            completionRate,

            activeUsers,

            totalProjects:
              projects.length,

            totalIdeas:
              ideas.length,

            totalTasks:
              tasks.length,
          });
        } catch (error) {
          console.log(
            "DASHBOARD ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );
        } finally {
          setLoading(false);
        }
      },
      [token]
    );

  //
  // LOAD
  //
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  //
  // PRODUCTIVITY DATA
  //
  const productivityData =
    [
      {
        name: "Mon",
        tasks: 4,
      },

      {
        name: "Tue",
        tasks: 7,
      },

      {
        name: "Wed",
        tasks: 5,
      },

      {
        name: "Thu",
        tasks: 9,
      },

      {
        name: "Fri",
        tasks: 11,
      },

      {
        name: "Sat",
        tasks: 8,
      },

      {
        name: "Sun",
        tasks: 13,
      },
    ];

  //
  // PIE DATA
  //
  const pieData = [
    {
      name: "Completed",

      value:
        analytics.completedTasks,
    },

    {
      name: "Pending",

      value:
        analytics.pendingTasks,
    },
  ];

  //
  // COLORS
  //
  const COLORS = [
    "#8B5CF6",
    "#EC4899",
  ];

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
      {/* GLOW */}
      <div
        style={{
          position:
            "absolute",

          width: "500px",

          height: "500px",

          background:
            "rgba(59,130,246,0.10)",

          borderRadius:
            "50%",

          filter:
            "blur(140px)",

          top: "-180px",

          left: "-120px",
        }}
      />

      <div
        style={{
          position:
            "absolute",

          width: "450px",

          height: "450px",

          background:
            "rgba(124,58,237,0.12)",

          borderRadius:
            "50%",

          filter:
            "blur(130px)",

          bottom: "-150px",

          right: "-100px",
        }}
      />

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

            padding: "42px",
          }}
        >
          {/* HERO */}
          <div
            className="glass-card"
            style={{
              padding: "42px",

              marginBottom: "38px",

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

                width: "260px",

                height: "260px",

                background:
                  "rgba(91,95,255,0.10)",

                borderRadius:
                  "50%",

                filter:
                  "blur(90px)",

                top: "-80px",

                right: "-40px",
              }}
            />

            <div
              style={{
                position:
                  "relative",

                zIndex: 2,
              }}
            >
              <h1
                style={{
                  fontSize: "54px",

                  marginBottom:
                    "18px",
                }}
              >
                AI Analytics Dashboard
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "18px",

                  lineHeight: "1.9",

                  maxWidth:
                    "820px",
                }}
              >
                Real-time
                AI-powered
                productivity,
                collaboration,
                analytics,
                and futuristic
                workflow insights
                for BuildX.
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

              marginBottom: "38px",
            }}
          >
            {stats.map(
              (
                item,
                index
              ) => (
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
                  <div
                    style={{
                      position:
                        "absolute",

                      width:
                        "180px",

                      height:
                        "180px",

                      background:
                        "rgba(124,58,237,0.08)",

                      borderRadius:
                        "50%",

                      filter:
                        "blur(70px)",

                      top: "-60px",

                      right:
                        "-60px",
                    }}
                  />

                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      marginBottom:
                        "20px",

                      position:
                        "relative",

                      zIndex: 2,
                    }}
                  >
                    <h2
                      style={{
                        fontSize:
                          "28px",
                      }}
                    >
                      {
                        item.title
                      }
                    </h2>

                    <span
                      style={{
                        fontSize:
                          "30px",
                      }}
                    >
                      {
                        item.icon
                      }
                    </span>
                  </div>

                  <h1
                    style={{
                      fontSize:
                        "52px",

                      position:
                        "relative",

                      zIndex: 2,
                    }}
                  >
                    {item.value}
                  </h1>
                </div>
              )
            )}
          </div>

          {/* CHARTS */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(420px, 1fr))",

              gap: "28px",

              marginBottom: "40px",
            }}
          >
            {/* LINE */}
            <div
              className="glass-card"
              style={{
                padding: "30px",

                height: "420px",
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "24px",

                  fontSize: "32px",
                }}
              >
                Productivity Growth
              </h2>

              <ResponsiveContainer
                width="100%"
                height="85%"
              >
                <LineChart
                  data={
                    productivityData
                  }
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.08)"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#CBD5E1"
                  />

                  <YAxis
                    stroke="#CBD5E1"
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="#A855F7"
                    strokeWidth={4}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* PIE */}
            <div
              className="glass-card"
              style={{
                padding: "30px",

                height: "420px",
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "24px",

                  fontSize: "32px",
                }}
              >
                Task Distribution
              </h2>

              <ResponsiveContainer
                width="100%"
                height="85%"
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label
                  >
                    {pieData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div
            className="glass-card"
            style={{
              padding: "42px",
            }}
          >
            <h1
              style={{
                marginBottom:
                  "28px",

                fontSize: "42px",
              }}
            >
              AI Productivity Insights
            </h1>

            <div
              style={{
                display: "flex",

                flexDirection:
                  "column",

                gap: "18px",
              }}
            >
              <div
                className="glass-card"
                style={{
                  padding: "22px",
                }}
              >
                🚀 Productivity
                increased by{" "}
                {
                  analytics.completionRate
                }
                % based on current
                task completion
                metrics.
              </div>

              <div
                className="glass-card"
                style={{
                  padding: "22px",
                }}
              >
                ⚡{" "}
                {
                  analytics.completedTasks
                }{" "}
                tasks completed
                successfully across
                active projects.
              </div>

              <div
                className="glass-card"
                style={{
                  padding: "22px",
                }}
              >
                🤖 AI recommends
                focusing on{" "}
                {
                  analytics.pendingTasks
                }{" "}
                pending tasks to
                optimize workflow
                efficiency.
              </div>

              <div
                className="glass-card"
                style={{
                  padding: "22px",
                }}
              >
                👥{" "}
                {
                  analytics.activeUsers
                }{" "}
                active collaborators
                detected across the
                BuildX ecosystem.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;