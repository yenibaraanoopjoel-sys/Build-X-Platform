import {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Profile() {
  // User State
  const [user, setUser] =
    useState(null);

  // Avatar
  const [selectedAvatar] =
    useState("👨‍💻");

  // Fetch Profile
  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const response =
            await API.get(
              "/user/profile",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setUser(
            response.data
          );
        } catch (error) {
          console.log(
            "PROFILE ERROR:",
            error.response?.data ||
              error.message
          );
        }
      };

    fetchProfile();
  }, []);

  // Loading
  if (!user) {
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

          fontSize: "28px",
        }}
      >
        Loading Profile...
      </div>
    );
  }

  // Dynamic User Data
  const dynamicUser = {
    name:
      user.name ||
      "BuildX User",

    role:
      "Full Stack Developer",

    email:
      user.email ||
      "No Email",

    bio:
      "Passionate developer focused on building scalable startup products, collaborative platforms, and futuristic AI-powered systems.",

    skillsHave: [
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "Socket.io",
      "UI/UX",
    ],

    skillsWant: [
      "AI Engineering",
      "System Design",
      "Cloud Computing",
    ],

    contributionScore: 92,

    projects: 12,

    ideas: 28,

    tasksCompleted: 46,
  };

  // Badges
  const creatorBadges = [
    "🚀 Startup Founder",

    "⚡ Full Stack Developer",

    "🤖 AI Innovator",

    "🎨 UI Visionary",
  ];

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

              marginBottom: "38px",

              position: "relative",

              overflow: "hidden",
            }}
          >
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
                  fontSize: "54px",

                  marginBottom: "22px",

                  lineHeight: "1.3",
                }}
              >
                CREATOR PROFILE
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "18px",

                  lineHeight: "2",

                  maxWidth: "850px",
                }}
              >
                Build your futuristic
                AI creator identity,
                showcase achievements,
                manage collaboration,
                and scale innovation
                inside BuildX.
              </p>
            </div>
          </div>

          {/* PROFILE CARD */}
          <div
            className="glass-card"
            style={{
              padding: "40px",

              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",

                gap: "34px",

                flexWrap: "wrap",

                alignItems: "center",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "160px",

                  height: "160px",

                  borderRadius: "50%",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  display: "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  fontSize: "68px",

                  boxShadow:
                    "0 0 28px rgba(124,58,237,0.22)",

                  border:
                    "4px solid rgba(255,255,255,0.08)",
                }}
              >
                {selectedAvatar}
              </div>

              {/* INFO */}
              <div>
                <h1
                  className="section-title"
                  style={{
                    fontSize: "52px",

                    marginBottom:
                      "12px",

                    color: "white",
                  }}
                >
                  {
                    dynamicUser.name
                  }
                </h1>

                <p
                  style={{
                    color: "#CBD5E1",

                    fontSize: "20px",

                    marginBottom:
                      "10px",
                  }}
                >
                  {
                    dynamicUser.role
                  }
                </p>

                <p
                  style={{
                    color: "#94A3B8",

                    marginBottom:
                      "24px",
                  }}
                >
                  {
                    dynamicUser.email
                  }
                </p>

                {/* Badges */}
                <div
                  style={{
                    display: "flex",

                    flexWrap: "wrap",

                    gap: "12px",
                  }}
                >
                  {creatorBadges.map(
                    (
                      badge,
                      index
                    ) => (
                      <span
                        key={index}
                        style={{
                          padding:
                            "11px 18px",

                          borderRadius:
                            "24px",

                          background:
                            "rgba(79,70,229,0.16)",

                          border:
                            "1px solid rgba(255,255,255,0.06)",

                          color:
                            "white",

                          fontSize:
                            "14px",
                        }}
                      >
                        {badge}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",

              gap: "24px",

              marginBottom: "32px",
            }}
          >
            {[
              {
                title:
                  "Projects",
                value:
                  dynamicUser.projects,
                icon: "🛠️",
              },

              {
                title:
                  "Ideas",
                value:
                  dynamicUser.ideas,
                icon: "💡",
              },

              {
                title:
                  "Tasks Completed",
                value:
                  dynamicUser.tasksCompleted,
                icon: "✅",
              },

              {
                title:
                  "Contribution",
                value: `${dynamicUser.contributionScore}%`,
                icon: "🚀",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card"
                style={{
                  padding: "28px",
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
                    className="card-title"
                    style={{
                      fontSize:
                        "24px",
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

                    color: "white",
                  }}
                >
                  {item.value}
                </h1>
              </div>
            ))}
          </div>

          {/* ABOUT + SKILLS */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",

              gap: "24px",
            }}
          >
            {/* ABOUT */}
            <div
              className="glass-card"
              style={{
                padding: "32px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  marginBottom: "22px",

                  fontSize: "38px",
                }}
              >
                About
              </h2>

              <p
                style={{
                  color: "#CBD5E1",

                  lineHeight: "2",

                  fontSize: "16px",
                }}
              >
                {
                  dynamicUser.bio
                }
              </p>
            </div>

            {/* SKILLS */}
            <div
              className="glass-card"
              style={{
                padding: "32px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  marginBottom: "22px",

                  fontSize: "38px",
                }}
              >
                Skills
              </h2>

              {/* HAVE */}
              <div
                style={{
                  marginBottom: "24px",
                }}
              >
                <h4
                  style={{
                    marginBottom:
                      "12px",

                    color:
                      "#CBD5E1",
                  }}
                >
                  Skills You Have
                </h4>

                <div
                  style={{
                    display: "flex",

                    flexWrap:
                      "wrap",

                    gap: "12px",
                  }}
                >
                  {dynamicUser.skillsHave.map(
                    (
                      skill,
                      index
                    ) => (
                      <span
                        key={index}
                        style={{
                          padding:
                            "10px 16px",

                          borderRadius:
                            "24px",

                          background:
                            "linear-gradient(135deg, #2563EB, #7C3AED)",

                          color:
                            "white",

                          fontSize:
                            "14px",

                          boxShadow:
                            "0 0 18px rgba(124,58,237,0.18)",
                        }}
                      >
                        ✨ {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* WANT */}
              <div>
                <h4
                  style={{
                    marginBottom:
                      "12px",

                    color:
                      "#CBD5E1",
                  }}
                >
                  Skills You Want
                </h4>

                <div
                  style={{
                    display: "flex",

                    flexWrap:
                      "wrap",

                    gap: "12px",
                  }}
                >
                  {dynamicUser.skillsWant.map(
                    (
                      skill,
                      index
                    ) => (
                      <span
                        key={index}
                        style={{
                          padding:
                            "10px 16px",

                          borderRadius:
                            "24px",

                          background:
                            "rgba(255,255,255,0.05)",

                          border:
                            "1px solid rgba(255,255,255,0.08)",

                          color:
                            "#E2E8F0",

                          fontSize:
                            "14px",
                        }}
                      >
                        🚀 {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div
            className="glass-card"
            style={{
              marginTop: "32px",

              padding: "32px",
            }}
          >
            <h2
              className="section-title"
              style={{
                marginBottom: "24px",

                fontSize: "42px",
              }}
            >
              Collaboration Performance
            </h2>

            <div
              style={{
                height: "18px",

                background:
                  "rgba(255,255,255,0.08)",

                borderRadius:
                  "20px",

                overflow:
                  "hidden",

                marginBottom:
                  "18px",
              }}
            >
              <div
                style={{
                  width: `${dynamicUser.contributionScore}%`,

                  height: "100%",

                  borderRadius:
                    "20px",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  boxShadow:
                    "0 0 20px rgba(124,58,237,0.24)",
                }}
              />
            </div>

            <p
              style={{
                color: "#CBD5E1",

                fontSize: "16px",

                lineHeight: "1.9",
              }}
            >
              Your collaboration
              performance is currently
              performing excellently
              inside the BuildX AI
              ecosystem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;