require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const User = require("../models/User");
const Idea = require("../models/Idea");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const CollaborationRequest = require("../models/CollaborationRequest");

const demoPassword = "BuildXDemo123!";

const demoUsers = [
  {
    name: "Aarav Sharma",
    email: "aarav.demo@buildx.dev",
    role: "Frontend Developer",
    experienceLevel: "Advanced",
    skillsHave: ["React", "TypeScript", "Figma"],
    skillsWant: ["Node.js", "Machine Learning"],
    interests: ["AI", "Open Source"],
    bio: "Builds thoughtful interfaces and loves turning ideas into products.",
    location: "Bengaluru, India",
    availability: "Available",
    isOnline: true,
    contributionScore: 94,
    productivityScore: 91,
  },
  {
    name: "Maya Patel",
    email: "maya.demo@buildx.dev",
    role: "UI/UX Designer",
    experienceLevel: "Advanced",
    skillsHave: ["UI/UX", "Figma", "User Research"],
    skillsWant: ["React", "Product Analytics"],
    interests: ["Design Systems", "Accessibility"],
    bio: "Designs calm, accessible experiences for ambitious teams.",
    location: "Pune, India",
    availability: "Available",
    contributionScore: 88,
    productivityScore: 86,
  },
  {
    name: "Leo Martin",
    email: "leo.demo@buildx.dev",
    role: "Backend Developer",
    experienceLevel: "Intermediate",
    skillsHave: ["Node.js", "MongoDB", "REST APIs"],
    skillsWant: ["React", "DevOps"],
    interests: ["Developer Tools", "Cloud"],
    bio: "Enjoys reliable APIs, clean data models, and useful automation.",
    location: "Lisbon, Portugal",
    availability: "Busy",
    contributionScore: 79,
    productivityScore: 83,
  },
  {
    name: "Zoya Khan",
    email: "zoya.demo@buildx.dev",
    role: "AI Engineer",
    experienceLevel: "Intermediate",
    skillsHave: ["Python", "Machine Learning", "Prompt Design"],
    skillsWant: ["Product Design", "React"],
    interests: ["AI", "Education"],
    bio: "Explores practical AI that helps people learn and collaborate.",
    location: "Hyderabad, India",
    availability: "Available",
    contributionScore: 82,
    productivityScore: 89,
  },
];

async function upsertDemoUsers() {
  const password = await bcrypt.hash(demoPassword, 10);
  const users = {};

  for (const details of demoUsers) {
    users[details.email] = await User.findOneAndUpdate(
      { email: details.email },
      { $set: { ...details }, $setOnInsert: { password } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return users;
}

async function seedDemoData() {
  await connectDB();

  const users = await upsertDemoUsers();
  const aarav = users["aarav.demo@buildx.dev"];
  const maya = users["maya.demo@buildx.dev"];
  const leo = users["leo.demo@buildx.dev"];
  const zoya = users["zoya.demo@buildx.dev"];

  const idea = await Idea.findOneAndUpdate(
    { title: "AI Study Companion", createdBy: aarav._id },
    {
      $set: {
        description: "A friendly workspace that turns study goals into small, achievable plans.",
        techStack: ["React", "Node.js", "Generative AI"],
        category: "AI",
        collaborators: [maya._id, zoya._id],
        status: "In Progress",
        visibility: "Public",
        featured: true,
        views: 128,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const project = await Project.findOneAndUpdate(
    { title: "BuildX Demo Workspace", owner: aarav._id },
    {
      $set: {
        description: "A sample collaboration workspace showing the BuildX workflow.",
        members: [aarav._id, maya._id, leo._id, zoya._id],
        linkedIdea: idea._id,
        status: "In Progress",
        completionPercentage: 50,
        totalTasks: 4,
        completedTasks: 2,
        priority: "High",
        visibility: "Public",
        tags: ["demo", "collaboration", "AI"],
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  idea.linkedProject = project._id;
  await idea.save();

  const taskDetails = [
    ["Map the onboarding flow", "Create the first-time user journey.", maya._id, "Completed", 100],
    ["Build the dashboard shell", "Implement the responsive React layout.", aarav._id, "Completed", 100],
    ["Connect the demo API", "Add the project and task data endpoints.", leo._id, "In Progress", 55],
    ["Prototype AI study prompts", "Test three helpful prompt patterns.", zoya._id, "Pending", 0],
  ];

  for (const [title, description, assignedTo, status, progress] of taskDetails) {
    await Task.findOneAndUpdate(
      { title, project: project._id },
      {
        $set: {
          description,
          assignedTo,
          status,
          progress,
          priority: progress === 0 ? "Medium" : "High",
          tags: ["demo", "BuildX"],
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const messages = [
    [maya, aarav, "The new onboarding flow is ready for feedback."],
    [aarav, maya, "It looks great. I will connect it to the workspace next."],
    [leo, aarav, "The demo API is ready and the task endpoint is responding."],
    [zoya, aarav, "I have a first pass of the AI study prompts to share."],
  ];

  for (const [sender, receiver, text] of messages) {
    await Message.findOneAndUpdate(
      { sender: sender._id, receiver: receiver._id, text },
      { $setOnInsert: { sender: sender._id, receiver: receiver._id, text } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const request = await CollaborationRequest.findOneAndUpdate(
    { sender: maya._id, receiver: aarav._id, title: "Design partnership for BuildX Demo Workspace" },
    {
      $set: {
        idea: idea._id,
        project: project._id,
        requestType: "Project Collaboration",
        message: "I would love to help polish the next workspace milestone.",
        status: "Pending",
        isRealtime: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const notifications = [
    [aarav, maya, "Maya sent you a collaboration request for the demo workspace.", "COLLAB_REQUEST"],
    [aarav, leo, "Leo completed the demo API setup.", "TASK_COMPLETED"],
    [aarav, zoya, "Zoya shared an update on AI study prompts.", "GENERAL"],
  ];

  for (const [receiver, sender, message, type] of notifications) {
    await Notification.findOneAndUpdate(
      { receiver: receiver._id, sender: sender._id, message },
      {
        $set: {
          type,
          project: project._id,
          idea: idea._id,
          requestId: type === "COLLAB_REQUEST" ? request._id : undefined,
          isRead: false,
        },
        $setOnInsert: { receiver: receiver._id, sender: sender._id, message },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  await Project.updateOne(
    { _id: project._id },
    { $set: { totalTasks: 4, completedTasks: 2, completionPercentage: 50 } }
  );

  console.log("Demo data is ready.");
  console.log(`Demo password: ${demoPassword}`);
  for (const details of demoUsers) {
    console.log(`${details.name}: ${details.email}`);
  }
}

seedDemoData()
  .catch((error) => {
    console.error("Demo seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });