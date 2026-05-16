import "@fontsource/dancing-script";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const stats = [
    {
      title: "Projects",
      value: 12,
      icon: "🛠️",
    },

    {
      title: "Ideas",
      value: 28,
      icon: "💡",
    },

    {
      title: "Tasks",
      value: 46,
      icon: "✅",
    },

    {
      title: "Messages",
      value: 103,
      icon: "💬",
    },
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
          {/* Hero Section */}
          <div
            style={{
              background:
                "linear-gradient(to right, rgba(147,51,234,0.16), rgba(236,72,153,0.16))",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: "32px",

              padding: "45px",

              marginBottom: "40px",

              backdropFilter:
                "blur(18px)",

              boxShadow:
                "0 10px 40px rgba(168,85,247,0.12)",
            }}
          >
            <h1
              style={{
                fontSize: "72px",

                fontFamily:
                  "'Dancing Script', cursive",

                marginBottom: "18px",

                background:
                  "linear-gradient(to right, #C084FC, #F472B6)",

                WebkitBackgroundClip:
                  "text",

                WebkitTextFillColor:
                  "transparent",
              }}
            >
              Welcome to BuildX ✨
            </h1>

            <p
              style={{
                color: "#E9D5FF",

                fontSize: "20px",

                lineHeight: "1.9",

                maxWidth: "850px",
              }}
            >
              AI-powered collaboration,
              productivity, innovation,
              and project management
              platform designed for
              next-generation creators.
            </p>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",

              gap: "24px",

              marginBottom: "40px",
            }}
          >
            {stats.map((item, index) => (
              <div
                key={index}
                style={{
                  background:
                    "rgba(255,255,255,0.05)",

                  padding: "30px",

                  borderRadius: "28px",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  backdropFilter:
                    "blur(16px)",

                  boxShadow:
                    "0 10px 35px rgba(168,85,247,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",

                    justifyContent:
                      "space-between",

                    alignItems: "center",

                    marginBottom: "18px",
                  }}
                >
                  <h3
                    style={{
                      color: "#D8B4FE",

                      fontSize: "18px",
                    }}
                  >
                    {item.title}
                  </h3>

                  <span
                    style={{
                      fontSize: "32px",
                    }}
                  >
                    {item.icon}
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: "48px",

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

          {/* Grid */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(340px, 1fr))",

              gap: "24px",
            }}
          >
            {/* Activity */}
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "32px",

                borderRadius: "30px",

                backdropFilter:
                  "blur(14px)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                boxShadow:
                  "0 10px 35px rgba(168,85,247,0.08)",
              }}
            >
              <h2
                style={{
                  marginBottom: "24px",

                  color: "#F9A8D4",

                  fontSize: "42px",

                  fontFamily:
                    "'Dancing Script', cursive",
                }}
              >
                🚀 Recent Activity
              </h2>

              <ul
                style={{
                  color: "#E9D5FF",

                  lineHeight: "2.3",

                  paddingLeft: "20px",

                  fontSize: "17px",
                }}
              >
                <li>
                  AI task workflow
                  generated
                </li>

                <li>
                  New startup idea
                  enhanced
                </li>

                <li>
                  Collaboration request
                  accepted
                </li>

                <li>
                  AI meeting summary
                  created
                </li>

                <li>
                  Video collaboration
                  started
                </li>
              </ul>
            </div>

            {/* Productivity */}
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "32px",

                borderRadius: "30px",

                backdropFilter:
                  "blur(14px)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                boxShadow:
                  "0 10px 35px rgba(168,85,247,0.08)",
              }}
            >
              <h2
                style={{
                  marginBottom: "24px",

                  color: "#F9A8D4",

                  fontSize: "42px",

                  fontFamily:
                    "'Dancing Script', cursive",
                }}
              >
                📈 Productivity
                Insights
              </h2>

              <p
                style={{
                  color: "#E9D5FF",

                  marginBottom: "22px",

                  lineHeight: "1.9",

                  fontSize: "17px",
                }}
              >
                Your BuildX productivity
                score increased due to
                successful AI-powered
                collaboration workflows.
              </p>

              <div
                style={{
                  height: "18px",

                  background:
                    "rgba(255,255,255,0.08)",

                  borderRadius: "20px",

                  overflow: "hidden",

                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    width: "92%",

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
                  color: "#D8B4FE",

                  fontWeight: "bold",

                  fontSize: "17px",
                }}
              >
                92% AI Productivity
              </p>
            </div>

            {/* AI Features */}
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "32px",

                borderRadius: "30px",

                backdropFilter:
                  "blur(14px)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                boxShadow:
                  "0 10px 35px rgba(168,85,247,0.08)",
              }}
            >
              <h2
                style={{
                  marginBottom: "24px",

                  color: "#F9A8D4",

                  fontSize: "42px",

                  fontFamily:
                    "'Dancing Script', cursive",
                }}
              >
                🤖 AI Features
              </h2>

              <div
                style={{
                  display: "flex",

                  flexDirection:
                    "column",

                  gap: "14px",
                }}
              >
                {[
                  "AI Assistant",
                  "AI Task Generator",
                  "AI Idea Enhancer",
                  "AI Meeting Summary",
                  "AI Collaboration Matching",
                ].map((feature) => (
                  <div
                    key={feature}
                    style={{
                      padding:
                        "15px 18px",

                      borderRadius:
                        "18px",

                      background:
                        "rgba(255,255,255,0.04)",

                      border:
                        "1px solid rgba(255,255,255,0.06)",

                      color:
                        "#E9D5FF",

                      fontSize:
                        "16px",
                    }}
                  >
                    ✨ {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;