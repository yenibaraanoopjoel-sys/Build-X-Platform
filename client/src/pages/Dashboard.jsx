import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  getProjects,
  getIdeas,
  getCollaborationRequests,
  getPlatformAnalytics,
  getMatchingUsers,
} from "../services/firestoreService";
import API from "../services/api";
import {
  FolderKanban,
  Lightbulb,
  CheckCircle,
  Users,
  TrendingUp,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const { currentUser, userProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalIdeas: 0,
    completedTasks: 0,
    totalTasks: 0,
    taskCompletionRate: 0,
    pendingCollaborations: 0,
  });

  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [analyticsCharts, setAnalyticsCharts] = useState(null); // eslint-disable-line no-unused-vars

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch projects, ideas, collaborations, and analytics
      const [allProjects, allIdeas, collabs, analyticsRes, matchRes] = await Promise.all([
        getProjects(),
        getIdeas(),
        currentUser ? getCollaborationRequests(currentUser.uid) : Promise.resolve({ incoming: [], outgoing: [] }),
        API.get("/analytics").catch(() => ({ data: {} })),
        API.get("/match/users").catch(() => ({ data: {} })),
      ]);

      let analyticsData = analyticsRes.data?.stats;
      let chartsData = analyticsRes.data?.charts;

      if (!analyticsData) {
        const directAnalytics = await getPlatformAnalytics();
        analyticsData = directAnalytics.stats;
        chartsData = directAnalytics.charts;
      }

      const pendingCollabs = collabs.incoming.filter((c) => c.status === "pending").length;

      setStats({
        totalProjects: allProjects.length || analyticsData?.totalProjects || 0,
        activeProjects: allProjects.filter((p) => (p.status || "").toLowerCase() !== "completed").length,
        completedProjects: allProjects.filter((p) => (p.status || "").toLowerCase() === "completed").length,
        totalIdeas: allIdeas.length || analyticsData?.totalIdeas || 0,
        totalTasks: analyticsData?.totalTasks || 0,
        completedTasks: analyticsData?.completedTasks || 0,
        taskCompletionRate: analyticsData?.taskCompletionRate || 0,
        pendingCollaborations: pendingCollabs,
      });

      if (chartsData) {
        setAnalyticsCharts(chartsData);
      }

      // Filter recommended projects based on user skills
      const userSkills = (userProfile?.skills || []).map((s) => s.toLowerCase());
      const recProj = allProjects.filter((p) => {
        if (p.ownerId === currentUser?.uid) return false;
        if (!p.requiredSkills || p.requiredSkills.length === 0) return true;
        return p.requiredSkills.some((sk) => userSkills.includes(sk.toLowerCase()));
      });
      setRecommendedProjects(recProj.slice(0, 3));

      // Recommended users
      let recUsers = matchRes.data?.users;
      if (!recUsers || recUsers.length === 0) {
        recUsers = await getMatchingUsers(currentUser);
      }
      if (recUsers) {
        setRecommendedUsers(recUsers.slice(0, 4));
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, userProfile]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);



  if (loading) {
    return <Loader />;
  }

  const userName = userProfile?.name || currentUser?.displayName || "Innovator";
  const userRole = userProfile?.role || "Creator";
  const skillsHave = userProfile?.skills || ["JavaScript", "React"];
  const skillsWant = userProfile?.skillsToLearn || ["AI Integration", "Cloud Architecture"];

  // Activity trend data for Recharts
  const activityTrendData = [
    { day: "Mon", activities: Math.max(stats.totalProjects, 2) },
    { day: "Tue", activities: Math.max(stats.totalIdeas, 3) },
    { day: "Wed", activities: Math.max(stats.completedTasks, 5) },
    { day: "Thu", activities: Math.max(stats.activeProjects, 4) },
    { day: "Fri", activities: Math.max(stats.totalTasks, 6) },
    { day: "Sat", activities: stats.completedTasks + 2 },
    { day: "Sun", activities: stats.totalProjects + stats.totalIdeas + 1 },
  ];



  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main style={{ maxWidth: "1380px", margin: "0 auto", padding: "32px 24px" }}>
        {/* HERO BANNER & WELCOME */}
        <section
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "24px",
            padding: "36px",
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle glow */}
          <div
            style={{
              position: "absolute",
              right: "-80px",
              top: "-80px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(59, 130, 246, 0.15)",
              filter: "blur(90px)",
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "20px",
                background: "rgba(56, 189, 248, 0.1)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                color: "#38BDF8",
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              <Sparkles size={14} />
              <span>BUILDX INNOVATION WORKSPACE</span>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 8px", color: "#FFFFFF" }}>
              Welcome back, {userName}
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "15px", margin: 0, maxWidth: "600px" }}>
              Explore active project collaborations, match skills with top engineers, and track your development sprint.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", position: "relative", zIndex: 2 }}>
            <Link
              to="/post-idea"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.35)",
              }}
            >
              <Lightbulb size={16} />
              <span>Publish Idea</span>
            </Link>
            <Link
              to="/projects"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              <FolderKanban size={16} />
              <span>New Project</span>
            </Link>
          </div>
        </section>

        {/* METRICS STATS GRID */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          {/* Card 1: Total Projects */}
          <div
            style={{
              padding: "24px",
              background: "rgba(15, 23, 42, 0.7)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ color: "#94A3B8", fontSize: "13px", fontWeight: "500" }}>Total Projects</span>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#38BDF8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FolderKanban size={20} />
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#FFFFFF" }}>{stats.totalProjects}</div>
            <div style={{ color: "#10B981", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={14} />
              <span>{stats.activeProjects} Active / {stats.completedProjects} Completed</span>
            </div>
          </div>

          {/* Card 2: Published Ideas */}
          <div
            style={{
              padding: "24px",
              background: "rgba(15, 23, 42, 0.7)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ color: "#94A3B8", fontSize: "13px", fontWeight: "500" }}>Ideas Discovered</span>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#F59E0B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lightbulb size={20} />
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#FFFFFF" }}>{stats.totalIdeas}</div>
            <div style={{ color: "#F59E0B", fontSize: "12px", marginTop: "4px" }}>Open for co-founders</div>
          </div>

          {/* Card 3: Task Completion Rate */}
          <div
            style={{
              padding: "24px",
              background: "rgba(15, 23, 42, 0.7)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ color: "#94A3B8", fontSize: "13px", fontWeight: "500" }}>Task Completion</span>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle size={20} />
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#FFFFFF" }}>{stats.taskCompletionRate}%</div>
            <div style={{ color: "#94A3B8", fontSize: "12px", marginTop: "4px" }}>
              {stats.completedTasks} of {stats.totalTasks} completed
            </div>
          </div>

          {/* Card 4: Pending Collaborations */}
          <div
            style={{
              padding: "24px",
              background: "rgba(15, 23, 42, 0.7)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ color: "#94A3B8", fontSize: "13px", fontWeight: "500" }}>Pending Collabs</span>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "rgba(139, 92, 246, 0.15)",
                  color: "#A855F7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users size={20} />
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#FFFFFF" }}>{stats.pendingCollaborations}</div>
            <Link
              to="/collaboration-requests"
              style={{ color: "#A855F7", fontSize: "12px", marginTop: "4px", display: "inline-block", textDecoration: "none" }}
            >
              Review pending requests →
            </Link>
          </div>
        </section>

        {/* TWO-COLUMN CONTENT GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "28px", marginBottom: "36px" }} className="dash-grid">
          {/* LEFT COLUMN: CHARTS & RECOMMENDED PROJECTS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* PLATFORM ACTIVITY CHART (RECHARTS) */}
            <div
              style={{
                padding: "28px",
                background: "rgba(15, 23, 42, 0.7)",
                borderRadius: "22px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "white" }}>Development Activity Pulse</h3>
                  <span style={{ color: "#94A3B8", fontSize: "13px" }}>Weekly engagement across workspaces</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#10B981" }}>
                  <Zap size={14} />
                  <span>Real-time Sync</span>
                </div>
              </div>

              <div style={{ height: "240px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityTrendData}>
                    <defs>
                      <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#0F172A",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "10px",
                        color: "white",
                        fontSize: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="activities" stroke="#3B82F6" strokeWidth={3} fill="url(#actGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECOMMENDED PROJECTS */}
            <div
              style={{
                padding: "28px",
                background: "rgba(15, 23, 42, 0.7)",
                borderRadius: "22px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "white" }}>Recommended Projects</h3>
                  <span style={{ color: "#94A3B8", fontSize: "13px" }}>Matched based on your engineering skill profile</span>
                </div>
                <Link to="/projects" style={{ color: "#38BDF8", fontSize: "13px", textDecoration: "none", fontWeight: "600" }}>
                  View All →
                </Link>
              </div>

              {recommendedProjects.length === 0 ? (
                <p style={{ color: "#64748B", fontSize: "14px", textAlign: "center", padding: "20px" }}>
                  No matching projects found yet. Explore all projects or publish your own!
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {recommendedProjects.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "14px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#FFFFFF" }}>{p.name}</div>
                        <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: "2px", maxWidth: "480px" }}>
                          {p.description}
                        </div>
                        <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                          {(p.requiredSkills || []).map((sk, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "3px 8px",
                                borderRadius: "6px",
                                background: "rgba(56, 189, 248, 0.1)",
                                color: "#38BDF8",
                                fontSize: "11px",
                              }}
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link
                        to="/projects"
                        style={{
                          padding: "8px 14px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "#E2E8F0",
                          textDecoration: "none",
                          fontSize: "13px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Explore
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: PROFILE OVERVIEW, SKILLS & RECOMMENDED USERS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* USER PROFILE OVERVIEW CARD */}
            <div
              style={{
                padding: "28px",
                background: "rgba(15, 23, 42, 0.7)",
                borderRadius: "22px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <img
                  src={
                    userProfile?.avatar ||
                    currentUser?.photoURL ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.uid || "user"}`
                  }
                  alt=""
                  style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#1E293B" }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: "17px", color: "white" }}>{userName}</h3>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: "rgba(139, 92, 246, 0.15)",
                      color: "#A855F7",
                      fontSize: "11px",
                      fontWeight: "600",
                      marginTop: "4px",
                    }}
                  >
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Skills I Have */}
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>
                  Skills Available
                </span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                  {skillsHave.map((sk, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        background: "rgba(16, 185, 129, 0.12)",
                        color: "#34D399",
                        fontSize: "12px",
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills To Learn */}
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>
                  Skills to Learn (For Swap)
                </span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                  {skillsWant.map((sk, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        background: "rgba(59, 130, 246, 0.12)",
                        color: "#60A5FA",
                        fontSize: "12px",
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to="/profile"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#E2E8F0",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Edit Profile & Skills →
              </Link>
            </div>

            {/* RECOMMENDED COLLABORATORS */}
            <div
              style={{
                padding: "28px",
                background: "rgba(15, 23, 42, 0.7)",
                borderRadius: "22px",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "17px", color: "white" }}>Top Collaborators</h3>
                <Link to="/skill-swap" style={{ color: "#38BDF8", fontSize: "12px", textDecoration: "none" }}>
                  Skill Swap →
                </Link>
              </div>

              {recommendedUsers.length === 0 ? (
                <p style={{ color: "#64748B", fontSize: "13px" }}>No other members registered yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {recommendedUsers.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                          alt=""
                          style={{ width: "36px", height: "36px", borderRadius: "50%" }}
                        />
                        <div>
                          <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{u.name}</div>
                          <div style={{ color: "#94A3B8", fontSize: "11px" }}>{u.role}</div>
                        </div>
                      </div>
                      <Link
                        to="/skill-swap"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(56, 189, 248, 0.15)",
                          color: "#38BDF8",
                          textDecoration: "none",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}
                      >
                        Swap
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 960px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
