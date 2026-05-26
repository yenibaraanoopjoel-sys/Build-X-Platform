const Task =
  require("../models/Task");

const Project =
  require("../models/Project");

const User =
  require("../models/User");

//
// AUTO ASSIGN TASK
//
const autoAssignTask =
  async (
    title,
    description,
    projectId
  ) => {
    try {
      //
      // FIND PROJECT
      //
      const project =
        await Project.findById(
          projectId
        ).populate(
          "members"
        );

      if (!project) {
        return null;
      }

      //
      // SAFE TEXT
      //
      const taskText = `
${title || ""}
${description || ""}
`
        .toLowerCase();

      //
      // ROLE DETECTION
      //
      let preferredRole =
        "";

      if (
        taskText.includes(
          "frontend"
        ) ||
        taskText.includes(
          "react"
        ) ||
        taskText.includes(
          "ui"
        )
      ) {
        preferredRole =
          "Frontend Developer";
      } else if (
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
      } else if (
        taskText.includes(
          "ai"
        ) ||
        taskText.includes(
          "machine learning"
        ) ||
        taskText.includes(
          "openai"
        )
      ) {
        preferredRole =
          "AI Engineer";
      } else if (
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

      //
      // SAFE MEMBERS
      //
      const members =
        Array.isArray(
          project.members
        )
          ? project.members
          : [];

      //
      // AVAILABLE USERS
      //
      const eligibleUsers =
        members.filter(
          (member) =>
            member &&
            member.availability !==
              "Busy"
        );

      if (
        eligibleUsers.length ===
        0
      ) {
        return null;
      }

      //
      // MATCH ROLE
      //
      let matchedUsers =
        eligibleUsers.filter(
          (user) =>
            user.role ===
            preferredRole
        );

      //
      // FALLBACK
      //
      if (
        matchedUsers.length ===
        0
      ) {
        matchedUsers =
          eligibleUsers;
      }

      //
      // SORT PRODUCTIVITY
      //
      matchedUsers.sort(
        (a, b) =>
          (b.productivityScore ||
            0) -
          (a.productivityScore ||
            0)
      );

      //
      // RETURN BEST USER
      //
      return matchedUsers[0]
        ?._id;
    } catch (error) {
      console.log(error);

      return null;
    }
  };

//
// UPDATE PROJECT PROGRESS
//
const updateProjectProgress =
  async (projectId) => {
    try {
      const tasks =
        await Task.find({
          project:
            projectId,
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
        completionPercentage >
          0 &&
        completionPercentage <
          100
      ) {
        projectStatus =
          "In Progress";
      }

      if (
        completionPercentage ===
        100
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

          status:
            projectStatus,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

//
// UPDATE USER PRODUCTIVITY
//
const updateUserProductivity =
  async (userId) => {
    try {
      const completedTasks =
        await Task.countDocuments(
          {
            assignedTo:
              userId,

            status:
              "Completed",
          }
        );

      const totalTasks =
        await Task.countDocuments(
          {
            assignedTo:
              userId,
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
    } catch (error) {
      console.log(error);
    }
  };

//
// CREATE TASK
//
exports.createTask =
  async (req, res) => {
    try {
      const {
        title,
        description,
        project,
        assignedTo,
        deadline,
        priority,
      } = req.body;

      //
      // VALIDATION
      //
      if (
        !title ||
        !project
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Title and project are required",
          });
      }

      //
      // AUTO ASSIGN
      //
      let assignedUser =
        assignedTo;

      if (
        !assignedUser
      ) {
        assignedUser =
          await autoAssignTask(
            title,
            description,
            project
          );
      }

      //
      // CREATE TASK
      //
      const task =
        await Task.create({
          title,

          description,

          project,

          assignedTo:
            assignedUser,

          deadline,

          priority:
            priority ||
            "Medium",

          status:
            "Pending",

          progress: 0,
        });

      //
      // ADD TO USER
      //
      if (
        assignedUser
      ) {
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

      //
      // UPDATE PROJECT
      //
      await updateProjectProgress(
        project
      );

      res.status(201).json({
        success: true,

        message:
          assignedUser
            ? "Task auto-assigned successfully 🚀"
            : "Task created successfully 🚀",

        task,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

//
// GET ALL TASKS
//
exports.getTasks =
  async (req, res) => {
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

        tasks:
          Array.isArray(
            tasks
          )
            ? tasks
            : [],
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          error.message,
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
            req.params
              .projectId,
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

        tasks:
          Array.isArray(
            tasks
          )
            ? tasks
            : [],
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          error.message,
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

      //
      // VALID STATUS
      //
      const validStatuses =
        [
          "Pending",
          "In Progress",
          "Completed",
        ];

      if (
        status &&
        !validStatuses.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid task status",
          });
      }

      //
      // UPDATE
      //
      if (status) {
        task.status =
          status;
      }

      if (
        progress !==
        undefined
      ) {
        task.progress =
          progress;
      }

      //
      // AUTO COMPLETE
      //
      if (
        task.progress ===
        100
      ) {
        task.status =
          "Completed";
      }

      await task.save();

      //
      // UPDATE PROJECT
      //
      await updateProjectProgress(
        task.project
      );

      //
      // UPDATE PRODUCTIVITY
      //
      if (
        task.assignedTo
      ) {
        await updateUserProductivity(
          task.assignedTo
        );
      }

      res.json({
        success: true,

        message:
          "Task updated successfully 🚀",

        task,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

//
// DELETE TASK
//
exports.deleteTask =
  async (req, res) => {
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

      //
      // DELETE TASK
      //
      await task.deleteOne();

      //
      // REMOVE FROM USER
      //
      if (
        assignedUser
      ) {
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

      //
      // UPDATE PROJECT
      //
      await updateProjectProgress(
        projectId
      );

      res.json({
        success: true,

        message:
          "Task deleted successfully 🚀",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };