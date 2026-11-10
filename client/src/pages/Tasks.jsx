import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  subscribeTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getProjects,
} from "../services/firestoreService";
import { askJarvisAI } from "../services/aiService";
import {
  ListTodo,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
} from "lucide-react";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "#64748B", bg: "rgba(100, 116, 139, 0.1)" },
  { id: "in_progress", label: "In Progress", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
  { id: "review", label: "In Review", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  { id: "completed", label: "Completed", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
];

function Tasks() {
  const { currentUser, userProfile } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("All");
  const [loading, setLoading] = useState(true);

  // Create Task Modal
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    projectName: "",
    priority: "Medium",
    deadline: "",
    assigneeName: "",
  });

  // AI Task Generator
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGoal, setAiGoal] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch available projects
  useEffect(() => {
    getProjects().then((data) => setProjects(data));
  }, []);

  // Subscribe to tasks in real time
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeTasks(selectedProjectId, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [selectedProjectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      setModalLoading(true);
      const user = userProfile || {
        uid: currentUser.uid,
        name: currentUser.displayName,
      };

      const selectedProj = projects.find((p) => p.id === form.projectId);

      await createTask(
        {
          ...form,
          projectName: selectedProj?.name || "General Workspace",
          assigneeName: form.assigneeName || user.name || "Assigned Member",
        },
        user
      );

      setShowModal(false);
      setForm({
        title: "",
        description: "",
        projectId: "",
        projectName: "",
        priority: "Medium",
        deadline: "",
        assigneeName: "",
      });
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error("Error moving task:", err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to remove this task?")) return;
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // AI Task Breakdown Generator
  const handleGenerateAiTasks = async (e) => {
    e.preventDefault();
    if (!aiGoal.trim()) return;

    try {
      setAiLoading(true);
      const prompt = `You are JARVIS AI on BuildX. Break down this project milestone into 4 structured engineering tasks:
Milestone: "${aiGoal}"

Output strictly a JSON array of 4 objects with keys:
[{"title": "...", "description": "...", "priority": "High"|"Medium"|"Low"}]`;

      const response = await askJarvisAI({ message: prompt });
      const reply = response.reply || "";

      // Try parsing JSON array from AI reply
      const jsonMatch = reply.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const user = userProfile || { uid: currentUser.uid, name: currentUser.displayName };

        for (const t of parsed) {
          await createTask(
            {
              title: t.title,
              description: t.description,
              priority: t.priority || "Medium",
              projectId: selectedProjectId !== "All" ? selectedProjectId : "general",
              projectName: "AI Sprint Breakdown",
            },
            user
          );
        }
        setShowAiModal(false);
        setAiGoal("");
      } else {
        alert("JARVIS generated guidance:\n" + reply);
      }
    } catch (err) {
      console.error("AI task generator error:", err);
      alert("Failed to auto-generate tasks. Please create them manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || "Medium").toLowerCase();
    if (p === "urgent" || p === "high") {
      return { bg: "rgba(239, 68, 68, 0.15)", color: "#EF4444" };
    }
    if (p === "medium") {
      return { bg: "rgba(245, 158, 11, 0.15)", color: "#F59E0B" };
    }
    return { bg: "rgba(16, 185, 129, 0.15)", color: "#10B981" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main style={{ maxWidth: "1480px", margin: "0 auto", padding: "32px 24px" }}>
        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#10B981", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
              <ListTodo size={16} />
              <span>SPRINT & KANBAN MANAGEMENT</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#FFFFFF" }}>
              Task Board
            </h1>
            <p style={{ margin: "4px 0 0", color: "#94A3B8", fontSize: "14px" }}>
              Track milestones, assign deliverables, and advance tasks across development stages.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Filter by Project */}
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "12px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "white",
                fontSize: "13px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* AI Generator Button */}
            <button
              onClick={() => setShowAiModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "rgba(139, 92, 246, 0.15)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                color: "#C084FC",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <Sparkles size={16} />
              <span>JARVIS Breakdown</span>
            </button>

            {/* Add Task Button */}
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                border: "none",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.35)",
              }}
            >
              <Plus size={16} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* KANBAN BOARD COLUMNS */}
        {loading ? (
          <Loader />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            {COLUMNS.map((col, colIdx) => {
              const colTasks = tasks.filter((t) => (t.status || "todo").toLowerCase() === col.id);

              return (
                <div
                  key={col.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "20px",
                    minHeight: "520px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* COLUMN HEADER */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: "14px",
                      marginBottom: "16px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: col.color,
                        }}
                      />
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#FFFFFF" }}>
                        {col.label}
                      </h3>
                    </div>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: col.bg,
                        color: col.color,
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {colTasks.length}
                    </span>
                  </div>

                  {/* CARDS LIST */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                    {colTasks.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 10px",
                          color: "#64748B",
                          fontSize: "13px",
                          border: "1px dashed rgba(255,255,255,0.06)",
                          borderRadius: "12px",
                        }}
                      >
                        No tasks in {col.label}
                      </div>
                    ) : (
                      colTasks.map((task) => {
                        const pBadge = getPriorityBadge(task.priority);

                        return (
                          <div
                            key={task.id}
                            style={{
                              background: "rgba(30, 41, 59, 0.7)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              borderRadius: "14px",
                              padding: "16px",
                              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <span
                                style={{
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  background: pBadge.bg,
                                  color: pBadge.color,
                                  fontSize: "11px",
                                  fontWeight: "700",
                                }}
                              >
                                {task.priority || "Medium"}
                              </span>

                              <button
                                onClick={() => handleDelete(task.id)}
                                title="Delete task"
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#64748B",
                                  cursor: "pointer",
                                  padding: "2px",
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", lineHeight: "1.4" }}>
                              {task.title}
                            </div>

                            {task.description && (
                              <div style={{ fontSize: "12px", color: "#94A3B8", lineHeight: "1.5" }}>
                                {task.description}
                              </div>
                            )}

                            {/* ASSIGNEE & DEADLINE */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "11px",
                                color: "#94A3B8",
                                paddingTop: "8px",
                                borderTop: "1px solid rgba(255,255,255,0.04)",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <User size={12} color="#38BDF8" />
                                <span>{task.assigneeName || "Member"}</span>
                              </div>

                              {task.deadline && (
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                  <Clock size={12} color="#F59E0B" />
                                  <span>{task.deadline}</span>
                                </div>
                              )}
                            </div>

                            {/* COLUMN TRANSITION BUTTONS */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "6px",
                                paddingTop: "4px",
                              }}
                            >
                              {colIdx > 0 ? (
                                <button
                                  onClick={() => handleStatusChange(task.id, COLUMNS[colIdx - 1].id)}
                                  title={`Move to ${COLUMNS[colIdx - 1].label}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "none",
                                    color: "#94A3B8",
                                    fontSize: "11px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <ArrowLeft size={11} />
                                  <span>{COLUMNS[colIdx - 1].label}</span>
                                </button>
                              ) : (
                                <div />
                              )}

                              {colIdx < COLUMNS.length - 1 && (
                                <button
                                  onClick={() => handleStatusChange(task.id, COLUMNS[colIdx + 1].id)}
                                  title={`Move to ${COLUMNS[colIdx + 1].label}`}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    background: "rgba(56, 189, 248, 0.15)",
                                    border: "none",
                                    color: "#38BDF8",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                  }}
                                >
                                  <span>{COLUMNS[colIdx + 1].label}</span>
                                  <ArrowRight size={11} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CREATE TASK MODAL */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "#0F172A",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "white" }}>Create Task</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Firestore Security Rules & Tests"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Requirements, acceptance criteria, or bug details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Project
                  </label>
                  <select
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "#0F172A",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">General</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "#0F172A",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Assignee Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Engineer"
                    value={form.assigneeName}
                    onChange={(e) => setForm({ ...form, assigneeName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    color: "#94A3B8",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    border: "none",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {modalLoading ? "Creating..." : "Add to Board"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI TASK BREAKDOWN MODAL */}
      {showAiModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowAiModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "#0F172A",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "24px",
              padding: "28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Sparkles size={20} color="#A855F7" />
              <h3 style={{ margin: 0, fontSize: "18px", color: "white" }}>JARVIS Task Breakdown</h3>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "13px", lineHeight: "1.5", marginBottom: "18px" }}>
              Enter a high-level milestone or feature (e.g. "Realtime chat with typing indicator"). JARVIS will decompose it into Kanban tasks.
            </p>

            <form onSubmit={handleGenerateAiTasks}>
              <textarea
                required
                rows={3}
                placeholder="Describe the milestone or sprint goal..."
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: "18px",
                }}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    color: "#94A3B8",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiLoading}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
                    border: "none",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {aiLoading ? "Decomposing..." : "Generate Tasks"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
