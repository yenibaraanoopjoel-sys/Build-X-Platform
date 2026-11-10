import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";

// ==========================================
// 1. IDEAS HUB
// ==========================================

export const getIdeas = async (category = "All", search = "") => {
  try {
    let q = query(collection(db, "ideas"), orderBy("createdAt", "desc"), limit(50));
    const snapshot = await getDocs(q);
    let ideas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (category && category !== "All") {
      ideas = ideas.filter((idea) => idea.category?.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const s = search.toLowerCase();
      ideas = ideas.filter(
        (idea) =>
          idea.title?.toLowerCase().includes(s) ||
          idea.description?.toLowerCase().includes(s) ||
          (idea.requiredSkills && idea.requiredSkills.some((sk) => sk.toLowerCase().includes(s)))
      );
    }

    return ideas;
  } catch (err) {
    console.error("Error fetching ideas:", err);
    return [];
  }
};

export const createIdea = async (ideaData, user) => {
  const newIdea = {
    title: ideaData.title,
    description: ideaData.description,
    category: ideaData.category || "Technology",
    requiredSkills: Array.isArray(ideaData.requiredSkills)
      ? ideaData.requiredSkills
      : (ideaData.requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
    authorId: user.uid,
    authorName: user.name || user.displayName || user.email?.split("@")[0] || "Innovator",
    authorAvatar: user.avatar || user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
    authorRole: user.role || "Creator",
    likes: [],
    commentsCount: 0,
    collaborationStatus: "Open for Collaborators",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "ideas"), newIdea);
  return { id: docRef.id, ...newIdea };
};

export const deleteIdea = async (ideaId) => {
  await deleteDoc(doc(db, "ideas", ideaId));
};

export const toggleLikeIdea = async (ideaId, userId) => {
  const ideaRef = doc(db, "ideas", ideaId);
  const snap = await getDoc(ideaRef);
  if (!snap.exists()) return;

  const likes = snap.data().likes || [];
  if (likes.includes(userId)) {
    await updateDoc(ideaRef, { likes: arrayRemove(userId) });
  } else {
    await updateDoc(ideaRef, { likes: arrayUnion(userId) });
  }
};

export const getIdeaComments = async (ideaId) => {
  const q = query(
    collection(db, "ideas", ideaId, "comments"),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addIdeaComment = async (ideaId, commentText, user) => {
  const comment = {
    text: commentText,
    authorId: user.uid,
    authorName: user.name || user.displayName || "Innovator",
    authorAvatar: user.avatar || user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "ideas", ideaId, "comments"), comment);
  await updateDoc(doc(db, "ideas", ideaId), {
    commentsCount: increment(1),
  });

  return { id: ref.id, ...comment };
};

// ==========================================
// 2. PROJECTS
// ==========================================

export const getProjects = async (filter = "All", search = "") => {
  try {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(50));
    const snapshot = await getDocs(q);
    let projects = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (filter && filter !== "All") {
      projects = projects.filter((p) => p.status?.toLowerCase() === filter.toLowerCase());
    }

    if (search && search.trim()) {
      const s = search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.name?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s) ||
          (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(s)))
      );
    }

    return projects;
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  }
};

export const createProject = async (projectData, user) => {
  const newProject = {
    name: projectData.name,
    description: projectData.description,
    ownerId: user.uid,
    ownerName: user.name || user.displayName || "Creator",
    ownerAvatar: user.avatar || user.photoURL || null,
    status: projectData.status || "Planning",
    progress: parseInt(projectData.progress || 0, 10),
    teamMembers: [
      {
        uid: user.uid,
        name: user.name || user.displayName || "Owner",
        role: "Project Owner",
        avatar: user.avatar || user.photoURL || null,
      },
    ],
    teamMemberIds: [user.uid],
    technologies: Array.isArray(projectData.technologies)
      ? projectData.technologies
      : (projectData.technologies || "").split(",").map((t) => t.trim()).filter(Boolean),
    requiredSkills: Array.isArray(projectData.requiredSkills)
      ? projectData.requiredSkills
      : (projectData.requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean),
    startDate: projectData.startDate || new Date().toISOString().split("T")[0],
    targetDate: projectData.targetDate || "",
    tasksCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "projects"), newProject);
  return { id: docRef.id, ...newProject };
};

