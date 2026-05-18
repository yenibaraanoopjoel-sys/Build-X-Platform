import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const changeHandler = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const submitHandler = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await API.post(
          "/auth/login",
          formData
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent:
          "center",

        alignItems: "center",

        overflow: "hidden",

        position: "relative",

        background:
          "linear-gradient(135deg, #050816 0%, #0B1023 40%, #1E1B4B 100%)",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",

          width: "480px",

          height: "480px",

          background:
            "rgba(91,95,255,0.12)",

          borderRadius: "50%",

          filter: "blur(130px)",

          top: "-120px",

          left: "-120px",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "420px",

          height: "420px",

          background:
            "rgba(124,58,237,0.10)",

          borderRadius: "50%",

          filter: "blur(120px)",

          bottom: "-100px",

          right: "-100px",
        }}
      />

      {/* MAIN */}
      <div
        className="glass-card"
        style={{
          width: "95%",

          maxWidth: "1280px",

          display: "grid",

          gridTemplateColumns:
            "1fr 1fr",

          overflow: "hidden",

          position: "relative",

          zIndex: 2,
        }}
      >
        {/* LEFT */}
        <div
          style={{
            padding: "70px",

            position: "relative",

            display: "flex",

            flexDirection:
              "column",

            justifyContent:
              "center",

            background:
              "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.06))",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",

              width: "260px",

              height: "260px",

              borderRadius: "50%",

              background:
                "rgba(91,95,255,0.14)",

              filter: "blur(60px)",

              top: "80px",

              right: "80px",
            }}
          />

          {/* IMAGE */}
          <img
            src="https://i.pinimg.com/736x/1e/f7/15/1ef715518bfdfe0355a3f51b875b933d.jpg"
            alt="AI Assistant"
            style={{
              width: "100%",

              maxWidth: "220px",

              borderRadius: "24px",

              marginBottom: "40px",

              alignSelf: "center",

              boxShadow:
                "0 16px 40px rgba(91,95,255,0.18)",

              border:
                "1px solid rgba(255,255,255,0.06)",

              zIndex: 2,
            }}
          />

          {/* TITLE */}
          <h1
            className="welcome-title"
            style={{
              fontSize: "68px",

              lineHeight: "1.1",

              marginBottom: "24px",

              color: "white",

              zIndex: 2,
            }}
          >
            BUILDX
            <br />
            AI PLATFORM
          </h1>

          {/* DESC */}
          <p
            style={{
              color: "#CBD5E1",

              fontSize: "18px",

              lineHeight: "2",

              maxWidth: "540px",

              zIndex: 2,
            }}
          >
            The next-generation
            AI-powered collaboration
            and productivity platform
            for creators, developers,
            innovators, and modern
            startup teams.
          </p>

          {/* FEATURES */}
          <div
            style={{
              marginTop: "42px",

              display: "flex",

              flexWrap: "wrap",

              gap: "14px",

              zIndex: 2,
            }}
          >
            {[
              "AI Assistant",
              "AI Tasks",
              "AI Meetings",
              "Video Calls",
              "Collaboration",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding:
                    "11px 18px",

                  borderRadius:
                    "14px",

                  background:
                    "rgba(255,255,255,0.04)",

                  border:
                    "1px solid rgba(255,255,255,0.06)",

                  color:
                    "#E2E8F0",

                  fontSize:
                    "14px",

                  backdropFilter:
                    "blur(10px)",
                }}
              >
                ✨ {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            padding: "70px",

            display: "flex",

            flexDirection:
              "column",

            justifyContent:
              "center",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              marginBottom: "38px",
            }}
          >
            <h1
              className="section-title"
              style={{
                fontSize: "52px",

                marginBottom: "14px",

                color: "white",
              }}
            >
              Welcome Back
            </h1>

            <p
              style={{
                color: "#CBD5E1",

                fontSize: "16px",

                lineHeight: "1.8",
              }}
            >
              Login to continue your
              futuristic AI-powered
              productivity journey.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={
              submitHandler
            }
          >
            {/* EMAIL */}
            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  color:
                    "#E2E8F0",

                  fontSize: "15px",

                  fontWeight:
                    "600",
                }}
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={
                  formData.email
                }
                onChange={
                  changeHandler
                }
                required
                style={{
                  width: "100%",

                  marginTop: "10px",

                  padding: "16px",

                  borderRadius:
                    "16px",

                  fontSize:
                    "15px",
                }}
              />
            </div>

            {/* PASSWORD */}
            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <label
                style={{
                  color:
                    "#E2E8F0",

                  fontSize: "15px",

                  fontWeight:
                    "600",
                }}
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={
                  formData.password
                }
                onChange={
                  changeHandler
                }
                required
                style={{
                  width: "100%",

                  marginTop: "10px",

                  padding: "16px",

                  borderRadius:
                    "16px",

                  fontSize:
                    "15px",
                }}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",

                padding: "16px",

                borderRadius:
                  "18px",

                background:
                  "linear-gradient(135deg, #2563EB, #7C3AED)",

                color:
                  "white",

                fontSize:
                  "15px",

                fontWeight:
                  "600",

                boxShadow:
                  "0 0 24px rgba(124,58,237,0.22)",
              }}
            >
              {loading
                ? "Entering BuildX..."
                : "Enter BuildX"}
            </button>
          </form>

          {/* FOOTER */}
          <p
            style={{
              textAlign: "center",

              marginTop: "28px",

              color: "#CBD5E1",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#C4B5FD",

                textDecoration:
                  "none",

                fontWeight:
                  "600",
              }}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;