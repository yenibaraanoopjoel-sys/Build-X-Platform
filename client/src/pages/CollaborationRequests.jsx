import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

function CollaborationRequests() {
  //
  // STATES
  //
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  //
  // FETCH REQUESTS
  //
  const fetchRequests =
    async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await API.get(
            "/collaborations/received",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (
          response.data.success
        ) {
          setRequests(
            response.data.requests
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  //
  // INITIAL FETCH
  //
  useEffect(() => {
    fetchRequests();
  }, []);

  //
  // ACCEPT REQUEST
  //
  const acceptRequest =
    async (id) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await API.put(
          `/collaborations/accept/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchRequests();

        alert(
          "Request accepted successfully 🚀"
        );
      } catch (error) {
        console.log(error);

        alert(
          "Failed to accept request"
        );
      }
    };

  //
  // REJECT REQUEST
  //
  const rejectRequest =
    async (id) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await API.put(
          `/collaborations/reject/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchRequests();

        alert(
          "Request rejected"
        );
      } catch (error) {
        console.log(error);

        alert(
          "Failed to reject request"
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

      {/* NAVBAR */}
      <Navbar />

      <div
        style={{
          display: "flex",

          position: "relative",

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
                position: "relative",

                zIndex: 2,
              }}
            >
              <h1
                className="welcome-title"
                style={{
                  fontSize: "52px",

                  marginBottom: "18px",
                }}
              >
                REQUEST CENTER
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "18px",

                  lineHeight: "2",
                }}
              >
                Manage collaboration,
                project, and skill
                swap requests inside
                your futuristic AI
                workspace.
              </p>
            </div>
          </div>

          {/* EMPTY */}
          {requests.length ===
          0 ? (
            <div
              className="glass-card"
              style={{
                padding: "70px",

                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "42px",

                  marginBottom:
                    "20px",
                }}
              >
                No Requests Yet
              </h2>

              <p
                style={{
                  color: "#CBD5E1",

                  lineHeight:
                    "1.9",
                }}
              >
                Incoming collaboration
                requests will appear
                here.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",

                flexDirection:
                  "column",

                gap: "24px",
              }}
            >
              {requests.map(
                (request) => (
                  <div
                    key={
                      request._id
                    }
                    className="glass-card"
                    style={{
                      padding:
                        "30px",

                      position:
                        "relative",

                      overflow:
                        "hidden",
                    }}
                  >
                    {/* CARD GLOW */}
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

                    <div
                      style={{
                        position:
                          "relative",

                        zIndex: 2,
                      }}
                    >
                      {/* NAME */}
                      <h2
                        style={{
                          fontSize:
                            "34px",

                          marginBottom:
                            "12px",
                        }}
                      >
                        {
                          request
                            .sender
                            ?.name
                        }
                      </h2>

                      {/* EMAIL */}
                      <p
                        style={{
                          color:
                            "#CBD5E1",

                          marginBottom:
                            "10px",
                        }}
                      >
                        {
                          request
                            .sender
                            ?.email
                        }
                      </p>

                      {/* ROLE */}
                      <p
                        style={{
                          color:
                            "#A5B4FC",

                          marginBottom:
                            "16px",
                        }}
                      >
                        Role:{" "}
                        {
                          request
                            .sender
                            ?.role
                        }
                      </p>

                      {/* REQUEST TYPE */}
                      <div
                        style={{
                          marginBottom:
                            "16px",
                        }}
                      >
                        <span
                          style={{
                            padding:
                              "8px 14px",

                            borderRadius:
                              "20px",

                            background:
                              "rgba(99,102,241,0.16)",

                            fontSize:
                              "13px",

                            border:
                              "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {request.requestType ||
                            "Idea Collaboration"}
                        </span>
                      </div>

                      {/* IDEA TITLE */}
                      <p
                        style={{
                          color:
                            "#F9A8D4",

                          marginBottom:
                            "20px",

                          fontSize:
                            "16px",
                        }}
                      >
                        Request For:
                        {" "}
                        {request
                          .idea
                          ?.title ||
                          request.title ||
                          "Untitled"}
                      </p>

                      {/* MESSAGE */}
                      {request.message && (
                        <p
                          style={{
                            color:
                              "#CBD5E1",

                            lineHeight:
                              "1.9",

                            marginBottom:
                              "22px",
                          }}
                        >
                          "
                          {
                            request.message
                          }
                          "
                        </p>
                      )}

                      {/* SKILLS */}
                      <div
                        style={{
                          display:
                            "flex",

                          flexWrap:
                            "wrap",

                          gap: "10px",

                          marginBottom:
                            "24px",
                        }}
                      >
                        {request
                          .sender
                          ?.skillsHave?.map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                key={
                                  index
                                }
                                style={{
                                  padding:
                                    "8px 14px",

                                  borderRadius:
                                    "22px",

                                  background:
                                    "rgba(79,70,229,0.16)",

                                  fontSize:
                                    "13px",
                                }}
                              >
                                {
                                  skill
                                }
                              </span>
                            )
                          )}
                      </div>

                      {/* STATUS */}
                      <p
                        style={{
                          marginBottom:
                            "24px",

                          color:
                            request.status ===
                            "Accepted"
                              ? "#34D399"
                              : request.status ===
                                "Rejected"
                              ? "#F87171"
                              : "#FBBF24",

                          fontWeight:
                            "600",
                        }}
                      >
                        Status:{" "}
                        {
                          request.status
                        }
                      </p>

                      {/* ACTIONS */}
                      {request.status ===
                        "Pending" && (
                        <div
                          style={{
                            display:
                              "flex",

                            gap: "14px",

                            flexWrap:
                              "wrap",
                          }}
                        >
                          <button
                            onClick={() =>
                              acceptRequest(
                                request._id
                              )
                            }
                            style={{
                              padding:
                                "13px 22px",

                              borderRadius:
                                "14px",

                              background:
                                "linear-gradient(135deg, #10B981, #059669)",

                              color:
                                "white",

                              border:
                                "none",

                              cursor:
                                "pointer",

                              fontWeight:
                                "600",

                              boxShadow:
                                "0 0 18px rgba(16,185,129,0.25)",
                            }}
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              rejectRequest(
                                request._id
                              )
                            }
                            style={{
                              padding:
                                "13px 22px",

                              borderRadius:
                                "14px",

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

                              boxShadow:
                                "0 0 18px rgba(239,68,68,0.25)",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollaborationRequests;