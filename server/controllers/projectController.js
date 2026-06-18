const Project =
  require("../models/Project");

const Task =
  require("../models/Task");

const Idea =
  require("../models/Idea");

//
// CREATE PROJECT
//
exports.createProject =
  async (req, res) => {
    try {
      const {
        title,
        description,
        linkedIdea,
        priority,
        visibility,
        deadline,
        tags,
      } = req.body;

      //
      // VALIDATION
      //
      if (!title) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Project title is required",
          });
      }

      //
      // SAFE TAGS
      //
      let safeTags =
        [];

      if (
        Array.isArray(tags)
      ) {
        safeTags = tags;
      } else if (
        typeof tags ===
        "string"
      ) {
        safeTags =
          tags
            .split(",")
            .map((tag) =>
              tag.trim()
            );
      }

      //
      // CREATE PROJECT
      //
      const project =
        await Project.create({
          title,

          description,

          owner:
            req.user,

          members: [
            req.user,
          ],

          linkedIdea,

          priority:
            priority ||
            "Medium",

          visibility:
            visibility ||
            "Public",

          deadline,

          tags: safeTags,

          status:
            "Pending",

          completionPercentage: 0,

          totalTasks: 0,

          completedTasks: 0,
        });

      //
      // LINK PROJECT TO IDEA
      //
      if (
        linkedIdea
      ) {
        const idea =
          await Idea.findById(
            linkedIdea
          );

        if (idea) {
          idea.linkedProject =
            project._id;

          await idea.save();
        }
      }

      res.status(201).json({
        success: true,

        message:
          "Project created successfully 🚀",

        project,
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
// GET ALL PROJECTS
//
exports.getProjects =
  async (req, res) => {
    try {
      const projects =
        await Project.find()

          .populate(
            "owner",
            "name email role profilePicture"
          )

          .populate(
            "members",
            "name email role profilePicture"
          )

          .populate(
            "linkedIdea"
          )

          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,

        projects:
          Array.isArray(
            projects
          )
            ? projects
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
// GET SINGLE PROJECT
//
exports.getProjectById =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.id
        )

          .populate(
            "owner",
            "name email role profilePicture"
          )

          .populate(
            "members",
            "name email role profilePicture"
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

      //
      // GET TASKS
      //
      const tasks =
        await Task.find({
          project:
            project._id,
        }).populate(
          "assignedTo",
          "name email role"
        );

      //
      // AUTO TASK COUNTS
      //
      const totalTasks =
        tasks.length;

      const completedTasks =
        tasks.filter(
          (task) =>
            task.status ===
            "Completed"
        ).length;

      //
      // UPDATE COUNTS
      //
      project.totalTasks =
        totalTasks;

      project.completedTasks =
        completedTasks;

      if (
        totalTasks > 0
      ) {
        project.completionPercentage =
          Math.round(
            (completedTasks /
              totalTasks) *
              100
          );
      } else {
        project.completionPercentage = 0;
      }

      await project.save();

      res.json({
        success: true,

        project,

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
// UPDATE PROJECT STATUS
//
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
        !validStatuses.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid project status",
          });
      }

      project.status =
        status;

      await project.save();

      res.json({
        success: true,

        message:
          "Project status updated successfully 🚀",

        project,
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
// ADD MEMBER TO PROJECT
//
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

      //
      // SAFE MEMBERS ARRAY
      //
      if (
        !Array.isArray(
          project.members
        )
      ) {
        project.members =
          [];
      }

      //
      // CHECK MEMBER
      //
      const alreadyMember =
        project.members.some(
          (member) =>
            member.toString() ===
            userId.toString()
        );

      if (
        alreadyMember
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "User is already a project member",
          });
      }

      //
      // ADD MEMBER
      //
      project.members.push(
        userId
      );

      await project.save();

      res.json({
        success: true,

        message:
          "Member added successfully 🚀",

        project,
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
// DELETE PROJECT
//
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

      //
      // OWNER CHECK
      //
      if (
        project.owner.toString() !==
        req.user.toString()
      ) {
        return res
          .status(403)
          .json({
            success: false,

            message:
              "Only owner can delete project",
          });
      }

      //
      // DELETE ALL TASKS
      //
      await Task.deleteMany(
        {
          project:
            project._id,
        }
      );

      //
      // REMOVE LINK FROM IDEA
      //
      if (
        project.linkedIdea
      ) {
        const idea =
          await Idea.findById(
            project.linkedIdea
          );

        if (idea) {
          idea.linkedProject =
            null;

          await idea.save();
        }
      }

      //
      // DELETE PROJECT
      //
      await project.deleteOne();

      res.json({
        success: true,

        message:
          "Project deleted successfully 🚀",
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