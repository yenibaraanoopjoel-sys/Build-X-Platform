import { useState } from "react";

import axios from "axios";

function Jarvis() {
  const [open, setOpen] =
    useState(false);

  const [messages, setMessages] =
    useState([
      {
        sender: "Jarvis",

        text:
          "Hello boss 👋 I am JARVIS, your BuildX AI assistant. How can I help you today?",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Send Message
  const handleSendMessage =
    async () => {
      if (!input.trim()) return;

      const userMessage = {
        sender: "You",

        text: input,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      const userInput = input;

      setInput("");

      setLoading(true);

      try {
        const response =
          await axios.post(
            "https://build-x-platform.onrender.com",
            {
              message:
                userInput,
            }
          );

        const jarvisReply = {
          sender: "Jarvis",

          text:
            response.data.reply,
        };

        setMessages((prev) => [
          ...prev,
          jarvisReply,
        ]);
      } catch (error) {
        console.log(error);

        setMessages((prev) => [
          ...prev,
          {
            sender: "Jarvis",

            text:
              "Sorry boss, AI service is temporarily unavailable.",
          },
        ]);
      }

      setLoading(false);
    };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        style={{
          position: "fixed",

          bottom: "30px",

          right: "30px",

          width: "75px",

          height: "75px",

          borderRadius: "50%",

          border: "none",

          cursor: "pointer",

          fontSize: "30px",

          color: "white",

          zIndex: 1000,

          background:
            "linear-gradient(to right, #2563EB, #7C3AED)",

          boxShadow:
            "0 8px 30px rgba(124,58,237,0.5)",
        }}
      >
        🤖
      </button>

      {/* Popup */}
      {open && (
        <div
          style={{
            position: "fixed",

            bottom: "120px",

            right: "30px",

            width: "370px",

            height: "550px",

            background:
              "rgba(15,23,42,0.98)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            borderRadius: "28px",

            backdropFilter:
              "blur(12px)",

            display: "flex",

            flexDirection:
              "column",

            overflow: "hidden",

            zIndex: 1000,

            boxShadow:
              "0 8px 40px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px",

              background:
                "linear-gradient(to right, #2563EB, #7C3AED)",

              color: "white",
            }}
          >
            <h2
              style={{
                marginBottom: "6px",
              }}
            >
              JARVIS AI 🚀
            </h2>

            <p
              style={{
                fontSize: "14px",
              }}
            >
              BuildX Productivity Assistant
            </p>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,

              padding: "18px",

              overflowY: "auto",

              display: "flex",

              flexDirection:
                "column",

              gap: "14px",
            }}
          >
            {messages.map(
              (message, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf:
                      message.sender ===
                      "You"
                        ? "flex-end"
                        : "flex-start",

                    maxWidth: "80%",
                  }}
                >
                  <div
                    style={{
                      padding:
                        "14px 18px",

                      borderRadius:
                        "18px",

                      background:
                        message.sender ===
                        "You"
                          ? "linear-gradient(to right, #2563EB, #7C3AED)"
                          : "rgba(255,255,255,0.08)",

                      color: "white",
                    }}
                  >
                    <strong>
                      {message.sender}
                    </strong>

                    <p
                      style={{
                        marginTop: "6px",

                        lineHeight:
                          "1.6",

                        whiteSpace:
                          "pre-wrap",
                      }}
                    >
                      {message.text}
                    </p>
                  </div>
                </div>
              )
            )}

            {loading && (
              <div
                style={{
                  color: "#CBD5E1",
                }}
              >
                JARVIS is thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "18px",

              borderTop:
                "1px solid rgba(255,255,255,0.08)",

              display: "flex",

              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Ask JARVIS..."
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleSendMessage();
                }
              }}
              style={{
                flex: 1,

                padding: "14px",

                borderRadius: "14px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                background:
                  "rgba(255,255,255,0.05)",

                color: "white",

                outline: "none",
              }}
            />

            <button
              onClick={
                handleSendMessage
              }
              style={{
                padding:
                  "14px 18px",

                border: "none",

                borderRadius:
                  "14px",

                cursor: "pointer",

                background:
                  "linear-gradient(to right, #2563EB, #7C3AED)",

                color: "white",

                fontWeight: "bold",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Jarvis;