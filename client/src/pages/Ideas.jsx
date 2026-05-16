import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import "@fontsource/dancing-script";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

function Ideas() {
  const [ideas, setIdeas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // Fetch Ideas
  const fetchIdeas = async () => {
    try {
      const response =
        await API.get("/ideas");

      setIdeas(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Loading
  if (loading) {
    return <Loader />;
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom right, #12071F, #1E0B36, #0F172A)",

        minHeight: "100vh",

        color: "white",

        overflow: "hidden",

        position: "relative",
      }}
    >
      {/* Background Glow */}
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

      {/* Navbar */}
      <Navbar />

      <div
        style={{
          display: "flex",

          position: "relative",

          zIndex: 2,
        }}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <div
          style={{
            flex: 1,

            padding: "40px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              flexWrap: "wrap",

              gap: "20px",

              marginBottom: "45px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "72px",

                  fontFamily:
                    "'Dancing Script', cursive",

                  marginBottom: "12px",

                  background:
                    "linear-gradient(to right, #C084FC, #F472B6)",

                  WebkitBackgroundClip:
                    "text",

                  WebkitTextFillColor:
                    "transparent",
                }}
              >
                Explore Ideas ✨
              </h1>

              <p
                style={{
                  color: "#E9D5FF",

                  fontSize: "19px",

                  lineHeight: "1.8",

                  maxWidth: "700px",
                }}
              >
                Discover innovative
                startup concepts,
                AI-powered creations,
                futuristic workflows,
                and visionary ideas
                from creators around
                the world.
              </p>
            </div>

            {/* Post Button */}
            <Link
              to="/post-idea"
              style={{
                padding:
                  "16px 28px",

                borderRadius:
                  "18px",

                background:
                  "linear-gradient(to right, #9333EA, #EC4899)",

                color: "white",

                textDecoration:
                  "none",

                fontWeight:
                  "bold",

                fontSize: "17px",

                boxShadow:
                  "0 10px 35px rgba(236,72,153,0.25)",

                transition:
                  "0.3s ease",
              }}
            >
              🚀 Post New Idea
            </Link>
          </div>

          {/* Empty State */}
          {ideas.length === 0 ? (
            <div
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                padding: "60px",

                borderRadius: "32px",

                textAlign: "center",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(16px)",

                boxShadow:
                  "0 10px 40px rgba(168,85,247,0.12)",
              }}
            >
              <h2
                style={{
                  fontSize: "42px",

                  marginBottom: "18px",

                  fontFamily:
                    "'Dancing Script', cursive",

                  background:
                    "linear-gradient(to right, #C084FC, #F472B6)",

                  WebkitBackgroundClip:
                    "text",

                  WebkitTextFillColor:
                    "transparent",
                }}
              >
                No Ideas Yet 💡
              </h2>

              <p
                style={{
                  color: "#D8B4FE",

                  fontSize: "18px",
                }}
              >
                Be the first creator
                to share an innovative
                AI-powered idea on
                BuildX.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",

                flexDirection:
                  "column",

                gap: "28px",
              }}
            >
              {ideas.map((idea) => (
                <div
                  key={idea._id}
                  style={{
                    background:
                      "rgba(255,255,255,0.05)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    borderRadius:
                      "30px",

                    padding: "34px",

                    backdropFilter:
                      "blur(16px)",

                    boxShadow:
                      "0 10px 40px rgba(168,85,247,0.10)",

                    transition:
                      "0.3s ease",
                  }}
                >
                  {/* Title */}
                  <h2
                    style={{
                      fontSize: "40px",

                      marginBottom: "18px",

                      fontFamily:
                        "'Dancing Script', cursive",

                      background:
                        "linear-gradient(to right, #F5D0FE, #F9A8D4)",

                      WebkitBackgroundClip:
                        "text",

                      WebkitTextFillColor:
                        "transparent",
                    }}
                  >
                    {idea.title}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      color: "#E2E8F0",

                      fontSize: "18px",

                      lineHeight: "1.9",

                      marginBottom: "28px",
                    }}
                  >
                    {idea.description}
                  </p>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",

                      flexWrap: "wrap",

                      gap: "14px",

                      marginBottom: "26px",
                    }}
                  >
                    {idea.tags &&
                      idea.tags.map(
                        (
                          tag,
                          index
                        ) => (
                          <span
                            key={index}
                            style={{
                              padding:
                                "10px 16px",

                              borderRadius:
                                "30px",

                              background:
                                "rgba(147,51,234,0.18)",

                              color:
                                "#F5D0FE",

                              fontSize:
                                "14px",

                              fontWeight:
                                "bold",

                              border:
                                "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            ✨ {tag}
                          </span>
                        )
                      )}
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      flexWrap: "wrap",

                      gap: "16px",
                    }}
                  >
                    <p
                      style={{
                        color:
                          "#CBD5E1",

                        fontSize:
                          "15px",
                      }}
                    >
                      Posted by:{" "}
                      <span
                        style={{
                          color:
                            "#F472B6",

                          fontWeight:
                            "bold",
                        }}
                      >
                        {idea.createdBy
                          ?.name ||
                          "Anonymous"}
                      </span>
                    </p>

                    <button
                      style={{
                        padding:
                          "12px 20px",

                        borderRadius:
                          "16px",

                        border:
                          "none",

                        cursor:
                          "pointer",

                        background:
                          "linear-gradient(to right, #9333EA, #EC4899)",

                        color:
                          "white",

                        fontWeight:
                          "bold",

                        boxShadow:
                          "0 8px 25px rgba(236,72,153,0.22)",
                      }}
                    >
                      🚀 Collaborate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ideas;