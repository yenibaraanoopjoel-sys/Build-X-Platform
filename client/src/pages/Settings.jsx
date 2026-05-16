import { useState } from "react";

import "@fontsource/dancing-script";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Settings() {
  const [settings, setSettings] =
    useState({
      darkMode: true,

      emailNotifications: true,

      teamInvites: true,

      publicProfile: false,

      aiAssistant: true,

      futuristicMode: true,
    });

  const toggleSetting = (
    key
  ) => {
    setSettings((prev) => ({
      ...prev,

      [key]: !prev[key],
    }));
  };

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
          {/* Header */}
          <div
            style={{
              marginBottom: "42px",
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
              Settings Center ⚙️
            </h1>

            <p
              style={{
                color: "#E9D5FF",

                fontSize: "19px",

                lineHeight: "1.8",

                maxWidth: "850px",
              }}
            >
              Customize your futuristic
              BuildX AI workspace,
              creator identity,
              notifications, privacy,
              and collaboration
              experience.
            </p>
          </div>

          {/* Main Grid */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(340px, 1fr))",

              gap: "28px",

              marginBottom: "35px",
            }}
          >
            {/* Account */}
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "32px",

                borderRadius: "30px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(16px)",

                boxShadow:
                  "0 10px 40px rgba(168,85,247,0.10)",
              }}
            >
              <h2
                style={{
                  marginBottom: "28px",

                  fontSize: "48px",

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
                Account ✨
              </h2>

              {/* Name */}
              <div
                style={{
                  marginBottom: "22px",
                }}
              >
                <label
                  style={{
                    color:
                      "#F5D0FE",

                    fontSize: "17px",

                    fontWeight:
                      "600",
                  }}
                >
                  Name
                </label>

                <input
                  type="text"
                  defaultValue="Anoop Joel"
                  style={{
                    width: "100%",

                    marginTop: "10px",

                    padding: "16px",

                    borderRadius:
                      "18px",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    outline: "none",

                    background:
                      "rgba(255,255,255,0.05)",

                    color:
                      "white",

                    fontSize:
                      "16px",

                    backdropFilter:
                      "blur(10px)",
                  }}
                />
              </div>

              {/* Email */}
              <div
                style={{
                  marginBottom: "22px",
                }}
              >
                <label
                  style={{
                    color:
                      "#F5D0FE",

                    fontSize: "17px",

                    fontWeight:
                      "600",
                  }}
                >
                  Email
                </label>

                <input
                  type="email"
                  defaultValue="anoop@example.com"
                  style={{
                    width: "100%",

                    marginTop: "10px",

                    padding: "16px",

                    borderRadius:
                      "18px",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    outline: "none",

                    background:
                      "rgba(255,255,255,0.05)",

                    color:
                      "white",

                    fontSize:
                      "16px",

                    backdropFilter:
                      "blur(10px)",
                  }}
                />
              </div>

              {/* Password */}
              <div
                style={{
                  marginBottom: "28px",
                }}
              >
                <label
                  style={{
                    color:
                      "#F5D0FE",

                    fontSize: "17px",

                    fontWeight:
                      "600",
                  }}
                >
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  style={{
                    width: "100%",

                    marginTop: "10px",

                    padding: "16px",

                    borderRadius:
                      "18px",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    outline: "none",

                    background:
                      "rgba(255,255,255,0.05)",

                    color:
                      "white",

                    fontSize:
                      "16px",

                    backdropFilter:
                      "blur(10px)",
                  }}
                />
              </div>

              {/* Button */}
              <button
                style={{
                  width: "100%",

                  padding: "16px",

                  border: "none",

                  borderRadius:
                    "18px",

                  cursor:
                    "pointer",

                  background:
                    "linear-gradient(to right, #9333EA, #EC4899)",

                  color:
                    "white",

                  fontWeight:
                    "bold",

                  fontSize:
                    "16px",

                  boxShadow:
                    "0 10px 30px rgba(236,72,153,0.25)",
                }}
              >
                🚀 Save Changes
              </button>
            </div>

            {/* Preferences */}
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "32px",

                borderRadius: "30px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(16px)",

                boxShadow:
                  "0 10px 40px rgba(168,85,247,0.10)",
              }}
            >
              <h2
                style={{
                  marginBottom: "28px",

                  fontSize: "48px",

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
                Preferences ⚡
              </h2>

              {[
                {
                  label:
                    "Dark Mode",

                  key:
                    "darkMode",
                },

                {
                  label:
                    "Email Notifications",

                  key:
                    "emailNotifications",
                },

                {
                  label:
                    "Team Invites",

                  key:
                    "teamInvites",
                },

                {
                  label:
                    "Public Profile",

                  key:
                    "publicProfile",
                },

                {
                  label:
                    "AI Assistant",

                  key:
                    "aiAssistant",
                },

                {
                  label:
                    "Futuristic Mode",

                  key:
                    "futuristicMode",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    marginBottom:
                      "24px",

                    paddingBottom:
                      "18px",

                    borderBottom:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    style={{
                      fontSize:
                        "17px",

                      color:
                        "#E9D5FF",
                    }}
                  >
                    {item.label}
                  </span>

                  <button
                    onClick={() =>
                      toggleSetting(
                        item.key
                      )
                    }
                    style={{
                      width:
                        "62px",

                      height:
                        "32px",

                      borderRadius:
                        "30px",

                      border:
                        "none",

                      cursor:
                        "pointer",

                      background:
                        settings[
                          item.key
                        ]
                          ? "linear-gradient(to right, #9333EA, #EC4899)"
                          : "#374151",

                      position:
                        "relative",

                      transition:
                        "0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        width:
                          "24px",

                        height:
                          "24px",

                        borderRadius:
                          "50%",

                        background:
                          "white",

                        position:
                          "absolute",

                        top: "4px",

                        left:
                          settings[
                            item.key
                          ]
                            ? "34px"
                            : "4px",

                        transition:
                          "0.3s ease",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div
            style={{
              background:
                "rgba(255,255,255,0.05)",

              padding: "34px",

              borderRadius: "30px",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(16px)",

              boxShadow:
                "0 10px 40px rgba(168,85,247,0.10)",
            }}
          >
            <h2
              style={{
                marginBottom: "28px",

                fontSize: "52px",

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
              Security & Privacy 🔒
            </h2>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",

                gap: "22px",
              }}
            >
              {[
                {
                  title:
                    "Two-Factor Authentication",

                  icon:
                    "🛡️",
                },

                {
                  title:
                    "Login Activity",

                  icon:
                    "📊",
                },

                {
                  title:
                    "Connected Devices",

                  icon:
                    "💻",
                },

                {
                  title:
                    "Privacy Controls",

                  icon:
                    "🔐",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding:
                      "24px",

                    borderRadius:
                      "24px",

                    background:
                      "rgba(255,255,255,0.04)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    backdropFilter:
                      "blur(10px)",

                    transition:
                      "0.3s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "38px",

                      marginBottom:
                        "18px",
                    }}
                  >
                    {item.icon}
                  </div>

                  <h3
                    style={{
                      fontSize:
                        "18px",

                      color:
                        "#F5D0FE",

                      lineHeight:
                        "1.6",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "35px",

              textAlign: "center",

              color: "#D8B4FE",

              fontSize: "16px",

              lineHeight: "1.8",
            }}
          >
            ✨ Your BuildX AI workspace
            is fully optimized for a
            futuristic collaboration
            experience.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;