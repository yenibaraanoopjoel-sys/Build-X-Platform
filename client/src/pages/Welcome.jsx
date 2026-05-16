import "@fontsource/cinzel";

import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate("/login")
      }
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent:
          "center",

        alignItems: "center",

        background:
          "linear-gradient(to bottom right, #12071F, #1E0B36, #0F172A)",

        overflow: "hidden",

        position: "relative",

        cursor: "pointer",
      }}
    >
      {/* Glow Effect 1 */}
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

      {/* Glow Effect 2 */}
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

      {/* Main Content */}
      <div
        style={{
          textAlign: "center",

          zIndex: 2,

          animation:
            "fadeIn 1.8s ease",
        }}
      >
        <h1
          style={{
            fontFamily:
              "'Cinzel', serif",

            fontSize: "120px",

            fontWeight: "700",

            letterSpacing: "8px",

            marginBottom: "20px",

            background:
              "linear-gradient(to right, #C084FC, #F472B6)",

            WebkitBackgroundClip:
              "text",

            WebkitTextFillColor:
              "transparent",

            textShadow:
              "0 0 40px rgba(244,114,182,0.35)",
          }}
        >
          BuildX
        </h1>

        <p
          style={{
            color: "#E9D5FF",

            fontSize: "22px",

            letterSpacing: "3px",

            fontFamily:
              "'Cinzel', serif",

            marginBottom: "40px",
          }}
        >
          FUTURISTIC AI PRODUCTIVITY
          PLATFORM
        </p>

        <button
          style={{
            padding:
              "18px 40px",

            border: "none",

            borderRadius:
              "20px",

            background:
              "linear-gradient(to right, #9333EA, #EC4899)",

            color: "white",

            fontSize: "16px",

            fontWeight: "700",

            fontFamily:
              "'Cinzel', serif",

            letterSpacing: "2px",

            cursor: "pointer",

            boxShadow:
              "0 10px 35px rgba(236,72,153,0.30)",
          }}
        >
          ENTER BUILDX ✨
        </button>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }

            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Welcome;