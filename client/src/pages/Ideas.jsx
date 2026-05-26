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
  const navigate = useNavigate();

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
    ) || "";

  //
  // STATES
  //
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
  const fetchIdeas =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await API.get(
            "/ideas"
          );

        if (
          response?.data?.success
        ) {
          setIdeas(
            Array.isArray(
              response?.data?.ideas
            )
              ? response.data.ideas
              : []
          );
        } else {
          setIdeas([]);
        }
      } catch (error) {
        console.log(
          "FETCH IDEAS ERROR:",
          error?.response?.data ||
            error.message
        );

        setIdeas([]);
      } finally {
        setLoading(false);
      }
    }, []);

  //
  // FETCH SENT REQUESTS
  //
  const fetchSentRequests =
    useCallback(async () => {
      try {
        if (!token) {
          setSentRequests([]);
          return;
        }

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
          response?.data?.success
        ) {
          setSentRequests(
            Array.isArray(
              response?.data?.requests
            )
              ? response.data.requests
              : []
          );
        } else {
          setSentRequests([]);
        }
      } catch (error) {
        console.log(
          "REQUEST FETCH ERROR:",
          error?.response?.data ||
            error.message
        );

        setSentRequests([]);
      }
    }, [token]);

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
        if (!token) {
          alert(
            "Please login first"
          );

          navigate("/login");

          return;
        }

        if (
          !idea?.createdBy?._id
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
              idea?.createdBy?._id,

            ideaId:
              idea?._id,

            projectId:
              idea?.linkedProject
                ?._id ||
              idea?.linkedProject,

            title:
              idea?.title,

            requestType:
              "Idea Collaboration",

            message:
              "I'd like to collaborate on this idea.",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchSentRequests();

        alert(
          "Collaboration request sent 🚀"
        );
      } catch (error) {
        console.log(
          "SEND REQUEST ERROR:",
          error?.response?.data ||
            error.message
        );

        alert(
          error?.response?.data
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

        if (!confirmDelete) {
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

        fetchIdeas();

        alert(
          "Idea deleted successfully 🚀"
        );
      } catch (error) {
        console.log(
          "DELETE ERROR:",
          error?.response?.data ||
            error.message
        );

        alert(
          error?.response?.data
            ?.message ||
            "Failed to delete idea"
        );
      }
    };

  //
  // CHECK REQUEST
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
          request?.idea?._id ===
          ideaId
      );
    };

  //
  // LIKE IDEA
  //
  const likeIdea =
    async (ideaId) => {
      try {
        if (!token) {
          alert(
            "Please login first"
          );

          navigate("/login");

          return;
        }

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
          error?.response?.data ||
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
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "40px",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "58px",
                  fontWeight: "800",
                  marginBottom: "10px",
                }}
              >
                IDEAS HUB
              </h1>

              <p
                style={{
                  color: "#CBD5E1",
                  fontSize: "18px",
                }}
              >
                Explore innovative startup ideas and collaborate with creators.
              </p>
            </div>

            <Link
              to="/postidea"
              style={{
                padding:
                  "16px 28px",
                borderRadius:
                  "16px",
                background:
                  "linear-gradient(135deg, #8B5CF6, #EC4899)",
                color: "white",
                textDecoration:
                  "none",
                fontWeight: "700",
              }}
            >
              + Post Idea
            </Link>
          </div>

          {/* EMPTY STATE */}
          {!Array.isArray(ideas) ||
          ideas.length === 0 ? (
            <div
              style={{
                padding: "60px",
                borderRadius:
                  "24px",
                background:
                  "rgba(255,255,255,0.05)",
                textAlign: "center",
              }}
            >
              <h2>
                No Ideas Found 🚀
              </h2>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "28px",
              }}
            >
              {ideas.map((idea) => {
                const requestStatus =
                  getRequestStatus(
                    idea?._id
                  );

                const isOwner =
                  currentUser?._id ===
                  idea?.createdBy?._id;

                return (
                  <div
                    key={idea?._id}
                    style={{
                      padding: "28px",
                      borderRadius:
                        "24px",
                      background:
                        "rgba(255,255,255,0.05)",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* TITLE */}
                    <h2
                      style={{
                        fontSize: "28px",
                        marginBottom:
                          "14px",
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
                        lineHeight:
                          "1.7",
                        marginBottom:
                          "18px",
                      }}
                    >
                      {idea?.description ||
                        "No description"}
                    </p>

                    {/* TECH STACK */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginBottom:
                          "18px",
                      }}
                    >
                      {Array.isArray(
                        idea?.techStack
                      ) &&
                        idea.techStack.map(
                          (
                            tech,
                            index
                          ) => (
                            <span
                              key={index}
                              style={{
                                padding:
                                  "8px 14px",
                                borderRadius:
                                  "999px",
                                background:
                                  "rgba(139,92,246,0.2)",
                                fontSize:
                                  "13px",
                              }}
                            >
                              {tech}
                            </span>
                          )
                        )}
                    </div>

                    {/* CREATOR */}
                    <p
                      style={{
                        marginBottom:
                          "14px",
                        color:
                          "#94A3B8",
                      }}
                    >
                      👤{" "}
                      {idea?.createdBy
                        ?.name ||
                        "Unknown User"}
                    </p>

                    {/* BUTTONS */}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
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
                            "12px 18px",
                          borderRadius:
                            "14px",
                          border: "none",
                          cursor:
                            "pointer",
                          background:
                            "linear-gradient(135deg, #2563EB, #7C3AED)",
                          color:
                            "white",
                          fontWeight:
                            "700",
                        }}
                      >
                        ❤️{" "}
                        {Array.isArray(
                          idea?.likes
                        )
                          ? idea.likes
                              .length
                          : 0}
                      </button>

                      {/* COLLABORATE */}
                      {!isOwner && (
                        <button
                          disabled={
                            requestLoading ===
                              idea?._id ||
                            requestStatus
                          }
                          onClick={() =>
                            sendRequest(
                              idea
                            )
                          }
                          style={{
                            padding:
                              "12px 18px",
                            borderRadius:
                              "14px",
                            border:
                              "none",
                            cursor:
                              "pointer",
                            background:
                              requestStatus
                                ? "#334155"
                                : "linear-gradient(135deg, #8B5CF6, #EC4899)",
                            color:
                              "white",
                            fontWeight:
                              "700",
                          }}
                        >
                          {requestLoading ===
                          idea?._id
                            ? "Sending..."
                            : requestStatus
                            ? "Request Sent"
                            : "Collaborate"}
                        </button>
                      )}

                      {/* DELETE */}
                      {isOwner && (
                        <button
                          onClick={() =>
                            deleteIdea(
                              idea?._id
                            )
                          }
                          style={{
                            padding:
                              "12px 18px",
                            borderRadius:
                              "14px",
                            border:
                              "none",
                            cursor:
                              "pointer",
                            background:
                              "linear-gradient(135deg, #DC2626, #F43F5E)",
                            color:
                              "white",
                            fontWeight:
                              "700",
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ideas;