export const updateProject = async (projectId, updates) => {
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProject = async (projectId) => {
  await deleteDoc(doc(db, "projects", projectId));
};

export const joinProject = async (projectId, user, role = "Collaborator") => {
  const projectRef = doc(db, "projects", projectId);
  const snap = await getDoc(projectRef);
  if (!snap.exists()) return;

  const data = snap.data();
  if (data.teamMemberIds?.includes(user.uid)) return;

  const newMember = {
    uid: user.uid,
    name: user.name || user.displayName || "Collaborator",
    role: role,
    avatar: user.avatar || user.photoURL || null,
  };

  await updateDoc(projectRef, {
    teamMembers: arrayUnion(newMember),
    teamMemberIds: arrayUnion(user.uid),
    updatedAt: serverTimestamp(),
  });
};

// ==========================================
// 3. TASK MANAGEMENT (Kanban)
// ==========================================

export const subscribeTasks = (projectId, callback) => {
  let q;
  if (projectId && projectId !== "All") {
    q = query(collection(db, "tasks"), where("projectId", "==", projectId));
  } else {
    q = query(collection(db, "tasks"), orderBy("createdAt", "desc"), limit(100));
  }

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(tasks);
  });
};

export const createTask = async (taskData, user) => {
  const newTask = {
    title: taskData.title,
    description: taskData.description || "",
    projectId: taskData.projectId || "general",
    projectName: taskData.projectName || "General Workspace",
    assigneeId: taskData.assigneeId || user.uid,
    assigneeName: taskData.assigneeName || user.name || "Assigned Member",
    assigneeAvatar: taskData.assigneeAvatar || user.avatar || null,
    creatorId: user.uid,
    status: taskData.status || "todo", // 'todo', 'in_progress', 'review', 'completed'
    priority: taskData.priority || "Medium", // 'Low', 'Medium', 'High', 'Urgent'
    deadline: taskData.deadline || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "tasks"), newTask);
  return { id: docRef.id, ...newTask };
};

export const updateTaskStatus = async (taskId, newStatus) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTask = async (taskId) => {
  await deleteDoc(doc(db, "tasks", taskId));
};

// ==========================================
// 4. SKILL SWAP & EXCHANGES
// ==========================================

export const sendSkillExchangeRequest = async (targetUser, offerSkill, wantSkill, user) => {
  const request = {
    requesterId: user.uid,
    requesterName: user.name || user.displayName || "Innovator",
    requesterAvatar: user.avatar || user.photoURL || null,
    requesterRole: user.role || "Developer",
    targetUserId: targetUser.id || targetUser.uid,
    targetUserName: targetUser.name || "Collaborator",
    targetUserAvatar: targetUser.avatar || null,
    offerSkill,
    wantSkill,
    status: "pending", // 'pending', 'accepted', 'rejected', 'completed'
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "skillExchanges"), request);

  // Send in-app notification to target user
  await addDoc(collection(db, "notifications"), {
    userId: targetUser.id || targetUser.uid,
    type: "skill_exchange",
    title: "New Skill Exchange Request",
    message: `${user.name || "A user"} wants to swap skills: Offers ${offerSkill} for ${wantSkill}.`,
    link: "/skill-swap",
    read: false,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, ...request };
};

export const respondSkillExchange = async (exchangeId, status, requesterId, requesterName, actionUser) => {
  await updateDoc(doc(db, "skillExchanges", exchangeId), {
    status,
    updatedAt: serverTimestamp(),
  });

  if (requesterId) {
    await addDoc(collection(db, "notifications"), {
      userId: requesterId,
      type: "skill_response",
      title: `Skill Exchange ${status.toUpperCase()}`,
      message: `${actionUser.name || "A user"} ${status} your skill exchange request!`,
      link: "/skill-swap",
      read: false,
      createdAt: serverTimestamp(),
    });
  }
};

