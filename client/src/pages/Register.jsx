import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
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
          "/auth/register",
          formData
        );

      console.log(
        "REGISTER SUCCESS:",
        response.data
      );

      alert(
        "Registration Successful"
      );

      navigate("/login");
    } catch (error) {
      console.log(
        "REGISTER ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data
          ?.message ||
          "Registration Failed"
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

          width: "500px",

          height: "500px",

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

          width: "450px",

          height: "450px",

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

          maxWidth: "1300px",

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

              top: "70px",

              right: "70px",
            }}
          />

          {/* IMAGE */}
          <img
            src="https://i.pinimg.com/736x/01/20/fc/0120fc063ac388e21329941114d7d01e.jpg"
            alt="AI Assistant"
            style={{
              width: "100%",

              maxWidth: "300px",

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
              fontSize: "70px",

              lineHeight: "1.1",

              marginBottom: "24px",

              color: "white",

              zIndex: 2,
            }}
          >
            JOIN
            <br />
            BUILDX
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
            Create your futuristic
            AI-powered workspace and
            collaborate with creators,
            innovators, developers,
            and modern startup teams.
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
                    "12px 18px",

                  borderRadius:
                    "16px",

                  background:
                    "rgba(255,255,255,0.05)",

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
              Create Account
            </h1>

            <p
              style={{
                color: "#CBD5E1",

                fontSize: "16px",

                lineHeight: "1.8",
              }}
            >
              Start your AI-powered
              BuildX productivity
              journey today.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={
              submitHandler
            }
          >
            {/* NAME */}
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
                Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={
                  formData.name
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
                placeholder="Create a password"
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

                padding: "17px",

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
                ? "Creating Account..."
                : "Create Account"}
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
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#C4B5FD",

                textDecoration:
                  "none",

                fontWeight:
                  "600",
              }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;