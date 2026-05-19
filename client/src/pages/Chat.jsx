import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import API from "../services/api";

function Chat() {
  // Navigate
  const navigate =
    useNavigate();

  // Current User
  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || {};

  // Collaborators
  const [
    collaborators,
    setCollaborators,
  ] = useState([]);

  // Selected User
  const [
    selectedUser,
    setSelectedUser,
  ] = useState(null);

  // Messages
  const [messages, setMessages] =
    useState([]);

  // Input
  const [input, setInput] =
    useState("");

  // Fetch Users
  useEffect(() => {
    const fetchUsers =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const response =
            await API.get(
              "/user/all-users",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          const filteredUsers =
            response.data.filter(
              (user) =>
                user._id !==
                currentUser.userId
            );

          setCollaborators(
            filteredUsers
          );

          if (
            filteredUsers.length >
            0
          ) {
            setSelectedUser(
              filteredUsers[0]
            );
          }
        } catch (error) {
          console.log(
            "USER FETCH ERROR:",
            error.response
              ?.data ||
              error.message
          );
        }
      };

    fetchUsers();
  }, [currentUser.userId]);

  // Fetch Messages
  useEffect(() => {
    const fetchMessages =
      async () => {
        if (!selectedUser)
          return;

        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const response =
            await API.get(
              `/messages/${selectedUser._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setMessages(
            response.data
          );
        } catch (error) {
          console.log(
            "MESSAGE FETCH ERROR:",
            error.response
              ?.data ||
              error.message
          );
        }
      };

    fetchMessages();
  }, [
    selectedUser,
    currentUser.userId,
  ]);

  // Send Message
  const handleSendMessage =
    async () => {
      if (!input.trim())
        return;

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await API.post(
            "/messages",
            {
              receiverId:
                selectedUser._id,

              text: input,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setMessages([
          ...messages,
          response.data,
        ]);

        setInput("");
      } catch (error) {
        console.log(
          "SEND ERROR:",
          error.response
            ?.data ||
            error.message
        );
      }
    };

  // Start Meeting
  const handleStartMeeting =
    () => {
      if (!selectedUser)
        return;

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

        {/* Main */}
        <div
          style={{
            flex: 1,

            display: "flex",

            padding: "32px",

            gap: "26px",
          }}
        >
          {/* Users */}
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
                    key={user._id}
                    onClick={() =>
                      setSelectedUser(
                        user
                      )
                    }
                    style={{
                      padding: "18px",

                      borderRadius:
                        "22px",

                      cursor: "pointer",

                      transition:
                        "0.3s ease",

                      background:
                        selectedUser?._id ===
                        user._id
                          ? "linear-gradient(135deg, #2563EB, #7C3AED)"
                          : "rgba(255,255,255,0.04)",

                      border:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <h3
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
                      {user.email}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Chat Area */}
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
            {/* Header */}
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
                  style={{
                    fontSize: "38px",

                    marginBottom:
                      "6px",
                  }}
                >
                  {selectedUser?.name}
                </h2>

                <p
                  style={{
                    color: "#CBD5E1",

                    fontSize: "15px",
                  }}
                >
                  {selectedUser?.email}
                </p>
              </div>

              <button
                onClick={
                  handleStartMeeting
                }
                style={{
                  padding:
                    "14px 24px",

                  borderRadius:
                    "16px",

                  border: "none",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  color:
                    "white",

                  fontWeight:
                    "600",

                  cursor:
                    "pointer",

                  boxShadow:
                    "0 0 22px rgba(124,58,237,0.24)",
                }}
              >
                Start Meeting
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
                (
                  message,
                  index
                ) => (
                  <div
                    key={index}
                    style={{
                      alignSelf:
                        message.sender ===
                        currentUser.userId
                          ? "flex-end"
                          : "flex-start",

                      maxWidth: "72%",
                    }}
                  >
                    <div
                      style={{
                        background:
                          message.sender ===
                          currentUser.userId
                            ? "linear-gradient(135deg, #2563EB, #7C3AED)"
                            : "rgba(255,255,255,0.06)",

                        padding:
                          "16px 20px",

                        borderRadius:
                          "22px",

                        border:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <p
                        style={{
                          lineHeight:
                            "1.8",

                          fontSize:
                            "16px",
                        }}
                      >
                        {
                          message.text
                        }
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