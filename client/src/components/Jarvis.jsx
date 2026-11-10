import React, { useState, useRef, useEffect } from "react";
import { askJarvisAI } from "../services/aiService";
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Lightbulb,
  ListTodo,
  BookOpen,
  Code,
  Bot,
} from "lucide-react";

function Jarvis() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      sender: "Jarvis",
      text: "Greetings! I am JARVIS, your BuildX AI architect. How may I assist your engineering, project planning, or skill growth today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSendMessage = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      role: "user",
      sender: "You",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const response = await askJarvisAI({
        message: textToSend,
        history: messages.slice(-8), // Send recent context
      });

      const reply =
        response.reply ||
        "I have processed your request. Let's build something extraordinary.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          sender: "Jarvis",
          text: reply,
        },
      ]);
    } catch (err) {
      console.error("Jarvis API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          sender: "Jarvis",
          text: "My neural link experienced a momentary delay. Please verify your connection or try again shortly.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        sender: "Jarvis",
        text: "Conversation cleared. Ready for your next idea, sprint planning, or code challenge.",
      },
    ]);
  };

  const quickPrompts = [
    { label: "Brainstorm Ideas", prompt: "Brainstorm 3 cutting-edge full-stack project ideas for BuildX innovators.", icon: Lightbulb },
    { label: "Plan Sprint Tasks", prompt: "Help me break down a collaborative web project into a structured sprint with Kanban tasks.", icon: ListTodo },
    { label: "Skill Roadmap", prompt: "What skills should a React developer master next to become a full-stack AI engineer?", icon: BookOpen },
    { label: "Debug Architecture", prompt: "What are best practices for Firestore security rules and real-time state synchronization?", icon: Code },
  ];

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 10px 25px rgba(99, 102, 241, 0.5), 0 0 15px rgba(56, 189, 248, 0.3)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 9999,
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          aria-label="Open JARVIS AI"
        >
          <Sparkles size={28} />
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "420px",
            maxWidth: "92vw",
            height: "600px",
            maxHeight: "85vh",
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "24px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 10000,
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: "16px 20px",
              background: "linear-gradient(90deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  boxShadow: "0 0 12px rgba(59, 130, 246, 0.5)",
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "1px" }}>
                  JARVIS
                </h3>
                <span style={{ fontSize: "11px", color: "#10B981", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
                  AI Architect Active
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={clearChat}
                title="Clear Chat"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                }}
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* MESSAGES LIST */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {/* QUICK SUGGESTIONS */}
            {messages.length === 1 && (
              <div style={{ marginBottom: "10px" }}>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#94A3B8" }}>Suggested actions:</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(qp.prompt)}
                      style={{
                        padding: "8px 10px",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "10px",
                        color: "#E2E8F0",
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                    >
                      <qp.icon size={14} color="#38BDF8" />
                      <span>{qp.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => {
              const isUser = msg.sender === "You" || msg.role === "user";
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: isUser ? "#38BDF8" : "#94A3B8",
                      marginBottom: "4px",
                      fontWeight: "600",
                    }}
                  >
                    {isUser ? "You" : "JARVIS AI"}
                  </div>
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "12px 16px",
                      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isUser
                        ? "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)"
                        : "rgba(255, 255, 255, 0.06)",
                      border: "1px solid",
                      borderColor: isUser ? "transparent" : "rgba(255, 255, 255, 0.08)",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      lineHeight: "1.55",
                      whiteSpace: "pre-wrap",
                      boxShadow: isUser ? "0 4px 14px rgba(37, 99, 235, 0.3)" : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ fontSize: "11px", color: "#94A3B8", marginBottom: "4px" }}>JARVIS AI</div>
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#94A3B8",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#38BDF8",
                      animation: "pulse 1s infinite alternate",
                    }}
                  />
                  Synthesizing guidance...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: "14px 18px",
              background: "rgba(10, 15, 30, 0.9)",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Ask JARVIS about ideas, code, roadmaps..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: input.trim() && !loading ? "linear-gradient(135deg, #3B82F6, #8B5CF6)" : "rgba(255,255,255,0.05)",
                border: "none",
                color: input.trim() && !loading ? "#FFFFFF" : "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !loading ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Jarvis;
