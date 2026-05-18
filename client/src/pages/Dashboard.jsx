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

      <Navbar />

      <div
        style={{
          display: "flex",

          position: "relative",

          zIndex: 2,
        }}
      >
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
              designed for modern
              creators, developers,
              startups, and next-gen
              teams.
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
            {stats.map((item, index) => (
              <div
                key={index}
                className="glass-card"
                style={{
                  padding: "30px",

                  position: "relative",

                  overflow: "hidden",
                }}
              >
                {/* Card Glow */}
                <div
                  style={{
                    position:
                      "absolute",

                    width: "180px",

                    height: "180px",

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
                      "18px",

                    position:
                      "relative",

                    zIndex: 2,
                  }}
                >
                  <h2
                    className="card-title"
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
                      fontSize: "30px",
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

          {/* LOWER GRID */}
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
              className="glass-card"
              style={{
                padding: "32px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  fontSize: "34px",

                  marginBottom:
                    "26px",
                }}
              >
                Recent Activity
              </h2>

              <ul
                style={{
                  color: "#CBD5E1",

                  lineHeight: "2.2",

                  paddingLeft:
                    "20px",

                  fontSize: "16px",
                }}
              >
                <li>
                  AI task workflow
                  generated
                </li>

                <li>
                  Startup idea enhanced
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
                  Team video session
                  started
                </li>
              </ul>
            </div>

            {/* Productivity */}
            <div
              className="glass-card"
              style={{
                padding: "32px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  fontSize: "34px",

                  marginBottom:
                    "26px",
                }}
              >
                Productivity
              </h2>

              <p
                style={{
                  color: "#CBD5E1",

                  marginBottom:
                    "22px",

                  lineHeight: "1.9",

                  fontSize: "16px",
                }}
              >
                Your BuildX AI
                productivity increased
                significantly through
                automation, intelligent
                workflows, and smart
                collaboration systems.
              </p>

              <div
                style={{
                  height: "16px",

                  background:
                    "rgba(255,255,255,0.08)",

                  borderRadius:
                    "20px",

                  overflow:
                    "hidden",

                  marginBottom:
                    "14px",
                }}
              >
                <div
                  style={{
                    width: "92%",

                    height: "100%",

                    borderRadius:
                      "20px",

                    background:
                      "linear-gradient(to right, #2563EB, #7C3AED)",
                  }}
                />
              </div>

              <p
                style={{
                  color: "white",

                  fontSize: "15px",
                }}
              >
                92% AI Efficiency
              </p>
            </div>

            {/* AI Features */}
            <div
              className="glass-card"
              style={{
                padding: "32px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  fontSize: "34px",

                  marginBottom:
                    "26px",
                }}
              >
                AI Features
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
                        "16px 18px",

                      borderRadius:
                        "16px",

                      background:
                        "rgba(255,255,255,0.04)",

                      border:
                        "1px solid rgba(255,255,255,0.06)",

                      color:
                        "white",

                      fontSize:
                        "15px",

                      backdropFilter:
                        "blur(10px)",
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