const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// Fallback keys from environment or project config
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.REACT_APP_GEMINI_API_KEY || "";

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY || "";

const SYSTEM_PROMPT = `You are JARVIS, the intelligent AI assistant inside BuildX — the premier collaboration, learning, and innovation platform for developers, designers, entrepreneurs, students, and creators.
Your purpose:
1. Assist users with project ideation, tech stacks, architecture design, and sprint task breakdown.
2. Help debug programming issues, recommend best practices, and suggest modern libraries.
3. Recommend skill swap pairings, personalized learning roadmaps, and career growth strategies.
4. Help draft compelling project pitches, collaboration requests, and idea summaries.
Tone: Sophisticated, highly capable, inspiring, concise, and professional.
Format: Use clean Markdown with headers, bullet points, and code blocks where helpful.`;

const handleAIChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Try Gemini First
    if (GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_PROMPT,
        });

        // Format history if provided
        let chat;
        if (Array.isArray(history) && history.length > 0) {
          const contents = history.map((item) => ({
            role: item.role === "assistant" || item.sender === "Jarvis" ? "model" : "user",
            parts: [{ text: item.text || item.content || "" }],
          }));
          chat = model.startChat({ history: contents });
        } else {
          chat = model.startChat();
        }

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        return res.status(200).json({
          success: true,
          reply,
          provider: "gemini",
        });
      } catch (geminiError) {
        console.warn("Gemini API call failed, attempting OpenRouter fallback:", geminiError.message);
      }
    }

    // Fallback to OpenRouter
    if (OPENROUTER_API_KEY) {
      try {
        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
        ];

        if (Array.isArray(history)) {
          history.slice(-6).forEach((h) => {
            messages.push({
              role: h.role === "assistant" || h.sender === "Jarvis" ? "assistant" : "user",
              content: h.text || h.content || "",
            });
          });
        }

        messages.push({ role: "user", content: message });

        const openRouterRes = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "google/gemini-2.0-flash-001",
            messages,
          },
          {
            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://buildx-63e3f.web.app",
              "X-Title": "BuildX Innovation Platform",
            },
            timeout: 25000,
          }
        );

        const reply = openRouterRes.data.choices[0].message.content;
        return res.status(200).json({
          success: true,
          reply,
          provider: "openrouter",
        });
      } catch (openRouterError) {
        console.error("OpenRouter API fallback failed:", openRouterError.message);
      }
    }

    // Built-in intelligent fallback
    return res.status(200).json({
      success: true,
      reply: `Greetings! I am JARVIS. I received your request regarding: "${message}". BuildX collaboration systems are fully operational. You can connect with collaborators, exchange skills, manage Kanban tasks, or launch video collaboration rooms directly from the navigation menu.`,
      provider: "fallback",
    });
  } catch (error) {
    console.error("AI Controller general error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal AI processing error",
      reply: "I encountered an error processing that request. Please try again in a moment.",
    });
  }
};

module.exports = { handleAIChat };