export const getSkillExchanges = async (userId) => {
  try {
    const q1 = query(collection(db, "skillExchanges"), where("requesterId", "==", userId));
    const q2 = query(collection(db, "skillExchanges"), where("targetUserId", "==", userId));

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const map = new Map();

    snap1.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
    snap2.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));

    return Array.from(map.values()).sort(
      (a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
    );
  } catch (err) {
    console.error("Error fetching skill exchanges:", err);
    return [];
  }
};

// ==========================================
// 5. COLLABORATION REQUESTS
// ==========================================

export const sendCollaborationRequest = async (receiverId, receiverName, projectId, projectTitle, message, user) => {
  const collab = {
    senderId: user.uid,
    senderName: user.name || user.displayName || "Innovator",
    senderAvatar: user.avatar || user.photoURL || null,
    senderRole: user.role || "Developer",
    receiverId,
    receiverName,
    projectId: projectId || "general",
    projectTitle: projectTitle || "General Collaboration",
    message: message || "I would love to collaborate with you on BuildX!",
    status: "pending",
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "collaborations"), collab);

  // Notify recipient
  await addDoc(collection(db, "notifications"), {
    userId: receiverId,
    type: "collaboration_request",
    title: "New Collaboration Invitation",
    message: `${user.name || "A user"} sent you a collaboration request for ${projectTitle || "a project"}.`,
    link: "/collaboration-requests",
    read: false,
    createdAt: serverTimestamp(),
  });

  return { id: ref.id, ...collab };
};

export const respondCollaborationRequest = async (collabId, status, collabData, actionUser) => {
  await updateDoc(doc(db, "collaborations", collabId), {
    status,
    updatedAt: serverTimestamp(),
  });

  if (collabData.senderId) {
    await addDoc(collection(db, "notifications"), {
      userId: collabData.senderId,
      type: "collaboration_response",
      title: `Collaboration Request ${status.toUpperCase()}`,
      message: `${actionUser.name || "A collaborator"} has ${status} your collaboration request.`,
      link: "/collaboration-requests",
      read: false,
      createdAt: serverTimestamp(),
    });
  }

  // If accepted and tied to a project, add user to project team
  if (status === "accepted" && collabData.projectId && collabData.projectId !== "general") {
    try {
      const projectRef = doc(db, "projects", collabData.projectId);
      await updateDoc(projectRef, {
        teamMemberIds: arrayUnion(collabData.senderId),
        teamMembers: arrayUnion({
          uid: collabData.senderId,
          name: collabData.senderName,
          role: collabData.senderRole || "Collaborator",
          avatar: collabData.senderAvatar,
        }),
      });
    } catch (e) {
      console.warn("Could not automatically attach member to project:", e);
    }
  }
};

export const getCollaborationRequests = async (userId) => {
  try {
    const qIncoming = query(collection(db, "collaborations"), where("receiverId", "==", userId));
    const qOutgoing = query(collection(db, "collaborations"), where("senderId", "==", userId));

    const [inSnap, outSnap] = await Promise.all([getDocs(qIncoming), getDocs(qOutgoing)]);

    return {
      incoming: inSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      outgoing: outSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    };
  } catch (err) {
    console.error("Error fetching collabs:", err);
    return { incoming: [], outgoing: [] };
  }
};

// ==========================================
// 6. REAL-TIME MESSAGING SYSTEM
// ==========================================

export const subscribeConversations = (userId, callback) => {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId),
    orderBy("updatedAt", "desc"),
    limit(30)
  );

  return onSnapshot(q, (snapshot) => {
    const convos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(convos);
  });
};

export const subscribeMessages = (conversationId, callback) => {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc"),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(msgs);
  });
};

