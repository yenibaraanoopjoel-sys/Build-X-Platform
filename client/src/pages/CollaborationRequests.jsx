import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  getCollaborationRequests,
  respondCollaborationRequest,
} from "../services/firestoreService";
import {
  Users,
  Check,
  X,
  MessageSquare,
  ArrowUpRight,
  ArrowDownLeft,
  FolderKanban,
} from "lucide-react";

function CollaborationRequests() {
  const { currentUser, userProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("incoming"); // 'incoming' | 'outgoing'
  const [filter, setFilter] = useState("All"); // 'All' | 'pending' | 'accepted' | 'rejected'
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollabs = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await getCollaborationRequests(currentUser.uid);
      setIncoming(data.incoming);
      setOutgoing(data.outgoing);
    } catch (err) {
      console.error("Error loading collabs:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCollabs();
  }, [fetchCollabs]);

  const handleRespond = async (collab, status) => {
    try {
      const user = userProfile || { uid: currentUser.uid, name: currentUser.displayName };
      await respondCollaborationRequest(collab.id, status, collab, user);
      setIncoming((prev) =>
        prev.map((c) => (c.id === collab.id ? { ...c, status } : c))
      );
    } catch (err) {
      console.error("Error updating collab response:", err);
    }
  };

  const list = activeTab === "incoming" ? incoming : outgoing;
  const filteredList =
    filter === "All"
      ? list
      : list.filter((item) => (item.status || "").toLowerCase() === filter.toLowerCase());

  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#38BDF8", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
            <Users size={16} />
            <span>PARTNERSHIPS & CO-FOUNDING</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#FFFFFF" }}>
            Collaboration Requests
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94A3B8", fontSize: "14px" }}>
            Manage invitations to join projects, build teams, and review collaboration proposals.
          </p>
        </div>

        {/* TABS & FILTERS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {/* INCOMING VS OUTGOING */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setActiveTab("incoming")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "14px",
                background: activeTab === "incoming" ? "rgba(56, 189, 248, 0.15)" : "rgba(255,255,255,0.04)",
                border: "1px solid",
                borderColor: activeTab === "incoming" ? "#38BDF8" : "rgba(255,255,255,0.08)",
                color: activeTab === "incoming" ? "#38BDF8" : "#94A3B8",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <ArrowDownLeft size={16} />
              <span>Incoming ({incoming.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("outgoing")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "14px",
                background: activeTab === "outgoing" ? "rgba(56, 189, 248, 0.15)" : "rgba(255,255,255,0.04)",
                border: "1px solid",
                borderColor: activeTab === "outgoing" ? "#38BDF8" : "rgba(255,255,255,0.08)",
                color: activeTab === "outgoing" ? "#38BDF8" : "#94A3B8",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <ArrowUpRight size={16} />
              <span>Outgoing Sent ({outgoing.length})</span>
            </button>
          </div>

          {/* STATUS FILTER PILLS */}
          <div style={{ display: "flex", gap: "6px" }}>
            {["All", "Pending", "Accepted", "Rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "12px",
                  background: filter === st ? "rgba(255,255,255,0.1)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: filter === st ? "#FFFFFF" : "#94A3B8",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <Loader />
        ) : filteredList.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "70px 20px",
              background: "rgba(15, 23, 42, 0.5)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Users size={44} color="#64748B" style={{ opacity: 0.6, marginBottom: "14px" }} />
            <h3 style={{ margin: "0 0 6px", color: "white", fontSize: "18px" }}>
              No {filter !== "All" ? filter : ""} requests found
            </h3>
            <p style={{ margin: 0, color: "#94A3B8", fontSize: "13px" }}>
              {activeTab === "incoming"
                ? "You have no incoming invitations right now."
                : "You haven't dispatched any collaboration requests yet."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredList.map((collab) => {
              const otherName = activeTab === "incoming" ? collab.senderName : collab.receiverName;
              const otherAvatar =
                activeTab === "incoming" ? collab.senderAvatar : null;

              const statusBg =
                collab.status === "accepted"
                  ? "rgba(16, 185, 129, 0.15)"
                  : collab.status === "rejected"
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(245, 158, 11, 0.15)";
              const statusColor =
                collab.status === "accepted" ? "#10B981" : collab.status === "rejected" ? "#EF4444" : "#F59E0B";

              return (
                <div
                  key={collab.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "18px",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: "280px" }}>
                    <img
                      src={otherAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${otherName}`}
                      alt=""
                      style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#1E293B" }}
                    />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h4 style={{ margin: 0, fontSize: "16px", color: "white", fontWeight: "700" }}>
                          {otherName}
                        </h4>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "6px",
                            background: statusBg,
                            color: statusColor,
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                          }}
                        >
                          {collab.status}
                        </span>
                      </div>

                      <div style={{ fontSize: "13px", color: "#38BDF8", marginTop: "2px", display: "flex", alignItems: "center", gap: "5px" }}>
                        <FolderKanban size={13} />
                        <span>{collab.projectTitle || "Project Collaboration"}</span>
                      </div>

                      <p style={{ margin: "6px 0 0", color: "#94A3B8", fontSize: "13px", lineHeight: "1.5" }}>
                        "{collab.message}"
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {activeTab === "incoming" && collab.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleRespond(collab, "accepted")}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 16px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #10B981, #059669)",
                            border: "none",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          <Check size={14} />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRespond(collab, "rejected")}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#F87171",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          <X size={14} />
                          <span>Decline</span>
                        </button>
                      </>
                    )}

                    <Link
                      to="/chat"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#E2E8F0",
                        textDecoration: "none",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      <MessageSquare size={14} />
                      <span>Message</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default CollaborationRequests;
