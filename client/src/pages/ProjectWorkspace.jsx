import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  getProjects,
  createProject,
  deleteProject,
  joinProject,
} from "../services/dataService";
import {
  FolderKanban,
  Plus,
  Search,
  Video,
  ListTodo,
  Trash2,
} from "lucide-react";

const STATUSES = ["All", "Planning", "Active", "On Hold", "Completed"];

function ProjectWorkspace() {
  const { currentUser, userProfile } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Create Project Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Planning",
    progress: 10,
    technologies: "React, Firebase, Node.js",
    requiredSkills: "Frontend, Cloud, UI/UX",
    startDate: new Date().toISOString().split("T")[0],
    targetDate: "",
  });

  const fetchProjectsData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjects(selectedStatus, searchTerm);
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchTerm]);

  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;

    try {
      setModalLoading(true);
      const user = userProfile || {
        uid: currentUser.uid,
        name: currentUser.displayName,
        role: "Project Owner",
      };

      await createProject(form, user);
      setShowCreateModal(false);
      setForm({
        name: "",
        description: "",
        status: "Planning",
        progress: 10,
        technologies: "React, Firebase, Node.js",
        requiredSkills: "Frontend, Cloud, UI/UX",
        startDate: new Date().toISOString().split("T")[0],
        targetDate: "",
      });
      fetchProjectsData();
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleJoin = async (projectId) => {
    if (!currentUser) return;
    try {
      const user = userProfile || {
        uid: currentUser.uid,
        name: currentUser.displayName,
        role: "Collaborator",
      };
      await joinProject(projectId, user);
      fetchProjectsData();
    } catch (err) {
      console.error("Error joining project:", err);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };



  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main style={{ maxWidth: "1320px", margin: "0 auto", padding: "36px 24px" }}>
        {/* HEADER BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#38BDF8", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
              <FolderKanban size={16} />
              <span>COLLABORATIVE PROJECT WORKSPACES</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#FFFFFF" }}>
              Projects
            </h1>
            <p style={{ margin: "4px 0 0", color: "#94A3B8", fontSize: "14px" }}>
              Create, manage, and scale real-world projects with cross-functional teams.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
            }}
          >
            <Plus size={18} />
            <span>Create Project</span>
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 18px",
              borderRadius: "14px",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              maxWidth: "500px",
            }}
          >
            <Search size={18} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search projects by title, description or stack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
            {STATUSES.map((st) => {
              const active = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    background: active ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.04)",
                    border: "1px solid",
                    borderColor: active ? "#38BDF8" : "rgba(255, 255, 255, 0.08)",
                    color: active ? "#38BDF8" : "#94A3B8",
                    fontSize: "13px",
                    fontWeight: active ? "700" : "500",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* PROJECTS GRID */}
        {loading ? (
          <Loader />
        ) : projects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "rgba(15, 23, 42, 0.5)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <FolderKanban size={48} color="#38BDF8" style={{ opacity: 0.6, marginBottom: "16px" }} />
            <h3 style={{ color: "#FFFFFF", fontSize: "20px", margin: "0 0 8px" }}>No Projects Found</h3>
            <p style={{ color: "#94A3B8", fontSize: "14px", maxWidth: "420px", margin: "0 auto 20px" }}>
              Start by creating a collaborative project workspace or invite other members to join!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                color: "white",
                border: "none",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <Plus size={16} />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "24px",
            }}
          >
            {projects.map((project) => {
              const isOwner = currentUser && project.ownerId === currentUser.uid;
              const isMember =
                currentUser &&
                Array.isArray(project.teamMemberIds) &&
                project.teamMemberIds.includes(currentUser.uid);

              const statusColor =
                project.status === "Completed"
                  ? "#10B981"
                  : project.status === "Active"
                  ? "#3B82F6"
                  : project.status === "On Hold"
                  ? "#EF4444"
                  : "#F59E0B";

              return (
                <div
                  key={project.id}
                  style={{
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "22px",
                    padding: "26px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <div>
                    {/* TOP BADGE & ACTIONS */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "10px",
                          background: `${statusColor}1A`,
                          color: statusColor,
                          fontSize: "12px",
                          fontWeight: "700",
                          border: `1px solid ${statusColor}40`,
                        }}
                      >
                        {project.status || "Planning"}
                      </span>

                      {isOwner && (
                        <button
                          onClick={() => handleDelete(project.id)}
                          title="Delete Project"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: "700", color: "#FFFFFF" }}>
                      {project.name}
                    </h3>
                    <p style={{ margin: "0 0 18px", color: "#94A3B8", fontSize: "14px", lineHeight: "1.6" }}>
                      {project.description}
                    </p>

                    {/* PROGRESS BAR */}
                    <div style={{ marginBottom: "18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94A3B8", marginBottom: "6px" }}>
                        <span>Sprint Progress</span>
                        <span style={{ color: "#38BDF8", fontWeight: "700" }}>{project.progress || 0}%</span>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${project.progress || 0}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #3B82F6 0%, #10B981 100%)",
                            borderRadius: "4px",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* TECHNOLOGIES */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div style={{ marginBottom: "18px" }}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "3px 8px",
                                borderRadius: "6px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                color: "#CBD5E1",
                                fontSize: "11px",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* TEAM MEMBERS */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "14px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ display: "flex", marginLeft: "6px" }}>
                          {(project.teamMembers || []).slice(0, 4).map((member, idx) => (
                            <img
                              key={idx}
                              src={member.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.uid || idx}`}
                              alt=""
                              title={member.name}
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                marginLeft: idx > 0 ? "-8px" : 0,
                                border: "2px solid #0F172A",
                              }}
                            />
                          ))}
                        </div>
                        <span style={{ color: "#94A3B8", fontSize: "12px", marginLeft: "4px" }}>
                          {(project.teamMembers || []).length} team
                        </span>
                      </div>

                      <div style={{ fontSize: "11px", color: "#64748B" }}>
                        Owner: {project.ownerName}
                      </div>
                    </div>

                    {/* ACTIONS: TASKS, MEETING, JOIN */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        to="/tasks"
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "#E2E8F0",
                          textDecoration: "none",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        <ListTodo size={14} color="#38BDF8" />
                        <span>Tasks</span>
                      </Link>

                      <Link
                        to={`/meeting/${project.id}`}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "10px",
                          borderRadius: "10px",
                          background: "rgba(59, 130, 246, 0.15)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          color: "#60A5FA",
                          textDecoration: "none",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        <Video size={14} />
                        <span>Video Room</span>
                      </Link>

                      {!isOwner && !isMember && (
                        <button
                          onClick={() => handleJoin(project.id)}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #10B981, #059669)",
                            border: "none",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Join Team
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
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
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#0F172A",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "32px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "20px", color: "white" }}>Create Collaborative Project</h3>
                <span style={{ fontSize: "13px", color: "#94A3B8" }}>Build your vision with your dream team</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Realtime Autonomous Platform"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Summary of project architecture, target milestones, and tech challenges..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "#0F172A",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    Initial Progress %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.progress}
                    onChange={(e) => setForm({ ...form, progress: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Firebase, Tailwind, Python"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#CBD5E1", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  Required Skills for Collaborators
                </label>
                <input
                  type="text"
                  placeholder="Frontend Architect, AI Engineer, UI Designer"
                  value={form.requiredSkills}
                  onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    color: "#94A3B8",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                    border: "none",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {modalLoading ? "Creating Project..." : "Launch Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectWorkspace;
