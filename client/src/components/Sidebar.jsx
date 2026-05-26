import "@fontsource/cinzel";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import API from "../services/api";

function Sidebar() {
  const location =
    useLocation();

  //
  // TOKEN
  //
  const token =
    localStorage.getItem(
      "token"
    );

  //
  // BADGES
  //
  const [
    unreadNotifications,
    setUnreadNotifications,
  ] = useState(0);

  const [
    pendingRequests,
    setPendingRequests,
  ] = useState(0);

  //
  // FETCH COUNTS
  //
  const fetchCounts =
    useCallback(
      async () => {
        try {
          if (!token)
            return;

          //
          // NOTIFICATIONS
          //
          const notificationRes =
            await API.get(
              "/notifications/unread-count",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          if (
            notificationRes
              ?.data
              ?.success
          ) {
            setUnreadNotifications(
              notificationRes
                .data
                .unreadCount || 0
            );
          }

          //
          // REQUESTS
          //
          const requestRes =
            await API.get(
              "/collaborations/received",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          if (
            requestRes?.data
              ?.success
          ) {
            const pending =
              Array.isArray(
                requestRes
                  .data
                  .requests
              )
                ? requestRes.data.requests.filter(
                    (
                      request
                    ) =>
                      request?.status ===
                      "Pending"
                  ).length
                : 0;

            setPendingRequests(
              pending
            );
          }
        } catch (error) {
          console.log(
            "SIDEBAR ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );

          setUnreadNotifications(
            0
          );

          setPendingRequests(
            0
          );
        }
      },
      [token]
    );

  //
  // LOAD COUNTS
  //
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  //
  // MENU ITEMS
  //
  const menuItems = [
    {
      name:
        "Dashboard",

      path:
        "/dashboard",

      icon: "🏠",
    },

    {
      name: "Ideas",

      path:
        "/ideas",

      icon: "💡",
    },

    {
      name:
        "Skill Swap",

      path:
        "/skill-swap",

      icon: "🔄",
    },

    {
      name:
        "Projects",

      path:
        "/projects",

      icon: "🛠️",
    },

    {
      name: "Tasks",

      path:
        "/tasks",

      icon: "✅",
    },

    {
      name:
        "Requests",

      path:
        "/collaboration-requests",

      icon: "📨",

      badge:
        pendingRequests,
    },

    {
      name: "Chat",

      path:
        "/chat",

      icon: "💬",
    },

    {
      name:
        "Profile",

      path:
        "/profile",

      icon: "👤",
    },

    {
      name:
        "Settings",

      path:
        "/settings",

      icon: "⚙️",
    },
  ];

  return (
    <div
      style={{
        width: "290px",

        minHeight:
          "100vh",

        background:
          "linear-gradient(to bottom, #12071F, #1E0B36, #0F172A)",

        color:
          "white",

        padding:
          "30px 22px",

        borderRight:
          "1px solid rgba(255,255,255,0.08)",

        backdropFilter:
          "blur(18px)",

        position:
          "sticky",

        top: 0,

        boxShadow:
          "8px 0 40px rgba(168,85,247,0.15)",

        overflowY:
          "auto",

        overflowX:
          "hidden",
      }}
    >
      {/* GLOW */}
      <div
        style={{
          position:
            "absolute",

          width: "220px",

          height: "220px",

          background:
            "rgba(168,85,247,0.10)",

          borderRadius:
            "50%",

          filter:
            "blur(100px)",

          top: "-60px",

          left: "-60px",

          zIndex: 0,
        }}
      />

      {/* LOGO */}
      <div
        style={{
          marginBottom:
            "48px",

          position:
            "relative",

          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontSize: "42px",

            fontFamily:
              "'Cinzel', serif",

            fontWeight:
              "700",

            letterSpacing:
              "3px",

            background:
              "linear-gradient(to right, #C084FC, #F472B6)",

            WebkitBackgroundClip:
              "text",

            WebkitTextFillColor:
              "transparent",

            textShadow:
              "0 0 30px rgba(244,114,182,0.3)",
          }}
        >
          BuildX ✨
        </h2>

        <p
          style={{
            color:
              "#D8B4FE",

            marginTop:
              "12px",

            fontSize:
              "13px",

            lineHeight:
              "1.8",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing:
              "1px",
          }}
        >
          Luxury AI
          Productivity
          Platform
        </p>
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          display: "flex",

          flexDirection:
            "column",

          gap: "16px",

          position:
            "relative",

          zIndex: 2,
        }}
      >
        {menuItems.map(
          (item) => {
            const active =
              location?.pathname ===
              item?.path;

            return (
              <Link
                key={
                  item?.path
                }
                to={
                  item?.path
                }
                style={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "space-between",

                  gap: "15px",

                  padding:
                    "16px 20px",

                  borderRadius:
                    "20px",

                  textDecoration:
                    "none",

                  color:
                    "white",

                  fontWeight:
                    "600",

                  fontFamily:
                    "'Cinzel', serif",

                  letterSpacing:
                    "1px",

                  transition:
                    "all 0.35s ease",

                  background:
                    active
                      ? "linear-gradient(to right, #9333EA, #EC4899)"
                      : "rgba(255,255,255,0.05)",

                  border:
                    active
                      ? "1px solid rgba(236,72,153,0.35)"
                      : "1px solid rgba(255,255,255,0.06)",

                  boxShadow:
                    active
                      ? "0 10px 30px rgba(236,72,153,0.28)"
                      : "none",

                  transform:
                    active
                      ? "scale(1.04)"
                      : "scale(1)",
                }}
              >
                {/* LEFT */}
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: "14px",
                  }}
                >
                  <span
                    style={{
                      fontSize:
                        "21px",
                    }}
                  >
                    {
                      item?.icon
                    }
                  </span>

                  <span>
                    {
                      item?.name
                    }
                  </span>
                </div>

                {/* BADGE */}
                {item?.badge >
                  0 && (
                  <div
                    style={{
                      minWidth:
                        "24px",

                      height:
                        "24px",

                      padding:
                        "0 8px",

                      borderRadius:
                        "50px",

                      background:
                        "#EC4899",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      fontSize:
                        "12px",

                      fontWeight:
                        "bold",

                      color:
                        "white",

                      boxShadow:
                        "0 0 20px rgba(236,72,153,0.35)",
                    }}
                  >
                    {
                      item.badge
                    }
                  </div>
                )}
              </Link>
            );
          }
        )}
      </div>

      {/* NOTIFICATION CARD */}
      <div
        style={{
          marginTop:
            "38px",

          padding:
            "20px",

          borderRadius:
            "24px",

          background:
            "linear-gradient(to right, rgba(147,51,234,0.18), rgba(236,72,153,0.18))",

          border:
            "1px solid rgba(255,255,255,0.08)",

          boxShadow:
            "0 10px 35px rgba(168,85,247,0.12)",

          position:
            "relative",

          zIndex: 2,
        }}
      >
        <h3
          style={{
            marginBottom:
              "12px",

            fontSize:
              "22px",

            color:
              "#F9A8D4",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing:
              "1px",
          }}
        >
          🔔 Notifications
        </h3>

        <p
          style={{
            color:
              "#E9D5FF",

            fontSize:
              "14px",

            lineHeight:
              "1.8",

            fontFamily:
              "'Cinzel', serif",
          }}
        >
          You currently have{" "}
          <strong>
            {
              unreadNotifications
            }
          </strong>{" "}
          unread notifications
          and{" "}
          <strong>
            {
              pendingRequests
            }
          </strong>{" "}
          pending collaboration
          requests.
        </p>
      </div>

      {/* AI CARD */}
      <div
        style={{
          marginTop:
            "28px",

          padding:
            "24px",

          borderRadius:
            "24px",

          background:
            "linear-gradient(to right, rgba(59,130,246,0.14), rgba(124,58,237,0.14))",

          border:
            "1px solid rgba(255,255,255,0.08)",

          boxShadow:
            "0 10px 35px rgba(59,130,246,0.12)",

          position:
            "relative",

          zIndex: 2,
        }}
      >
        <h3
          style={{
            marginBottom:
              "14px",

            fontSize:
              "22px",

            color:
              "#BFDBFE",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing:
              "1px",
          }}
        >
          🤖 JARVIS AI
        </h3>

        <p
          style={{
            color:
              "#DBEAFE",

            fontSize:
              "14px",

            lineHeight:
              "1.8",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing:
              "0.5px",
          }}
        >
          Your futuristic AI
          productivity assistant
          helping you manage
          collaboration,
          analytics, workflow,
          and innovation inside
          BuildX.
        </p>
      </div>
    </div>
  );
}

export default Sidebar;