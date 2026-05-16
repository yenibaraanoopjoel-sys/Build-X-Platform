import { useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "@fontsource/dancing-script";

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

            display: "flex",

            padding: "30px",

            gap: "26px",
          }}
        >
          {/* Collaborators */}
          <div
            style={{
              width: "340px",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: "30px",

              padding: "28px",

              backdropFilter:
                "blur(16px)",

              boxShadow:
                "0 10px 40px rgba(168,85,247,0.10)",
            }}
          >
            <h2
              style={{
                marginBottom: "28px",

                fontSize: "50px",

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
              Collaborators ✨
            </h2>

            {/* Users */}
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

                      transition: "0.3s ease",

                      background:
                        selectedUser.name ===
                        user.name
                          ? "linear-gradient(to right, #9333EA, #EC4899)"
                          : "rgba(255,255,255,0.05)",

                      border:
                        "1px solid rgba(255,255,255,0.08)",

                      boxShadow:
                        selectedUser.name ===
                        user.name
                          ? "0 8px 30px rgba(236,72,153,0.20)"
                          : "none",
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: "6px",

                        fontSize: "20px",
                      }}
                    >
                      {user.name}
                    </h3>

                    <p
                      style={{
                        color:
                          "#E9D5FF",

                        fontSize: "14px",
                      }}
                    >
                      {user.role}
                    </p>

                    <div
                      style={{
                        marginTop: "12px",

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

          {/* Chat Area */}
          <div
            style={{
              flex: 1,

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: "30px",

              display: "flex",

              flexDirection: "column",

              backdropFilter:
                "blur(16px)",

              boxShadow:
                "0 10px 40px rgba(168,85,247,0.10)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "26px",

                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",

                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "42px",

                    fontFamily:
                      "'Dancing Script', cursive",

                    marginBottom: "6px",

                    background:
                      "linear-gradient(to right, #C084FC, #F472B6)",

                    WebkitBackgroundClip:
                      "text",

                    WebkitTextFillColor:
                      "transparent",
                  }}
                >
                  {selectedUser.name}
                </h2>

                <p
                  style={{
                    color: "#E9D5FF",

                    fontSize: "15px",
                  }}
                >
                  {selectedUser.role}
                </p>
              </div>

              {/* Meeting */}
              <button
                onClick={
                  handleStartMeeting
                }
                style={{
                  padding:
                    "14px 22px",

                  border: "none",

                  borderRadius:
                    "18px",

                  cursor: "pointer",

                  background:
                    "linear-gradient(to right, #9333EA, #EC4899)",

                  color: "white",

                  fontWeight: "bold",

                  boxShadow:
                    "0 8px 25px rgba(236,72,153,0.25)",
                }}
              >
                🎥 Start Meeting
              </button>
            </div>

            {/* Messages */}
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
                            ? "linear-gradient(to right, #9333EA, #EC4899)"
                            : "rgba(255,255,255,0.08)",

                        padding:
                          "16px 20px",

                        borderRadius:
                          "22px",

                        border:
                          "1px solid rgba(255,255,255,0.08)",

                        boxShadow:
                          message.sender ===
                          "You"
                            ? "0 8px 25px rgba(236,72,153,0.18)"
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
                          marginTop: "8px",

                          lineHeight:
                            "1.7",

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

            {/* Input */}
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
                placeholder="Type your futuristic message..."
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                style={{
                  flex: 1,

                  padding: "18px",

                  borderRadius: "18px",

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
                  handleSendMessage
                }
                style={{
                  padding:
                    "18px 28px",

                  border: "none",

                  borderRadius:
                    "18px",

                  cursor: "pointer",

                  background:
                    "linear-gradient(to right, #9333EA, #EC4899)",

                  color: "white",

                  fontWeight: "bold",

                  fontSize: "16px",

                  boxShadow:
                    "0 8px 25px rgba(236,72,153,0.25)",
                }}
              >
                🚀 Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;