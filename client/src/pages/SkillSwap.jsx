import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  sendSkillExchangeRequest,
  respondSkillExchange,
  getSkillExchanges,
  getMatchingUsers,
} from "../services/dataService";
import API from "../services/api";
import {
  Repeat,
  Sparkles,
  Award,
  BookOpen,
} from "lucide-react";

function SkillSwap() {
  const { currentUser, userProfile } = useAuth();

  const [matchedUsers, setMatchedUsers] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Send request modal state
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);
  const [offerSkill, setOfferSkill] = useState("");
  const [wantSkill, setWantSkill] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const userSkillsHave = userProfile?.skills || ["React", "JavaScript"];
  const userSkillsWant = userProfile?.skillsToLearn || ["AI Integration", "Cloud Architecture"];

  const fetchSkillSwapData = useCallback(async () => {
    try {
      setLoading(true);

      const [matchRes, exchangesData] = await Promise.all([
        API.get("/match/users").catch(() => ({ data: { users: [] } })),
        currentUser ? getSkillExchanges(currentUser.uid) : Promise.resolve([]),
      ]);

      let users = matchRes.data?.users;
      if (!users || users.length === 0) {
        users = await getMatchingUsers(currentUser);
      }

      setMatchedUsers(users || []);
      setExchanges(exchangesData);
    } catch (err) {
      console.error("Error loading skill swap data:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchSkillSwapData();
  }, [fetchSkillSwapData]);

  // Open Swap Modal
  const openSwapModal = (targetUser) => {
    setSelectedUserForSwap(targetUser);
    setOfferSkill(userSkillsHave[0] || "");
    setWantSkill(targetUser.skills?.[0] || "");
    setSuccessMsg("");
  };

  // Submit Swap Request
  const handleSendSwap = async (e) => {
    e.preventDefault();
    if (!offerSkill.trim() || !wantSkill.trim() || !selectedUserForSwap || !currentUser) return;

    try {
      setModalLoading(true);
      const user = userProfile || {
        uid: currentUser.uid,
        name: currentUser.displayName,
        role: "Developer",
      };

      await sendSkillExchangeRequest(selectedUserForSwap, offerSkill, wantSkill, user);
      setSuccessMsg(`Skill swap request sent to ${selectedUserForSwap.name}!`);

      setTimeout(() => {
        setSelectedUserForSwap(null);
        fetchSkillSwapData();
      }, 1200);
    } catch (err) {
      console.error("Failed to send skill swap request:", err);
    } finally {
      setModalLoading(false);
    }
  };

  // Accept or Reject Request
  const handleResponse = async (exchangeId, status, requesterId, requesterName) => {
    try {
      const user = userProfile || { uid: currentUser.uid, name: currentUser.displayName };
      await respondSkillExchange(exchangeId, status, requesterId, requesterName, user);
      setExchanges((prev) =>
        prev.map((ex) => (ex.id === exchangeId ? { ...ex, status } : ex))
      );
    } catch (err) {
      console.error("Failed to update exchange status:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main style={{ maxWidth: "1320px", margin: "0 auto", padding: "36px 24px" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#A855F7", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
            <Repeat size={16} />
            <span>PEER-TO-PEER KNOWLEDGE EXCHANGE</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#FFFFFF" }}>
            Skill Swap
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94A3B8", fontSize: "14px" }}>
            Teach what you master, learn what you desire. Connect with engineers for 1-on-1 skill exchanges.
          </p>
        </div>

        {/* MY SKILL OVERVIEW BAR */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "22px",
            padding: "26px",
            marginBottom: "36px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
          className="skills-grid"
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Award size={18} color="#10B981" />
              <h3 style={{ margin: 0, fontSize: "16px", color: "white" }}>Skills I Can Teach (Skills I Have)</h3>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {userSkillsHave.map((sk, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#34D399",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <BookOpen size={18} color="#3B82F6" />
              <h3 style={{ margin: 0, fontSize: "16px", color: "white" }}>Skills I Want to Learn</h3>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {userSkillsWant.map((sk, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "10px",
                    background: "rgba(59, 130, 246, 0.15)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    color: "#60A5FA",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIVE / PENDING EXCHANGES SECTION */}
        {exchanges.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#FFFFFF", marginBottom: "16px" }}>
              My Skill Exchanges ({exchanges.length})
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
              {exchanges.map((ex) => {
                const isIncoming = ex.targetUserId === currentUser?.uid;

                const statusBg =
                  ex.status === "accepted"
                    ? "rgba(16, 185, 129, 0.15)"
                    : ex.status === "rejected"
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(245, 158, 11, 0.15)";
                const statusColor =
                  ex.status === "accepted" ? "#10B981" : ex.status === "rejected" ? "#EF4444" : "#F59E0B";

                return (
                  <div
                    key={ex.id}
                    style={{
                      background: "rgba(15, 23, 42, 0.75)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "18px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                          {isIncoming ? `From ${ex.requesterName}` : `To ${ex.targetUserName}`}
                        </span>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: statusBg,
                            color: statusColor,
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                          }}
                        >
                          {ex.status}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                        <div style={{ flex: 1, padding: "8px 12px", background: "rgba(16,185,129,0.08)", borderRadius: "10px" }}>
                          <span style={{ fontSize: "10px", color: "#94A3B8", display: "block" }}>Offered:</span>
                          <span style={{ color: "#34D399", fontSize: "13px", fontWeight: "600" }}>{ex.offerSkill}</span>
                        </div>
                        <Repeat size={16} color="#94A3B8" />
                        <div style={{ flex: 1, padding: "8px 12px", background: "rgba(59,130,246,0.08)", borderRadius: "10px" }}>
                          <span style={{ fontSize: "10px", color: "#94A3B8", display: "block" }}>Wanted:</span>
                          <span style={{ color: "#60A5FA", fontSize: "13px", fontWeight: "600" }}>{ex.wantSkill}</span>
                        </div>
                      </div>
                    </div>

                    {isIncoming && ex.status === "pending" && (
                      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                        <button
                          onClick={() => handleResponse(ex.id, "accepted", ex.requesterId, ex.requesterName)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, #10B981, #059669)",
                            border: "none",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleResponse(ex.id, "rejected", ex.requesterId, ex.requesterName)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "8px",
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#F87171",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* INTELLIGENT MATCHING USERS GRID */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <Sparkles size={18} color="#38BDF8" />
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>
              AI Intelligent Skill Matches ({matchedUsers.length})
            </h2>
          </div>

          {loading ? (
            <Loader />
          ) : matchedUsers.length === 0 ? (
            <p style={{ color: "#64748B", textAlign: "center", padding: "60px 0" }}>
              No other users found for skill matching yet. Invite friends and collaborators to join BuildX!
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                gap: "22px",
              }}
            >
              {matchedUsers.map((targetUser) => (
                <div
                  key={targetUser.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* USER HEADER */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={targetUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${targetUser.id}`}
                          alt=""
                          style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#1E293B" }}
                        />
                        <div>
                          <h4 style={{ margin: 0, fontSize: "16px", color: "white", fontWeight: "700" }}>
                            {targetUser.name}
                          </h4>
                          <span style={{ fontSize: "12px", color: "#94A3B8" }}>{targetUser.role}</span>
                        </div>
                      </div>

                      {targetUser.matchScore > 0 && (
                        <div
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            background: "rgba(56, 189, 248, 0.15)",
                            border: "1px solid rgba(56, 189, 248, 0.3)",
                            color: "#38BDF8",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {targetUser.matchScore} pts match
                        </div>
                      )}
                    </div>

                    <p style={{ margin: "0 0 16px", color: "#94A3B8", fontSize: "13px", lineHeight: "1.5" }}>
                      {targetUser.bio || "Active innovator on BuildX."}
                    </p>

                    {/* MATCHED RATIONALE */}
                    {targetUser.matchedSkills && targetUser.matchedSkills.length > 0 && (
                      <div style={{ marginBottom: "14px", padding: "8px 12px", background: "rgba(56, 189, 248, 0.06)", borderRadius: "10px" }}>
                        {targetUser.matchedSkills.map((m, idx) => (
                          <div key={idx} style={{ color: "#38BDF8", fontSize: "11px", fontWeight: "600" }}>
                            ✓ {m}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SKILLS THEY HAVE */}
                    <div style={{ marginBottom: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#64748B", fontWeight: "600", textTransform: "uppercase" }}>
                        Can Teach You:
                      </span>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                        {(targetUser.skills || []).map((sk, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: "2px 8px",
                              borderRadius: "6px",
                              background: "rgba(16, 185, 129, 0.1)",
                              color: "#34D399",
                              fontSize: "11px",
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* SKILLS THEY WANT */}
                    <div style={{ marginBottom: "18px" }}>
                      <span style={{ fontSize: "11px", color: "#64748B", fontWeight: "600", textTransform: "uppercase" }}>
                        Wants to Learn:
                      </span>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                        {(targetUser.skillsToLearn || []).map((sk, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: "2px 8px",
                              borderRadius: "6px",
                              background: "rgba(59, 130, 246, 0.1)",
                              color: "#60A5FA",
                              fontSize: "11px",
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openSwapModal(targetUser)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                      border: "none",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 6px 16px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    <Repeat size={14} />
                    <span>Send Swap Request</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* SWAP REQUEST MODAL */}
      {selectedUserForSwap && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedUserForSwap(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "#0F172A",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "white" }}>
                Swap Skills with {selectedUserForSwap.name}
              </h3>
              <button
                onClick={() => setSelectedUserForSwap(null)}
                style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            {successMsg ? (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#6EE7B7",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSendSwap} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Skill You Will Teach (Offer)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React Architecture"
                    value={offerSkill}
                    onChange={(e) => setOfferSkill(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Skill You Want to Learn (Request from {selectedUserForSwap.name})
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UI/UX Design System"
                    value={wantSkill}
                    onChange={(e) => setWantSkill(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedUserForSwap(null)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.06)",
                      border: "none",
                      color: "#94A3B8",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                      border: "none",
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    {modalLoading ? "Sending..." : "Submit Exchange"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default SkillSwap;
