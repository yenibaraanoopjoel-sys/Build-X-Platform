const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

/**
 * GET /api/analytics/dashboard
 * Returns aggregated stats for the dashboard
 */
router.get("/dashboard", protect, async (req, res) => {
  try {
    const User = require("../models/User");
    const Project = require("../models/Project");
    const Task = require("../models/Task");
    const Idea = require("../models/Idea");
    const Collaboration = require("../models/CollaborationRequest");
    const Message = require("../models/Message");

    // Run all aggregations in parallel for performance
    const [
      totalProjects,
      totalTasks,
      totalIdeas,
      totalCollabs,
      totalUsers,
      tasksByStatus,
      projectsByStatus,
    ] = await Promise.all([
      Project.countDocuments(),
      Task.countDocuments(),
      Idea.countDocuments(),
      Collaboration.countDocuments(),
      User.countDocuments(),
      Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Project.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    // Map task statuses
    const taskMap = {};
    tasksByStatus.forEach((t) => { taskMap[t._id] = t.count; });
    const todoTasks = taskMap["To Do"] || taskMap["todo"] || 0;
    const inProgressTasks = taskMap["In Progress"] || taskMap["in_progress"] || 0;
    const reviewTasks = taskMap["In Review"] || taskMap["review"] || 0;
    const completedTasks = taskMap["Completed"] || taskMap["done"] || 0;
    const taskCompletionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    // Map project statuses
    const projMap = {};
    projectsByStatus.forEach((p) => { projMap[p._id] = p.count; });
    const activeProjects = projMap["Active"] || projMap["active"] || 0;
    const completedProjects = projMap["Completed"] || projMap["completed"] || 0;

    res.json({
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalIdeas,
        totalTasks,
        completedTasks,
        taskCompletionRate,
        totalCollaborations: totalCollabs,
        activeCollaborations: 0,
        pendingCollaborations: 0,
        totalSkillExchanges: 0,
        completedSkillExchanges: 0,
        totalUsers,
      },
      charts: {
        taskDistribution: [
          { name: "To Do", count: todoTasks, color: "#64748B" },
          { name: "In Progress", count: inProgressTasks, color: "#3B82F6" },
          { name: "In Review", count: reviewTasks, color: "#F59E0B" },
          { name: "Completed", count: completedTasks, color: "#10B981" },
        ],
        projectDistribution: [
          { name: "Active", value: activeProjects, color: "#3B82F6" },
          { name: "Completed", value: completedProjects, color: "#10B981" },
        ],
      },
    });
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.json({
      stats: {
        totalProjects: 0, activeProjects: 0, completedProjects: 0,
        totalIdeas: 0, totalTasks: 0, completedTasks: 0, taskCompletionRate: 0,
        totalCollaborations: 0, activeCollaborations: 0, pendingCollaborations: 0,
        totalSkillExchanges: 0, completedSkillExchanges: 0, totalUsers: 0,
      },
      charts: { taskDistribution: [], projectDistribution: [] },
    });
  }
});

module.exports = router;
