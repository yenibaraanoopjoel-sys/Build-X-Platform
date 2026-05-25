import "@fontsource/cinzel";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import socket from "../socket";

function Navbar() {
  const navigate = useNavigate();

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

  //
  // LOGOUT
  //
  const logoutHandler = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  //
  // FETCH UNREAD COUNT
  //
  const fetchUnreadCount =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

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
          response.data.success
        ) {
          setUnreadCount(
            response.data
              .unreadCount
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  //
  // FETCH NOTIFICATIONS
  //
  const fetchNotifications =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
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
          response.data.success
        ) {
          setNotifications(
            response.data
              .notifications
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

  //
  // MARK AS READ
  //
  const markAsRead =
    async (id) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

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
        console.log(error);
      }
    };

  //
  // DELETE NOTIFICATION
  //
  const deleteNotification =
    async (id) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await API.delete(
          `/notifications/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchNotifications();

        fetchUnreadCount();
      } catch (error) {
        console.log(error);
      }
    };

  //
  // SOCKET + NOTIFICATIONS
  //
  useEffect(() => {
    fetchUnreadCount();

    fetchNotifications();

    const user =
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      );

    //
    // JOIN USER ROOM
    //
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

    //
    // RECEIVE LIVE NOTIFICATIONS
    //
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
          (prev) => prev + 1
        );

        //
        // REFRESH
        //
        fetchNotifications();

        fetchUnreadCount();
      }
    );

    //
    // CLEANUP
    //
    return () => {
      socket.off(
        "receive_notification"
      );
    };
  }, []);

  return (
    <nav
      style={{
        display: "flex",

        justifyContent:
          "space-between",

        alignItems: "center",

        padding: "18px 35px",

        background:
          "linear-gradient(to right, rgba(18,7,31,0.96), rgba(30,11,54,0.96), rgba(15,23,42,0.96))",

        color: "white",

        borderBottom:
          "1px solid rgba(255,255,255,0.08)",

        backdropFilter:
          "blur(16px)",

        position: "sticky",

        top: 0,

        zIndex: 1000,

        boxShadow:
          "0 8px 35px rgba(168,85,247,0.12)",
      }}
    >
      {/* LOGO */}
      <div>
        <h2
          style={{
            fontFamily:
              "'Cinzel', serif",

            fontSize: "36px",

            fontWeight: "700",

            letterSpacing: "3px",

            background:
              "linear-gradient(to right, #C084FC, #F472B6)",

            WebkitBackgroundClip:
              "text",

            WebkitTextFillColor:
              "transparent",

            textShadow:
              "0 0 30px rgba(244,114,182,0.3)",

            marginBottom: "4px",
          }}
        >
          BuildX ✨
        </h2>

        <p
          style={{
            color: "#D8B4FE",

            fontSize: "12px",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing: "1.5px",

            lineHeight: "1.7",
          }}
        >
          AI Collaboration Platform
        </p>
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          display: "flex",

          gap: "18px",

          alignItems: "center",

          position: "relative",
        }}
      >
        {[
          {
            name: "Dashboard",
            path: "/dashboard",
          },

          {
            name: "Ideas",
            path: "/ideas",
          },

          {
            name: "Projects",
            path: "/projects",
          },

          {
            name: "Requests",
            path:
              "/collaboration-requests",
          },

          {
            name: "Chat",
            path: "/chat",
          },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              color: "white",

              textDecoration:
                "none",

              padding:
                "10px 18px",

              borderRadius:
                "14px",

              fontWeight: "600",

              fontFamily:
                "'Cinzel', serif",

              letterSpacing: "1px",

              transition:
                "all 0.3s ease",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.06)",

              backdropFilter:
                "blur(10px)",

              boxShadow:
                "0 4px 18px rgba(168,85,247,0.08)",
            }}
          >
            {item.name}
          </Link>
        ))}

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
                (prev) => !prev
              )
            }
            style={{
              position:
                "relative",

              padding:
                "12px 16px",

              borderRadius:
                "16px",

              border:
                "1px solid rgba(255,255,255,0.08)",

              background:
                "rgba(255,255,255,0.05)",

              color: "white",

              cursor:
                "pointer",

              fontSize: "20px",

              backdropFilter:
                "blur(10px)",
            }}
          >
            🔔

            {unreadCount >
              0 && (
              <span
                style={{
                  position:
                    "absolute",

                  top: "-8px",

                  right:
                    "-8px",

                  background:
                    "#EC4899",

                  color:
                    "white",

                  borderRadius:
                    "50%",

                  width:
                    "22px",

                  height:
                    "22px",

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

                top: "70px",

                right: 0,

                width: "380px",

                maxHeight:
                  "500px",

                overflowY:
                  "auto",

                background:
                  "rgba(10,10,25,0.96)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                borderRadius:
                  "24px",

                padding:
                  "20px",

                backdropFilter:
                  "blur(20px)",

                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.45)",

                zIndex: 9999,
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "20px",

                  fontFamily:
                    "'Cinzel', serif",

                  fontSize:
                    "24px",
                }}
              >
                Notifications
              </h2>

              {notifications.length ===
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
                        notification._id
                      }
                      style={{
                        padding:
                          "16px",

                        borderRadius:
                          "18px",

                        marginBottom:
                          "14px",

                        background:
                          notification.isRead
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(124,58,237,0.14)",

                        border:
                          "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p
                        style={{
                          lineHeight:
                            "1.8",

                          marginBottom:
                            "10px",

                          color:
                            "white",
                        }}
                      >
                        {
                          notification.message
                        }
                      </p>

                      <p
                        style={{
                          color:
                            "#A5B4FC",

                          fontSize:
                            "13px",

                          marginBottom:
                            "12px",
                        }}
                      >
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>

                      <div
                        style={{
                          display:
                            "flex",

                          gap: "10px",
                        }}
                      >
                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markAsRead(
                                notification._id
                              )
                            }
                            style={{
                              padding:
                                "8px 14px",

                              borderRadius:
                                "12px",

                              border:
                                "none",

                              background:
                                "linear-gradient(to right, #8B5CF6, #EC4899)",

                              color:
                                "white",

                              cursor:
                                "pointer",

                              fontSize:
                                "12px",
                            }}
                          >
                            Mark Read
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteNotification(
                              notification._id
                            )
                          }
                          style={{
                            padding:
                              "8px 14px",

                            borderRadius:
                              "12px",

                            border:
                              "none",

                            background:
                              "rgba(239,68,68,0.18)",

                            color:
                              "#FCA5A5",

                            cursor:
                              "pointer",

                            fontSize:
                              "12px",
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

            border:
              "1px solid rgba(255,255,255,0.08)",

            color: "#F9A8D4",

            fontWeight: "bold",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing: "1px",

            fontSize: "13px",

            boxShadow:
              "0 6px 20px rgba(236,72,153,0.12)",
          }}
        >
          🤖 JARVIS ONLINE
        </div>

        {/* LOGOUT */}
        <button
          onClick={logoutHandler}
          style={{
            padding:
              "12px 22px",

            border: "none",

            borderRadius:
              "16px",

            cursor:
              "pointer",

            background:
              "linear-gradient(to right, #9333EA, #EC4899)",

            color: "white",

            fontWeight: "700",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing: "1px",

            fontSize: "13px",

            boxShadow:
              "0 8px 25px rgba(236,72,153,0.25)",

            transition:
              "all 0.3s ease",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;