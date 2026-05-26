import "@fontsource/cinzel";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import API from "../services/api";

import socket from "../socket";

function Navbar() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  //
  // USER
  //
  const [user] =
    useState(() => {
      return (
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        ) || {}
      );
    });

  //
  // TOKEN
  //
  const token =
    localStorage.getItem(
      "token"
    );

  //
  // STATES
  //
  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [
    loadingNotifications,
    setLoadingNotifications,
  ] = useState(false);

  //
  // LOGOUT
  //
  const logoutHandler =
    () => {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      navigate("/login");
    };

  //
  // FETCH UNREAD COUNT
  //
  const fetchUnreadCount =
    useCallback(
      async () => {
        try {
          if (!token)
            return;

          const response =
            await API.get(
              "/notifications/unread-count",
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
            setUnreadCount(
              response.data
                .unreadCount ||
                0
            );
          }
        } catch (error) {
          console.log(
            "UNREAD ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );

          setUnreadCount(
            0
          );
        }
      },
      [token]
    );

  //
  // FETCH NOTIFICATIONS
  //
  const fetchNotifications =
    useCallback(
      async () => {
        try {
          if (!token)
            return;

          setLoadingNotifications(
            true
          );

          const response =
            await API.get(
              "/notifications",
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
            setNotifications(
              Array.isArray(
                response.data
                  .notifications
              )
                ? response
                    .data
                    .notifications
                : []
            );
          } else {
            setNotifications(
              []
            );
          }
        } catch (error) {
          console.log(
            "NOTIFICATION ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );

          setNotifications(
            []
          );
        } finally {
          setLoadingNotifications(
            false
          );
        }
      },
      [token]
    );

  //
  // MARK READ
  //
  const markAsRead =
    async (id) => {
      try {
        await API.put(
          `/notifications/read/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchNotifications();

        fetchUnreadCount();
      } catch (error) {
        console.log(
          error
        );
      }
    };

  //
  // DELETE NOTIFICATION
  //
  const deleteNotification =
    async (id) => {
      try {
        await API.delete(
          `/notifications/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(
          (prev) =>
            prev.filter(
              (
                notification
              ) =>
                notification._id !==
                id
            )
        );

        fetchUnreadCount();
      } catch (error) {
        console.log(
          error
        );
      }
    };

  //
  // ACCEPT REQUEST
  //
  const acceptRequest =
    async (id) => {
      try {
        await API.put(
          `/collaborations/accept/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchNotifications();

        fetchUnreadCount();

        alert(
          "Request Accepted 🚀"
        );
      } catch (error) {
        console.log(
          error
        );

        alert(
          "Failed to accept request"
        );
      }
    };

  //
  // REJECT REQUEST
  //
  const rejectRequest =
    async (id) => {
      try {
        await API.put(
          `/collaborations/reject/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchNotifications();

        fetchUnreadCount();

        alert(
          "Request Rejected ❌"
        );
      } catch (error) {
        console.log(
          error
        );

        alert(
          "Failed to reject request"
        );
      }
    };

  //
  // INITIAL LOAD
  //
  useEffect(() => {
    fetchUnreadCount();

    fetchNotifications();
  }, [
    fetchUnreadCount,
    fetchNotifications,
  ]);

  //
  // SOCKET CONNECTION
  //
  useEffect(() => {
    if (
      user?._id ||
      user?.userId
    ) {
      socket.emit(
        "join_user",
        user._id ||
          user.userId
      );
    }

    socket.on(
      "receive_notification",
      (data) => {
        setNotifications(
          (prev) => [
            data,
            ...prev,
          ]
        );

        setUnreadCount(
          (prev) =>
            prev + 1
        );
      }
    );

    return () => {
      socket.off(
        "receive_notification"
      );
    };
  }, [user]);

  //
  // NAVIGATION ITEMS
  //
  const navItems = [
    {
      name:
        "Dashboard",

      path:
        "/dashboard",
    },

    {
      name: "Ideas",

      path:
        "/ideas",
    },

    {
      name:
        "Projects",

      path:
        "/projects",
    },

    {
      name: "Tasks",

      path:
        "/tasks",
    },

    {
      name:
        "Requests",

      path:
        "/collaboration-requests",
    },

    {
      name: "Chat",

      path: "/chat",
    },
  ];

  return (
    <nav
      style={{
        display: "flex",

        justifyContent:
          "space-between",

        alignItems:
          "center",

        padding:
          "18px 34px",

        background:
          "linear-gradient(to right, rgba(18,7,31,0.96), rgba(30,11,54,0.96), rgba(15,23,42,0.96))",

        borderBottom:
          "1px solid rgba(255,255,255,0.08)",

        position:
          "sticky",

        top: 0,

        zIndex: 1000,

        backdropFilter:
          "blur(18px)",

        boxShadow:
          "0 10px 35px rgba(168,85,247,0.10)",
      }}
    >
      {/* LOGO */}
      <div>
        <h1
          style={{
            fontFamily:
              "'Cinzel', serif",

            fontSize:
              "34px",

            background:
              "linear-gradient(to right, #C084FC, #F472B6)",

            WebkitBackgroundClip:
              "text",

            WebkitTextFillColor:
              "transparent",

            marginBottom:
              "4px",
          }}
        >
          BuildX ✨
        </h1>

        <p
          style={{
            color:
              "#D8B4FE",

            fontSize:
              "12px",

            letterSpacing:
              "1px",
          }}
        >
          AI Collaboration
          Platform
        </p>
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          gap: "14px",

          flexWrap:
            "wrap",
        }}
      >
        {navItems.map(
          (item) => (
            <Link
              key={
                item.path
              }
              to={
                item.path
              }
              style={{
                textDecoration:
                  "none",

                padding:
                  "10px 18px",

                borderRadius:
                  "14px",

                color:
                  "white",

                fontWeight:
                  "600",

                background:
                  location.pathname ===
                  item.path
                    ? "linear-gradient(to right, #8B5CF6, #EC4899)"
                    : "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {
                item.name
              }
            </Link>
          )
        )}

        {/* NOTIFICATIONS */}
        <div
          style={{
            position:
              "relative",
          }}
        >
          <button
            onClick={() =>
              setShowNotifications(
                (
                  prev
                ) => !prev
              )
            }
            style={{
              position:
                "relative",

              padding:
                "12px 16px",

              borderRadius:
                "14px",

              border:
                "1px solid rgba(255,255,255,0.08)",

              background:
                "rgba(255,255,255,0.05)",

              color:
                "white",

              cursor:
                "pointer",

              fontSize:
                "18px",
            }}
          >
            🔔

            {unreadCount >
              0 && (
              <span
                style={{
                  position:
                    "absolute",

                  top: "-6px",

                  right:
                    "-6px",

                  background:
                    "#EC4899",

                  borderRadius:
                    "50%",

                  width:
                    "20px",

                  height:
                    "20px",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  fontSize:
                    "11px",

                  fontWeight:
                    "bold",

                  color:
                    "white",
                }}
              >
                {
                  unreadCount
                }
              </span>
            )}
          </button>

          {/* DROPDOWN */}
          {showNotifications && (
            <div
              style={{
                position:
                  "absolute",

                top: "65px",

                right: 0,

                width:
                  "380px",

                maxHeight:
                  "520px",

                overflowY:
                  "auto",

                background:
                  "rgba(10,10,25,0.97)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                borderRadius:
                  "24px",

                padding:
                  "20px",

                zIndex:
                  9999,
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "18px",

                  fontSize:
                    "24px",
                }}
              >
                Notifications
              </h2>

              {loadingNotifications ? (
                <p>
                  Loading...
                </p>
              ) : notifications.length ===
                0 ? (
                <p
                  style={{
                    color:
                      "#CBD5E1",
                  }}
                >
                  No notifications
                </p>
              ) : (
                notifications.map(
                  (
                    notification
                  ) => (
                    <div
                      key={
                        notification?._id
                      }
                      style={{
                        padding:
                          "16px",

                        marginBottom:
                          "14px",

                        borderRadius:
                          "18px",

                        background:
                          notification?.isRead
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(124,58,237,0.14)",
                      }}
                    >
                      <p
                        style={{
                          marginBottom:
                            "10px",

                          lineHeight:
                            "1.8",
                        }}
                      >
                        {
                          notification?.message
                        }
                      </p>

                      <div
                        style={{
                          display:
                            "flex",

                          gap:
                            "10px",

                          flexWrap:
                            "wrap",
                        }}
                      >
                        {notification?.type ===
                          "COLLAB_REQUEST" &&
                          notification?.collaborationRequest && (
                            <>
                              <button
                                onClick={() =>
                                  acceptRequest(
                                    notification?.collaborationRequest
                                  )
                                }
                                style={{
                                  padding:
                                    "8px 14px",

                                  border:
                                    "none",

                                  borderRadius:
                                    "12px",

                                  background:
                                    "#22C55E",

                                  color:
                                    "white",

                                  cursor:
                                    "pointer",
                                }}
                              >
                                Accept
                              </button>

                              <button
                                onClick={() =>
                                  rejectRequest(
                                    notification?.collaborationRequest
                                  )
                                }
                                style={{
                                  padding:
                                    "8px 14px",

                                  border:
                                    "none",

                                  borderRadius:
                                    "12px",

                                  background:
                                    "#EF4444",

                                  color:
                                    "white",

                                  cursor:
                                    "pointer",
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}

                        {!notification?.isRead && (
                          <button
                            onClick={() =>
                              markAsRead(
                                notification?._id
                              )
                            }
                            style={{
                              padding:
                                "8px 14px",

                              border:
                                "none",

                              borderRadius:
                                "12px",

                              background:
                                "#8B5CF6",

                              color:
                                "white",

                              cursor:
                                "pointer",
                            }}
                          >
                            Mark Read
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteNotification(
                              notification?._id
                            )
                          }
                          style={{
                            padding:
                              "8px 14px",

                            border:
                              "none",

                            borderRadius:
                              "12px",

                            background:
                              "rgba(239,68,68,0.16)",

                            color:
                              "#FCA5A5",

                            cursor:
                              "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          )}
        </div>

        {/* AI STATUS */}
        <div
          style={{
            padding:
              "10px 16px",

            borderRadius:
              "14px",

            background:
              "linear-gradient(to right, rgba(147,51,234,0.18), rgba(236,72,153,0.18))",

            color:
              "#F9A8D4",

            fontWeight:
              "bold",

            fontSize:
              "13px",
          }}
        >
          🤖 JARVIS ONLINE
        </div>

        {/* LOGOUT */}
        <button
          onClick={
            logoutHandler
          }
          style={{
            padding:
              "12px 22px",

            border:
              "none",

            borderRadius:
              "16px",

            cursor:
              "pointer",

            background:
              "linear-gradient(to right, #9333EA, #EC4899)",

            color:
              "white",

            fontWeight:
              "700",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;