export const sendMessage = async (conversationId, messageText, user, fileAttachment = null) => {
  const msg = {
    senderId: user.uid,
    senderName: user.name || user.displayName || "User",
    senderAvatar: user.avatar || user.photoURL || null,
    text: messageText,
    fileAttachment: fileAttachment || null,
    readBy: [user.uid],
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, "conversations", conversationId, "messages"), msg);

  await setDoc(
    doc(db, "conversations", conversationId),
    {
      lastMessage: messageText || "Sent an attachment",
      lastSenderId: user.uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { id: ref.id, ...msg };
};

export const getOrCreateDirectConversation = async (currentUser, otherUser) => {
  const participants = [currentUser.uid, otherUser.uid || otherUser.id].sort();
  const convoId = `direct_${participants[0]}_${participants[1]}`;
  const convoRef = doc(db, "conversations", convoId);
  const snap = await getDoc(convoRef);

  if (!snap.exists()) {
    const newConvo = {
      type: "direct",
      participants,
      participantDetails: {
        [currentUser.uid]: {
          name: currentUser.name || "You",
          avatar: currentUser.avatar || null,
        },
        [otherUser.uid || otherUser.id]: {
          name: otherUser.name || "Collaborator",
          avatar: otherUser.avatar || null,
        },
      },
      lastMessage: "Conversation opened",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(convoRef, newConvo);
    return { id: convoId, ...newConvo };
  }

  return { id: snap.id, ...snap.data() };
};

// ==========================================
// 7. NOTIFICATIONS
// ==========================================

export const subscribeNotifications = (userId, callback) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(25)
  );

  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(notifs);
  });
};

export const markNotificationRead = async (notificationId) => {
  await updateDoc(doc(db, "notifications", notificationId), {
    read: true,
  });
};

export const deleteNotification = async (notificationId) => {
  await deleteDoc(doc(db, "notifications", notificationId));
};

// ==========================================
// 8. GLOBAL SEARCH
// ==========================================

export const searchGlobal = async (term) => {
  if (!term || !term.trim()) return { users: [], ideas: [], projects: [] };
  const s = term.toLowerCase().trim();

  try {
    const [usersSnap, ideasSnap, projectsSnap] = await Promise.all([
      getDocs(query(collection(db, "users"), limit(40))),
      getDocs(query(collection(db, "ideas"), limit(40))),
      getDocs(query(collection(db, "projects"), limit(40))),
    ]);

    const users = usersSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter(
        (u) =>
          u.name?.toLowerCase().includes(s) ||
          u.role?.toLowerCase().includes(s) ||
          (u.skills && u.skills.some((sk) => sk.toLowerCase().includes(s)))
      );

    const ideas = ideasSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter(
        (i) =>
          i.title?.toLowerCase().includes(s) ||
          i.category?.toLowerCase().includes(s) ||
          i.description?.toLowerCase().includes(s)
      );

    const projects = projectsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(s) ||
          p.status?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s)
      );

    return { users, ideas, projects };
  } catch (err) {
    console.error("Global search error:", err);
    return { users: [], ideas: [], projects: [] };
  }
};

// ==========================================
// 9. CLIENT-SIDE FALLBACK ANALYTICS & MATCHING
// ==========================================

