const express = require("express");

const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({
        reply: "Message is required",
      });
    }

    console.log(
      "Incoming Message:",
      message
    );

    // OpenRouter API Request
    const response =
      await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model:
            "openai/gpt-4o-mini",

          messages: [
            {
              role: "system",

              content:
                "You are JARVIS AI inside BuildX. You help users with coding, productivity, startups, collaboration, AI tools, learning, project management, and futuristic innovation. Be intelligent, concise, modern, and helpful.",
            },

            {
              role: "user",

              content: message,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

            "Content-Type":
              "application/json",

            "HTTP-Referer":
              "https://build-x-platform.vercel.app",

            "X-Title":
              "BuildX AI Platform",
          },

          timeout: 30000,
        }
      );

    console.log(
      "OpenRouter Response Success"
    );

    // Extract AI Reply
    const reply =
      response.data.choices?.[0]
        ?.message?.content ||
      "No response generated.";

    // Send Reply
    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.log(
      "=============================="
    );

    console.log(
      "FULL OPENROUTER ERROR:"
    );

    console.log(error);

    console.log(
      "Error Response Data:"
    );

    console.log(
      error.response?.data
    );

    console.log(
      "Error Message:"
    );

    console.log(error.message);

    console.log(
      "=============================="
    );

    res.status(500).json({
      reply:
        "Sorry boss, AI service is temporarily unavailable.",
    });
  }
});

module.exports = router;