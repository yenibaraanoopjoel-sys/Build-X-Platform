import { useState } from "react";

function ChatBox({
  messages = [],
  onSendMessage,
}) {
  const [text, setText] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    // Prevent empty messages
    if (!text.trim()) {
      return;
    }

    // Send Message
    onSendMessage(text);

    // Clear Input
    setText("");
  };

  return (
    <div
      style={{
        border:
          "1px solid rgba(255,255,255,0.08)",

        borderRadius: "22px",

        padding: "24px",

        background:
          "rgba(255,255,255,0.05)",

        backdropFilter: "blur(12px)",

        height: "600px",

        display: "flex",

        flexDirection: "column",

        boxShadow:
          "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Chat Header */}
      <h2
        style={{
          marginBottom: "24px",

          fontSize: "28px",

          color: "white",
        }}
      >
        Messages 💬
      </h2>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,

          overflowY: "auto",

          marginBottom: "20px",

          display: "flex",

          flexDirection: "column",

          gap: "14px",

          paddingRight: "6px",
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              color: "#94A3B8",
            }}
          >
            No messages yet
          </p>
        ) : (
          messages.map((message, index) => {
            const isYou =
              message.sender?.name === "You";

            return (
              <div
                key={index}
                style={{
                  alignSelf: isYou
                    ? "flex-end"
                    : "flex-start",

                  maxWidth: "75%",
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",

                    borderRadius: "18px",

                    background: isYou
                      ? "linear-gradient(to right, #2563EB, #7C3AED)"
                      : "rgba(255,255,255,0.08)",

                    color: "white",

                    boxShadow:
                      "0 4px 14px rgba(0,0,0,0.2)",
                  }}
                >
                  <strong
                    style={{
                      display: "block",

                      marginBottom: "6px",

                      fontSize: "14px",

                      color: "#E2E8F0",
                    }}
                  >
                    {message.sender?.name ||
                      "User"}
                  </strong>

                  <p
                    style={{
                      lineHeight: "1.5",
                    }}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={submitHandler}
        style={{
          display: "flex",

          gap: "14px",
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          style={{
            flex: 1,

            padding: "16px",

            borderRadius: "14px",

            border:
              "1px solid rgba(255,255,255,0.08)",

            background:
              "rgba(255,255,255,0.05)",

            color: "white",

            outline: "none",

            fontSize: "15px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "14px 28px",

            border: "none",

            borderRadius: "14px",

            cursor: "pointer",

            background:
              "linear-gradient(to right, #2563EB, #7C3AED)",

            color: "white",

            fontWeight: "bold",

            fontSize: "15px",

            transition: "0.3s",

            boxShadow:
              "0 6px 18px rgba(37,99,235,0.35)",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;