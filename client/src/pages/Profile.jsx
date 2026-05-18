import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Profile() {
  // Avatar Options
  const avatarOptions = [
    "👨‍💻",
    "👩‍💻",
    "🤖",
    "🚀",
    "🧠",
    "🎨",
    "⚡",
    "☁️",
  ];

  // Avatar
  const [selectedAvatar, setSelectedAvatar] =
    useState("👨‍💻");

  // User
  const user = {
    name: "Anoop Joel",

    role: "Full Stack Developer",

    email: "anoop@example.com",

    bio: "Passionate developer focused on building scalable startup products, collaborative platforms, and futuristic AI-powered systems.",

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
                  {user.name}
                </h1>

                <p
                  style={{
                    color: "#CBD5E1",

                    fontSize: "20px",

                    marginBottom:
                      "10px",
                  }}
                >
                  {user.role}
                </p>

                <p
                  style={{
                    color: "#94A3B8",

                    marginBottom:
                      "24px",
                  }}
                >
                  {user.email}
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

          {/* AVATAR */}
          <div
            className="glass-card"
            style={{
              padding: "32px",

              marginBottom: "32px",
            }}
          >
            <h2
              className="section-title"
              style={{
                marginBottom: "26px",

                fontSize: "38px",
              }}
            >
              Avatar Selection
            </h2>

            <div
              style={{
                display: "flex",

                flexWrap: "wrap",

                gap: "18px",
              }}
            >
              {avatarOptions.map(
                (avatar, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setSelectedAvatar(
                        avatar
                      )
                    }
                    style={{
                      width: "90px",

                      height: "90px",

                      borderRadius:
                        "50%",

                      cursor: "pointer",

                      display: "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      fontSize: "38px",

                      transition:
                        "0.3s ease",

                      background:
                        selectedAvatar ===
                        avatar
                          ? "linear-gradient(135deg, #2563EB, #7C3AED)"
                          : "rgba(255,255,255,0.04)",

                      border:
                        "1px solid rgba(255,255,255,0.08)",

                      boxShadow:
                        selectedAvatar ===
                        avatar
                          ? "0 0 24px rgba(124,58,237,0.22)"
                          : "none",
                    }}
                  >
                    {avatar}
                  </div>
                )
              )}
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
                  user.projects,
                icon: "🛠️",
              },

              {
                title:
                  "Ideas",
                value:
                  user.ideas,
                icon: "💡",
              },

              {
                title:
                  "Tasks Completed",
                value:
                  user.tasksCompleted,
                icon: "✅",
              },

              {
                title:
                  "Contribution",
                value: `${user.contributionScore}%`,
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
                {user.bio}
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
                  {user.skillsHave.map(
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
                  {user.skillsWant.map(
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
                  width: `${user.contributionScore}%`,

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