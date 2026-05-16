const User = require("../models/User");

// Get All Skill Swap Users
exports.getSkillSwapUsers = async (
  req,
  res
) => {
  try {
    // Fetch users except password
    const users = await User.find(
      {},
      "-password"
    );

    res.status(200).json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch users",
    });
  }
};