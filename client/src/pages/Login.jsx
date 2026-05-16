import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "@fontsource/dancing-script";

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
          "linear-gradient(to bottom right, #12071F, #1E0B36, #0F172A)",
      }}
    >
      {/* Animated Glow */}
      <div
        style={{
          position: "absolute",

          width: "500px",

          height: "500px",

          background:
            "rgba(168,85,247,0.18)",

          borderRadius: "50%",

          filter: "blur(120px)",

          top: "-120px",

          left: "-120px",
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "450px",

          height: "450px",

          background:
            "rgba(236,72,153,0.18)",

          borderRadius: "50%",

          filter: "blur(120px)",

          bottom: "-100px",

          right: "-100px",
        }}
      />

      {/* Main Container */}
      <div
        style={{
          width: "95%",

          maxWidth: "1300px",

          display: "grid",

          gridTemplateColumns:
            "1fr 1fr",

          background:
            "rgba(255,255,255,0.05)",

          backdropFilter:
            "blur(20px)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          borderRadius: "34px",

          overflow: "hidden",

          boxShadow:
            "0 20px 60px rgba(168,85,247,0.18)",

          zIndex: 2,
        }}
      >
        {/* Left Side */}
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
              "linear-gradient(to bottom right, rgba(147,51,234,0.15), rgba(236,72,153,0.12))",
          }}
        >
          {/* AI Image */}
          <img
            src="https://i.pinimg.com/736x/1e/f7/15/1ef715518bfdfe0355a3f51b875b933d.jpg"
            alt="AI Assistant"
            style={{
              width: "200%",

              maxWidth: "200px",

              borderRadius: "24px",

              marginBottom: "35px",

              alignSelf: "center",

              boxShadow:
                "0 20px 50px rgba(236,72,153,0.22)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              zIndex: 2,
            }}
          />

          {/* Floating AI Circle */}
          <div
            style={{
              position: "absolute",

              width: "260px",

              height: "260px",

              borderRadius: "50%",

              background:
                "linear-gradient(to right, rgba(192,132,252,0.28), rgba(244,114,182,0.25))",

              filter: "blur(20px)",

              top: "60px",

              right: "60px",
            }}
          />

          <h1
            style={{
              fontSize: "78px",

              fontFamily:
                "'Dancing Script', cursive",

              lineHeight: "1.1",

              marginBottom: "25px",

              background:
                "linear-gradient(to right, #C084FC, #F472B6)",

              WebkitBackgroundClip:
                "text",

              WebkitTextFillColor:
                "transparent",

              zIndex: 2,
            }}
          >
            BuildX
            <br />
            AI Platform ✨
          </h1>

          <p
            style={{
              color: "#E9D5FF",

              fontSize: "20px",

              lineHeight: "1.9",

              maxWidth: "520px",

              zIndex: 2,
            }}
          >
            The next-generation
            AI-powered collaboration
            and productivity platform
            designed for creators,
            developers, innovators,
            and startup teams.
          </p>

          {/* AI Feature Cards */}
          <div
            style={{
              marginTop: "40px",

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
                    "12px 18px",

                  borderRadius:
                    "16px",

                  background:
                    "rgba(255,255,255,0.06)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  color:
                    "#F5D0FE",

                  backdropFilter:
                    "blur(10px)",
                }}
              >
                ✨ {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
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
          {/* Header */}
          <div
            style={{
              marginBottom: "35px",
            }}
          >
            <h1
              style={{
                fontSize: "52px",

                fontFamily:
                  "'Dancing Script', cursive",

                marginBottom: "14px",

                background:
                  "linear-gradient(to right, #C084FC, #F472B6)",

                WebkitBackgroundClip:
                  "text",

                WebkitTextFillColor:
                  "transparent",
              }}
            >
              Welcome Back 👋
            </h1>

            <p
              style={{
                color: "#D8B4FE",

                fontSize: "17px",
              }}
            >
              Login to continue your
              AI-powered productivity
              journey.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={
              submitHandler
            }
          >
            {/* Email */}
            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  color:
                    "#F5D0FE",

                  fontSize: "18px",

                  fontWeight: "600",
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

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  outline: "none",

                  background:
                    "rgba(255,255,255,0.05)",

                  color:
                    "white",

                  backdropFilter:
                    "blur(10px)",

                  fontSize:
                    "17px",
                }}
              />
            </div>

            {/* Password */}
            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <label
                style={{
                  color:
                    "#F5D0FE",

                  fontSize: "18px",

                  fontWeight: "600",
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

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  outline: "none",

                  background:
                    "rgba(255,255,255,0.05)",

                  color:
                    "white",

                  backdropFilter:
                    "blur(10px)",

                  fontSize:
                    "17px",
                }}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",

                padding: "17px",

                borderRadius:
                  "18px",

                border: "none",

                cursor:
                  "pointer",

                background:
                  "linear-gradient(to right, #9333EA, #EC4899)",

                color:
                  "white",

                fontSize:
                  "17px",

                fontWeight:
                  "bold",

                boxShadow:
                  "0 10px 30px rgba(236,72,153,0.25)",

                transition:
                  "0.3s ease",
              }}
            >
              {loading
                ? "Entering BuildX..."
                : "🚀 Enter BuildX"}
            </button>
          </form>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",

              marginTop: "28px",

              color: "#D8B4FE",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#F472B6",

                textDecoration:
                  "none",

                fontWeight:
                  "bold",
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