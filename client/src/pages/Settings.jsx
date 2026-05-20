import {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Settings() {
  // User State
  const [user, setUser] =
    useState({
      name: "",

      email: "",

      password: "",
    });

  // Settings State
  const [settings, setSettings] =
    useState({
      darkMode: true,

      emailNotifications: true,

      teamInvites: true,

      publicProfile: false,

      aiAssistant: true,

      futuristicMode: true,
    });

  // Fetch Logged In User
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

          setUser({
            name:
              response.data.name ||
              "",

            email:
              response.data.email ||
              "",

            password: "",
          });
        } catch (error) {
          console.log(
            "SETTINGS ERROR:",
            error.response?.data ||
              error.message
          );
        }
      };

    fetchProfile();
  }, []);

  // Toggle Settings
  const toggleSetting = (
    key
  ) => {
    setSettings((prev) => ({
      ...prev,

      [key]: !prev[key],
    }));
  };

  // Input Change
  const handleChange = (
    e
  ) => {
    setUser({
      ...user,

      [e.target.name]:
        e.target.value,
    });
  };

  // Save Changes
  const handleSave =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await API.put(
          "/user/profile",
          {
            name: user.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "Profile Updated Successfully"
        );
      } catch (error) {
        console.log(
          "UPDATE ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          "Failed To Update Profile"
        );
      }
    };

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
                SETTINGS CENTER
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "18px",

                  lineHeight: "2",

                  maxWidth: "850px",
                }}
              >
                Customize your BuildX
                AI workspace, privacy,
                notifications,
                collaboration systems,
                and futuristic
                productivity ecosystem.
              </p>
            </div>
          </div>

          {/* GRID */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(340px, 1fr))",

              gap: "28px",

              marginBottom: "32px",
            }}
          >
            {/* ACCOUNT */}
            <div
              className="glass-card"
              style={{
                padding: "34px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  marginBottom: "28px",

                  fontSize: "40px",
                }}
              >
                Account
              </h2>

              {/* NAME */}
              <div
                style={{
                  marginBottom: "22px",
                }}
              >
                <label
                  style={{
                    color:
                      "#E2E8F0",

                    fontSize: "15px",

                    fontWeight:
                      "600",
                  }}
                >
                  Name
                </label>

                <input
                  type="text"

                  name="name"

                  value={user.name}

                  onChange={
                    handleChange
                  }

                  style={{
                    width: "100%",

                    marginTop: "10px",

                    padding: "16px",

                    borderRadius:
                      "16px",

                    fontSize:
                      "15px",
                  }}
                />
              </div>

              {/* EMAIL */}
              <div
                style={{
                  marginBottom: "22px",
                }}
              >
                <label
                  style={{
                    color:
                      "#E2E8F0",

                    fontSize: "15px",

                    fontWeight:
                      "600",
                  }}
                >
                  Email
                </label>

                <input
                  type="email"

                  value={user.email}

                  disabled

                  style={{
                    width: "100%",

                    marginTop: "10px",

                    padding: "16px",

                    borderRadius:
                      "16px",

                    fontSize:
                      "15px",

                    opacity: 0.7,
                  }}
                />
              </div>

              {/* PASSWORD */}
              <div
                style={{
                  marginBottom: "28px",
                }}
              >
                <label
                  style={{
                    color:
                      "#E2E8F0",

                    fontSize: "15px",

                    fontWeight:
                      "600",
                  }}
                >
                  New Password
                </label>

                <input
                  type="password"

                  name="password"

                  value={
                    user.password
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Enter new password"

                  style={{
                    width: "100%",

                    marginTop: "10px",

                    padding: "16px",

                    borderRadius:
                      "16px",

                    fontSize:
                      "15px",
                  }}
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={
                  handleSave
                }
                style={{
                  width: "100%",

                  padding: "16px",

                  borderRadius:
                    "18px",

                  border: "none",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  color:
                    "white",

                  fontWeight:
                    "600",

                  fontSize:
                    "15px",

                  cursor:
                    "pointer",

                  boxShadow:
                    "0 0 24px rgba(124,58,237,0.22)",
                }}
              >
                Save Changes
              </button>
            </div>

            {/* PREFERENCES */}
            <div
              className="glass-card"
              style={{
                padding: "34px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  marginBottom: "28px",

                  fontSize: "40px",
                }}
              >
                Preferences
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
                        "16px",

                      color:
                        "#CBD5E1",
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
                          ? "linear-gradient(135deg, #2563EB, #7C3AED)"
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
        </div>
      </div>
    </div>
  );
}

export default Settings;