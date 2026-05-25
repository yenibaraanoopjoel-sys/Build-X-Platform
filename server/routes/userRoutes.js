const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const User = require("../models/User");

//
// GET PROFILE
//
router.get(
  "/profile",
  protect,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user
        ).select(
          "-password"
        );

      res.json({
        success: true,

        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  }
);

//
// GET ALL USERS
//
router.get(
  "/all-users",
  protect,
  async (req, res) => {
    try {
      const users =
        await User.find()
          .select(
            "-password"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,

        users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  }
);

module.exports = router;