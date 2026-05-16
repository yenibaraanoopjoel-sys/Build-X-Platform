import "@fontsource/cinzel";

import {
  Link,
  useNavigate,
} from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

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
      {/* Logo */}
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

      {/* Navigation */}
      <div
        style={{
          display: "flex",

          gap: "18px",

          alignItems: "center",
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

        {/* AI Status */}
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

        {/* Logout */}
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