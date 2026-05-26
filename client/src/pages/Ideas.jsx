import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

function Ideas() {
  const navigate =
    useNavigate();

  //
  // CURRENT USER
  //
  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || {};

  //
  // TOKEN
  //
  const token =
    localStorage.getItem(
      "token"
    );

  //
  // STATES
  //
  const [ideas, setIdeas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    requestLoading,
    setRequestLoading,
  ] = useState("");

  const [
    sentRequests,
    setSentRequests,
  ] = useState([]);

  //
  // FETCH IDEAS
  //
  const fetchIdeas =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await API.get(
              "/ideas"
            );

          if (
            response?.data
              ?.success
          ) {
            setIdeas(
              Array.isArray(
                response.data
                  .ideas
              )
                ? response.data
                    .ideas
                : []
            );
          } else {
            setIdeas([]);
          }
        } catch (error) {
          console.log(
            "FETCH IDEAS ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );

          setIdeas([]);
        } finally {
          setLoading(false);
        }
      },
      []
    );

  //
  // FETCH SENT REQUESTS
  //
  const fetchSentRequests =
    useCallback(
      async () => {
        try {
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
            response?.data
              ?.success
          ) {
            setSentRequests(
              Array.isArray(
                response.data
                  .requests
              )
                ? response.data
                    .requests
                : []
            );
          } else {
            setSentRequests([]);
          }
        } catch (error) {
          console.log(
            "REQUEST FETCH ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );

          setSentRequests([]);
        }
      },
      [token]
    );

  //
  // INITIAL LOAD
  //
  useEffect(() => {
    fetchIdeas();

    if (token) {
      fetchSentRequests();
    }
  }, [
    fetchIdeas,
    fetchSentRequests,
    token,
  ]);

  //
  // SEND REQUEST
  //
  const sendRequest =
    async (idea) => {
      try {
        if (
          !idea?.createdBy
            ?._id
        ) {
          alert(
            "Idea owner not found"
          );

          return;
        }

        setRequestLoading(
          idea?._id
        );

        await API.post(
          "/collaborations/send",
          {
            receiver:
              idea?.createdBy
                ?._id,

            ideaId:
              idea?._id,

            projectId:
              idea
                ?.linkedProject
                ?._id ||
              idea?.linkedProject,

            title:
              idea?.title,

            requestType:
              "Idea Collaboration",

            message:
              "I'd like to collaborate on this project.",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchSentRequests();

        alert(
          "Collaboration request sent successfully 🚀"
        );
      } catch (error) {
        console.log(
          "SEND REQUEST ERROR:",
          error
            ?.response
            ?.data ||
            error.message
        );

        alert(
          error?.response
            ?.data
            ?.message ||
            "Failed to send request"
        );
      } finally {
        setRequestLoading("");
      }
    };

  //
  // DELETE IDEA
  //
  const deleteIdea =
    async (ideaId) => {
      try {
        const confirmDelete =
          window.confirm(
            "Delete this idea?"
          );

        if (
          !confirmDelete
        ) {
          return;
        }

        await API.delete(
          `/ideas/${ideaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchIdeas();

        alert(
          "Idea deleted successfully 🚀"
        );
      } catch (error) {
        console.log(
          "DELETE IDEA ERROR:",
          error
            ?.response
            ?.data ||
            error.message
        );

        alert(
          error?.response
            ?.data
            ?.message ||
            "Failed to delete idea"
        );
      }
    };

  //
  // CHECK REQUEST STATUS
  //
  const getRequestStatus =
    (ideaId) => {
      if (
        !Array.isArray(
          sentRequests
        )
      ) {
        return null;
      }

      return sentRequests.find(
        (request) =>
          request?.idea
            ?._id ===
          ideaId
      );
    };

  //
  // LIKE IDEA
  //
  const likeIdea =
    async (ideaId) => {
      try {
        await API.put(
          `/ideas/like/${ideaId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchIdeas();
      } catch (error) {
        console.log(
          "LIKE ERROR:",
          error
            ?.response
            ?.data ||
            error.message
        );
      }
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
      {/* GLOW */}
      <div
        style={{
          position:
            "absolute",

          width: "500px",

          height: "500px",

          background:
            "rgba(59,130,246,0.10)",

          borderRadius:
            "50%",

          filter:
            "blur(140px)",

          top: "-180px",

          left: "-120px",
        }}
      />

      <div
        style={{
          position:
            "absolute",

          width: "450px",

          height: "450px",

          background:
            "rgba(124,58,237,0.12)",

          borderRadius:
            "50%",

          filter:
            "blur(130px)",

          bottom: "-150px",

          right: "-100px",
        }}
      />

      {/* NAVBAR */}
      <Navbar />

      <div
        style={{
          display: "flex",

          position:
            "relative",

          zIndex: 2,
        }}
      >
        {/* SIDEBAR */}
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

              marginBottom:
                "42px",

              position:
                "relative",

              overflow:
                "hidden",
            }}
          >
            <div
              style={{
                position:
                  "absolute",

                width: "240px",

                height: "240px",

                background:
                  "rgba(91,95,255,0.10)",

                borderRadius:
                  "50%",

                filter:
                  "blur(90px)",

                top: "-70px",

                right: "-40px",
              }}
            />

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                flexWrap:
                  "wrap",

                gap: "24px",

                position:
                  "relative",

                zIndex: 2,
              }}
            >
              <div>
                <h1
                  className="welcome-title"
                  style={{
                    fontSize:
                      "50px",

                    marginBottom:
                      "20px",

                    lineHeight:
                      "1.3",
                  }}
                >
                  EXPLORE IDEAS
                </h1>

                <p
                  style={{
                    color:
                      "#CBD5E1",

                    fontSize:
                      "18px",

                    lineHeight:
                      "2",

                    maxWidth:
                      "760px",
                  }}
                >
                  Discover futuristic
                  startup concepts,
                  AI-powered
                  workflows,
                  modern innovation
                  systems,
                  and collaborate
                  with builders
                  across BuildX.
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

                  color:
                    "white",

                  fontSize:
                    "15px",

                  fontWeight:
                    "600",

                  textDecoration:
                    "none",

                  boxShadow:
                    "0 0 24px rgba(124,58,237,0.28)",
                }}
              >
                Post New Idea
              </Link>
            </div>
          </div>

          {/* EMPTY */}
          {ideas.length ===
          0 ? (
            <div
              className="glass-card"
              style={{
                padding: "70px",

                textAlign:
                  "center",
              }}
            >
              <h2
                className="section-title"
                style={{
                  fontSize:
                    "42px",

                  marginBottom:
                    "22px",
                }}
              >
                No Ideas Yet
              </h2>

              <p
                style={{
                  color:
                    "#CBD5E1",

                  fontSize:
                    "17px",

                  lineHeight:
                    "1.9",
                }}
              >
                Be the first creator
                to share an
                innovative idea
                inside BuildX.
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
              {ideas.map(
                (idea) => {
                  const request =
                    getRequestStatus(
                      idea?._id
                    );

                  return (
                    <div
                      key={
                        idea?._id
                      }
                      className="glass-card"
                      style={{
                        padding:
                          "34px",

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

                          width:
                            "220px",

                          height:
                            "220px",

                          background:
                            "rgba(124,58,237,0.08)",

                          borderRadius:
                            "50%",

                          filter:
                            "blur(80px)",

                          top: "-80px",

                          right:
                            "-60px",
                        }}
                      />

                      {/* TITLE */}
                      <h2
                        className="card-title"
                        style={{
                          fontSize:
                            "38px",

                          marginBottom:
                            "22px",

                          position:
                            "relative",

                          zIndex: 2,
                        }}
                      >
                        {idea?.title ||
                          "Untitled Idea"}
                      </h2>

                      {/* DESCRIPTION */}
                      <p
                        style={{
                          color:
                            "#CBD5E1",

                          fontSize:
                            "17px",

                          lineHeight:
                            "2",

                          marginBottom:
                            "30px",

                          position:
                            "relative",

                          zIndex: 2,
                        }}
                      >
                        {idea?.description ||
                          "No description available"}
                      </p>

                      {/* TECH STACK */}
                      <div
                        style={{
                          display:
                            "flex",

                          flexWrap:
                            "wrap",

                          gap: "12px",

                          marginBottom:
                            "26px",

                          position:
                            "relative",

                          zIndex: 2,
                        }}
                      >
                        {Array.isArray(
                          idea?.techStack
                        ) &&
                        idea
                          ?.techStack
                          .length >
                          0 ? (
                          idea.techStack.map(
                            (
                              tech,
                              index
                            ) => (
                              <span
                                key={
                                  index
                                }
                                style={{
                                  padding:
                                    "10px 16px",

                                  borderRadius:
                                    "24px",

                                  background:
                                    "rgba(79,70,229,0.16)",

                                  border:
                                    "1px solid rgba(255,255,255,0.06)",

                                  fontSize:
                                    "13px",
                                }}
                              >
                                {tech}
                              </span>
                            )
                          )
                        ) : (
                          <span
                            style={{
                              color:
                                "#94A3B8",
                            }}
                          >
                            No tech stack
                          </span>
                        )}
                      </div>

                      {/* FOOTER */}
                      <div
                        style={{
                          display:
                            "flex",

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
                        {/* LEFT */}
                        <div>
                          <p
                            style={{
                              color:
                                "#CBD5E1",

                              marginBottom:
                                "8px",
                            }}
                          >
                            Posted by{" "}
                            <span
                              style={{
                                fontWeight:
                                  "600",
                              }}
                            >
                              {idea
                                ?.createdBy
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
                            {idea?.status ||
                              "Open"}
                          </p>
                        </div>

                        {/* RIGHT */}
                        <div
                          style={{
                            display:
                              "flex",

                            gap: "14px",

                            flexWrap:
                              "wrap",
                          }}
                        >
                          {/* LIKE */}
                          <button
                            onClick={() =>
                              likeIdea(
                                idea?._id
                              )
                            }
                            style={{
                              padding:
                                "13px 18px",

                              borderRadius:
                                "16px",

                              background:
                                "rgba(255,255,255,0.06)",

                              border:
                                "1px solid rgba(255,255,255,0.08)",

                              color:
                                "white",

                              cursor:
                                "pointer",
                            }}
                          >
                            ❤️{" "}
                            {Array.isArray(
                              idea?.likes
                            )
                              ? idea
                                  .likes
                                  .length
                              : 0}
                          </button>

                          {/* WORKSPACE */}
                          {idea?.linkedProject && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/projects`
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

                                border:
                                  "none",

                                cursor:
                                  "pointer",

                                fontWeight:
                                  "600",
                              }}
                            >
                              Open Workspace
                            </button>
                          )}

                          {/* OWNER */}
                          {idea
                            ?.createdBy
                            ?._id ===
                          (currentUser?.userId ||
                            currentUser?._id) ? (
                            <button
                              onClick={() =>
                                deleteIdea(
                                  idea?._id
                                )
                              }
                              style={{
                                padding:
                                  "13px 22px",

                                borderRadius:
                                  "16px",

                                background:
                                  "linear-gradient(135deg, #EF4444, #DC2626)",

                                color:
                                  "white",

                                border:
                                  "none",

                                cursor:
                                  "pointer",

                                fontWeight:
                                  "600",
                              }}
                            >
                              Delete
                            </button>
                          ) : request
                              ?.status ===
                            "Accepted" ? (
                            <button
                              style={{
                                padding:
                                  "13px 22px",

                                borderRadius:
                                  "16px",

                                background:
                                  "rgba(34,197,94,0.16)",

                                color:
                                  "#4ADE80",

                                border:
                                  "1px solid rgba(34,197,94,0.20)",
                              }}
                            >
                              Accepted
                            </button>
                          ) : request
                              ?.status ===
                            "Rejected" ? (
                            <button
                              style={{
                                padding:
                                  "13px 22px",

                                borderRadius:
                                  "16px",

                                background:
                                  "rgba(239,68,68,0.16)",

                                color:
                                  "#F87171",

                                border:
                                  "1px solid rgba(239,68,68,0.20)",
                              }}
                            >
                              Rejected
                            </button>
                          ) : request
                              ?.status ===
                            "Pending" ? (
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
                                idea?._id
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

                                border:
                                  "none",

                                cursor:
                                  "pointer",

                                fontWeight:
                                  "600",
                              }}
                            >
                              {requestLoading ===
                              idea?._id
                                ? "Sending..."
                                : "Collaborate"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ideas;