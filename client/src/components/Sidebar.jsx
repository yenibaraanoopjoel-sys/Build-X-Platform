import "@fontsource/cinzel";

import {
  Link,
  useLocation,
} from "react-router-dom";

function Sidebar() {
  const location =
    useLocation();

  //
  // MENU ITEMS
  //
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },

    {
      name: "Ideas",
      path: "/ideas",
      icon: "💡",
    },

    {
      name: "Skill Swap",
      path: "/skill-swap",
      icon: "🔄",
    },

    {
      name: "Projects",
      path: "/projects",
      icon: "🛠️",
    },

    {
      name: "Tasks",
      path: "/tasks",
      icon: "✅",
    },

    {
      name: "Requests",
      path:
        "/collaboration-requests",
      icon: "📨",
    },

    {
      name: "Chat",
      path: "/chat",
      icon: "💬",
    },

    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
    },

    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
    },
  ];

  return (
    <div
      style={{
        width: "270px",

        minHeight: "100vh",

        background:
          "linear-gradient(to bottom, #12071F, #1E0B36, #0F172A)",

        color: "white",

        padding: "30px 22px",

        borderRight:
          "1px solid rgba(255,255,255,0.08)",

        backdropFilter:
          "blur(18px)",

        position: "sticky",

        top: 0,

        boxShadow:
          "8px 0 40px rgba(168,85,247,0.15)",

        overflowY: "auto",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          marginBottom: "45px",
        }}
      >
        <h2
          style={{
            fontSize: "40px",

            fontFamily:
              "'Cinzel', serif",

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
          }}
        >
          BuildX ✨
        </h2>

        <p
          style={{
            color: "#D8B4FE",

            marginTop: "12px",

            fontSize: "13px",

            lineHeight: "1.8",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing: "1px",
          }}
        >
          Luxury AI Productivity
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

                  gap: "15px",

                  padding:
                    "16px 20px",

                  borderRadius:
                    "18px",

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

                {
                  item?.name
                }
              </Link>
            );
          }
        )}
      </div>

      {/* AI CARD */}
      <div
        style={{
          marginTop: "45px",

          padding: "24px",

          borderRadius:
            "24px",

          background:
            "linear-gradient(to right, rgba(147,51,234,0.18), rgba(236,72,153,0.18))",

          border:
            "1px solid rgba(255,255,255,0.08)",

          boxShadow:
            "0 10px 35px rgba(168,85,247,0.12)",
        }}
      >
        <h3
          style={{
            marginBottom:
              "14px",

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
          🤖 JARVIS AI
        </h3>

        <p
          style={{
            color: "#E9D5FF",

            fontSize: "14px",

            lineHeight: "1.8",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing:
              "0.5px",
          }}
        >
          Your luxury AI-powered
          productivity assistant
          for futuristic BuildX
          collaboration.
        </p>
      </div>
    </div>
  );
}

export default Sidebar;