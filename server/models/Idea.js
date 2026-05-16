const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    techStack: [String],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", ideaSchema);