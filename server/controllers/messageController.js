const Message = require("../models/Message");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { text, receiverId } = req.body;

    const message = await Message.create({
      sender: req.user,
      receiver: receiverId,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL MESSAGES
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};