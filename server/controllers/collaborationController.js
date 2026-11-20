const CollaborationRequest =
  require(
    "../models/CollaborationRequest"
  );

const Idea =
  require("../models/Idea");

const Project =
  require("../models/Project");

const Notification =
  require(
    "../models/Notification"
  );

//
// SEND COLLABORATION REQUEST
//
exports.sendRequest = async (
  req,
  res
) => {
  try {
    const {
      receiver,
      ideaId,
      message,
      requestType,
      title,
    } = req.body;

    //
    // CHECK IDEA
    //
    const idea =
      await Idea.findById(
        ideaId
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
    // PREVENT SELF REQUEST
    //
    if (
      idea.createdBy.toString() ===
      req.user.toString()
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "You cannot collaborate with yourself",
        });
    }

    //
    // CHECK EXISTING REQUEST
    //
    const existingRequest =
      await CollaborationRequest.findOne(
        {
          sender:
            req.user,

          receiver,

          idea: ideaId,

          status:
            "Pending",
        }
      );

    if (existingRequest) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Request already sent",
        });
    }

    //
    // CREATE REQUEST
    //
    const request =
      await CollaborationRequest.create(
        {
          sender:
            req.user,

          receiver,

          idea: ideaId,

          project:
            idea.linkedProject,

          title:
            title ||
            idea.title,

          requestType:
            requestType ||
            "Idea Collaboration",

          message:
            message || "",

          status:
            "Pending",
        }
      );

    //
    // CREATE NOTIFICATION
    //
    await Notification.create({
      receiver,

      sender:
        req.user,

      type:
        "COLLAB_REQUEST",

      message: `${req.user.name} sent you a collaboration request.`,

      idea: ideaId,

      project:
        idea.linkedProject,

      requestId:
        request._id,

      collaborationRequest:
        request._id,
    });

    res.status(201).json({
      success: true,

      message:
        "Collaboration request sent successfully",

      request,
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
// GET RECEIVED REQUESTS
//
exports.getMyRequests =
  async (req, res) => {
    try {
      const requests =
        await CollaborationRequest.find(
          {
            receiver:
              req.user,
          }
        )
          .populate(
            "sender",
            "name email profilePicture role skillsHave"
          )
          .populate(
            "idea",
            "title description"
          )
          .populate(
            "project",
            "title"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,

        requests:
          Array.isArray(
            requests
          )
            ? requests
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
// ACCEPT REQUEST
//
exports.acceptRequest =
  async (req, res) => {
    try {
      const request =
        await CollaborationRequest.findById(
          req.params.id
        );

      if (!request) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Request not found",
          });
      }

      //
      // ALREADY ACCEPTED
      //
      if (
        request.status ===
        "Accepted"
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Request already accepted",
          });
      }

      //
      // UPDATE STATUS
      //
      request.status =
        "Accepted";

      await request.save();

      //
      // ADD USER TO IDEA
      //
      const idea =
        await Idea.findById(
          request.idea
        );

      if (idea) {
        if (
          !Array.isArray(
            idea.collaborators
          )
        ) {
          idea.collaborators =
            [];
        }

        const alreadyExists =
          idea.collaborators.some(
            (
              collaborator
            ) =>
              collaborator.toString() ===
              request.sender.toString()
          );

        if (
          !alreadyExists
        ) {
          idea.collaborators.push(
            request.sender
          );

          await idea.save();
        }
      }

      //
      // ADD USER TO PROJECT
      //
      const project =
        await Project.findById(
          request.project
        );

      if (project) {
        if (
          !Array.isArray(
            project.members
          )
        ) {
          project.members =
            [];
        }

        const alreadyMember =
          project.members.some(
            (member) =>
              member.toString() ===
              request.sender.toString()
          );

        if (
          !alreadyMember
        ) {
          project.members.push(
            request.sender
          );

          await project.save();
        }
      }

      //
      // CREATE NOTIFICATION
      //
      await Notification.create({
        receiver:
          request.sender,

        sender:
          req.user,

        type:
          "REQUEST_ACCEPTED",

        message:
          "Your collaboration request was accepted.",

        idea:
          request.idea,

        project:
          request.project,

        requestId:
          request._id,

        collaborationRequest:
          request._id,
      });

      res.json({
        success: true,

        message:
          "Collaboration request accepted successfully",

        request,
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
// REJECT REQUEST
//
exports.rejectRequest =
  async (req, res) => {
    try {
      const request =
        await CollaborationRequest.findById(
          req.params.id
        );

      if (!request) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Request not found",
          });
      }

      //
      // UPDATE STATUS
      //
      request.status =
        "Rejected";

      await request.save();

      //
      // CREATE NOTIFICATION
      //
      await Notification.create({
        receiver:
          request.sender,

        sender:
          req.user,

        type:
          "REQUEST_REJECTED",

        message:
          "Your collaboration request was rejected.",

        idea:
          request.idea,

        project:
          request.project,

        requestId:
          request._id,

        collaborationRequest:
          request._id,
      });

      res.json({
        success: true,

        message:
          "Collaboration request rejected",

        request,
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
// GET SENT REQUESTS
//
exports.getSentRequests =
  async (req, res) => {
    try {
      const requests =
        await CollaborationRequest.find(
          {
            sender:
              req.user,
          }
        )
          .populate(
            "receiver",
            "name email profilePicture role"
          )
          .populate(
            "idea",
            "title"
          )
          .populate(
            "project",
            "title"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,

        requests:
          Array.isArray(
            requests
          )
            ? requests
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