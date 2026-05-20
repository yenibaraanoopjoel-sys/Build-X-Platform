const Idea = require("../models/Idea");
const Project = require("../models/Project");

// CREATE IDEA + AUTO CREATE PROJECT
exports.createIdea = async (req, res) => {
  try {
    const {
      title,
      description,
      techStack,
      category,
    } = req.body;

    // Create Idea
    const idea = await Idea.create({
      title,
      description,
      techStack,
      category,

      createdBy: req.user,
    });

    // Automatically Create Project
    const project = await Project.create({
      title,

      description,

      owner: req.user,

      linkedIdea: idea._id,

      members: [req.user],

      status: "Pending",

      completionPercentage: 0,

      totalTasks: 0,

      completedTasks: 0,
    });

    // Link Project to Idea
    idea.linkedProject = project._id;

    await idea.save();

    res.status(201).json({
      success: true,

      message:
        "Idea and Project created successfully",

      idea,

      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

// GET ALL IDEAS
exports.getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find()

      .populate(
        "createdBy",
        "name email"
      )

      .populate(
        "collaborators",
        "name email"
      )

      .populate(
        "linkedProject"
      )

      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,

      ideas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

// GET SINGLE IDEA
exports.getIdeaById = async (
  req,
  res
) => {
  try {
    const idea =
      await Idea.findById(
        req.params.id
      )

        .populate(
          "createdBy",
          "name email"
        )

        .populate(
          "collaborators",
          "name email"
        )

        .populate(
          "linkedProject"
        );

    if (!idea) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Idea not found",
        });
    }

    res.json({
      success: true,

      idea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

// DELETE IDEA
exports.deleteIdea = async (
  req,
  res
) => {
  try {
    const idea =
      await Idea.findById(
        req.params.id
      );

    if (!idea) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Idea not found",
        });
    }

    await idea.deleteOne();

    res.json({
      success: true,

      message:
        "Idea deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

// LIKE IDEA
exports.likeIdea = async (
  req,
  res
) => {
  try {
    const idea =
      await Idea.findById(
        req.params.id
      );

    if (!idea) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Idea not found",
        });
    }

    const alreadyLiked =
      idea.likes.includes(
        req.user
      );

    if (alreadyLiked) {
      idea.likes =
        idea.likes.filter(
          (userId) =>
            userId.toString() !==
            req.user.toString()
        );
    } else {
      idea.likes.push(
        req.user
      );
    }

    await idea.save();

    res.json({
      success: true,

      likes:
        idea.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};