import {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

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
  // STATS
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

  // ANALYTICS
  const [
    analytics,
    setAnalytics,
  ] = useState({
    completedTasks: 0,

    pendingTasks: 0,

    completionRate: 0,

    activeUsers: 0,
  });

  // LOADING
  const [loading, setLoading] =
    useState(true);

  //
  // FETCH DASHBOARD DATA
  //
  useEffect(() => {
    const fetchDashboard =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const [
            projectsRes,
            ideasRes,
            tasksRes,
            messagesRes,
          ] = await Promise.all([
            API.get("/projects", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            API.get("/ideas", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            API.get("/tasks", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            API.get("/messages", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

          setStats([
            {
              title: "Projects",
              value:
                projectsRes.data
                  ?.projects
                  ?.length ||
                projectsRes.data
                  ?.length ||
                0,

              icon: "🛠️",
            },

            {
              title: "Ideas",
              value:
                ideasRes.data
                  ?.ideas
                  ?.length ||
                ideasRes.data
                  ?.length ||
                0,

              icon: "💡",
            },

            {
              title: "Tasks",
              value:
                tasksRes.data
                  ?.tasks
                  ?.length ||
                tasksRes.data
                  ?.length ||
                0,

              icon: "✅",
            },

            {
              title: "Messages",
              value:
                messagesRes.data
                  ?.messages
                  ?.length ||
                messagesRes.data
                  ?.length ||
                0,

              icon: "💬",
            },
          ]);

          //
          // TASK ANALYTICS
          //
          const tasks =
            tasksRes.data
              ?.tasks || [];

          const completedTasks =
            tasks.filter(
              (task) =>
                task.status ===
                "Completed"
            ).length;

          const pendingTasks =
            tasks.filter(
              (task) =>
                task.status !==
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

          setAnalytics({
            completedTasks,

            pendingTasks,

            completionRate,

            activeUsers:
              projectsRes.data
                ?.projects
                ?.length || 0,
          });
        } catch (error) {
          console.log(
            "DASHBOARD ERROR:",
            error.response
              ?.data ||
              error.message
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);

  //
  // CHART DATA
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

  const COLORS = [
    "#8B5CF6",
    "#EC4899",
  ];

  //
  // LOADING SCREEN
  //
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",

          background:
            "linear-gradient(135deg, #050816 0%, #0B1023 40%, #1E1B4B 100%)",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          color: "white",

          fontSize: "32px",
        }}
      >
        Loading BuildX...
      </div>
    );
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
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,

            padding: "42px",
          }}
        >
          {/* TITLE */}
          <div
            className="glass-card"
            style={{
              padding: "42px",

              marginBottom: "38px",
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
              }}
            >
              Real-time AI-powered
              productivity and
              collaboration insights.
            </p>
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
              (item, index) => (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    padding: "30px",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      marginBottom:
                        "20px",
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
            {/* LINE CHART */}
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

            {/* PIE CHART */}
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

              marginBottom: "40px",
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
                increased this week
                compared to previous
                performance.
              </div>

              <div
                className="glass-card"
                style={{
                  padding: "22px",
                }}
              >
                ⚡ High task completion
                efficiency detected in
                active projects.
              </div>

              <div
                className="glass-card"
                style={{
                  padding: "22px",
                }}
              >
                🤖 AI recommends
                focusing on pending
                tasks for better
                workflow optimization.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;