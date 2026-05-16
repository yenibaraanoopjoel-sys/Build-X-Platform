import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import "@fontsource/dancing-script";

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

  // Matched Users
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

  // AI Matching
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
            "https://build-x-platform.onrender.com",
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

  // Send Request
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
              Skill Swap ✨
            </h1>

            <p
              style={{
                color: "#E9D5FF",

                fontSize: "19px",

                lineHeight: "1.8",

                maxWidth: "850px",
              }}
            >
              Connect with creators,
              developers, designers,
              and AI innovators
              through BuildX luxury
              collaboration matching.
            </p>
          </div>

          {/* Action Button */}
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
                "linear-gradient(to right, #9333EA, #EC4899)",

              boxShadow:
                "0 10px 35px rgba(236,72,153,0.30)",
            }}
          >
            +
          </button>

          {/* Form */}
          {showForm && (
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "36px",

                borderRadius: "30px",

                marginBottom: "38px",

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
                🤖 AI Collaboration
                Request
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
                    "18px",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  background:
                    "rgba(255,255,255,0.05)",

                  color: "white",

                  outline: "none",

                  fontSize: "16px",

                  backdropFilter:
                    "blur(10px)",
                }}
              />

              <input
                type="text"
                placeholder="Skill you want to learn"
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
                    "18px",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  background:
                    "rgba(255,255,255,0.05)",

                  color: "white",

                  outline: "none",

                  fontSize: "16px",

                  backdropFilter:
                    "blur(10px)",
                }}
              />

              <button
                onClick={
                  handleFindMatches
                }
                style={{
                  padding:
                    "16px 30px",

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
                    "17px",

                  boxShadow:
                    "0 10px 30px rgba(236,72,153,0.25)",
                }}
              >
                🚀 Find AI Matches
              </button>
            </div>
          )}

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "36px",

                borderRadius: "30px",

                marginBottom: "40px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                whiteSpace:
                  "pre-wrap",

                lineHeight: "2",

                backdropFilter:
                  "blur(16px)",

                boxShadow:
                  "0 10px 40px rgba(168,85,247,0.10)",
              }}
            >
              <h2
                style={{
                  marginBottom: "22px",

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
                🤖 AI Collaboration
                Insights
              </h2>

              <div
                style={{
                  color: "#E9D5FF",

                  fontSize: "17px",
                }}
              >
                {aiLoading
                  ? "JARVIS is analyzing futuristic collaboration opportunities..."
                  : aiSuggestion}
              </div>
            </div>
          )}

          {/* Matches */}
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
                  style={{
                    background:
                      "rgba(255,255,255,0.05)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    borderRadius:
                      "30px",

                    padding: "30px",

                    backdropFilter:
                      "blur(16px)",

                    boxShadow:
                      "0 10px 35px rgba(168,85,247,0.08)",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "85px",

                      height: "85px",

                      borderRadius:
                        "50%",

                      background:
                        "linear-gradient(to right, #9333EA, #EC4899)",

                      display: "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      fontSize: "30px",

                      marginBottom: "22px",

                      boxShadow:
                        "0 10px 25px rgba(236,72,153,0.25)",
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>

                  <h2
                    style={{
                      fontSize: "34px",

                      marginBottom: "10px",

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
                  </h2>

                  <p
                    style={{
                      color: "#CBD5E1",

                      marginBottom: "24px",

                      fontSize: "16px",
                    }}
                  >
                    {user.role}
                  </p>

                  {/* Skills */}
                  <div
                    style={{
                      display: "flex",

                      flexWrap: "wrap",

                      gap: "12px",

                      marginBottom: "28px",
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
                              "30px",

                            background:
                              "rgba(147,51,234,0.18)",

                            color:
                              "#F5D0FE",

                            border:
                              "1px solid rgba(255,255,255,0.08)",

                            fontWeight:
                              "bold",
                          }}
                        >
                          ✨ {skill}
                        </span>
                      )
                    )}
                  </div>

                  {/* Buttons */}
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
                          "0 10px 30px rgba(236,72,153,0.22)",
                      }}
                    >
                      🚀 Send Request
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

                        border: "none",

                        borderRadius:
                          "18px",

                        background:
                          "#F59E0B",

                        color:
                          "white",

                        fontWeight:
                          "bold",

                        fontSize:
                          "16px",
                      }}
                    >
                      ⏳ Request Pending...
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

                        border: "none",

                        borderRadius:
                          "18px",

                        cursor:
                          "pointer",

                        background:
                          "#10B981",

                        color:
                          "white",

                        fontWeight:
                          "bold",

                        fontSize:
                          "16px",

                        boxShadow:
                          "0 10px 25px rgba(16,185,129,0.25)",
                      }}
                    >
                      🤝 Start
                      Collaboration
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