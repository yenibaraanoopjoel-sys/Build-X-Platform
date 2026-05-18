import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function SkillSwap() {
  const navigate = useNavigate();

  // Modal
  const [showForm, setShowForm] =
    useState(false);

  // Inputs
  const [skillsHave, setSkillsHave] =
    useState("");

  const [skillsWant, setSkillsWant] =
    useState("");

  // AI Suggestion
  const [aiSuggestion, setAiSuggestion] =
    useState("");

  const [aiLoading, setAiLoading] =
    useState(false);

  // Matches
  const [matchedUsers, setMatchedUsers] =
    useState([]);

  // Request Status
  const [requestStatus, setRequestStatus] =
    useState({});

  // Demo Users
  const users = [
    {
      name: "Rahul Sharma",
      role: "Full Stack Developer",

      skillsHave: [
        "React",
        "Node.js",
        "MongoDB",
      ],
    },

    {
      name: "Priya Verma",
      role: "UI UX Designer",

      skillsHave: [
        "UI UX",
        "Figma",
        "Frontend",
      ],
    },

    {
      name: "Arjun Patel",
      role: "AI Engineer",

      skillsHave: [
        "AI",
        "Python",
        "Machine Learning",
      ],
    },

    {
      name: "Sneha Reddy",
      role: "Backend Developer",

      skillsHave: [
        "Node.js",
        "Express",
        "MongoDB",
      ],
    },

    {
      name: "Karthik Sai",
      role: "DevOps Engineer",

      skillsHave: [
        "AWS",
        "Docker",
        "DevOps",
      ],
    },

    {
      name: "Aditi Kapoor",
      role: "Data Scientist",

      skillsHave: [
        "Python",
        "AI",
        "Data Science",
      ],
    },

    {
      name: "Vikram Singh",
      role: "Cloud Engineer",

      skillsHave: [
        "Cloud",
        "AWS",
        "Linux",
      ],
    },

    {
      name: "Ananya Iyer",
      role: "Frontend Developer",

      skillsHave: [
        "React",
        "JavaScript",
        "CSS",
      ],
    },
  ];

  // AI MATCH
  const handleFindMatches =
    async () => {
      const matches =
        users.filter((user) =>
          user.skillsHave.some(
            (skill) =>
              skill
                .toLowerCase()
                .includes(
                  skillsWant.toLowerCase()
                ) ||
              skill
                .toLowerCase()
                .includes(
                  skillsHave.toLowerCase()
                ) ||

              user.role
                .toLowerCase()
                .includes(
                  skillsWant.toLowerCase()
                ) ||

              user.role
                .toLowerCase()
                .includes(
                  skillsHave.toLowerCase()
                )
          )
        );

      setMatchedUsers(matches);

      setShowForm(false);

      try {
        setAiLoading(true);

        const response =
          await axios.post(
            "https://build-x-platform.onrender.com/api/ai",
            {
              message: `
Suggest the best collaboration strategy.

Skills I Have:
${skillsHave}

Skills I Want:
${skillsWant}

Provide:
1. Best collaborator type
2. Suggested project ideas
3. Team role suggestions
4. Collaboration advice
`,
            }
          );

        setAiSuggestion(
          response.data.reply
        );
      } catch (error) {
        console.log(error);
      } finally {
        setAiLoading(false);
      }
    };

  // Request
  const handleSendRequest = (
    userName
  ) => {
    setRequestStatus((prev) => ({
      ...prev,
      [userName]: "Pending",
    }));

    setTimeout(() => {
      setRequestStatus((prev) => ({
        ...prev,
        [userName]: "Accepted",
      }));
    }, 3000);
  };

  // Chat
  const handleStartChat = (
    user
  ) => {
    navigate("/chat", {
      state: {
        collaborator: user,
      },
    });
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
                AI SKILL SWAP
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "18px",

                  lineHeight: "2",

                  maxWidth: "850px",
                }}
              >
                Discover AI-powered
                collaboration matches,
                connect with creators,
                developers, designers,
                and innovators inside
                the futuristic BuildX
                ecosystem.
              </p>
            </div>
          </div>

          {/* ACTION */}
          <button
            onClick={() =>
              setShowForm(true)
            }
            style={{
              width: "82px",

              height: "82px",

              borderRadius: "50%",

              border: "none",

              cursor: "pointer",

              fontSize: "42px",

              color: "white",

              marginBottom: "38px",

              background:
                "linear-gradient(135deg, #2563EB, #7C3AED)",

              boxShadow:
                "0 0 28px rgba(124,58,237,0.24)",
            }}
          >
            +
          </button>

          {/* FORM */}
          {showForm && (
            <div
              className="glass-card"
              style={{
                padding: "36px",

                marginBottom: "38px",
              }}
            >
              <h2
                className="section-title"
                style={{
                  marginBottom: "28px",

                  fontSize: "42px",
                }}
              >
                AI Collaboration Match
              </h2>

              <input
                type="text"
                placeholder="Skills you have"
                value={skillsHave}
                onChange={(e) =>
                  setSkillsHave(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",

                  padding: "18px",

                  marginBottom: "22px",

                  borderRadius:
                    "16px",

                  fontSize:
                    "15px",
                }}
              />

              <input
                type="text"
                placeholder="Skills you want to learn"
                value={skillsWant}
                onChange={(e) =>
                  setSkillsWant(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",

                  padding: "18px",

                  marginBottom: "28px",

                  borderRadius:
                    "16px",

                  fontSize:
                    "15px",
                }}
              />

              <button
                onClick={
                  handleFindMatches
                }
                style={{
                  padding:
                    "16px 30px",

                  borderRadius:
                    "18px",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  color:
                    "white",

                  fontWeight:
                    "600",

                  fontSize:
                    "15px",

                  boxShadow:
                    "0 0 24px rgba(124,58,237,0.22)",
                }}
              >
                Find AI Matches
              </button>
            </div>
          )}

          {/* AI INSIGHTS */}
          {aiSuggestion && (
            <div
              className="glass-card"
              style={{
                padding: "36px",

                marginBottom: "40px",

                whiteSpace:
                  "pre-wrap",

                lineHeight: "2",
              }}
            >
              <h2
                className="section-title"
                style={{
                  marginBottom: "24px",

                  fontSize: "42px",
                }}
              >
                AI Collaboration Insights
              </h2>

              <div
                style={{
                  color: "#CBD5E1",

                  fontSize: "16px",
                }}
              >
                {aiLoading
                  ? "Analyzing futuristic collaboration opportunities..."
                  : aiSuggestion}
              </div>
            </div>
          )}

          {/* MATCHES */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",

              gap: "28px",
            }}
          >
            {matchedUsers.map(
              (user, index) => (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    padding: "30px",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "88px",

                      height: "88px",

                      borderRadius:
                        "50%",

                      background:
                        "linear-gradient(135deg, #2563EB, #7C3AED)",

                      display: "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      fontSize: "32px",

                      marginBottom: "24px",

                      boxShadow:
                        "0 0 24px rgba(124,58,237,0.22)",
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>

                  {/* NAME */}
                  <h2
                    className="card-title"
                    style={{
                      fontSize: "34px",

                      marginBottom:
                        "10px",
                    }}
                  >
                    {user.name}
                  </h2>

                  <p
                    style={{
                      color: "#CBD5E1",

                      marginBottom:
                        "24px",

                      fontSize: "16px",
                    }}
                  >
                    {user.role}
                  </p>

                  {/* SKILLS */}
                  <div
                    style={{
                      display: "flex",

                      flexWrap:
                        "wrap",

                      gap: "12px",

                      marginBottom:
                        "28px",
                    }}
                  >
                    {user.skillsHave.map(
                      (skill, i) => (
                        <span
                          key={i}
                          style={{
                            padding:
                              "10px 16px",

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
                          ✨ {skill}
                        </span>
                      )
                    )}
                  </div>

                  {/* BUTTONS */}
                  {!requestStatus[
                    user.name
                  ] && (
                    <button
                      onClick={() =>
                        handleSendRequest(
                          user.name
                        )
                      }
                      style={{
                        width: "100%",

                        padding: "15px",

                        borderRadius:
                          "18px",

                        background:
                          "linear-gradient(135deg, #2563EB, #7C3AED)",

                        color:
                          "white",

                        fontWeight:
                          "600",

                        fontSize:
                          "15px",

                        boxShadow:
                          "0 0 22px rgba(124,58,237,0.22)",
                      }}
                    >
                      Send Request
                    </button>
                  )}

                  {requestStatus[
                    user.name
                  ] === "Pending" && (
                    <button
                      disabled
                      style={{
                        width: "100%",

                        padding: "15px",

                        borderRadius:
                          "18px",

                        background:
                          "#F59E0B",

                        color:
                          "white",

                        fontWeight:
                          "600",

                        fontSize:
                          "15px",
                      }}
                    >
                      Request Pending...
                    </button>
                  )}

                  {requestStatus[
                    user.name
                  ] ===
                    "Accepted" && (
                    <button
                      onClick={() =>
                        handleStartChat(
                          user
                        )
                      }
                      style={{
                        width: "100%",

                        padding: "15px",

                        borderRadius:
                          "18px",

                        background:
                          "#10B981",

                        color:
                          "white",

                        fontWeight:
                          "600",

                        fontSize:
                          "15px",

                        boxShadow:
                          "0 0 20px rgba(16,185,129,0.24)",
                      }}
                    >
                      Start Collaboration
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillSwap;