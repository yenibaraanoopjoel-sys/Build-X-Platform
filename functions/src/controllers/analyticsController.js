const admin = require("firebase-admin");

const getAnalytics = async (req, res) => {
  try {
    const db = admin.firestore();

    // Query collections in parallel
    const [
      projectsSnap,
      ideasSnap,
      tasksSnap,
      collabsSnap,
      skillExchangesSnap,
      usersSnap,
    ] = await Promise.all([
      db.collection("projects").get(),
      db.collection("ideas").get(),
      db.collection("tasks").get(),
      db.collection("collaborations").get(),
      db.collection("skillExchanges").get(),
      db.collection("users").get(),
    ]);

    const totalProjects = projectsSnap.size;
    let completedProjects = 0;
    let activeProjects = 0;

    projectsSnap.forEach((doc) => {
      const data = doc.data();
      if (data.status === "completed" || data.status === "Completed") completedProjects++;
      else activeProjects++;
    });

    const totalIdeas = ideasSnap.size;
    let totalLikes = 0;
    ideasSnap.forEach((doc) => {
      const data = doc.data();
      if (Array.isArray(data.likes)) totalLikes += data.likes.length;
    });

    const totalTasks = tasksSnap.size;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let todoTasks = 0;
    let reviewTasks = 0;

    tasksSnap.forEach((doc) => {
      const data = doc.data();
      const status = (data.status || "").toLowerCase();
      if (status === "completed" || status === "done") completedTasks++;
      else if (status === "in_progress" || status === "in progress") inProgressTasks++;
      else if (status === "review") reviewTasks++;
      else todoTasks++;
    });

    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalCollaborations = collabsSnap.size;
    let activeCollaborations = 0;
    let pendingCollaborations = 0;
    collabsSnap.forEach((doc) => {
      const data = doc.data();
      if (data.status === "accepted" || data.status === "Active") activeCollaborations++;
      else if (data.status === "pending" || data.status === "Pending") pendingCollaborations++;
    });

    const totalSkillExchanges = skillExchangesSnap.size;
    let completedSkillExchanges = 0;
    skillExchangesSnap.forEach((doc) => {
      const data = doc.data();
      if (data.status === "completed" || data.status === "accepted") completedSkillExchanges++;
    });

    const totalUsers = usersSnap.size;

    // Chart distribution data for frontend Recharts
    const taskStatusDistribution = [
      { name: "To Do", count: todoTasks, color: "#64748B" },
      { name: "In Progress", count: inProgressTasks, color: "#3B82F6" },
      { name: "In Review", count: reviewTasks, color: "#F59E0B" },
      { name: "Completed", count: completedTasks, color: "#10B981" },
    ];

    const projectStatusDistribution = [
      { name: "Active", value: activeProjects, color: "#3B82F6" },
      { name: "Completed", value: completedProjects, color: "#10B981" },
    ];

    return res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalIdeas,
        totalLikes,
        totalTasks,
        completedTasks,
        taskCompletionRate,
        totalCollaborations,
        activeCollaborations,
        pendingCollaborations,
        totalSkillExchanges,
        completedSkillExchanges,
        totalUsers,
      },
      charts: {
        taskDistribution: taskStatusDistribution,
        projectDistribution: projectStatusDistribution,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to compile platform analytics",
    });
  }
};

module.exports = { getAnalytics };

