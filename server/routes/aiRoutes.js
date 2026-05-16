const express = require("express");

const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const response =
      await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model:
            "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "system",

              content:
                "You are JARVIS AI inside BuildX. You help users with coding, productivity, collaboration, and learning.",
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
          },
        }
      );

    const reply =
      response.data.choices[0]
        .message.content;

    res.json({
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
        "AI service temporarily unavailable",
    });
  }
});

module.exports = router;