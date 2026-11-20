/**
 * dataService.js — MongoDB/Express Backend Data Layer
 * Drop-in replacement for firestoreService.js using the Express REST API.
 * Provides identical function signatures so all pages work without change
 * (except for the import path change).
 *
 * Falls back to localStorage for demo/offline sessions.
 */

import API from "./api";

// ─── Utility helpers ───────────────────────────────────────────────────────────

const isDemoToken = () => {
  const t = localStorage.getItem("token");
  return !t || t.startsWith("demo-");
};

const getDemoUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

/** Generate a simple local ID for demo/offline objects */
const localId = () => Math.random().toString(36).slice(2, 11);

/** Wrap an API call with a demo fallback that returns `fallback` data */
const withFallback = async (apiFn, fallbackFn) => {
  if (isDemoToken()) return fallbackFn();
  try {
    return await apiFn();
  } catch (err) {
    console.warn("API error — falling back to demo data:", err.message);
    return fallbackFn();
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// 1. IDEAS HUB
// ══════════════════════════════════════════════════════════════════════════════

const DEMO_IDEAS = [
  {
    id: "demo-idea-1",
    title: "AI-Powered Code Review Tool",
    description: "An AI assistant that reviews pull requests, spots bugs, suggests optimizations, and enforces coding standards automatically.",
    category: "Technology",
    requiredSkills: ["Python", "Machine Learning", "GitHub API"],
    authorName: "Anoop Joel",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=demo1",
    authorRole: "Developer",
    likes: [],
    commentsCount: 3,
    collaborationStatus: "Open for Collaborators",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-idea-2",
    title: "SkillSwap Marketplace Platform",
    description: "A marketplace where developers trade skills — learn React by teaching Python, etc.",
    category: "Education",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    authorName: "Alex Chen",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=demo2",
    authorRole: "Designer",
    likes: ["user1", "user2"],
    commentsCount: 7,
    collaborationStatus: "Open for Collaborators",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const getIdeas = async (category = "All", search = "") => {
  return withFallback(
    async () => {
      const params = {};
      if (category && category !== "All") params.category = category;
      if (search) params.search = search;
      const res = await API.get("/ideas", { params });
      return res.data?.ideas || res.data || [];
    },
    () => {
      let ideas = [...DEMO_IDEAS];
      if (category && category !== "All") {
        ideas = ideas.filter((i) => i.category?.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        ideas = ideas.filter(
          (i) => i.title?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s)
        );
      }
      return ideas;
    }
  );
};

export const createIdea = async (ideaData, user) => {
  const payload = {
    title: ideaData.title,
    description: ideaData.description,
    category: ideaData.category || "Technology",
    requiredSkills: Array.isArray(ideaData.requiredSkills)
      ? ideaData.requiredSkills
      : (ideaData.requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
  };

  return withFallback(
    async () => {
      const res = await API.post("/ideas", payload);
      return res.data?.idea || res.data;
    },
    () => ({
      id: localId(),
      ...payload,
      authorId: user?.uid || "demo",
      authorName: user?.name || "Demo User",
      authorAvatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid}`,
      authorRole: user?.role || "Developer",
      likes: [],
      commentsCount: 0,
      collaborationStatus: "Open for Collaborators",
      createdAt: new Date().toISOString(),
    })
  );
};

export const deleteIdea = async (ideaId) => {
  if (!isDemoToken()) {
    try { await API.delete(`/ideas/${ideaId}`); } catch {}
  }
};

export const toggleLikeIdea = async (ideaId, userId) => {
  if (!isDemoToken()) {
    try { await API.post(`/ideas/${ideaId}/like`); } catch {}
  }
};

export const getIdeaComments = async (ideaId) => {
  return withFallback(
    async () => {
      const res = await API.get(`/ideas/${ideaId}/comments`);
      return res.data?.comments || res.data || [];
    },
    () => []
  );
};

export const addIdeaComment = async (ideaId, commentText, user) => {
  return withFallback(
    async () => {
      const res = await API.post(`/ideas/${ideaId}/comments`, { text: commentText });
      return res.data?.comment || res.data;
    },
    () => ({
      id: localId(),
      text: commentText,
      authorId: user?.uid || "demo",
      authorName: user?.name || "Demo User",
      authorAvatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=demo`,
      createdAt: new Date().toISOString(),
    })
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 2. PROJECTS
// ══════════════════════════════════════════════════════════════════════════════

const DEMO_PROJECTS = [
  {
    id: "demo-proj-1",
    name: "BuildX Analytics Dashboard",
    description: "Real-time analytics and insights for the BuildX platform using MongoDB aggregations.",
    ownerId: "demo",
    ownerName: "Anoop Joel",
    ownerAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=proj1",
    status: "Active",
    technologies: ["React", "Node.js", "MongoDB", "Socket.IO"],
    memberCount: 3,
    taskCount: 12,
    completedTasks: 7,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

export const getProjects = async (filter = "All", search = "") => {
  return withFallback(
    async () => {
      const params = {};
      if (filter && filter !== "All") params.status = filter;
      if (search) params.search = search;
      const res = await API.get("/projects", { params });
      return res.data?.projects || res.data || [];
    },
    () => {
      let projects = [...DEMO_PROJECTS];
      if (filter && filter !== "All") {
        projects = projects.filter((p) => p.status?.toLowerCase() === filter.toLowerCase());
      }
      return projects;
    }
  );
};

export const createProject = async (projectData, user) => {
  const payload = {
    name: projectData.name,
    description: projectData.description,
    status: projectData.status || "Active",
    technologies: Array.isArray(projectData.technologies)
      ? projectData.technologies
      : (projectData.technologies || "").split(",").map((s) => s.trim()).filter(Boolean),
    maxMembers: projectData.maxMembers || 5,
    deadline: projectData.deadline || null,
  };

  return withFallback(
    async () => {
      const res = await API.post("/projects", payload);
      return res.data?.project || res.data;
    },
    () => ({
      id: localId(),
      ...payload,
      ownerId: user?.uid || "demo",
      ownerName: user?.name || "Demo User",
      ownerAvatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid}`,
      memberCount: 1,
      taskCount: 0,
      completedTasks: 0,
      createdAt: new Date().toISOString(),
    })
  );
};

export const deleteProject = async (projectId) => {
  if (!isDemoToken()) {
    try { await API.delete(`/projects/${projectId}`); } catch {}
  }
};

export const getProjectMembers = async (projectId) => {
  return withFallback(
    async () => {
      const res = await API.get(`/projects/${projectId}/members`);
      return res.data?.members || res.data || [];
    },
    () => []
  );
};

export const addProjectMember = async (projectId, userId) => {
  if (!isDemoToken()) {
    try {
      const res = await API.post(`/projects/${projectId}/members`, { userId });
      return res.data;
    } catch {}
  }
};

export const removeProjectMember = async (projectId, userId) => {
  if (!isDemoToken()) {
    try { await API.delete(`/projects/${projectId}/members/${userId}`); } catch {}
  }
};

export const getProjectTasks = async (projectId) => {
  return withFallback(
    async () => {
      const res = await API.get(`/projects/${projectId}/tasks`);
      return res.data?.tasks || res.data || [];
    },
    () => []
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 3. TASKS
// ══════════════════════════════════════════════════════════════════════════════

const DEMO_TASKS = [
  {
    id: "demo-task-1",
    title: "Set up MongoDB Atlas cluster",
    description: "Configure cloud database with proper indexes and connection pooling.",
    status: "Completed",
    priority: "High",
    assigneeName: "Anoop Joel",
    projectName: "BuildX Backend",
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "demo-task-2",
    title: "Implement JWT authentication middleware",
    description: "Create Express middleware for JWT verification and role-based access control.",
    status: "In Progress",
    priority: "High",
    assigneeName: "Anoop Joel",
    projectName: "BuildX Backend",
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "demo-task-3",
    title: "Build React Dashboard UI",
    description: "Design and implement the main analytics dashboard with charts.",
    status: "To Do",
    priority: "Medium",
    assigneeName: "Anoop Joel",
    projectName: "BuildX Frontend",
    dueDate: new Date(Date.now() + 604800000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const getUserTasks = async (userId) => {
  return withFallback(
    async () => {
      const res = await API.get("/tasks", { params: { userId } });
      return res.data?.tasks || res.data || [];
    },
    () => [...DEMO_TASKS]
  );
};

export const getTasks = async (filter = "All") => {
  return withFallback(
    async () => {
      const params = {};
      if (filter && filter !== "All") params.status = filter;
      const res = await API.get("/tasks", { params });
      return res.data?.tasks || res.data || [];
    },
    () => {
      if (filter === "All") return [...DEMO_TASKS];
      return DEMO_TASKS.filter((t) => t.status === filter);
    }
  );
};

export const createTask = async (taskData, user) => {
  return withFallback(
    async () => {
      const res = await API.post("/tasks", taskData);
      return res.data?.task || res.data;
    },
    () => ({
      id: localId(),
      ...taskData,
      createdAt: new Date().toISOString(),
    })
  );
};

export const updateTask = async (taskId, updates) => {
  return withFallback(
    async () => {
      const res = await API.put(`/tasks/${taskId}`, updates);
      return res.data?.task || res.data;
    },
    () => ({ id: taskId, ...updates })
  );
};

export const deleteTask = async (taskId) => {
  if (!isDemoToken()) {
    try { await API.delete(`/tasks/${taskId}`); } catch {}
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// 4. COLLABORATION REQUESTS
// ══════════════════════════════════════════════════════════════════════════════

const DEMO_COLLABS = [
  {
    id: "demo-collab-1",
    projectId: "demo-proj-1",
    projectName: "BuildX Analytics Dashboard",
    requesterId: "user-2",
    requesterName: "Alex Chen",
    requesterAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=alex",
    requesterRole: "Designer",
    requesterSkills: ["Figma", "React", "CSS"],
    message: "I'd love to contribute UI/UX design to this project!",
    status: "Pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const getCollaborationRequests = async (userId) => {
  return withFallback(
    async () => {
      const res = await API.get("/collaborations", { params: { userId } });
      return res.data?.collaborations || res.data || [];
    },
    () => [...DEMO_COLLABS]
  );
};

export const sendCollaborationRequest = async (projectId, requestData, user) => {
  return withFallback(
    async () => {
      const res = await API.post("/collaborations", { projectId, ...requestData });
      return res.data?.collaboration || res.data;
    },
    () => ({
      id: localId(),
      projectId,
      ...requestData,
      status: "Pending",
      createdAt: new Date().toISOString(),
    })
  );
};

export const updateCollaborationStatus = async (collabId, status) => {
  return withFallback(
    async () => {
      const res = await API.put(`/collaborations/${collabId}`, { status });
      return res.data;
    },
    () => ({ id: collabId, status })
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 5. SKILL SWAP
// ══════════════════════════════════════════════════════════════════════════════

const DEMO_SKILL_SWAPS = [
  {
    id: "demo-swap-1",
    requesterId: "demo",
    requesterName: "Anoop Joel",
    requesterAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=demo",
    skillOffered: "React & Frontend Development",
    skillWanted: "Machine Learning & Python",
    description: "I can teach React from basics to advanced hooks. Looking to learn ML fundamentals.",
    status: "Open",
    matches: 3,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const getSkillSwapListings = async (search = "") => {
  return withFallback(
    async () => {
      const res = await API.get("/skillswap", { params: search ? { search } : {} });
      return res.data?.listings || res.data || [];
    },
    () => {
      if (!search) return [...DEMO_SKILL_SWAPS];
      const s = search.toLowerCase();
      return DEMO_SKILL_SWAPS.filter(
        (sw) =>
          sw.skillOffered?.toLowerCase().includes(s) ||
          sw.skillWanted?.toLowerCase().includes(s)
      );
    }
  );
};

export const createSkillSwap = async (data, user) => {
  return withFallback(
    async () => {
      const res = await API.post("/skillswap", data);
      return res.data?.listing || res.data;
    },
    () => ({
      id: localId(),
      ...data,
      requesterId: user?.uid || "demo",
      requesterName: user?.name || "Demo User",
      requesterAvatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid}`,
      status: "Open",
      matches: 0,
      createdAt: new Date().toISOString(),
    })
  );
};

export const updateSkillSwapStatus = async (swapId, status) => {
  if (!isDemoToken()) {
    try { await API.put(`/skillswap/${swapId}`, { status }); } catch {}
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// 6. CHAT / MESSAGES
// ══════════════════════════════════════════════════════════════════════════════

export const getChatMessages = async (roomId) => {
  return withFallback(
    async () => {
      const res = await API.get(`/messages/${roomId}`);
      return res.data?.messages || res.data || [];
    },
    () => [
      {
        id: localId(),
        roomId,
        text: "Welcome to BuildX Chat! Connect with collaborators.",
        senderName: "BuildX Bot",
        senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bot",
        createdAt: new Date().toISOString(),
      },
    ]
  );
};

export const sendChatMessage = async (roomId, text, user) => {
  return withFallback(
    async () => {
      const res = await API.post(`/messages/${roomId}`, { text });
      return res.data?.message || res.data;
    },
    () => ({
      id: localId(),
      roomId,
      text,
      senderId: user?.uid || "demo",
      senderName: user?.name || "Demo User",
      senderAvatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=demo`,
      createdAt: new Date().toISOString(),
    })
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 7. DASHBOARD ANALYTICS
// ══════════════════════════════════════════════════════════════════════════════

export const getDashboardAnalytics = async (userId) => {
  return withFallback(
    async () => {
      const res = await API.get("/users/analytics", { params: { userId } });
      return res.data;
    },
    () => ({
      stats: {
        totalProjects: 2,
        activeProjects: 1,
        completedProjects: 1,
        totalIdeas: 3,
        totalTasks: 3,
        completedTasks: 1,
        taskCompletionRate: 33,
        totalCollaborations: 2,
        activeCollaborations: 1,
        pendingCollaborations: 1,
        totalSkillExchanges: 1,
        completedSkillExchanges: 0,
        totalUsers: 42,
      },
      charts: {
        taskDistribution: [
          { name: "To Do", count: 1, color: "#64748B" },
          { name: "In Progress", count: 1, color: "#3B82F6" },
          { name: "In Review", count: 0, color: "#F59E0B" },
          { name: "Completed", count: 1, color: "#10B981" },
        ],
        projectDistribution: [
          { name: "Active", value: 1, color: "#3B82F6" },
          { name: "Completed", value: 1, color: "#10B981" },
        ],
      },
    })
  );
};

// Keep this for backward compatibility with Dashboard.jsx which calls it
export const getAnalytics = getDashboardAnalytics;

// ══════════════════════════════════════════════════════════════════════════════
// 8. USERS / PROFILE
// ══════════════════════════════════════════════════════════════════════════════

export const getMatchingUsers = async (currentUser) => {
  return withFallback(
    async () => {
      const res = await API.get("/users/matches");
      return res.data?.users || res.data || [];
    },
    () => [
      {
        id: "match-1",
        uid: "match-1",
        name: "Alex Chen",
        email: "alex@buildx.app",
        role: "Designer",
        bio: "UI/UX designer passionate about great user experiences.",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=match1",
        skills: ["Figma", "React", "CSS", "User Research"],
        skillsToLearn: ["Node.js", "Python", "AI/ML"],
        matchScore: 85,
        matchedSkills: ["Can teach you: React", "Wants to learn: Node.js"],
      },
      {
        id: "match-2",
        uid: "match-2",
        name: "Sam Rivera",
        email: "sam@buildx.app",
        role: "Data Scientist",
        bio: "ML engineer exploring NLP and computer vision.",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=match2",
        skills: ["Python", "TensorFlow", "SQL", "Data Analysis"],
        skillsToLearn: ["React", "JavaScript", "Node.js"],
        matchScore: 72,
        matchedSkills: ["Can teach you: Python", "Wants to learn: React"],
      },
    ]
  );
};

export const getUserProfile = async (userId) => {
  return withFallback(
    async () => {
      const res = await API.get(`/users/${userId}`);
      return res.data?.user || res.data;
    },
    () => getDemoUser()
  );
};

export const updateUserProfileDoc = async (userId, updates) => {
  if (!isDemoToken()) {
    try {
      const res = await API.put(`/users/${userId}`, updates);
      return res.data?.user || res.data;
    } catch {}
  }
  return { ...getDemoUser(), ...updates };
};


// ══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL FUNCTIONS — appended to dataService.js
// ══════════════════════════════════════════════════════════════════════════════

// These are exported from dataService.js to satisfy all page imports.
// The main file already exports: getIdeas, createIdea, deleteIdea, toggleLikeIdea,
// getIdeaComments, addIdeaComment, getProjects, createProject, deleteProject,
// getProjectMembers, addProjectMember, removeProjectMember, getProjectTasks,
// getUserTasks, getTasks, createTask, updateTask, deleteTask,
// getCollaborationRequests, sendCollaborationRequest, updateCollaborationStatus,
// getSkillSwapListings, createSkillSwap, updateSkillSwapStatus,
// getChatMessages, sendChatMessage, getDashboardAnalytics, getAnalytics,
// getMatchingUsers, getUserProfile, updateUserProfileDoc


// ─── Dashboard: getPlatformAnalytics ─────────────────────────────────────────
export const getPlatformAnalytics = getDashboardAnalytics;

// ─── Collaboration: respondCollaborationRequest ───────────────────────────────
export const respondCollaborationRequest = async (collabId, status, collab, user) => {
  return updateCollaborationStatus(collabId, status);
};

// ─── Chat: subscribeMessages (returns unsubscribe fn) ────────────────────────
export const subscribeMessages = (roomId, callback) => {
  // Poll the backend every 3 seconds for new messages (REST fallback for real-time)
  let active = true;

  const poll = async () => {
    if (!active) return;
    try {
      if (!isDemoToken()) {
        const res = await API.get(`/messages/${roomId}`);
        const messages = res.data?.messages || res.data || [];
        callback(messages);
      } else {
        callback([
          {
            id: "demo-msg-1",
            roomId,
            text: "Welcome to BuildX Chat! Connect via WebSocket on the backend.",
            senderName: "BuildX Bot",
            senderAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bot",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {}
    if (active) setTimeout(poll, 3000);
  };

  poll();
  return () => { active = false; }; // unsubscribe function
};

// ─── Chat: sendMessage (alias for sendChatMessage with extra params) ──────────
export { sendChatMessage as sendMessage };

// ─── Chat: getOrCreateDirectConversation ─────────────────────────────────────
export const getOrCreateDirectConversation = async (user, targetUser) => {
  return withFallback(
    async () => {
      const res = await API.post("/messages/direct", {
        userId: user?.uid,
        targetUserId: targetUser?.uid || targetUser?.id,
      });
      return res.data?.conversation || res.data;
    },
    () => ({
      id: `dm-${user?.uid}-${targetUser?.uid || targetUser?.id}`,
      type: "direct",
      participants: [user, targetUser],
      createdAt: new Date().toISOString(),
    })
  );
};

// ─── SkillSwap: sendSkillExchangeRequest ─────────────────────────────────────
export const sendSkillExchangeRequest = async (data, user) => {
  return withFallback(
    async () => {
      const res = await API.post("/skillswap/request", data);
      return res.data?.request || res.data;
    },
    () => ({
      id: localId(),
      ...data,
      requesterId: user?.uid || "demo",
      requesterName: user?.name || "Demo User",
      status: "Pending",
      createdAt: new Date().toISOString(),
    })
  );
};

// ─── SkillSwap: respondSkillExchange ─────────────────────────────────────────
export const respondSkillExchange = async (exchangeId, status) => {
  return withFallback(
    async () => {
      const res = await API.put(`/skillswap/${exchangeId}/respond`, { status });
      return res.data;
    },
    () => ({ id: exchangeId, status })
  );
};

// ─── SkillSwap: getSkillExchanges ────────────────────────────────────────────
export const getSkillExchanges = async (userId) => {
  return withFallback(
    async () => {
      const res = await API.get("/skillswap/exchanges", { params: { userId } });
      return res.data?.exchanges || res.data || [];
    },
    () => [
      {
        id: "demo-exchange-1",
        offeredSkill: "React Development",
        wantedSkill: "Machine Learning",
        requesterName: "Alex Chen",
        requesterAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=alex",
        status: "Pending",
        createdAt: new Date().toISOString(),
      },
    ]
  );
};

// ─── Tasks: subscribeTasks (real-time subscription via polling) ───────────────
export const subscribeTasks = (userId, callback) => {
  let active = true;

  const poll = async () => {
    if (!active) return;
    try {
      const tasks = await getTasks("All");
      callback(tasks);
    } catch {}
    if (active) setTimeout(poll, 5000);
  };

  poll();
  return () => { active = false; };
};

// ─── Tasks: updateTaskStatus ──────────────────────────────────────────────────
export const updateTaskStatus = async (taskId, status) => {
  return updateTask(taskId, { status });
};

// ─── Projects: joinProject ────────────────────────────────────────────────────
export const joinProject = async (projectId, user) => {
  return withFallback(
    async () => {
      const res = await API.post(`/projects/${projectId}/join`);
      return res.data;
    },
    () => ({ projectId, userId: user?.uid, joined: true })
  );
};
