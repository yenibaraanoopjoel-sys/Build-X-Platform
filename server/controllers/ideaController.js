const Idea = require("../models/Idea");

// CREATE IDEA
exports.createIdea = async (req, res) => {
  try {
    const { title, description, techStack } = req.body;

    const idea = await Idea.create({
      title,
      description,
      techStack,
      createdBy: req.user,
    });

    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL IDEAS
exports.getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(ideas);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET SINGLE IDEA
exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    res.json(idea);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE IDEA
exports.deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    await idea.deleteOne();

    res.json({
      message: "Idea deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};