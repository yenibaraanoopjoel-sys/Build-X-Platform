import {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Dashboard() {
  // Stats State
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

  // Loading
  const [loading, setLoading] =
    useState(true);

  // Fetch Real Dashboard Data
  useEffect(() => {
    const fetchDashboard =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          // Fetch All APIs
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

          // Update Stats
          setStats([
            {
              title: "Projects",
              value:
                projectsRes.data
                  ?.length || 0,
              icon: "🛠️",
            },

            {
              title: "Ideas",
              value:
                ideasRes.data
                  ?.length || 0,
              icon: "💡",
            },

            {
              title: "Tasks",
              value:
                tasksRes.data
                  ?.length || 0,
              icon: "✅",
            },

            {
              title: "Messages",
              value:
                messagesRes.data
                  ?.length || 0,
              icon: "💬",
            },
          ]);
        } catch (error) {
          console.log(
            "DASHBOARD ERROR:",
            error.response?.data ||
              error.message
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);

  // Loading Screen
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
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",

          width: "500px",

          height: "500px",

          background:
            "rgba(59,130,246,0.12)",

          borderRadius: "50%",

          filter: "blur(140px)",

          top: "-180px",

          left: "-100px",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "450px",

          height: "450px",

          background:
            "rgba(124,58,237,0.14)",

          borderRadius: "50%",

          filter: "blur(130px)",

          bottom: "-160px",

          right: "-120px",
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

            padding: "42px",
          }}
        >
          {/* HERO */}
          <div
            className="glass-card"
            style={{
              padding: "52px",

              marginBottom: "38px",

              position: "relative",

              overflow: "hidden",
            }}
          >
            {/* Hero Glow */}
            <div
              style={{
                position: "absolute",

                width: "260px",

                height: "260px",

                background:
                  "rgba(91,95,255,0.12)",

                borderRadius: "50%",

                filter: "blur(90px)",

                top: "-80px",

                right: "-50px",
              }}
            />

            <h1
              className="welcome-title"
              style={{
                fontSize: "54px",

                marginBottom: "24px",

                lineHeight: "1.3",

                color: "white",

                position: "relative",

                zIndex: 2,
              }}
            >
              WELCOME TO BUILDX
            </h1>

            <p
              style={{
                color: "#CBD5E1",

                fontSize: "18px",

                lineHeight: "2",

                maxWidth: "850px",

                position: "relative",

                zIndex: 2,
              }}
            >
              AI-powered collaboration,
              productivity, innovation,
              and futuristic project
              management platform
              designed for creators,
              developers, startups,
              and next-gen teams.
            </p>
          </div>

          {/* REAL STATS */}
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

                      alignItems:
                        "center",

                      marginBottom:
                        "18px",

                      position:
                        "relative",

                      zIndex: 2,
                    }}
                  >
                    <h2
                      style={{
                        fontSize:
                          "28px",

                        color:
                          "white",
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
                        "48px",

                      color:
                        "white",

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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;