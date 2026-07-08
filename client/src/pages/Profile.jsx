import {
  useState,
  useEffect,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Profile() {
  //
  // USER STATES
  //
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [skills, setSkills] =
    useState("");

  const [
    skillsToLearn,
    setSkillsToLearn,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  //
  // LOADING
  //
  const [loading, setLoading] =
    useState(false);

  //
  // FETCH PROFILE
  //
  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const response =
            await API.get("/user/profile");

          const user =
            response.data;

          setName(
            user.name || ""
          );

          setEmail(
            user.email || ""
          );

          setRole(
            user.role || ""
          );

          setBio(
            user.bio || ""
          );

          setSkills(
            Array.isArray(
              user.skills
            )
              ? user.skills.join(
                  ", "
                )
              : user.skills ||
                  ""
          );

          setSkillsToLearn(
            Array.isArray(
              user.skillsToLearn
            )
              ? user.skillsToLearn.join(
                  ", "
                )
              : user.skillsToLearn ||
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
  // UPDATE PROFILE
  //
  const updateProfile =
    async () => {
      try {
        setLoading(true);

        await API.put("/user/profile", {
          name,
          role,
          bio,
          password,
          skills: skills
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
          skillsToLearn: skillsToLearn
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item),
        });

        alert(
          "Profile Updated Successfully 🚀"
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
      } finally {
        setLoading(false);
      }
    };

  //
  // INPUT STYLE
  //
  const inputStyle = {
    width: "100%",

    padding: "16px",

    marginTop: "10px",

    marginBottom: "22px",

    borderRadius: "14px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.05)",

    color: "white",

    outline: "none",

    fontSize: "15px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        background:
          "linear-gradient(135deg, #050816 0%, #0B1023 40%, #1E1B4B 100%)",

        color: "white",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div
        style={{
          flex: 1,
        }}
      >
        {/* NAVBAR */}
        <Navbar />

        <div
          style={{
            padding: "40px",
          }}
        >
          {/* HERO */}
          <div
            style={{
              padding: "50px",

              borderRadius:
                "28px",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(20px)",

              marginBottom:
                "35px",
            }}
          >
            <h1
              style={{
                fontSize:
                  "68px",

                marginBottom:
                  "20px",

                fontWeight:
                  "800",
              }}
            >
              CREATOR PROFILE
            </h1>

            <p
              style={{
                fontSize:
                  "20px",

                color:
                  "#CBD5E1",

                lineHeight:
                  "1.8",

                maxWidth:
                  "900px",
              }}
            >
              Build your
              futuristic creator
              identity inside
              BuildX and showcase
              your skills,
              collaboration
              interests, and AI
              innovation journey.
            </p>
          </div>

          {/* PROFILE CARD */}
          <div
            style={{
              padding: "40px",

              borderRadius:
                "28px",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(20px)",

              marginBottom:
                "35px",
            }}
          >
            <div
              style={{
                display: "flex",

                gap: "40px",

                alignItems:
                  "center",

                flexWrap: "wrap",
              }}
            >
              {/* AVATAR */}
              <div
                style={{
                  width: "170px",

                  height: "170px",

                  borderRadius:
                    "50%",

                  background:
                    "linear-gradient(135deg, #4F46E5, #9333EA)",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  fontSize:
                    "70px",

                  boxShadow:
                    "0 0 40px rgba(139,92,246,0.5)",
                }}
              >
                👨‍💻
              </div>

              {/* DETAILS */}
              <div>
                <h2
                  style={{
                    fontSize:
                      "64px",

                    marginBottom:
                      "12px",
                  }}
                >
                  {name ||
                    "BuildX User"}
                </h2>

                <p
                  style={{
                    fontSize:
                      "28px",

                    color:
                      "#CBD5E1",

                    marginBottom:
                      "12px",
                  }}
                >
                  {role ||
                    "No Role Added"}
                </p>

                <p
                  style={{
                    color:
                      "#94A3B8",

                    fontSize:
                      "18px",
                  }}
                >
                  {email ||
                    "No Email"}
                </p>

                {/* DYNAMIC ROLES */}
                <div
                  style={{
                    display:
                      "flex",

                    flexWrap:
                      "wrap",

                    gap: "14px",

                    marginTop:
                      "25px",
                  }}
                >
                  {role &&
                    role
                      .split(",")
                      .map(
                        (
                          item,
                          index
                        ) => (
                          <span
                            key={
                              index
                            }
                            style={{
                              padding:
                                "12px 20px",

                              borderRadius:
                                "999px",

                              background:
                                "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(236,72,153,0.25))",

                              border:
                                "1px solid rgba(255,255,255,0.08)",

                              color:
                                "white",

                              fontWeight:
                                "600",

                              fontSize:
                                "14px",
                            }}
                          >
                            {item.trim()}
                          </span>
                        )
                      )}
                </div>
              </div>
            </div>
          </div>

          {/* EDIT PROFILE */}
          <div
            style={{
              padding: "40px",

              borderRadius:
                "28px",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(20px)",
            }}
          >
            <h2
              style={{
                fontSize:
                  "48px",

                marginBottom:
                  "35px",
              }}
            >
              EDIT PROFILE
            </h2>

            {/* NAME */}
            <label>
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            {/* EMAIL */}
            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              disabled
              style={{
                ...inputStyle,

                opacity: 0.6,
              }}
            />

            {/* ROLE */}
            <label>
              Role
            </label>

            <input
              type="text"
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
              placeholder="AI Engineer, UI Designer, Startup Founder"
              style={inputStyle}
            />

            {/* BIO */}
            <label>
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) =>
                setBio(
                  e.target.value
                )
              }
              rows="5"
              style={{
                ...inputStyle,

                resize: "none",
              }}
            />

            {/* SKILLS */}
            <label>
              Skills
            </label>

            <input
              type="text"
              value={skills}
              onChange={(e) =>
                setSkills(
                  e.target.value
                )
              }
              placeholder="React, Node.js, UI/UX"
              style={inputStyle}
            />

            {/* SKILLS TO LEARN */}
            <label>
              Skills To Learn
            </label>

            <input
              type="text"
              value={
                skillsToLearn
              }
              onChange={(e) =>
                setSkillsToLearn(
                  e.target.value
                )
              }
              placeholder="AI, Blockchain, Cybersecurity"
              style={inputStyle}
            />

            {/* PASSWORD */}
            <label>
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter new password"
              style={inputStyle}
            />

            {/* BUTTON */}
            <button
              onClick={
                updateProfile
              }
              disabled={
                loading
              }
              style={{
                width: "100%",

                padding: "18px",

                borderRadius:
                  "18px",

                border: "none",

                background:
                  "linear-gradient(135deg, #8B5CF6, #EC4899)",

                color: "white",

                fontSize:
                  "18px",

                fontWeight:
                  "700",

                cursor:
                  "pointer",

                marginTop:
                  "10px",
              }}
            >
              {loading
                ? "Updating..."
                : "Save Profile 🚀"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;