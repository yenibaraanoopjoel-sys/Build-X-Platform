import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  subscribeMessages,
  sendMessage,
  getOrCreateDirectConversation,
  getMatchingUsers,
} from "../services/dataService";
import API from "../services/api";
import {
  MessageSquare,
  Send,
  Video,
  Users,
  Paperclip,
  Search,
  Image,
} from "lucide-react";

// Default public channels
const PUBLIC_CHANNELS = [
  {
    id: "channel_general_community",
    name: "General Community",
    type: "channel",
    description: "BuildX global innovation room",
  },
  {
    id: "channel_tech_architecture",
    name: "Tech & Architecture",
    type: "channel",
    description: "Discuss stacks, databases, and APIs",
  },
  {
    id: "channel_startup_founders",
    name: "Startup & Co-Founders",
    type: "channel",
    description: "Connect with entrepreneurs and creators",
  },
];

function Chat() {
  const { currentUser, userProfile } = useAuth();

  const [activeChannel, setActiveChannel] = useState(PUBLIC_CHANNELS[0]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load available users for 1:1 direct chat
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await API.get("/match/users").catch(() => null);
        if (res?.data?.users && res.data.users.length > 0) {
          setAvailableUsers(res.data.users);
          return;
        }
      } catch (e) {
        // Fall through to Firestore
      }
      const directUsers = await getMatchingUsers(currentUser);
      setAvailableUsers(directUsers);
    };

    loadUsers();
  }, [currentUser]);



  // Listen to real-time messages of active channel/conversation
  useEffect(() => {
    if (!activeChannel) return;
    setLoading(true);

    const unsub = subscribeMessages(activeChannel.id, (data) => {
      setMessages(data);
      setLoading(false);
    });

    return () => unsub();
  }, [activeChannel]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!inputText.trim() && !attachmentPreview) || sending || !currentUser) return;

    try {
      setSending(true);
      const user = userProfile || {
        uid: currentUser.uid,
        name: currentUser.displayName || currentUser.email?.split("@")[0] || "Innovator",
        avatar: currentUser.photoURL,
      };

      await sendMessage(activeChannel.id, inputText.trim(), user, attachmentPreview);
      setInputText("");
      setAttachmentPreview(null);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  // Start 1:1 Direct Chat with another member
  const handleStartDirectChat = async (targetUser) => {
    try {
      const user = userProfile || { uid: currentUser.uid, name: currentUser.displayName };
      const convo = await getOrCreateDirectConversation(user, targetUser);
      setActiveChannel({
        id: convo.id,
        name: targetUser.name,
        type: "direct",
        targetUserId: targetUser.id || targetUser.uid,
        avatar: targetUser.avatar,
      });
    } catch (err) {
      console.error("Error opening direct chat:", err);
    }
  };

  // Handle local image attachment preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachmentPreview({
          name: file.name,
          url: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredUsers = availableUsers.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "24px",
          height: "calc(100vh - 120px)",
          minHeight: "600px",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "20px",
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
          className="chat-layout"
        >
          {/* LEFT SIDEBAR: CHANNELS & USERS */}
          <div
            style={{
              background: "rgba(10, 15, 30, 0.6)",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* SEARCH */}
            <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Search size={15} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Find innovators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "white",
                    fontSize: "12px",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* CHANNELS LIST */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", padding: "0 8px 8px", display: "block" }}>
                Public Channels
              </span>

              {PUBLIC_CHANNELS.map((ch) => {
                const active = activeChannel.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: active ? "rgba(56, 189, 248, 0.15)" : "transparent",
                      border: "1px solid",
                      borderColor: active ? "rgba(56, 189, 248, 0.3)" : "transparent",
                      color: active ? "#38BDF8" : "#E2E8F0",
                      fontSize: "13px",
                      fontWeight: active ? "700" : "500",
                      cursor: "pointer",
                      marginBottom: "4px",
                      transition: "all 0.2s",
                    }}
                  >
                    <Users size={16} />
                    <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ch.name}
                    </div>
                  </button>
                );
              })}

              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", padding: "16px 8px 8px", display: "block" }}>
                Direct Messages ({filteredUsers.length})
              </span>

              {filteredUsers.map((u) => {
                const isSelected = activeChannel.type === "direct" && activeChannel.targetUserId === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleStartDirectChat(u)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      background: isSelected ? "rgba(139, 92, 246, 0.15)" : "transparent",
                      border: "1px solid",
                      borderColor: isSelected ? "rgba(139, 92, 246, 0.3)" : "transparent",
                      color: isSelected ? "#C084FC" : "#CBD5E1",
                      fontSize: "13px",
                      cursor: "pointer",
                      marginBottom: "4px",
                    }}
                  >
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                      alt=""
                      style={{ width: "26px", height: "26px", borderRadius: "50%" }}
                    />
                    <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <span style={{ fontWeight: isSelected ? "700" : "500" }}>{u.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT AREA: CHAT THREAD */}
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* CHAT HEADER */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(15, 23, 42, 0.5)",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", color: "white", fontWeight: "700" }}>
                  {activeChannel.name}
                </h3>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                  {activeChannel.description || "Active Firestore Realtime Discussion"}
                </span>
              </div>

              {/* Start Video Meeting for this conversation */}
              <Link
                to={`/meeting/${activeChannel.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                }}
              >
                <Video size={14} />
                <span>Launch Video Call</span>
              </Link>
            </div>

            {/* MESSAGES CONTAINER */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {loading ? (
                <Loader />
              ) : messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748B" }}>
                  <MessageSquare size={36} style={{ opacity: 0.5, marginBottom: "10px" }} />
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    Start the discussion in {activeChannel.name}!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.uid;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        maxWidth: "70%",
                      }}
                    >
                      {!isMe && (
                        <img
                          src={msg.senderAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.senderId}`}
                          alt=""
                          style={{ width: "32px", height: "32px", borderRadius: "50%", marginTop: "4px" }}
                        />
                      )}

                      <div>
                        {!isMe && (
                          <span style={{ fontSize: "11px", fontWeight: "600", color: "#94A3B8", display: "block", marginBottom: "3px" }}>
                            {msg.senderName}
                          </span>
                        )}

                        <div
                          style={{
                            padding: "10px 16px",
                            borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: isMe
                              ? "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)"
                              : "rgba(255, 255, 255, 0.06)",
                            border: "1px solid",
                            borderColor: isMe ? "transparent" : "rgba(255, 255, 255, 0.08)",
                            color: "white",
                            fontSize: "13px",
                            lineHeight: "1.5",
                          }}
                        >
                          {msg.text}

                          {msg.fileAttachment && (
                            <div style={{ marginTop: "8px" }}>
                              <img
                                src={msg.fileAttachment.url}
                                alt="Attachment"
                                style={{ maxWidth: "220px", borderRadius: "8px", display: "block" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ATTACHMENT PREVIEW */}
            {attachmentPreview && (
              <div
                style={{
                  padding: "8px 24px",
                  background: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#38BDF8" }}>
                  <Image size={14} />
                  <span>{attachmentPreview.name}</span>
                </div>
                <button
                  onClick={() => setAttachmentPreview(null)}
                  style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "13px" }}
                >
                  Remove
                </button>
              </div>
            )}

            {/* INPUT FORM */}
            <form
              onSubmit={handleSend}
              style={{
                padding: "14px 24px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                background: "rgba(15, 23, 42, 0.6)",
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach image"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  padding: "6px",
                }}
              >
                <Paperclip size={18} />
              </button>

              <input
                type="text"
                placeholder={`Message #${activeChannel.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={sending}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
                  fontSize: "13px",
                  outline: "none",
                }}
              />

              <button
                type="submit"
                disabled={(!inputText.trim() && !attachmentPreview) || sending}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background:
                    inputText.trim() || attachmentPreview
                      ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                      : "rgba(255,255,255,0.05)",
                  border: "none",
                  color: inputText.trim() || attachmentPreview ? "white" : "#64748B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: inputText.trim() || attachmentPreview ? "pointer" : "default",
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 820px) {
          .chat-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default Chat;
