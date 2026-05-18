import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg, #050816 0%, #0B1023 45%, #1E1B4B 100%)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "20px",

        color: "white",

        overflow: "hidden",

        position: "relative",
      }}
    >
      {/* Glow 1 */}
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

      {/* Glow 2 */}
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

      {/* Main Card */}
      <div
        className="glass-card"
        style={{
          textAlign: "center",

          maxWidth: "720px",

          width: "100%",

          padding: "70px 50px",

          position: "relative",

          overflow: "hidden",

          zIndex: 2,
        }}
      >
        {/* Internal Glow */}
        <div
          style={{
            position: "absolute",

            width: "260px",

            height: "260px",

            background:
              "rgba(91,95,255,0.10)",

            borderRadius: "50%",

            filter: "blur(90px)",

            top: "-70px",

            right: "-60px",
          }}
        />

        {/* LABEL */}
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

            marginBottom: "36px",

            backdropFilter:
              "blur(14px)",

            color: "#CBD5E1",

            fontSize: "14px",

            letterSpacing: "1px",

            position: "relative",

            zIndex: 2,
          }}
        >
          ⚠ SYSTEM NAVIGATION ERROR
        </div>

        {/* ERROR CODE */}
        <h1
          className="welcome-title"
          style={{
            fontSize: "150px",

            marginBottom: "10px",

            lineHeight: "1",

            color: "white",

            letterSpacing: "6px",

            textShadow:
              "0 0 40px rgba(91,95,255,0.18)",

            position: "relative",

            zIndex: 2,
          }}
        >
          404
        </h1>

        {/* HEADING */}
        <h2
          className="section-title"
          style={{
            fontSize: "46px",

            marginBottom: "20px",

            color: "white",

            position: "relative",

            zIndex: 2,
          }}
        >
          PAGE NOT FOUND
        </h2>

        {/* DESCRIPTION */}
        <p
          style={{
            color: "#CBD5E1",

            lineHeight: "2",

            marginBottom: "42px",

            fontSize: "18px",

            maxWidth: "560px",

            marginInline: "auto",

            position: "relative",

            zIndex: 2,
          }}
        >
          The requested BuildX
          workspace or AI route could
          not be located. The page may
          have been moved, deleted, or
          is temporarily unavailable.
        </p>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",

            justifyContent:
              "center",

            gap: "18px",

            flexWrap: "wrap",

            position: "relative",

            zIndex: 2,
          }}
        >
          {/* Dashboard */}
          <Link
            to="/dashboard"
            style={{
              padding:
                "16px 32px",

              borderRadius:
                "18px",

              textDecoration:
                "none",

              background:
                "linear-gradient(135deg, #2563EB, #7C3AED)",

              color: "white",

              fontWeight:
                "600",

              fontSize:
                "15px",

              boxShadow:
                "0 0 24px rgba(124,58,237,0.24)",
            }}
          >
            Open Dashboard
          </Link>

          {/* Login */}
          <Link
            to="/login"
            style={{
              padding:
                "16px 32px",

              borderRadius:
                "18px",

              textDecoration:
                "none",

              border:
                "1px solid rgba(255,255,255,0.10)",

              background:
                "rgba(255,255,255,0.04)",

              backdropFilter:
                "blur(14px)",

              color: "white",

              fontWeight:
                "600",

              fontSize:
                "15px",
            }}
          >
            Return to Login
          </Link>
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: "42px",

            color: "#64748B",

            fontSize: "14px",

            letterSpacing: "1px",

            position: "relative",

            zIndex: 2,
          }}
        >
          BUILDX AI PRODUCTIVITY
          ECOSYSTEM
        </p>
      </div>
    </div>
  );
}

export default NotFound;