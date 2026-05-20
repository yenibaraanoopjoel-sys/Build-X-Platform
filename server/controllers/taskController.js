const Task = require("../models/Task");

const Project = require("../models/Project");

const User = require("../models/User");

//
// AUTO ASSIGN TASK
//
const autoAssignTask =
  async (
    title,
    description,
    projectId
  ) => {
    // FIND PROJECT
    const project =
      await Project.findById(
        projectId
      ).populate("members");

    if (!project) {
      return null;
    }

    // COMBINE TEXT
    const taskText = `
${title}
${description}
`
      .toLowerCase();

    // PRIORITY ROLE MATCHING
    let preferredRole = "";

    if (
      taskText.includes(
        "frontend"
      ) ||
      taskText.includes(
        "react"
      ) ||
      taskText.includes("ui")
    ) {
      preferredRole =
        "Frontend Developer";
    }

    else if (
      taskText.includes(
        "backend"
      ) ||
      taskText.includes(
        "api"
      ) ||
      taskText.includes(
        "database"
      ) ||
      taskText.includes(
        "server"
      )
    ) {
      preferredRole =
        "Backend Developer";
    }

    else if (
      taskText.includes("ai") ||
      taskText.includes(
        "machine learning"
      ) ||
      taskText.includes(
        "openai"
      )
    ) {
      preferredRole =
        "AI Engineer";
    }

    else if (
      taskText.includes(
        "design"
      ) ||
      taskText.includes(
        "figma"
      ) ||
      taskText.includes(
        "ux"
      )
    ) {
      preferredRole =
        "UI/UX Designer";
    }

    // FILTER AVAILABLE USERS
    const eligibleUsers =
      project.members.filter(
        (member) =>
          member.availability ===
          "Available"
      );

    if (
      eligibleUsers.length === 0
    ) {
      return null;
    }

    // ROLE MATCHING
    let matchedUsers =
      eligibleUsers.filter(
        (user) =>
          user.role ===
          preferredRole
      );

    // FALLBACK
    if (
      matchedUsers.length === 0
    ) {
      matchedUsers =
        eligibleUsers;
    }

    // SORT BY PRODUCTIVITY
    matchedUsers.sort(
      (a, b) =>
        b.productivityScore -
        a.productivityScore
    );

    // RETURN BEST USER
    return matchedUsers[0]._id;
  };

//
// UPDATE PROJECT PROGRESS
//
const updateProjectProgress =
  async (projectId) => {
    const tasks =
      await Task.find({
        project: projectId,
      });

    const totalTasks =
      tasks.length;

    const completedTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "Completed"
      ).length;

    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks /
              totalTasks) *
              100
          );

    let projectStatus =
      "Pending";

    if (
      completionPercentage > 0 &&
      completionPercentage < 100
    ) {
      projectStatus =
        "In Progress";
    }

    if (
      completionPercentage === 100
    ) {
      projectStatus =
        "Completed";
    }

    await Project.findByIdAndUpdate(
      projectId,
      {
        totalTasks,

        completedTasks,

        completionPercentage,

        status: projectStatus,
      }
    );
  };

//
// UPDATE USER PRODUCTIVITY
//
const updateUserProductivity =
  async (userId) => {
    const completedTasks =
      await Task.countDocuments(
        {
          assignedTo: userId,

          status:
            "Completed",
        }
      );

    const totalTasks =
      await Task.countDocuments(
        {
          assignedTo: userId,
        }
      );

    const productivityScore =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks /
              totalTasks) *
              100
          );

    await User.findByIdAndUpdate(
      userId,
      {
        completedTasks,

        productivityScore,
      }
    );
  };

//
// CREATE TASK
//
exports.createTask = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      deadline,
    } = req.body;

    // AUTO ASSIGN
    let assignedUser =
      assignedTo;

    if (!assignedUser) {
      assignedUser =
        await autoAssignTask(
          title,
          description,
          project
        );
    }

    const task =
      await Task.create({
        title,

        description,

        project,

        assignedTo:
          assignedUser,

        deadline,

        status: "Pending",

        progress: 0,
      });

    // ADD TASK TO USER
    if (assignedUser) {
      await User.findByIdAndUpdate(
        assignedUser,
        {
          $push: {
            assignedTasks:
              task._id,
          },
        }
      );
    }

    // UPDATE PROJECT
    await updateProjectProgress(
      project
    );

    res.status(201).json({
      success: true,

      message:
        assignedUser
          ? "Task auto-assigned successfully"
          : "Task created successfully",

      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

//
// GET ALL TASKS
//
exports.getTasks = async (
  req,
  res
) => {
  try {
    const tasks =
      await Task.find()

        .populate(
          "project",
          "title"
        )

        .populate(
          "assignedTo",
          "name email role productivityScore"
        )

        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,

      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};

//
// GET TASKS BY PROJECT
//
exports.getTasksByProject =
  async (req, res) => {
    try {
      const tasks =
        await Task.find({
          project:
            req.params.projectId,
        })

          .populate(
            "assignedTo",
            "name email role productivityScore"
          )

          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,

        tasks,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error: error.message,
      });
    }
  };

//
// UPDATE TASK STATUS
//
exports.updateTaskStatus =
  async (req, res) => {
    try {
      const {
        status,
        progress,
      } = req.body;

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Task not found",
          });
      }

      task.status =
        status;

      task.progress =
        progress;

      await task.save();

      // UPDATE PROJECT
      await updateProjectProgress(
        task.project
      );

      // UPDATE USER PRODUCTIVITY
      if (
        task.assignedTo
      ) {
        await updateUserProductivity(
          task.assignedTo
        );
      }

      res.json({
        success: true,

        task,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error: error.message,
      });
    }
  };

//
// DELETE TASK
//
exports.deleteTask = async (
  req,
  res
) => {
  try {
    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Task not found",
        });
    }

    const projectId =
      task.project;

    const assignedUser =
      task.assignedTo;

    // DELETE TASK
    await task.deleteOne();

    // REMOVE FROM USER
    if (assignedUser) {
      await User.findByIdAndUpdate(
        assignedUser,
        {
          $pull: {
            assignedTasks:
              task._id,
          },
        }
      );

      await updateUserProductivity(
        assignedUser
      );
    }

    // UPDATE PROJECT
    await updateProjectProgress(
      projectId
    );

    res.json({
      success: true,

      message:
        "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      error: error.message,
    });
  }
};