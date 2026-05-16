import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #020617, #0F172A, #111827)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        color: "white",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          background: "rgba(255,255,255,0.05)",
          padding: "50px",
          borderRadius: "24px",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.35)",
        }}
      >
        {/* Error Code */}
        <h1
          style={{
            fontSize: "120px",
            marginBottom: "10px",
            background:
              "linear-gradient(to right, #2563EB, #7C3AED)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>

        {/* Heading */}
        <h2
          style={{
            fontSize: "32px",
            marginBottom: "15px",
          }}
        >
          Page Not Found
        </h2>

        {/* Description */}
        <p
          style={{
            color: "#CBD5E1",
            lineHeight: "1.8",
            marginBottom: "30px",
            fontSize: "17px",
          }}
        >
          The page you are looking for does not
          exist or may have been moved.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          {/* Dashboard Button */}
          <Link
            to="/dashboard"
            style={{
              padding: "14px 28px",
              borderRadius: "10px",
              textDecoration: "none",
              background:
                "linear-gradient(to right, #2563EB, #7C3AED)",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Go to Dashboard
          </Link>

          {/* Login Button */}
          <Link
            to="/login"
            style={{
              padding: "14px 28px",
              borderRadius: "10px",
              textDecoration: "none",
              border:
                "1px solid rgba(255,255,255,0.15)",
              color: "white",
            }}
          >
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;