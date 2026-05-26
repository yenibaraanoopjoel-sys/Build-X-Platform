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

      res.json(user);
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

      user.skills =
        req.body.skills ||
        user.skills;

      user.skillsToLearn =
        req.body.skillsToLearn ||
        user.skillsToLearn;

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

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({
        success: false,

        error:
          error.message,
      });
    }
  };