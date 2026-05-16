const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const User = require("../models/User");

router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user).select(
    "-password"
  );

  res.json(user);
});

module.exports = router;