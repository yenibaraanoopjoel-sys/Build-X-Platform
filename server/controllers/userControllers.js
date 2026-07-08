const User = require("../models/User");

const bcrypt =
  require("bcryptjs");

//
// GET USER PROFILE
//
exports.getUserProfile =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user
        ).select("-password");

      if (!user) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "User not found",
          });
      }

      const userObj =
        user.toObject();

      userObj.skills =
        userObj.skillsHave || [];
      userObj.skillsToLearn =
        userObj.skillsWant || [];

      delete userObj.skillsHave;
      delete userObj.skillsWant;

      res.json(userObj);
    } catch (error) {
      res.status(500).json({
        success: false,

        error:
          error.message,
      });
    }
  };

//
// UPDATE USER PROFILE
//
exports.updateUserProfile =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user
        );

      if (!user) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "User not found",
          });
      }

      //
      // UPDATE FIELDS
      //
      user.name =
        req.body.name ||
        user.name;

      user.role =
        req.body.role ||
        user.role;

      user.bio =
        req.body.bio ||
        user.bio;

      user.skillsHave = Array.isArray(req.body.skills)
        ? req.body.skills
            .map((item) => item?.trim())
            .filter((item) => item)
        : user.skillsHave;

      user.skillsWant = Array.isArray(req.body.skillsToLearn)
        ? req.body.skillsToLearn
            .map((item) => item?.trim())
            .filter((item) => item)
        : user.skillsWant;

      //
      // PASSWORD
      //
      if (
        req.body.password &&
        req.body.password.trim() !==
          ""
      ) {
        const salt =
          await bcrypt.genSalt(
            10
          );

        user.password =
          await bcrypt.hash(
            req.body.password,
            salt
          );
      }

      const updatedUser =
        await user.save();

      const updatedUserObj =
        updatedUser.toObject();

      updatedUserObj.skills =
        updatedUserObj.skillsHave || [];
      updatedUserObj.skillsToLearn =
        updatedUserObj.skillsWant || [];

      delete updatedUserObj.skillsHave;
      delete updatedUserObj.skillsWant;

      res.json(updatedUserObj);
    } catch (error) {
      res.status(500).json({
        success: false,

        error:
          error.message,
      });
    }
  };