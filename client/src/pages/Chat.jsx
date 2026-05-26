import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

import socket from "../socket";

function Chat() {
  //
  // SCROLL REF
  //
  const messagesEndRef =
    useRef(null);

  //
  // SAFE USER
  //
  const storedUser =
    localStorage.getItem(
      "user"
    );

  const currentUser =
    storedUser
      ? JSON.parse(
          storedUser
        )
      : {};

  const currentUserId =
    currentUser?._id ||
    currentUser?.userId ||
    "";

  //
  // STATES
  //
  const [
    collaborators,
    setCollaborators,
  ] = useState([]);

  const [
    selectedUser,
    setSelectedUser,
  ] = useState(null);

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [typing, setTyping] =
    useState(false);

  const [
    onlineUsers,
    setOnlineUsers,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  //
  // TOKEN
  //
  const token =
    localStorage.getItem(
      "token"
    );

  //
  // AUTO SCROLL
  //
  const scrollToBottom =
    () => {
      messagesEndRef.current?.scrollIntoView(
        {
          behavior:
            "smooth",
        }
      );
    };

  //
  // FETCH USERS
  //
  const fetchCollaborators =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await API.get(
              "/users/all",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          if (
            response?.data
              ?.success
          ) {
            const filtered =
              Array.isArray(
                response.data
                  .users
              )
                ? response.data.users.filter(
                    (
                      user
                    ) =>
                      user?._id !==
                      currentUserId
                  )
                : [];

            setCollaborators(
              filtered
            );
          } else {
            setCollaborators([]);
          }
        } catch (error) {
          console.log(
            "COLLABORATOR ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );

          setCollaborators([]);
        } finally {
          setLoading(false);
        }
      },
      [
        token,
        currentUserId,
      ]
    );

  //
  // FETCH MESSAGES
  //
  const fetchMessages =
    useCallback(
      async (receiverId) => {
        try {
          const response =
            await API.get(
              `/messages/${receiverId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          if (
            response?.data
              ?.success
          ) {
            setMessages(
              Array.isArray(
                response.data
                  .messages
              )
                ? response.data
                    .messages
                : []
            );
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.log(
            "MESSAGE ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );

          setMessages([]);
        }
      },
      [token]
    );

  //
  // LOAD USERS
  //
  useEffect(() => {
    fetchCollaborators();
  }, [
    fetchCollaborators,
  ]);

  //
  // SOCKET CONNECTION
  //
  useEffect(() => {
    if (!currentUserId)
      return;

    socket.emit(
      "join",
      currentUserId
    );

    socket.on(
      "receiveMessage",
      (message) => {
        if (
          message?.sender ===
            selectedUser?._id ||
          message?.receiver ===
            selectedUser?._id ||
          message?.sender
            ?._id ===
            selectedUser?._id
        ) {
          setMessages(
            (prev) => [
              ...prev,
              message,
            ]
          );
        }
      }
    );

    socket.on(
      "typing",
      () => {
        setTyping(true);

        setTimeout(() => {
          setTyping(false);
        }, 2000);
      }
    );

    socket.on(
      "onlineUsers",
      (users) => {
        setOnlineUsers(
          Array.isArray(
            users
          )
            ? users
            : []
        );
      }
    );

    return () => {
      socket.off(
        "receiveMessage"
      );

      socket.off("typing");

      socket.off(
        "onlineUsers"
      );
    };
  }, [
    currentUserId,
    selectedUser,
  ]);

  //
  // AUTO SCROLL
  //
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //
  // SELECT USER
  //
  const selectUser =
    async (user) => {
      setSelectedUser(user);

      await fetchMessages(
        user?._id
      );
    };

  //
  // SEND MESSAGE
  //
  const sendMessage =
    async () => {
      if (
        !input.trim() ||
        !selectedUser
      ) {
        return;
      }

      try {
        const response =
          await API.post(
            "/messages/send",
            {
              receiver:
                selectedUser?._id,

              text: input,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (
          response?.data
            ?.success
        ) {
          const newMessage =
            response.data
              .message;

          setMessages(
            (prev) => [
              ...prev,
              newMessage,
            ]
          );

          socket.emit(
            "sendMessage",
            newMessage
          );

          setInput("");
        }
      } catch (error) {
        console.log(
          "SEND ERROR:",
          error
            ?.response
            ?.data ||
            error.message
        );
      }
    };

  //
  // ENTER SEND
  //
  const handleKeyDown =
    (e) => {
      if (
        e.key === "Enter"
      ) {
        sendMessage();
      }
    };

  //
  // LOADING
  //
  if (loading) {
    return <Loader />;
  }

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

            padding: "30px",

            display: "flex",

            gap: "24px",

            height:
              "calc(100vh - 80px)",
          }}
        >
          {/* USERS PANEL */}
          <div
            style={{
              width: "340px",

              borderRadius:
                "28px",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(18px)",

              overflow: "hidden",

              display: "flex",

              flexDirection:
                "column",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                padding: "24px",

                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2
                style={{
                  fontSize:
                    "32px",
                }}
              >
                Chats 💬
              </h2>
            </div>

            {/* USERS */}
            <div
              style={{
                flex: 1,

                overflowY:
                  "auto",
              }}
            >
              {collaborators.map(
                (user) => {
                  const online =
                    onlineUsers.includes(
                      user?._id
                    );

                  return (
                    <div
                      key={
                        user?._id
                      }
                      onClick={() =>
                        selectUser(
                          user
                        )
                      }
                      style={{
                        padding:
                          "20px",

                        cursor:
                          "pointer",

                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",

                        background:
                          selectedUser?._id ===
                          user?._id
                            ? "rgba(124,58,237,0.25)"
                            : "transparent",

                        transition:
                          "0.3s",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap: "16px",
                        }}
                      >
                        {/* AVATAR */}
                        <div
                          style={{
                            width:
                              "56px",

                            height:
                              "56px",

                            borderRadius:
                              "50%",

                            background:
                              "linear-gradient(135deg, #8B5CF6, #EC4899)",

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            fontWeight:
                              "bold",

                            fontSize:
                              "22px",
                          }}
                        >
                          {user?.name
                            ?.charAt(
                              0
                            )
                            ?.toUpperCase()}
                        </div>

                        {/* INFO */}
                        <div>
                          <h3
                            style={{
                              marginBottom:
                                "6px",
                            }}
                          >
                            {
                              user?.name
                            }
                          </h3>

                          <p
                            style={{
                              color:
                                online
                                  ? "#10B981"
                                  : "#94A3B8",

                              fontSize:
                                "13px",
                            }}
                          >
                            {online
                              ? "Online"
                              : "Offline"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* CHAT PANEL */}
          <div
            style={{
              flex: 1,

              borderRadius:
                "28px",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(18px)",

              display: "flex",

              flexDirection:
                "column",

              overflow: "hidden",
            }}
          >
            {/* EMPTY */}
            {!selectedUser ? (
              <div
                style={{
                  flex: 1,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  flexDirection:
                    "column",
                }}
              >
                <h1
                  style={{
                    fontSize:
                      "48px",

                    marginBottom:
                      "16px",
                  }}
                >
                  BuildX Chat 🚀
                </h1>

                <p
                  style={{
                    color:
                      "#CBD5E1",
                  }}
                >
                  Select a user
                  to start
                  chatting.
                </p>
              </div>
            ) : (
              <>
                {/* HEADER */}
                <div
                  style={{
                    padding:
                      "24px",

                    borderBottom:
                      "1px solid rgba(255,255,255,0.08)",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width:
                        "58px",

                      height:
                        "58px",

                      borderRadius:
                        "50%",

                      background:
                        "linear-gradient(135deg, #8B5CF6, #EC4899)",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      fontWeight:
                        "bold",

                      fontSize:
                        "24px",
                    }}
                  >
                    {selectedUser?.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <h2>
                      {
                        selectedUser?.name
                      }
                    </h2>

                    <p
                      style={{
                        color:
                          onlineUsers.includes(
                            selectedUser?._id
                          )
                            ? "#10B981"
                            : "#94A3B8",

                        fontSize:
                          "13px",
                      }}
                    >
                      {onlineUsers.includes(
                        selectedUser?._id
                      )
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </div>

                {/* MESSAGES */}
                <div
                  style={{
                    flex: 1,

                    padding:
                      "28px",

                    overflowY:
                      "auto",

                    display:
                      "flex",

                    flexDirection:
                      "column",

                    gap: "18px",
                  }}
                >
                  {messages.map(
                    (
                      message,
                      index
                    ) => {
                      const mine =
                        message?.sender ===
                          currentUserId ||
                        message
                          ?.sender
                          ?._id ===
                          currentUserId;

                      return (
                        <div
                          key={
                            index
                          }
                          style={{
                            display:
                              "flex",

                            justifyContent:
                              mine
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <div
                            style={{
                              maxWidth:
                                "70%",

                              padding:
                                "16px 20px",

                              borderRadius:
                                mine
                                  ? "22px 22px 0 22px"
                                  : "22px 22px 22px 0",

                              background:
                                mine
                                  ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
                                  : "rgba(255,255,255,0.08)",

                              color:
                                "white",
                            }}
                          >
                            <p
                              style={{
                                lineHeight:
                                  "1.7",
                              }}
                            >
                              {message?.text}
                            </p>

                            <div
                              style={{
                                marginTop:
                                  "10px",

                                fontSize:
                                  "11px",

                                opacity:
                                  0.7,
                              }}
                            >
                              {message?.createdAt
                                ? new Date(
                                    message.createdAt
                                  ).toLocaleTimeString()
                                : ""}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                  {/* TYPING */}
                  {typing && (
                    <p
                      style={{
                        color:
                          "#CBD5E1",
                      }}
                    >
                      Typing...
                    </p>
                  )}

                  <div
                    ref={
                      messagesEndRef
                    }
                  />
                </div>

                {/* INPUT */}
                <div
                  style={{
                    padding:
                      "24px",

                    borderTop:
                      "1px solid rgba(255,255,255,0.08)",

                    display:
                      "flex",

                    gap: "16px",
                  }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) =>
                      setInput(
                        e.target
                          .value
                      )
                    }
                    onKeyDown={
                      handleKeyDown
                    }
                    placeholder="Type your message..."
                    style={{
                      flex: 1,

                      padding:
                        "18px 22px",

                      borderRadius:
                        "18px",

                      border:
                        "1px solid rgba(255,255,255,0.08)",

                      background:
                        "rgba(255,255,255,0.05)",

                      color:
                        "white",

                      outline:
                        "none",

                      fontSize:
                        "15px",
                    }}
                  />

                  <button
                    onClick={
                      sendMessage
                    }
                    style={{
                      padding:
                        "18px 28px",

                      borderRadius:
                        "18px",

                      border:
                        "none",

                      cursor:
                        "pointer",

                      fontWeight:
                        "700",

                      background:
                        "linear-gradient(135deg, #8B5CF6, #EC4899)",

                      color:
                        "white",
                    }}
                  >
                    Send 🚀
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;