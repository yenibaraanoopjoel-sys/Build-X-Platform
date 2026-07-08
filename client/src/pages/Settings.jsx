import {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Settings() {
  //
  // USER STATE
  //
  const [user, setUser] =
    useState({
      name: "",

      email: "",

      password: "",
    });

  //
  // SETTINGS STATE
  //
  const [settings, setSettings] =
    useState({
      darkMode: true,

      emailNotifications: true,

      teamInvites: true,

      publicProfile: false,

      aiAssistant: true,

      futuristicMode: true,

      focusMode: false,

      soundEffects: true,

      onlineStatus: true,

      autoAcceptSkillSwap: false,

      productivityInsights: true,

      collaborationAlerts: true,
    });

  //
  // THEME
  //
  const [theme, setTheme] =
    useState("Luxury Purple");

  //
  // FETCH USER
  //
  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const response = await API.get(
            "/user/profile"
          );

          setUser({
            name:
              response.data?.name ||
              "",

            email:
              response.data?.email ||
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

  //
  // TOGGLE SETTINGS
  //
  const toggleSetting = (
    key
  ) => {
    setSettings((prev) => ({
      ...prev,

      [key]: !prev[key],
    }));
  };

  //
  // INPUT CHANGE
  //
  const handleChange = (
    e
  ) => {
    setUser({
      ...user,

      [e.target.name]:
        e.target.value,
    });
  };

  //
  // SAVE PROFILE
  //
  const handleSave =
    async () => {
      try {
        await API.put("/user/profile", {
          name: user.name,
          password: user.password,
        });

        alert(
          "Settings Updated Successfully 🚀"
        );
      } catch (error) {
        console.log(
          "UPDATE ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          "Failed To Update Settings"
        );
      }
    };

  //
  // TOGGLE SWITCH
  //
  const ToggleSwitch = ({
    enabled,
    onClick,
  }) => (
    <div
      onClick={onClick}
      style={{
        width: "58px",

        height: "30px",

        borderRadius:
          "999px",

        background: enabled
          ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
          : "rgba(255,255,255,0.12)",

        position:
          "relative",

        cursor: "pointer",

        transition:
          "0.3s",
      }}
    >
      <div
        style={{
          width: "24px",

          height: "24px",

          borderRadius:
            "50%",

          background:
            "white",

          position:
            "absolute",

          top: "3px",

          left: enabled
            ? "31px"
            : "3px",

          transition:
            "0.3s",
        }}
      />
    </div>
  );

  //
  // SETTINGS OPTIONS
  //
  const appearanceSettings =
    [
      {
        label:
          "Dark Mode",

        key: "darkMode",
      },

      {
        label:
          "Futuristic Mode",

        key:
          "futuristicMode",
      },

      {
        label:
          "Sound Effects",

        key:
          "soundEffects",
      },
    ];

  const notificationSettings =
    [
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
          "Collaboration Alerts",

        key:
          "collaborationAlerts",
      },
    ];

  const productivitySettings =
    [
      {
        label:
          "Focus Mode",

        key:
          "focusMode",
      },

      {
        label:
          "AI Assistant",

        key:
          "aiAssistant",
      },

      {
        label:
          "Productivity Insights",

        key:
          "productivityInsights",
      },
    ];

  const privacySettings =
    [
      {
        label:
          "Public Profile",

        key:
          "publicProfile",
      },

      {
        label:
          "Online Status",

        key:
          "onlineStatus",
      },

      {
        label:
          "Auto Accept Skill Swap",

        key:
          "autoAcceptSkillSwap",
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
      }}
    >
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
            style={{
              padding: "48px",

              marginBottom:
                "38px",

              borderRadius:
                "28px",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(18px)",
            }}
          >
            <h1
              style={{
                fontSize:
                  "54px",

                marginBottom:
                  "18px",
              }}
            >
              SETTINGS CENTER ⚙️
            </h1>

            <p
              style={{
                color:
                  "#CBD5E1",

                fontSize:
                  "18px",

                lineHeight:
                  "1.9",

                maxWidth:
                  "850px",
              }}
            >
              Customize your
              futuristic BuildX
              experience with AI
              preferences,
              collaboration
              settings, security
              controls, and
              premium appearance
              customization.
            </p>
          </div>

          {/* GRID */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(360px, 1fr))",

              gap: "28px",
            }}
          >
            {/* ACCOUNT */}
            <div
              style={{
                padding: "34px",

                borderRadius:
                  "28px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(18px)",
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "28px",

                  fontSize:
                    "34px",
                }}
              >
                Account Settings
              </h2>

              <input
                type="text"
                name="name"
                value={user.name}
                onChange={
                  handleChange
                }
                placeholder="Your Name"
                style={{
                  width: "100%",

                  padding: "16px",

                  borderRadius:
                    "16px",

                  marginBottom:
                    "18px",

                  background:
                    "rgba(255,255,255,0.05)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  color: "white",

                  outline:
                    "none",
                }}
              />

              <input
                type="email"
                value={user.email}
                disabled
                style={{
                  width: "100%",

                  padding: "16px",

                  borderRadius:
                    "16px",

                  marginBottom:
                    "18px",

                  background:
                    "rgba(255,255,255,0.05)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  color: "white",

                  opacity: 0.7,
                }}
              />

              <input
                type="password"
                name="password"
                value={
                  user.password
                }
                onChange={
                  handleChange
                }
                placeholder="New Password"
                style={{
                  width: "100%",

                  padding: "16px",

                  borderRadius:
                    "16px",

                  marginBottom:
                    "24px",

                  background:
                    "rgba(255,255,255,0.05)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  color: "white",

                  outline:
                    "none",
                }}
              />

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

                  cursor:
                    "pointer",

                  background:
                    "linear-gradient(135deg, #8B5CF6, #EC4899)",

                  color: "white",

                  fontWeight:
                    "700",

                  fontSize:
                    "15px",
                }}
              >
                Save Changes 🚀
              </button>
            </div>

            {/* APPEARANCE */}
            <div
              style={{
                padding: "34px",

                borderRadius:
                  "28px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(18px)",
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "28px",

                  fontSize:
                    "34px",
                }}
              >
                Appearance
              </h2>

              <p
                style={{
                  marginBottom:
                    "14px",

                  color:
                    "#CBD5E1",
                }}
              >
                Theme Selection
              </p>

              <select
                value={theme}
                onChange={(e) =>
                  setTheme(
                    e.target
                      .value
                  )
                }
                style={{
                  width: "100%",

                  padding: "16px",

                  borderRadius:
                    "16px",

                  marginBottom:
                    "28px",

                  background:
                    "rgba(255,255,255,0.05)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  color: "white",
                }}
              >
                <option>
                  Luxury Purple
                </option>

                <option>
                  Neon Pink
                </option>

                <option>
                  AI Futuristic
                </option>

                <option>
                  Cyber Blue
                </option>
              </select>

              {appearanceSettings.map(
                (item) => (
                  <div
                    key={
                      item.key
                    }
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      marginBottom:
                        "24px",
                    }}
                  >
                    <span>
                      {
                        item.label
                      }
                    </span>

                    <ToggleSwitch
                      enabled={
                        settings[
                          item
                            .key
                        ]
                      }
                      onClick={() =>
                        toggleSetting(
                          item.key
                        )
                      }
                    />
                  </div>
                )
              )}
            </div>

            {/* NOTIFICATIONS */}
            <div
              style={{
                padding: "34px",

                borderRadius:
                  "28px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(18px)",
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "28px",

                  fontSize:
                    "34px",
                }}
              >
                Notifications
              </h2>

              {notificationSettings.map(
                (item) => (
                  <div
                    key={
                      item.key
                    }
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      marginBottom:
                        "24px",
                    }}
                  >
                    <span>
                      {
                        item.label
                      }
                    </span>

                    <ToggleSwitch
                      enabled={
                        settings[
                          item
                            .key
                        ]
                      }
                      onClick={() =>
                        toggleSetting(
                          item.key
                        )
                      }
                    />
                  </div>
                )
              )}
            </div>

            {/* PRODUCTIVITY */}
            <div
              style={{
                padding: "34px",

                borderRadius:
                  "28px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(18px)",
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "28px",

                  fontSize:
                    "34px",
                }}
              >
                Productivity
              </h2>

              {productivitySettings.map(
                (item) => (
                  <div
                    key={
                      item.key
                    }
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      marginBottom:
                        "24px",
                    }}
                  >
                    <span>
                      {
                        item.label
                      }
                    </span>

                    <ToggleSwitch
                      enabled={
                        settings[
                          item
                            .key
                        ]
                      }
                      onClick={() =>
                        toggleSetting(
                          item.key
                        )
                      }
                    />
                  </div>
                )
              )}
            </div>

            {/* PRIVACY */}
            <div
              style={{
                padding: "34px",

                borderRadius:
                  "28px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(18px)",
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "28px",

                  fontSize:
                    "34px",
                }}
              >
                Privacy &
                Security
              </h2>

              {privacySettings.map(
                (item) => (
                  <div
                    key={
                      item.key
                    }
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      marginBottom:
                        "24px",
                    }}
                  >
                    <span>
                      {
                        item.label
                      }
                    </span>

                    <ToggleSwitch
                      enabled={
                        settings[
                          item
                            .key
                        ]
                      }
                      onClick={() =>
                        toggleSetting(
                          item.key
                        )
                      }
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;