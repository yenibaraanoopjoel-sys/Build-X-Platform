import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

function Ideas() {
  const navigate = useNavigate();

  const [ideas, setIdeas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [requestLoading, setRequestLoading] =
    useState("");

  const [sentRequests, setSentRequests] =
    useState([]);

  //
  // FETCH IDEAS
  //
  const fetchIdeas = async () => {
    try {
      setLoading(true);

      const response =
        await API.get("/ideas");

      if (
        response.data.success
      ) {
        setIdeas(
          response.data.ideas
        );
      }
    } catch (error) {
      console.log(
        "Error fetching ideas:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  //
  // FETCH SENT REQUESTS
  //
  const fetchSentRequests =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await API.get(
            "/collaborations/sent",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (
          response.data.success
        ) {
          setSentRequests(
            response.data.requests
          );
        }
      } catch (error) {
        console.log(
          "Request Fetch Error:",
          error
        );
      }
    };

  useEffect(() => {
    fetchIdeas();
    fetchSentRequests();
  }, []);

  //
  // SEND REQUEST
  //
  const sendRequest =
    async (idea) => {
      try {
        setRequestLoading(
          idea._id
        );

        const token =
          localStorage.getItem(
            "token"
          );

        await API.post(
          "/collaborations/send",
          {
            receiver:
              idea.createdBy._id,

            ideaId:
              idea._id,

            message:
              "I'd like to collaborate on this project.",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchSentRequests();

        alert(
          "Collaboration request sent successfully 🚀"
        );
      } catch (error) {
        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to send request"
        );
      } finally {
        setRequestLoading("");
      }
    };

  //
  // CHECK REQUEST STATUS
  //
  const hasRequested =
    (ideaId) => {
      return sentRequests.some(
        (request) =>
          request.idea?._id ===
            ideaId &&
          request.status ===
            "Pending"
      );
    };

  //
  // LOADING
  //
  if (loading) {
    return <Loader />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg, #050816 0%, #0B1023 40%, #1E1B4B 100%)",

        color: "white",

        overflow: "hidden",

        position: "relative",
      }}
    >
      {/* Glow Effects */}
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

      <Navbar />

      <div
        style={{
          display: "flex",

          position: "relative",

          zIndex: 2,
        }}
      >
        <Sidebar />

        {/* MAIN */}
        <div
          style={{
            flex: 1,

            padding: "42px",
          }}
        >
          {/* HERO */}
          <div
            className="glass-card"
            style={{
              padding: "48px",

              marginBottom: "42px",

              position: "relative",

              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",

                width: "240px",

                height: "240px",

                background:
                  "rgba(91,95,255,0.10)",

                borderRadius: "50%",

                filter: "blur(90px)",

                top: "-70px",

                right: "-40px",
              }}
            />

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: "24px",

                position: "relative",

                zIndex: 2,
              }}
            >
              <div>
                <h1
                  className="welcome-title"
                  style={{
                    fontSize: "50px",

                    marginBottom:
                      "20px",

                    lineHeight:
                      "1.3",

                    color: "white",
                  }}
                >
                  EXPLORE IDEAS
                </h1>

                <p
                  style={{
                    color: "#CBD5E1",

                    fontSize: "18px",

                    lineHeight:
                      "2",

                    maxWidth:
                      "760px",
                  }}
                >
                  Discover innovative
                  startup concepts,
                  AI-powered workflows,
                  futuristic solutions,
                  and next-generation
                  collaboration ideas
                  from creators and
                  modern teams.
                </p>
              </div>

              <Link
                to="/post-idea"
                style={{
                  padding:
                    "16px 28px",

                  borderRadius:
                    "18px",

                  background:
                    "linear-gradient(135deg, #2563EB, #7C3AED)",

                  color: "white",

                  fontSize: "15px",

                  fontWeight:
                    "600",

                  boxShadow:
                    "0 0 24px rgba(124,58,237,0.28)",

                  whiteSpace:
                    "nowrap",
                }}
              >
                Post New Idea
              </Link>
            </div>
          </div>

          {/* EMPTY */}
          {ideas.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: "70px",

                textAlign: "center",
              }}
            >
              <h2
                className="section-title"
                style={{
                  fontSize: "42px",

                  marginBottom:
                    "22px",
                }}
              >
                No Ideas Yet
              </h2>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "17px",

                  lineHeight:
                    "1.9",
                }}
              >
                Be the first creator
                to share an innovative
                idea inside BuildX.
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
                  className="glass-card"
                  style={{
                    padding: "34px",

                    position:
                      "relative",

                    overflow:
                      "hidden",
                  }}
                >
                  {/* Glow */}
                  <div
                    style={{
                      position:
                        "absolute",

                      width: "220px",

                      height:
                        "220px",

                      background:
                        "rgba(124,58,237,0.08)",

                      borderRadius:
                        "50%",

                      filter:
                        "blur(80px)",

                      top: "-80px",

                      right: "-60px",
                    }}
                  />

                  {/* TITLE */}
                  <h2
                    className="card-title"
                    style={{
                      fontSize: "38px",

                      marginBottom:
                        "22px",

                      color: "white",

                      position:
                        "relative",

                      zIndex: 2,
                    }}
                  >
                    {idea.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p
                    style={{
                      color: "#CBD5E1",

                      fontSize: "17px",

                      lineHeight:
                        "2",

                      marginBottom:
                        "30px",

                      position:
                        "relative",

                      zIndex: 2,
                    }}
                  >
                    {idea.description}
                  </p>

                  {/* TECH STACK */}
                  <div
                    style={{
                      display: "flex",

                      flexWrap:
                        "wrap",

                      gap: "12px",

                      marginBottom:
                        "28px",

                      position:
                        "relative",

                      zIndex: 2,
                    }}
                  >
                    {idea.techStack &&
                      idea.techStack.map(
                        (
                          tech,
                          index
                        ) => (
                          <span
                            key={index}
                            style={{
                              padding:
                                "10px 16px",

                              borderRadius:
                                "24px",

                              background:
                                "rgba(79,70,229,0.16)",

                              border:
                                "1px solid rgba(255,255,255,0.06)",

                              color:
                                "white",

                              fontSize:
                                "13px",
                            }}
                          >
                            {tech}
                          </span>
                        )
                      )}
                  </div>

                  {/* FOOTER */}
                  <div
                    style={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      flexWrap:
                        "wrap",

                      gap: "18px",

                      position:
                        "relative",

                      zIndex: 2,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color:
                            "#CBD5E1",

                          fontSize:
                            "15px",

                          marginBottom:
                            "8px",
                        }}
                      >
                        Posted by{" "}
                        <span
                          style={{
                            color:
                              "white",

                            fontWeight:
                              "600",
                          }}
                        >
                          {idea
                            .createdBy
                            ?.name ||
                            "Anonymous"}
                        </span>
                      </p>

                      <p
                        style={{
                          color:
                            "#94A3B8",

                          fontSize:
                            "13px",
                        }}
                      >
                        Status:{" "}
                        {
                          idea.status
                        }
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",

                        gap: "14px",

                        flexWrap:
                          "wrap",
                      }}
                    >
                      {/* OPEN WORKSPACE */}
                      <button
                        onClick={() =>
                          navigate(
                            `/projects/${idea.linkedProject}`
                          )
                        }
                        style={{
                          padding:
                            "13px 22px",

                          borderRadius:
                            "16px",

                          background:
                            "linear-gradient(135deg, #2563EB, #7C3AED)",

                          color:
                            "white",

                          fontSize:
                            "14px",

                          fontWeight:
                            "600",

                          boxShadow:
                            "0 0 22px rgba(124,58,237,0.24)",

                          border:
                            "none",

                          cursor:
                            "pointer",
                        }}
                      >
                        Open Workspace
                      </button>

                      {/* COLLABORATE */}
                      {hasRequested(
                        idea._id
                      ) ? (
                        <button
                          style={{
                            padding:
                              "13px 22px",

                            borderRadius:
                              "16px",

                            background:
                              "rgba(255,255,255,0.08)",

                            color:
                              "#CBD5E1",

                            fontSize:
                              "14px",

                            border:
                              "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          Request Sent
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            sendRequest(
                              idea
                            )
                          }
                          disabled={
                            requestLoading ===
                            idea._id
                          }
                          style={{
                            padding:
                              "13px 22px",

                            borderRadius:
                              "16px",

                            background:
                              "linear-gradient(135deg, #06B6D4, #3B82F6)",

                            color:
                              "white",

                            fontSize:
                              "14px",

                            fontWeight:
                              "600",

                            border:
                              "none",

                            cursor:
                              "pointer",

                            boxShadow:
                              "0 0 20px rgba(59,130,246,0.24)",
                          }}
                        >
                          {requestLoading ===
                          idea._id
                            ? "Sending..."
                            : "Collaborate"}
                        </button>
                      )}
                    </div>
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