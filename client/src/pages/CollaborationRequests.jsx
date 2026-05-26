import {
  useEffect,
  useState,
  useCallback,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

function CollaborationRequests() {
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
  const [
    requests,
    setRequests,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("All");

  //
  // FETCH REQUESTS
  //
  const fetchRequests =
    useCallback(
      async () => {
        try {
          setLoading(true);

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
            response?.data
              ?.success
          ) {
            setRequests(
              Array.isArray(
                response.data
                  .requests
              )
                ? response.data
                    .requests
                : []
            );
          } else {
            setRequests([]);
          }
        } catch (error) {
          console.log(
            "REQUEST FETCH ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );

          setRequests([]);
        } finally {
          setLoading(false);
        }
      },
      [token]
    );

  //
  // LOAD
  //
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  //
  // ACCEPT REQUEST
  //
  const acceptRequest =
    async (id) => {
      try {
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
          "Collaboration Request Accepted 🚀"
        );
      } catch (error) {
        console.log(
          error
        );

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
          "Request Rejected ❌"
        );
      } catch (error) {
        console.log(
          error
        );

        alert(
          "Failed to reject request"
        );
      }
    };

  //
  // FILTERED REQUESTS
  //
  const filteredRequests =
    Array.isArray(
      requests
    )
      ? requests.filter(
          (request) => {
            if (
              activeFilter ===
              "All"
            ) {
              return true;
            }

            return (
              request?.status ===
              activeFilter
            );
          }
        )
      : [];

  //
  // COUNTS
  //
  const pendingCount =
    requests.filter(
      (request) =>
        request?.status ===
        "Pending"
    ).length;

  const acceptedCount =
    requests.filter(
      (request) =>
        request?.status ===
        "Accepted"
    ).length;

  const rejectedCount =
    requests.filter(
      (request) =>
        request?.status ===
        "Rejected"
    ).length;

  //
  // STATUS COLOR
  //
  const getStatusColor =
    (status) => {
      switch (status) {
        case "Accepted":
          return "#10B981";

        case "Rejected":
          return "#EF4444";

        default:
          return "#F59E0B";
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
                "40px",

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

                width: "250px",

                height: "250px",

                background:
                  "rgba(124,58,237,0.10)",

                borderRadius:
                  "50%",

                filter:
                  "blur(100px)",

                top: "-80px",

                right: "-50px",
              }}
            />

            <div
              style={{
                position:
                  "relative",

                zIndex: 2,
              }}
            >
              <h1
                style={{
                  fontSize: "54px",

                  marginBottom:
                    "18px",
                }}
              >
                Collaboration Requests
              </h1>

              <p
                style={{
                  color: "#CBD5E1",

                  fontSize: "18px",

                  lineHeight: "1.9",

                  maxWidth:
                    "820px",
                }}
              >
                Manage team
                invitations,
                collaboration
                workflows,
                skill swap
                partnerships,
                and futuristic
                project requests
                inside BuildX.
              </p>
            </div>
          </div>

          {/* STATS */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",

              gap: "24px",

              marginBottom:
                "40px",
            }}
          >
            {[
              {
                title:
                  "Pending",

                value:
                  pendingCount,

                icon: "⏳",

                color:
                  "#F59E0B",
              },

              {
                title:
                  "Accepted",

                value:
                  acceptedCount,

                icon: "✅",

                color:
                  "#10B981",
              },

              {
                title:
                  "Rejected",

                value:
                  rejectedCount,

                icon: "❌",

                color:
                  "#EF4444",
              },

              {
                title:
                  "Total",

                value:
                  requests.length,

                icon: "📨",

                color:
                  "#8B5CF6",
              },
            ].map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    padding:
                      "28px",

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

                      width:
                        "180px",

                      height:
                        "180px",

                      background:
                        `${item.color}20`,

                      borderRadius:
                        "50%",

                      filter:
                        "blur(80px)",

                      top:
                        "-70px",

                      right:
                        "-70px",
                    }}
                  />

                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      marginBottom:
                        "18px",

                      position:
                        "relative",

                      zIndex: 2,
                    }}
                  >
                    <h2
                      style={{
                        fontSize:
                          "28px",
                      }}
                    >
                      {
                        item.title
                      }
                    </h2>

                    <span
                      style={{
                        fontSize:
                          "30px",
                      }}
                    >
                      {
                        item.icon
                      }
                    </span>
                  </div>

                  <h1
                    style={{
                      fontSize:
                        "52px",

                      color:
                        item.color,

                      position:
                        "relative",

                      zIndex: 2,
                    }}
                  >
                    {
                      item.value
                    }
                  </h1>
                </div>
              )
            )}
          </div>

          {/* FILTERS */}
          <div
            style={{
              display: "flex",

              gap: "16px",

              flexWrap: "wrap",

              marginBottom:
                "34px",
            }}
          >
            {[
              "All",
              "Pending",
              "Accepted",
              "Rejected",
            ].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() =>
                    setActiveFilter(
                      filter
                    )
                  }
                  style={{
                    padding:
                      "14px 24px",

                    borderRadius:
                      "16px",

                    border:
                      "none",

                    cursor:
                      "pointer",

                    fontWeight:
                      "700",

                    background:
                      activeFilter ===
                      filter
                        ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
                        : "rgba(255,255,255,0.06)",

                    color:
                      "white",
                  }}
                >
                  {filter}
                </button>
              )
            )}
          </div>

          {/* EMPTY */}
          {filteredRequests.length ===
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
                style={{
                  fontSize:
                    "42px",

                  marginBottom:
                    "20px",
                }}
              >
                No Requests Found
              </h2>

              <p
                style={{
                  color:
                    "#CBD5E1",

                  lineHeight:
                    "1.9",

                  fontSize:
                    "17px",
                }}
              >
                There are no
                collaboration
                requests in this
                category right now.
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
              {filteredRequests.map(
                (request) => (
                  <div
                    key={
                      request?._id
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
                    {/* GLOW */}
                    <div
                      style={{
                        position:
                          "absolute",

                        width:
                          "240px",

                        height:
                          "240px",

                        background:
                          "rgba(124,58,237,0.08)",

                        borderRadius:
                          "50%",

                        filter:
                          "blur(90px)",

                        top:
                          "-80px",

                        right:
                          "-60px",
                      }}
                    />

                    {/* HEADER */}
                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "start",

                        gap: "24px",

                        marginBottom:
                          "22px",

                        position:
                          "relative",

                        zIndex: 2,
                      }}
                    >
                      <div>
                        <h2
                          style={{
                            fontSize:
                              "36px",

                            marginBottom:
                              "14px",
                          }}
                        >
                          {request?.title ||
                            "Untitled Request"}
                        </h2>

                        <p
                          style={{
                            color:
                              "#CBD5E1",

                            lineHeight:
                              "1.9",

                            maxWidth:
                              "820px",
                          }}
                        >
                          {request?.message ||
                            "No message available"}
                        </p>
                      </div>

                      <div
                        style={{
                          padding:
                            "12px 18px",

                          borderRadius:
                            "16px",

                          background:
                            getStatusColor(
                              request?.status
                            ),

                          color:
                            "white",

                          fontWeight:
                            "700",
                        }}
                      >
                        {request?.status}
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div
                      style={{
                        display:
                          "flex",

                        flexWrap:
                          "wrap",

                        gap: "14px",

                        marginBottom:
                          "24px",

                        position:
                          "relative",

                        zIndex: 2,
                      }}
                    >
                      <div
                        style={{
                          padding:
                            "10px 16px",

                          borderRadius:
                            "18px",

                          background:
                            "rgba(255,255,255,0.05)",

                          border:
                            "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        👤{" "}
                        {request
                          ?.sender
                          ?.name ||
                          "Unknown"}
                      </div>

                      <div
                        style={{
                          padding:
                            "10px 16px",

                          borderRadius:
                            "18px",

                          background:
                            "rgba(255,255,255,0.05)",

                          border:
                            "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        📧{" "}
                        {request
                          ?.sender
                          ?.email ||
                          "No Email"}
                      </div>

                      <div
                        style={{
                          padding:
                            "10px 16px",

                          borderRadius:
                            "18px",

                          background:
                            "rgba(255,255,255,0.05)",

                          border:
                            "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        🚀{" "}
                        {request?.requestType ||
                          "Collaboration"}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    {request?.status ===
                      "Pending" && (
                      <div
                        style={{
                          display:
                            "flex",

                          gap: "16px",

                          flexWrap:
                            "wrap",

                          position:
                            "relative",

                          zIndex: 2,
                        }}
                      >
                        <button
                          onClick={() =>
                            acceptRequest(
                              request?._id
                            )
                          }
                          style={{
                            padding:
                              "14px 24px",

                            borderRadius:
                              "16px",

                            border:
                              "none",

                            cursor:
                              "pointer",

                            fontWeight:
                              "700",

                            background:
                              "linear-gradient(135deg, #10B981, #059669)",

                            color:
                              "white",
                          }}
                        >
                          Accept Request
                        </button>

                        <button
                          onClick={() =>
                            rejectRequest(
                              request?._id
                            )
                          }
                          style={{
                            padding:
                              "14px 24px",

                            borderRadius:
                              "16px",

                            border:
                              "none",

                            cursor:
                              "pointer",

                            fontWeight:
                              "700",

                            background:
                              "linear-gradient(135deg, #EF4444, #DC2626)",

                            color:
                              "white",
                          }}
                        >
                          Reject Request
                        </button>
                      </div>
                    )}
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