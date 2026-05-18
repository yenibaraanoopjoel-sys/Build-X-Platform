const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required",
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content:
              "You are JARVIS AI inside BuildX. You help users with coding, productivity, startups, AI tools, collaboration, learning, and futuristic project management.",
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
          "Content-Type": "application/json",

          "HTTP-Referer":
            "https://build-x-platform.vercel.app",

          "X-Title":
            "BuildX AI Platform",
        },
      }
    );

    const reply =
      response.data.choices[0].message.content;

    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.log(
      "OPENROUTER ERROR:",
      error.response?.data ||
        error.message
    );

    res.status(500).json({
      reply:
        "Sorry boss, AI service is temporarily unavailable.",
    });
  }
});

module.exports = router;