export const getPlatformAnalytics = async () => {
  try {
    const [projectsSnap, ideasSnap, tasksSnap, collabsSnap, skillSnap, usersSnap] =
      await Promise.all([
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "ideas")),
        getDocs(collection(db, "tasks")),
        getDocs(collection(db, "collaborations")),
        getDocs(collection(db, "skillExchanges")),
        getDocs(collection(db, "users")),
      ]);

    const totalProjects = projectsSnap.size;
    let completedProjects = 0;
    let activeProjects = 0;
    projectsSnap.forEach((d) => {
      const data = d.data();
      if ((data.status || "").toLowerCase() === "completed") completedProjects++;
      else activeProjects++;
    });

    const totalIdeas = ideasSnap.size;
    const totalTasks = tasksSnap.size;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let todoTasks = 0;
    let reviewTasks = 0;

    tasksSnap.forEach((d) => {
      const status = (d.data().status || "").toLowerCase();
      if (status === "completed" || status === "done") completedTasks++;
      else if (status.includes("progress")) inProgressTasks++;
      else if (status === "review") reviewTasks++;
      else todoTasks++;
    });

    const taskCompletionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let activeCollaborations = 0;
    let pendingCollaborations = 0;
    collabsSnap.forEach((d) => {
      const status = (d.data().status || "").toLowerCase();
      if (status === "accepted") activeCollaborations++;
      else if (status === "pending") pendingCollaborations++;
    });

    let completedSkillExchanges = 0;
    skillSnap.forEach((d) => {
      const status = (d.data().status || "").toLowerCase();
      if (status === "accepted" || status === "completed") completedSkillExchanges++;
    });

    return {
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalIdeas,
        totalTasks,
        completedTasks,
        taskCompletionRate,
        totalCollaborations: collabsSnap.size,
        activeCollaborations,
        pendingCollaborations,
        totalSkillExchanges: skillSnap.size,
        completedSkillExchanges,
        totalUsers: usersSnap.size,
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
    };
  } catch (err) {
    console.warn("Client fallback analytics compilation:", err);
    return {
      stats: {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalIdeas: 0,
        totalTasks: 0,
        completedTasks: 0,
        taskCompletionRate: 0,
        totalCollaborations: 0,
        activeCollaborations: 0,
        pendingCollaborations: 0,
        totalSkillExchanges: 0,
        completedSkillExchanges: 0,
        totalUsers: 0,
      },
      charts: {
        taskDistribution: [],
        projectDistribution: [],
      },
    };
  }
};

export const getMatchingUsers = async (currentUser) => {
  try {
    const currentUid = currentUser?.uid;
    const snap = await getDocs(query(collection(db, "users"), limit(60)));

    const currentSkillsHave = (
      currentUser?.skills ||
      currentUser?.skillsHave ||
      []
    ).map((s) => s.toLowerCase());

    const currentSkillsWant = (
      currentUser?.skillsToLearn ||
      currentUser?.skillsWant ||
      []
    ).map((s) => s.toLowerCase());

    const results = [];
    snap.forEach((d) => {
      if (d.id === currentUid) return;
      const u = d.data();

      const otherSkillsHave = (u.skills || []).map((s) => s.toLowerCase());
      const otherSkillsWant = (u.skillsToLearn || []).map((s) => s.toLowerCase());

      let score = 5; // base connection score
      const matchedSkills = [];

      currentSkillsWant.forEach((skill) => {
        if (otherSkillsHave.some((s) => s.includes(skill) || skill.includes(s))) {
          score += 20;
          matchedSkills.push(`Can teach you: ${skill}`);
        }
      });

      otherSkillsWant.forEach((skill) => {
        if (currentSkillsHave.some((s) => s.includes(skill) || skill.includes(s))) {
          score += 20;
          matchedSkills.push(`Wants to learn: ${skill}`);
        }
      });

      currentSkillsHave.forEach((skill) => {
        if (otherSkillsHave.some((s) => s === skill)) {
          score += 10;
        }
      });

      results.push({
        id: d.id,
        uid: d.id,
        name: u.name || u.displayName || u.email?.split("@")[0] || "Innovator",
        email: u.email,
        role: u.role || "Developer",
        bio: u.bio || "Passionate innovator collaborating on BuildX.",
        avatar: u.avatar || u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${d.id}`,
        skills: u.skills || ["React", "JavaScript"],
        skillsToLearn: u.skillsToLearn || ["Cloud", "AI"],
        matchScore: score,
        matchedSkills,
      });
    });

    results.sort((a, b) => b.matchScore - a.matchScore);
    return results;
  } catch (err) {
    console.error("Client getMatchingUsers error:", err);
    return [];
  }
};


