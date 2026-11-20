const Idea =
  require("../models/Idea");

const Project =
  require("../models/Project");

//
// CREATE IDEA + AUTO CREATE PROJECT
//
exports.createIdea =
  async (req, res) => {
    try {
      const {
        title,
        description,
        techStack,
        category,
        visibility,
      } = req.body;

      //
      // VALIDATION
      //
      if (
        !title ||
        !description
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Title and description are required",
          });
      }

      //
      // SAFE TECH STACK
      //
      let safeTechStack =
        [];

      if (
        Array.isArray(
          techStack
        )
      ) {
        safeTechStack =
          techStack;
      } else if (
        typeof techStack ===
        "string"
      ) {
        safeTechStack =
          techStack
            .split(",")
            .map((tech) =>
              tech.trim()
            );
      }

      //
      // CREATE IDEA
      //
      const idea =
        await Idea.create({
          title,

          description,

          techStack:
            safeTechStack,

          category,

          visibility:
            visibility ||
            "Public",

          createdBy:
            req.user,
        });

      //
      // CREATE PROJECT
      //
      const project =
        await Project.create({
          title,

          description,

          owner:
            req.user,

          linkedIdea:
            idea._id,

          members: [
            req.user,
          ],

          status:
            "Pending",

          completionPercentage: 0,

          totalTasks: 0,

          completedTasks: 0,
        });

      //
      // LINK PROJECT
      //
      idea.linkedProject =
        project._id;

      await idea.save();

      res.status(201).json({
        success: true,

        message:
          "Idea and project created successfully 🚀",

        idea,

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
// GET ALL IDEAS
//
exports.getIdeas =
  async (req, res) => {
    try {
      const ideas =
        await Idea.find()

          .populate(
            "createdBy",
            "name email role profilePicture"
          )

          .populate(
            "collaborators",
            "name email role"
          )

          .populate(
            "linkedProject"
          )

          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,

        ideas:
          Array.isArray(
            ideas
          )
            ? ideas
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
// GET SINGLE IDEA
//
exports.getIdeaById =
  async (req, res) => {
    try {
      const idea =
        await Idea.findById(
          req.params.id
        )

          .populate(
            "createdBy",
            "name email role profilePicture"
          )

          .populate(
            "collaborators",
            "name email role"
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

      //
      // INCREASE VIEWS
      //
      idea.views =
        (idea.views || 0) +
        1;

      await idea.save();

      res.json({
        success: true,

        idea,
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
// DELETE IDEA
//
exports.deleteIdea =
  async (req, res) => {
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

      //
      // OWNER CHECK
      //
      if (
        idea.createdBy.toString() !==
        req.user.toString()
      ) {
        return res
          .status(403)
          .json({
            success: false,

            message:
              "Only the owner can delete this idea",
          });
      }

      //
      // DELETE LINKED PROJECT
      //
      if (
        idea.linkedProject
      ) {
        await Project.findByIdAndDelete(
          idea.linkedProject
        );
      }

      //
      // DELETE IDEA
      //
      await idea.deleteOne();

      res.json({
        success: true,

        message:
          "Idea deleted successfully 🚀",
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
// LIKE / UNLIKE IDEA
//
exports.likeIdea =
  async (req, res) => {
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

      //
      // SAFE ARRAY
      //
      if (
        !Array.isArray(
          idea.likes
        )
      ) {
        idea.likes = [];
      }

      //
      // CHECK LIKE
      //
      const alreadyLiked =
        idea.likes.some(
          (userId) =>
            userId.toString() ===
            req.user.toString()
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

        totalLikes:
          idea.likes.length,

        liked:
          !alreadyLiked,
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