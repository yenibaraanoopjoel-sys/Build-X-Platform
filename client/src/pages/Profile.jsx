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

  // Editable Fields
  const [bio, setBio] =
    useState("");

  const [skillsHave, setSkillsHave] =
    useState("");

  const [skillsWant, setSkillsWant] =
    useState("");

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

          setBio(
            response.data.bio ||
              ""
          );

          setSkillsHave(
            response.data.skills
              ?.join(", ") ||
              ""
          );

          setSkillsWant(
            response.data
              .skillsToLearn
              ?.join(", ") ||
              ""
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

  // Save Profile
  const saveProfile =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await API.put(
            "/user/update-profile",
            {
              bio,

              skills:
                skillsHave
                  .split(",")
                  .map((s) =>
                    s.trim()
                  ),

              skillsToLearn:
                skillsWant
                  .split(",")
                  .map((s) =>
                    s.trim()
                  ),
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

        setUser(
          response.data
        );
      } catch (error) {
        console.log(
          "UPDATE ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          "Failed to Update Profile"
        );
      }
    };

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
      bio ||
      "No bio added yet.",

    skillsHave:
      skillsHave
        .split(",")
        .map((s) =>
          s.trim()
        )
        .filter(Boolean),

    skillsWant:
      skillsWant
        .split(",")
        .map((s) =>
          s.trim()
        )
        .filter(Boolean),

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

          {/* EDIT PROFILE */}
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
                marginBottom: "22px",

                fontSize: "38px",
              }}
            >
              Edit Profile
            </h2>

            {/* BIO */}
            <textarea
              value={bio}
              onChange={(e) =>
                setBio(
                  e.target.value
                )
              }
              placeholder="Enter your bio..."
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "18px",
                borderRadius: "18px",
                background:
                  "rgba(255,255,255,0.05)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                color: "white",
                marginBottom: "22px",
                outline: "none",
              }}
            />

            {/* SKILLS HAVE */}
            <input
              type="text"
              value={skillsHave}
              onChange={(e) =>
                setSkillsHave(
                  e.target.value
                )
              }
              placeholder="Skills you have (comma separated)"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                background:
                  "rgba(255,255,255,0.05)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                color: "white",
                marginBottom: "18px",
                outline: "none",
              }}
            />

            {/* SKILLS WANT */}
            <input
              type="text"
              value={skillsWant}
              onChange={(e) =>
                setSkillsWant(
                  e.target.value
                )
              }
              placeholder="Skills you want to learn (comma separated)"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                background:
                  "rgba(255,255,255,0.05)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                color: "white",
                marginBottom: "24px",
                outline: "none",
              }}
            />

            {/* SAVE BUTTON */}
            <button
              onClick={
                saveProfile
              }
              style={{
                padding:
                  "16px 30px",

                borderRadius:
                  "18px",

                border: "none",

                background:
                  "linear-gradient(135deg, #2563EB, #7C3AED)",

                color: "white",

                fontWeight:
                  "600",

                cursor: "pointer",

                boxShadow:
                  "0 0 20px rgba(124,58,237,0.24)",
              }}
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;