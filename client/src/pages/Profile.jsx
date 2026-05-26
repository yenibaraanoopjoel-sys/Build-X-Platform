import {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Profile() {
  //
  // USER STATE
  //
  const [user, setUser] =
    useState(null);

  //
  // EDITABLE FIELDS
  //
  const [role, setRole] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [skillsHave, setSkillsHave] =
    useState("");

  const [skillsWant, setSkillsWant] =
    useState("");

  //
  // AVATAR
  //
  const [selectedAvatar] =
    useState("👨‍💻");

  //
  // FETCH PROFILE
  //
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

          setRole(
            response.data.role ||
              ""
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

  //
  // SAVE PROFILE
  //
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
              role,

              bio,

              skills:
                skillsHave
                  .split(",")
                  .map((s) =>
                    s.trim()
                  )
                  .filter(Boolean),

              skillsToLearn:
                skillsWant
                  .split(",")
                  .map((s) =>
                    s.trim()
                  )
                  .filter(Boolean),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        alert(
          "Profile Updated Successfully 🚀"
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

  //
  // LOADING
  //
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

  //
  // DYNAMIC USER
  //
  const dynamicUser = {
    name:
      user.name ||
      "BuildX User",

    role:
      role ||
      "No role added",

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

  //
  // DYNAMIC BADGES
  //
  const creatorBadges =
    dynamicUser.skillsHave
      .slice(0, 4)
      .map(
        (skill) =>
          `⚡ ${skill}`
      );

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
      {/* NAVBAR */}
      <Navbar />

      <div
        style={{
          display: "flex",

          position:
            "relative",

          zIndex: 2,
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
            className="glass-card"
            style={{
              padding: "48px",

              marginBottom:
                "38px",
            }}
          >
            <h1
              style={{
                fontSize: "54px",

                marginBottom:
                  "22px",
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
              creator identity and
              showcase your real
              skills inside BuildX.
            </p>
          </div>

          {/* PROFILE CARD */}
          <div
            className="glass-card"
            style={{
              padding: "40px",

              marginBottom:
                "32px",
            }}
          >
            <div
              style={{
                display: "flex",

                gap: "34px",

                flexWrap: "wrap",

                alignItems:
                  "center",
              }}
            >
              {/* AVATAR */}
              <div
                style={{
                  width: "160px",

                  height: "160px",

                  borderRadius:
                    "50%",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  display: "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  fontSize: "68px",
                }}
              >
                {selectedAvatar}
              </div>

              {/* INFO */}
              <div>
                <h1
                  style={{
                    fontSize: "52px",

                    marginBottom:
                      "12px",
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

                {/* BADGES */}
                <div
                  style={{
                    display: "flex",

                    flexWrap: "wrap",

                    gap: "12px",
                  }}
                >
                  {creatorBadges
                    .length >
                  0 ? (
                    creatorBadges.map(
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
                    )
                  ) : (
                    <span
                      style={{
                        color:
                          "#94A3B8",
                      }}
                    >
                      No skills added
                    </span>
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

              marginBottom:
                "32px",
            }}
          >
            <h2
              style={{
                marginBottom:
                  "22px",

                fontSize: "38px",
              }}
            >
              Edit Profile
            </h2>

            {/* ROLE */}
            <input
              type="text"
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
              placeholder="Enter your role..."
              style={{
                width: "100%",

                padding: "16px",

                borderRadius:
                  "16px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "white",

                marginBottom:
                  "18px",

                outline: "none",
              }}
            />

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

                borderRadius:
                  "18px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "white",

                marginBottom:
                  "22px",

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

                borderRadius:
                  "16px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "white",

                marginBottom:
                  "18px",

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

                borderRadius:
                  "16px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "white",

                marginBottom:
                  "22px",

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
                  "16px 28px",

                borderRadius:
                  "18px",

                border: "none",

                cursor: "pointer",

                fontWeight: "700",

                background:
                  "linear-gradient(135deg, #8B5CF6, #EC4899)",

                color: "white",

                fontSize: "16px",
              }}
            >
              Save Profile 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;