import { useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Chat() {
  // Location
  const location = useLocation();

  // Navigate
  const navigate = useNavigate();

  // Collaborators
  const collaborators = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "AI Engineer",
      online: true,
    },

    {
      id: 2,
      name: "Priya Verma",
      role: "UI UX Designer",
      online: true,
    },

    {
      id: 3,
      name: "Arjun Patel",
      role: "Full Stack Developer",
      online: false,
    },

    {
      id: 4,
      name: "BuildX Team",
      role: "Group Chat",
      online: true,
    },
  ];

  // Selected User
  const [selectedUser, setSelectedUser] =
    useState(
      location.state?.collaborator ||
        collaborators[0]
    );

  // Messages
  const [messages, setMessages] =
    useState([
      {
        sender:
          selectedUser.name,

        text:
          "Hey! Ready for today's collaboration session?",
      },

      {
        sender: "You",

        text:
          "Yes 🚀 Let's continue building BuildX.",
      },
    ]);

  // Input
  const [input, setInput] =
    useState("");

  // Send
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      sender: "You",
      text: input,
    };

    setMessages([
      ...messages,
      newMessage,
    ]);

    setInput("");
  };

  // Meeting
  const handleStartMeeting = () => {
    const roomId =
      selectedUser.name.replace(
        /\s+/g,
        "-"
      ) + "-BuildX";

    navigate(
      `/meeting/${roomId}`
    );
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
      {/* Glow Effects */}
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

            display: "flex",

            padding: "32px",

            gap: "26px",
          }}
        >
          {/* Collaborators */}
          <div
            className="glass-card"
            style={{
              width: "340px",

              padding: "28px",
            }}
          >
            <h2
              className="section-title"
              style={{
                marginBottom: "30px",

                fontSize: "38px",
              }}
            >
              Collaborators
            </h2>

            {/* USERS */}
            <div
              style={{
                display: "flex",

                flexDirection:
                  "column",

                gap: "18px",
              }}
            >
              {collaborators.map(
                (user) => (
                  <div
                    key={user.id}
                    onClick={() =>
                      setSelectedUser(user)
                    }
                    style={{
                      padding: "18px",

                      borderRadius:
                        "22px",

                      cursor: "pointer",

                      transition:
                        "0.3s ease",

                      background:
                        selectedUser.name ===
                        user.name
                          ? "linear-gradient(135deg, #2563EB, #7C3AED)"
                          : "rgba(255,255,255,0.04)",

                      border:
                        "1px solid rgba(255,255,255,0.08)",

                      boxShadow:
                        selectedUser.name ===
                        user.name
                          ? "0 0 24px rgba(124,58,237,0.24)"
                          : "none",
                    }}
                  >
                    <h3
                      className="card-title"
                      style={{
                        marginBottom:
                          "6px",

                        fontSize: "24px",

                        color: "white",
                      }}
                    >
                      {user.name}
                    </h3>

                    <p
                      style={{
                        color:
                          "#CBD5E1",

                        fontSize:
                          "14px",
                      }}
                    >
                      {user.role}
                    </p>

                    <div
                      style={{
                        marginTop:
                          "12px",

                        display: "flex",

                        alignItems:
                          "center",

                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "10px",

                          height: "10px",

                          borderRadius:
                            "50%",

                          background:
                            user.online
                              ? "#10B981"
                              : "#EF4444",

                          boxShadow:
                            user.online
                              ? "0 0 10px #10B981"
                              : "0 0 10px #EF4444",
                        }}
                      />

                      <span
                        style={{
                          fontSize:
                            "13px",

                          color:
                            "#CBD5E1",
                        }}
                      >
                        {user.online
                          ? "Online"
                          : "Offline"}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* CHAT AREA */}
          <div
            className="glass-card"
            style={{
              flex: 1,

              display: "flex",

              flexDirection:
                "column",

              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                padding: "28px",

                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",

                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",
              }}
            >
              <div>
                <h2
                  className="section-title"
                  style={{
                    fontSize: "38px",

                    marginBottom:
                      "6px",
                  }}
                >
                  {selectedUser.name}
                </h2>

                <p
                  style={{
                    color: "#CBD5E1",

                    fontSize: "15px",
                  }}
                >
                  {selectedUser.role}
                </p>
              </div>

              {/* MEETING */}
              <button
                onClick={
                  handleStartMeeting
                }
                style={{
                  padding:
                    "14px 24px",

                  borderRadius:
                    "16px",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  color:
                    "white",

                  fontWeight:
                    "600",

                  boxShadow:
                    "0 0 22px rgba(124,58,237,0.24)",
                }}
              >
                Start Meeting
              </button>
            </div>

            {/* MESSAGES */}
            <div
              style={{
                flex: 1,

                padding: "28px",

                overflowY: "auto",

                display: "flex",

                flexDirection:
                  "column",

                gap: "18px",
              }}
            >
              {messages.map(
                (message, index) => (
                  <div
                    key={index}
                    style={{
                      alignSelf:
                        message.sender ===
                        "You"
                          ? "flex-end"
                          : "flex-start",

                      maxWidth: "72%",
                    }}
                  >
                    <div
                      style={{
                        background:
                          message.sender ===
                          "You"
                            ? "linear-gradient(135deg, #2563EB, #7C3AED)"
                            : "rgba(255,255,255,0.06)",

                        padding:
                          "16px 20px",

                        borderRadius:
                          "22px",

                        border:
                          "1px solid rgba(255,255,255,0.08)",

                        boxShadow:
                          message.sender ===
                          "You"
                            ? "0 0 18px rgba(124,58,237,0.18)"
                            : "none",
                      }}
                    >
                      <strong
                        style={{
                          fontSize:
                            "15px",
                        }}
                      >
                        {message.sender}
                      </strong>

                      <p
                        style={{
                          marginTop:
                            "8px",

                          lineHeight:
                            "1.8",

                          fontSize:
                            "16px",
                        }}
                      >
                        {message.text}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* INPUT */}
            <div
              style={{
                padding: "24px",

                borderTop:
                  "1px solid rgba(255,255,255,0.08)",

                display: "flex",

                gap: "16px",
              }}
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                style={{
                  flex: 1,

                  padding: "18px",

                  borderRadius:
                    "18px",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  background:
                    "rgba(255,255,255,0.04)",

                  color: "white",

                  outline: "none",

                  fontSize: "15px",

                  backdropFilter:
                    "blur(10px)",
                }}
              />

              <button
                onClick={
                  handleSendMessage
                }
                style={{
                  padding:
                    "18px 28px",

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
                    "0 0 22px rgba(124,58,237,0.24)",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;