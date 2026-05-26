import {
  useEffect,
  useState,
  useCallback,
} from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

import API from "../services/api";

function SkillSwap() {
  //
  // TOKEN
  //
  const token =
    localStorage.getItem(
      "token"
    );

  //
  // USER
  //
  const storedUser =
    localStorage.getItem(
      "user"
    );

  const parsedUser =
    storedUser
      ? JSON.parse(
          storedUser
        )
      : {};

  //
  // CURRENT USER IDS
  //
  const currentUserId =
    parsedUser?._id ||
    parsedUser?.userId ||
    "";

  //
  // STATES
  //
  const [users, setUsers] =
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
  // FETCH USERS
  //
  const fetchUsers =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const response =
            await API.get(
              "/users/all",
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
            const filteredUsers =
              Array.isArray(
                response.data
                  .users
              )
                ? response.data.users.filter(
                    (
                      user
                    ) =>
                      user?._id !==
                      currentUserId
                  )
                : [];

            setUsers(
              filteredUsers
            );
          } else {
            setUsers([]);
          }
        } catch (error) {
          console.log(
            "USER FETCH ERROR:",
            error
              ?.response
              ?.data ||
              error.message
          );

          setUsers([]);
        } finally {
          setLoading(false);
        }
      },
      [
        token,
        currentUserId,
      ]
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
            "REQUEST ERROR:",
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
  // LOAD
  //
  useEffect(() => {
    fetchUsers();

    fetchSentRequests();
  }, [
    fetchUsers,
    fetchSentRequests,
  ]);

  //
  // SEND SKILL REQUEST
  //
  const sendSkillRequest =
    async (user) => {
      try {
        setRequestLoading(
          user?._id
        );

        await API.post(
          "/collaborations/send",
          {
            receiver:
              user?._id,

            title:
              "Skill Swap Request",

            requestType:
              "Skill Swap",

            message:
              "I'd like to collaborate through a futuristic skill swap partnership inside BuildX.",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchSentRequests();

        alert(
          "Skill Swap Request Sent 🚀"
        );
      } catch (error) {
        console.log(
          error
        );

        alert(
          error?.response
            ?.data
            ?.message ||
            "Failed to send request"
        );
      } finally {
        setRequestLoading(
          ""
        );
      }
    };

  //
  // GET REQUEST STATUS
  //
  const getRequestStatus =
    (receiverId) => {
      return sentRequests.find(
        (request) =>
          request?.receiver
            ?._id ===
            receiverId &&
          request?.requestType ===
            "Skill Swap"
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
      }}
    >
      {/* NAVBAR */}
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN */}
        <div
          style={{
            flex: 1,

            padding: "40px",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              marginBottom:
                "40px",
            }}
          >
            <h1
              style={{
                fontSize: "52px",

                marginBottom:
                  "16px",
              }}
            >
              Skill Swap Hub 🚀
            </h1>

            <p
              style={{
                color: "#CBD5E1",

                lineHeight:
                  "1.9",

                fontSize: "17px",

                maxWidth:
                  "820px",
              }}
            >
              Connect with
              developers,
              designers,
              creators, and
              innovators to
              exchange skills
              and build amazing
              futuristic
              collaborations.
            </p>
          </div>

          {/* EMPTY */}
          {users.length ===
          0 ? (
            <div
              style={{
                padding: "60px",

                borderRadius:
                  "24px",

                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                textAlign:
                  "center",
              }}
            >
              <h2
                style={{
                  fontSize:
                    "38px",

                  marginBottom:
                    "16px",
                }}
              >
                No Users Found
              </h2>

              <p
                style={{
                  color:
                    "#CBD5E1",
                }}
              >
                No available
                users for skill
                swapping right
                now.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(340px, 1fr))",

                gap: "28px",
              }}
            >
              {users.map(
                (user) => {
                  const request =
                    getRequestStatus(
                      user?._id
                    );

                  return (
                    <div
                      key={
                        user?._id
                      }
                      style={{
                        padding:
                          "34px",

                        borderRadius:
                          "28px",

                        background:
                          "rgba(255,255,255,0.05)",

                        border:
                          "1px solid rgba(255,255,255,0.08)",

                        backdropFilter:
                          "blur(18px)",

                        boxShadow:
                          "0 0 30px rgba(124,58,237,0.12)",
                      }}
                    >
                      {/* PROFILE */}
                      <div
                        style={{
                          display:
                            "flex",

                          flexDirection:
                            "column",

                          alignItems:
                            "center",

                          textAlign:
                            "center",
                        }}
                      >
                        {/* AVATAR */}
                        <div
                          style={{
                            width:
                              "100px",

                            height:
                              "100px",

                            borderRadius:
                              "50%",

                            background:
                              "linear-gradient(135deg, #8B5CF6, #EC4899)",

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "center",

                            fontSize:
                              "40px",

                            fontWeight:
                              "bold",

                            marginBottom:
                              "22px",
                          }}
                        >
                          {user?.name
                            ?.charAt(
                              0
                            )
                            ?.toUpperCase() ||
                            "U"}
                        </div>

                        {/* NAME */}
                        <h2
                          style={{
                            fontSize:
                              "30px",

                            marginBottom:
                              "12px",
                          }}
                        >
                          {user?.name ||
                            "Unknown User"}
                        </h2>

                        {/* EMAIL */}
                        <p
                          style={{
                            color:
                              "#CBD5E1",

                            marginBottom:
                              "18px",
                          }}
                        >
                          {user?.email ||
                            "No Email"}
                        </p>

                        {/* BIO */}
                        <p
                          style={{
                            color:
                              "#CBD5E1",

                            lineHeight:
                              "1.9",

                            marginBottom:
                              "24px",
                          }}
                        >
                          {user?.bio ||
                            "Creative innovator building futuristic products inside BuildX."}
                        </p>

                        {/* SKILLS */}
                        <div
                          style={{
                            display:
                              "flex",

                            flexWrap:
                              "wrap",

                            justifyContent:
                              "center",

                            gap: "12px",

                            marginBottom:
                              "28px",
                          }}
                        >
                          {Array.isArray(
                            user?.skills
                          ) &&
                          user.skills
                            .length >
                            0 ? (
                            user.skills.map(
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
                                      "10px 16px",

                                    borderRadius:
                                      "18px",

                                    background:
                                      "rgba(255,255,255,0.06)",

                                    border:
                                      "1px solid rgba(255,255,255,0.08)",

                                    fontSize:
                                      "13px",
                                  }}
                                >
                                  {skill}
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
                              No skills added
                            </span>
                          )}
                        </div>

                        {/* ACTION */}
                        {request?.status ===
                        "Accepted" ? (
                          <button
                            style={{
                              width:
                                "100%",

                              padding:
                                "16px",

                              borderRadius:
                                "18px",

                              border:
                                "none",

                              background:
                                "linear-gradient(135deg, #10B981, #059669)",

                              color:
                                "white",

                              fontWeight:
                                "700",
                            }}
                          >
                            Connected ✅
                          </button>
                        ) : request?.status ===
                          "Rejected" ? (
                          <button
                            style={{
                              width:
                                "100%",

                              padding:
                                "16px",

                              borderRadius:
                                "18px",

                              border:
                                "none",

                              background:
                                "linear-gradient(135deg, #EF4444, #DC2626)",

                              color:
                                "white",

                              fontWeight:
                                "700",
                            }}
                          >
                            Request Rejected
                          </button>
                        ) : request?.status ===
                          "Pending" ? (
                          <button
                            style={{
                              width:
                                "100%",

                              padding:
                                "16px",

                              borderRadius:
                                "18px",

                              border:
                                "none",

                              background:
                                "rgba(255,255,255,0.08)",

                              color:
                                "#CBD5E1",

                              fontWeight:
                                "700",
                            }}
                          >
                            Request Sent ⏳
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              sendSkillRequest(
                                user
                              )
                            }
                            disabled={
                              requestLoading ===
                              user?._id
                            }
                            style={{
                              width:
                                "100%",

                              padding:
                                "16px",

                              borderRadius:
                                "18px",

                              border:
                                "none",

                              cursor:
                                "pointer",

                              fontWeight:
                                "700",

                              background:
                                "linear-gradient(135deg, #8B5CF6, #EC4899)",

                              color:
                                "white",
                            }}
                          >
                            {requestLoading ===
                            user?._id
                              ? "Sending..."
                              : "Start Skill Swap 🚀"}
                          </button>
                        )}
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

export default SkillSwap;