import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  getIdeas,
  toggleLikeIdea,
  deleteIdea,
  getIdeaComments,
  addIdeaComment,
  sendCollaborationRequest,
} from "../services/dataService";
import {
  Lightbulb,
  Plus,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Users,
  Check,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Technology",
  "Artificial Intelligence",
  "Web3 & Blockchain",
  "EdTech & Learning",
  "FinTech",
  "Design & UI/UX",
  "Health & Wellness",
  "Open Source",
];

function Ideas() {
  const { currentUser, userProfile } = useAuth();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Comment Modal state
  const [activeIdeaForComments, setActiveIdeaForComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Collab request state
  const [collabSentMap, setCollabSentMap] = useState({});

  const fetchIdeasData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getIdeas(selectedCategory, searchTerm);
      setIdeas(data);
    } catch (err) {
      console.error("Error loading ideas:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchIdeasData();
  }, [fetchIdeasData]);

  // Handle Like
  const handleLike = async (ideaId) => {
    if (!currentUser) return;
    try {
      // Optimistic update
      setIdeas((prev) =>
        prev.map((idea) => {
          if (idea.id === ideaId) {
            const likes = idea.likes || [];
            const hasLiked = likes.includes(currentUser.uid);
            return {
              ...idea,
              likes: hasLiked
                ? likes.filter((uid) => uid !== currentUser.uid)
                : [...likes, currentUser.uid],
            };
          }
          return idea;
        })
      );
      await toggleLikeIdea(ideaId, currentUser.uid);
    } catch (err) {
      console.error("Failed to toggle like:", err);
      fetchIdeasData();
    }
  };

  // Handle Delete
  const handleDelete = async (ideaId) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;
    try {
      await deleteIdea(ideaId);
      setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
    } catch (err) {
      console.error("Failed to delete idea:", err);
    }
  };

  // Handle Comments Drawer
  const openComments = async (idea) => {
    setActiveIdeaForComments(idea);
    try {
      const data = await getIdeaComments(idea.id);
      setComments(data);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeIdeaForComments || !currentUser) return;
    try {
      setCommentLoading(true);
      const newComment = await addIdeaComment(
        activeIdeaForComments.id,
        commentInput.trim(),
        userProfile || { uid: currentUser.uid, name: currentUser.displayName }
      );
      setComments((prev) => [...prev, newComment]);
      setCommentInput("");

      // Update commentsCount locally
      setIdeas((prev) =>
        prev.map((i) =>
          i.id === activeIdeaForComments.id
            ? { ...i, commentsCount: (i.commentsCount || 0) + 1 }
            : i
        )
      );
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle Collaborate / Express Interest
  const handleExpressInterest = async (idea) => {
    if (!currentUser || idea.authorId === currentUser.uid) return;
    try {
      await sendCollaborationRequest(
        idea.authorId,
        idea.authorName,
        idea.id,
        `Idea: ${idea.title}`,
        `Hi ${idea.authorName}, I saw your idea "${idea.title}" on BuildX and would love to collaborate with you!`,
        userProfile || { uid: currentUser.uid, name: currentUser.displayName }
      );
      setCollabSentMap((prev) => ({ ...prev, [idea.id]: true }));
    } catch (err) {
      console.error("Error sending collab request:", err);
    }
  };

  // Handle Share Link
  const handleShare = (idea) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + "/ideas");
      alert("Link to BuildX Ideas Hub copied to clipboard!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main style={{ maxWidth: "1320px", margin: "0 auto", padding: "36px 24px" }}>
        {/* HEADER BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#F59E0B", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
              <Lightbulb size={16} />
              <span>INNOVATION & DISCOVERY HUB</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#FFFFFF" }}>
              Ideas Hub
            </h1>
            <p style={{ margin: "4px 0 0", color: "#94A3B8", fontSize: "14px" }}>
              Publish startup concepts, discover breakthrough ideas, and find collaborators.
            </p>
          </div>

          <Link
            to="/post-idea"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "14px",
              textDecoration: "none",
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
            }}
          >
            <Plus size={18} />
            <span>Publish New Idea</span>
          </Link>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {/* SEARCH INPUT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 18px",
              borderRadius: "14px",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              maxWidth: "500px",
            }}
          >
            <Search size={18} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search ideas by title, description or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          {/* CATEGORY PILLS */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    background: active ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.04)",
                    border: "1px solid",
                    borderColor: active ? "#38BDF8" : "rgba(255, 255, 255, 0.08)",
                    color: active ? "#38BDF8" : "#94A3B8",
                    fontSize: "13px",
                    fontWeight: active ? "700" : "500",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* IDEAS CARDS GRID */}
        {loading ? (
          <Loader />
        ) : ideas.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "rgba(15, 23, 42, 0.5)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Lightbulb size={48} color="#F59E0B" style={{ opacity: 0.6, marginBottom: "16px" }} />
            <h3 style={{ color: "#FFFFFF", fontSize: "20px", margin: "0 0 8px" }}>No Ideas Found</h3>
            <p style={{ color: "#94A3B8", fontSize: "14px", maxWidth: "400px", margin: "0 auto 20px" }}>
              Be the first to publish a breakthrough idea in this category!
            </p>
            <Link
              to="/post-idea"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              <Plus size={16} />
              <span>Create Idea</span>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "24px",
            }}
          >
            {ideas.map((idea) => {
              const isOwner = currentUser && idea.authorId === currentUser.uid;
              const hasLiked = currentUser && Array.isArray(idea.likes) && idea.likes.includes(currentUser.uid);
              const isCollabSent = collabSentMap[idea.id];

              return (
                <div
                  key={idea.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.2s",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div>
                    {/* TOP META */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          background: "rgba(56, 189, 248, 0.12)",
                          color: "#38BDF8",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {idea.category || "General"}
                      </span>

                      {isOwner && (
                        <button
                          onClick={() => handleDelete(idea.id)}
                          title="Delete my idea"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* TITLE & DESCRIPTION */}
                    <h3 style={{ margin: "0 0 10px", fontSize: "18px", fontWeight: "700", color: "#FFFFFF", lineHeight: "1.4" }}>
                      {idea.title}
                    </h3>
                    <p style={{ margin: "0 0 16px", color: "#94A3B8", fontSize: "14px", lineHeight: "1.6" }}>
                      {idea.description}
                    </p>

                    {/* REQUIRED SKILLS */}
                    {idea.requiredSkills && idea.requiredSkills.length > 0 && (
                      <div style={{ marginBottom: "18px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748B", textTransform: "uppercase" }}>
                          Required Skills
                        </span>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                          {idea.requiredSkills.map((sk, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "3px 8px",
                                borderRadius: "6px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                color: "#CBD5E1",
                                fontSize: "11px",
                              }}
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* AUTHOR INFO */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        paddingTop: "14px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                        marginBottom: "16px",
                      }}
                    >
                      <img
                        src={idea.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${idea.authorId}`}
                        alt=""
                        style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1E293B" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#E2E8F0" }}>{idea.authorName}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>{idea.authorRole || "Creator"}</div>
                      </div>
                    </div>

                    {/* ACTIONS: LIKE, COMMENT, COLLAB */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <button
                          onClick={() => handleLike(idea.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: hasLiked ? "#EF4444" : "#94A3B8",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            cursor: "pointer",
                            fontSize: "13px",
                            padding: 0,
                          }}
                        >
                          <Heart size={16} fill={hasLiked ? "#EF4444" : "none"} />
                          <span>{(idea.likes || []).length}</span>
                        </button>

                        <button
                          onClick={() => openComments(idea)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#94A3B8",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            cursor: "pointer",
                            fontSize: "13px",
                            padding: 0,
                          }}
                        >
                          <MessageCircle size={16} />
                          <span>{idea.commentsCount || 0}</span>
                        </button>

                        <button
                          onClick={() => handleShare(idea)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#94A3B8",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          <Share2 size={16} />
                        </button>
                      </div>

                      {!isOwner && (
                        <button
                          onClick={() => handleExpressInterest(idea)}
                          disabled={isCollabSent}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "10px",
                            background: isCollabSent ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.15)",
                            border: "1px solid",
                            borderColor: isCollabSent ? "#10B981" : "#3B82F6",
                            color: isCollabSent ? "#10B981" : "#38BDF8",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: isCollabSent ? "default" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          {isCollabSent ? (
                            <>
                              <Check size={13} />
                              <span>Request Sent</span>
                            </>
                          ) : (
                            <>
                              <Users size={13} />
                              <span>Collaborate</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* COMMENTS MODAL / DRAWER */}
      {activeIdeaForComments && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setActiveIdeaForComments(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              maxHeight: "85vh",
              background: "#0F172A",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", color: "white" }}>Discussion</h3>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>{activeIdeaForComments.title}</span>
              </div>
              <button
                onClick={() => setActiveIdeaForComments(null)}
                style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            {/* COMMENTS LIST */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {comments.length === 0 ? (
                <p style={{ color: "#64748B", textAlign: "center", padding: "30px 0", fontSize: "14px" }}>
                  No comments yet. Share your feedback or ideas!
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} style={{ display: "flex", gap: "10px" }}>
                    <img
                      src={c.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.authorId}`}
                      alt=""
                      style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                    />
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "10px 14px" }}>
                      <div style={{ fontSize: "12px", fontWeight: "700", color: "#E2E8F0" }}>{c.authorName}</div>
                      <div style={{ fontSize: "13px", color: "#CBD5E1", marginTop: "3px" }}>{c.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* COMMENT INPUT */}
            <form
              onSubmit={handleAddComment}
              style={{
                padding: "16px 20px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Write a constructive comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={commentLoading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={!commentInput.trim() || commentLoading}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ideas;
