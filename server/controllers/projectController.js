const Project = require("../models/Project");
const Task = require("../models/Task");

// CREATE PROJECT
exports.createProject = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      linkedIdea,
    } = req.body;

    const project =
      await Project.create({
        title,

        description,

        owner: req.user,

        members: [req.user],

        linkedIdea,

        status: "Pending",

        completionPercentage: 0,

        totalTasks: 0,

        completedTasks: 0,
      });

    res.status(201).json({
      success: true,

      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

// GET ALL PROJECTS
exports.getProjects = async (
  req,
  res
) => {
  try {
    const projects =
      await Project.find()

        .populate(
          "owner",
          "name email"
        )

        .populate(
          "members",
          "name email"
        )

        .populate(
          "linkedIdea"
        )

        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,

      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

// GET SINGLE PROJECT
exports.getProjectById =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.id
        )

          .populate(
            "owner",
            "name email"
          )

          .populate(
            "members",
            "name email"
          )

          .populate(
            "linkedIdea"
          );

      if (!project) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Project not found",
          });
      }

      // Get Tasks
      const tasks =
        await Task.find({
          project:
            project._id,
        }).populate(
          "assignedTo",
          "name email"
        );

      res.json({
        success: true,

        project,

        tasks,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error: error.message,
      });
    }
  };

// UPDATE PROJECT STATUS
exports.updateProjectStatus =
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Project not found",
          });
      }

      project.status =
        status;

      await project.save();

      res.json({
        success: true,

        message:
          "Project status updated",

        project,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error: error.message,
      });
    }
  };

// ADD MEMBER TO PROJECT
exports.addMember =
  async (req, res) => {
    try {
      const {
        userId,
      } = req.body;

      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Project not found",
          });
      }

      const alreadyMember =
        project.members.includes(
          userId
        );

      if (
        !alreadyMember
      ) {
        project.members.push(
          userId
        );

        await project.save();
      }

      res.json({
        success: true,

        message:
          "Member added successfully",

        project,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error: error.message,
      });
    }
  };

// DELETE PROJECT
exports.deleteProject =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Project not found",
          });
      }

      // Delete Tasks
      await Task.deleteMany({
        project:
          project._id,
      });

      // Delete Project
      await project.deleteOne();

      res.json({
        success: true,

        message:
          "Project deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error: error.message,
      });
    }
  };