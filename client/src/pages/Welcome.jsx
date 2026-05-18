import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg, #050816 0%, #0B1023 45%, #1E1B4B 100%)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        overflow: "hidden",

        position: "relative",
      }}
    >
      {/* Glow 1 */}
      <div
        style={{
          position: "absolute",

          width: "600px",

          height: "600px",

          background:
            "rgba(59,130,246,0.14)",

          borderRadius: "50%",

          filter: "blur(150px)",

          top: "-220px",

          left: "-180px",
        }}
      />

      {/* Glow 2 */}
      <div
        style={{
          position: "absolute",

          width: "500px",

          height: "500px",

          background:
            "rgba(124,58,237,0.14)",

          borderRadius: "50%",

          filter: "blur(140px)",

          bottom: "-180px",

          right: "-150px",
        }}
      />

      {/* Grid Overlay */}
      <div
        style={{
          position: "absolute",

          inset: 0,

          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",

          backgroundSize:
            "80px 80px",

          maskImage:
            "radial-gradient(circle at center, black, transparent 85%)",
        }}
      />

      {/* MAIN */}
      <div
        style={{
          textAlign: "center",

          zIndex: 2,

          maxWidth: "1100px",

          padding: "40px",

          animation:
            "fadeUp 1.5s ease",
        }}
      >
        {/* SMALL LABEL */}
        <div
          style={{
            display: "inline-flex",

            alignItems: "center",

            gap: "10px",

            padding: "12px 22px",

            borderRadius: "40px",

            background:
              "rgba(255,255,255,0.05)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            marginBottom: "42px",

            backdropFilter:
              "blur(14px)",

            color: "#CBD5E1",

            fontSize: "14px",

            letterSpacing: "1px",
          }}
        >
          ✨ NEXT GENERATION AI
          COLLABORATION PLATFORM
        </div>

        {/* TITLE */}
        <h1
          className="welcome-title"
          style={{
            fontSize: "140px",

            lineHeight: "1",

            marginBottom: "28px",

            color: "white",

            letterSpacing: "10px",

            textShadow:
              "0 0 40px rgba(91,95,255,0.18)",
          }}
        >
          BUILDX
        </h1>

        {/* SUBTITLE */}
        <h2
          className="section-title"
          style={{
            fontSize: "42px",

            marginBottom: "28px",

            color: "#E2E8F0",

            letterSpacing: "1px",
          }}
        >
          AI POWERED PRODUCTIVITY
          ECOSYSTEM
        </h2>

        {/* DESCRIPTION */}
        <p
          style={{
            color: "#CBD5E1",

            fontSize: "20px",

            lineHeight: "2",

            maxWidth: "900px",

            margin:
              "0 auto 52px auto",
          }}
        >
          Build futuristic startups,
          collaborate with creators,
          generate AI workflows,
          manage intelligent
          productivity systems, and
          scale innovative ideas
          inside a premium next-gen
          AI workspace.
        </p>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",

            justifyContent:
              "center",

            gap: "22px",

            flexWrap: "wrap",
          }}
        >
          {/* ENTER */}
          <button
            onClick={() =>
              navigate("/login")
            }
            style={{
              padding:
                "18px 42px",

              borderRadius:
                "20px",

              border: "none",

              background:
                "linear-gradient(135deg, #2563EB, #7C3AED)",

              color: "white",

              fontSize: "15px",

              fontWeight: "700",

              letterSpacing:
                "1px",

              cursor: "pointer",

              boxShadow:
                "0 0 28px rgba(124,58,237,0.24)",
            }}
          >
            ENTER BUILDX
          </button>

          {/* REGISTER */}
          <button
            onClick={() =>
              navigate("/register")
            }
            style={{
              padding:
                "18px 42px",

              borderRadius:
                "20px",

              border:
                "1px solid rgba(255,255,255,0.10)",

              background:
                "rgba(255,255,255,0.04)",

              backdropFilter:
                "blur(14px)",

              color: "white",

              fontSize: "15px",

              fontWeight: "700",

              letterSpacing:
                "1px",

              cursor: "pointer",
            }}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* FEATURES */}
        <div
          style={{
            marginTop: "80px",

            display: "flex",

            justifyContent:
              "center",

            flexWrap: "wrap",

            gap: "18px",
          }}
        >
          {[
            "AI Assistant",
            "AI Meetings",
            "AI Tasks",
            "Startup Builder",
            "Video Collaboration",
            "Productivity Workspace",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding:
                  "14px 20px",

                borderRadius:
                  "18px",

                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color: "#E2E8F0",

                fontSize: "14px",

                backdropFilter:
                  "blur(12px)",
              }}
            >
              ✨ {item}
            </div>
          ))}
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Welcome;