import { useState } from "react";

import "@fontsource/dancing-script";

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

  // Selected Avatar
  const [selectedAvatar, setSelectedAvatar] =
    useState("👨‍💻");

  // User Data
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

  // Professional Badges
  const creatorBadges = [
    "🚀 Startup Founder",

    "⚡ Full Stack Developer",

    "🤖 AI Innovator",

    "🎨 UI Visionary",
  ];

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
              Creator Profile ✨
            </h1>

            <p
              style={{
                color: "#E9D5FF",

                fontSize: "19px",

                lineHeight: "1.8",

                maxWidth: "850px",
              }}
            >
              Build your futuristic
              creator identity and
              showcase your AI-powered
              collaboration journey
              inside BuildX.
            </p>
          </div>

          {/* Main Profile Card */}
          <div
            style={{
              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: "34px",

              padding: "40px",

              marginBottom: "35px",

              backdropFilter:
                "blur(16px)",

              boxShadow:
                "0 10px 40px rgba(168,85,247,0.10)",
            }}
          >
            <div
              style={{
                display: "flex",

                gap: "35px",

                flexWrap: "wrap",

                alignItems: "center",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "150px",

                  height: "150px",

                  borderRadius: "50%",

                  background:
                    "linear-gradient(to right, #9333EA, #EC4899)",

                  display: "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  fontSize: "64px",

                  boxShadow:
                    "0 10px 35px rgba(236,72,153,0.25)",

                  border:
                    "4px solid rgba(255,255,255,0.08)",
                }}
              >
                {selectedAvatar}
              </div>

              {/* Info */}
              <div>
                <h1
                  style={{
                    fontSize: "58px",

                    marginBottom: "12px",

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
                  {user.name}
                </h1>

                <p
                  style={{
                    color: "#E9D5FF",

                    fontSize: "20px",

                    marginBottom: "10px",
                  }}
                >
                  {user.role}
                </p>

                <p
                  style={{
                    color: "#CBD5E1",

                    marginBottom: "22px",
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
                            "10px 16px",

                          borderRadius:
                            "30px",

                          background:
                            "rgba(147,51,234,0.18)",

                          border:
                            "1px solid rgba(255,255,255,0.08)",

                          color:
                            "#F5D0FE",

                          fontWeight:
                            "bold",

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

          {/* Avatar Selector */}
          <div
            style={{
              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: "30px",

              padding: "32px",

              marginBottom: "35px",

              backdropFilter:
                "blur(16px)",

              boxShadow:
                "0 10px 35px rgba(168,85,247,0.08)",
            }}
          >
            <h2
              style={{
                marginBottom: "24px",

                fontSize: "48px",

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
              🎭 Choose Your Avatar
            </h2>

            <div
              style={{
                display: "flex",

                flexWrap: "wrap",

                gap: "20px",
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
                          ? "linear-gradient(to right, #9333EA, #EC4899)"
                          : "rgba(255,255,255,0.05)",

                      border:
                        "2px solid rgba(255,255,255,0.08)",

                      boxShadow:
                        selectedAvatar ===
                        avatar
                          ? "0 10px 30px rgba(236,72,153,0.25)"
                          : "none",
                    }}
                  >
                    {avatar}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",

              gap: "24px",

              marginBottom: "35px",
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
                  "Contribution Score",
                value: `${user.contributionScore}%`,
                icon: "🚀",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background:
                    "rgba(255,255,255,0.05)",

                  padding: "28px",

                  borderRadius: "28px",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  backdropFilter:
                    "blur(14px)",

                  boxShadow:
                    "0 10px 35px rgba(168,85,247,0.08)",
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
                    style={{
                      color:
                        "#D8B4FE",

                      fontSize:
                        "18px",
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
                    fontSize: "46px",

                    background:
                      "linear-gradient(to right, #C084FC, #F472B6)",

                    WebkitBackgroundClip:
                      "text",

                    WebkitTextFillColor:
                      "transparent",
                  }}
                >
                  {item.value}
                </h1>
              </div>
            ))}
          </div>

          {/* About + Skills */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",

              gap: "24px",
            }}
          >
            {/* About */}
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "30px",

                borderRadius: "28px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(14px)",
              }}
            >
              <h2
                style={{
                  marginBottom: "22px",

                  fontSize: "42px",

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
                About ✨
              </h2>

              <p
                style={{
                  color: "#E9D5FF",

                  lineHeight: "2",

                  fontSize: "17px",
                }}
              >
                {user.bio}
              </p>
            </div>

            {/* Skills */}
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "30px",

                borderRadius: "28px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(14px)",
              }}
            >
              <h2
                style={{
                  marginBottom: "22px",

                  fontSize: "42px",

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
                Skills ⚡
              </h2>

              {/* Skills Have */}
              <div
                style={{
                  marginBottom: "24px",
                }}
              >
                <h4
                  style={{
                    marginBottom: "12px",

                    color: "#CBD5E1",
                  }}
                >
                  Skills You Have
                </h4>

                <div
                  style={{
                    display: "flex",

                    flexWrap: "wrap",

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
                            "30px",

                          background:
                            "linear-gradient(to right, #9333EA, #EC4899)",

                          color:
                            "white",

                          fontWeight:
                            "bold",

                          fontSize:
                            "14px",

                          boxShadow:
                            "0 8px 25px rgba(236,72,153,0.18)",
                        }}
                      >
                        ✨ {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Skills Want */}
              <div>
                <h4
                  style={{
                    marginBottom: "12px",

                    color: "#CBD5E1",
                  }}
                >
                  Skills You Want
                </h4>

                <div
                  style={{
                    display: "flex",

                    flexWrap: "wrap",

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
                            "30px",

                          background:
                            "rgba(255,255,255,0.08)",

                          color:
                            "#F5D0FE",

                          border:
                            "1px solid rgba(255,255,255,0.08)",

                          fontWeight:
                            "bold",

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

          {/* Performance */}
          <div
            style={{
              marginTop: "35px",

              background:
                "rgba(255,255,255,0.05)",

              padding: "30px",

              borderRadius: "28px",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(14px)",
            }}
          >
            <h2
              style={{
                marginBottom: "24px",

                fontSize: "46px",

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
              Collaboration Performance 🚀
            </h2>

            <div
              style={{
                height: "18px",

                background:
                  "rgba(255,255,255,0.08)",

                borderRadius: "20px",

                overflow: "hidden",

                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: `${user.contributionScore}%`,

                  height: "100%",

                  borderRadius:
                    "20px",

                  background:
                    "linear-gradient(to right, #9333EA, #EC4899)",

                  boxShadow:
                    "0 0 20px rgba(236,72,153,0.35)",
                }}
              />
            </div>

            <p
              style={{
                color: "#E9D5FF",

                fontSize: "17px",

                lineHeight: "1.8",
              }}
            >
              Your creator collaboration
              score is performing
              excellently this month
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