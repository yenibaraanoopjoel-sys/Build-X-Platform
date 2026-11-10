import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  subscribeNotifications,
  markNotificationRead,
  deleteNotification,
  searchGlobal,
} from "../services/firestoreService";
import {
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Sparkles,
  Check,
  Trash2,
  FolderKanban,
  Lightbulb,
  Repeat,
  MessageSquare,
  Users,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Real-time notifications listener
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeNotifications(currentUser.uid, (data) => {
      setNotifications(data);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle Search
  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    setSearchLoading(true);
    setShowSearchModal(true);
    try {
      const results = await searchGlobal(searchTerm);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", icon: Sparkles },
    { label: "Ideas Hub", path: "/ideas", icon: Lightbulb },
    { label: "Projects", path: "/projects", icon: FolderKanban },
    { label: "Tasks", path: "/tasks", icon: Check },
    { label: "Skill Swap", path: "/skill-swap", icon: Repeat },
    { label: "Collabs", path: "/collaboration-requests", icon: Users },
    { label: "Chat", path: "/chat", icon: MessageSquare },
  ];

  const userAvatar =
    userProfile?.avatar ||
    currentUser?.photoURL ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.uid || "buildx"}`;
  const userName = userProfile?.name || currentUser?.displayName || "Innovator";

  return (
    <>
      <header
        style={{
          height: "72px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10, 15, 30, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
        }}
      >
        {/* BRAND LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <Link
            to="/dashboard"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: "900",
                fontSize: "20px",
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
              }}
            >
              X
            </div>
            <div>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  letterSpacing: "1.5px",
                  background: "linear-gradient(90deg, #FFFFFF 0%, #CBD5E1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                BUILDX
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#94A3B8",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginTop: "-2px",
                }}
              >
                Collaborate & Innovate
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav
            style={{
              display: "none",
              gap: "6px",
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: active ? "600" : "500",
                    color: active ? "#38BDF8" : "#94A3B8",
                    background: active ? "rgba(56, 189, 248, 0.1)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <item.icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SEARCH & USER ACTIONS */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* SEARCH BAR */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "6px 14px",
              width: "220px",
            }}
            className="search-bar-wrap"
          >
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search platform..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: "13px",
                marginLeft: "8px",
                width: "100%",
              }}
            />
          </form>

          {/* NOTIFICATIONS DROPDOWN */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              aria-label="Notifications"
              style={{
                position: "relative",
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: showNotifs ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: showNotifs ? "#38BDF8" : "#E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    background: "#EF4444",
                    color: "white",
                    borderRadius: "10px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "2px 6px",
                    minWidth: "18px",
                    textAlign: "center",
                    boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATIONS PANEL */}
            {showNotifs && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: "10px",
                  width: "360px",
                  maxHeight: "440px",
                  overflowY: "auto",
                  background: "#0F172A",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  padding: "16px",
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    paddingBottom: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <h4 style={{ margin: 0, color: "white", fontSize: "14px", fontWeight: "600" }}>
                    Notifications ({notifications.length})
                  </h4>
                  {unreadCount > 0 && (
                    <span style={{ fontSize: "11px", color: "#38BDF8" }}>
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p style={{ color: "#64748B", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: item.read ? "transparent" : "rgba(56, 189, 248, 0.08)",
                        border: "1px solid",
                        borderColor: item.read ? "rgba(255,255,255,0.04)" : "rgba(56, 189, 248, 0.2)",
                        marginBottom: "8px",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Link
                          to={item.link || "#"}
                          onClick={() => {
                            markNotificationRead(item.id);
                            setShowNotifs(false);
                          }}
                          style={{ textDecoration: "none", flex: 1 }}
                        >
                          <div style={{ fontSize: "13px", fontWeight: "600", color: "#F8FAFC" }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>
                            {item.message}
                          </div>
                        </Link>
                        <button
                          onClick={() => deleteNotification(item.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#64748B",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* USER PROFILE DROPDOWN */}
          <div style={{ position: "relative" }} ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "30px",
                padding: "4px 12px 4px 4px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <img
                src={userAvatar}
                alt={userName}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  background: "#1E293B",
                }}
              />
              <span
                style={{
                  color: "#F1F5F9",
                  fontSize: "13px",
                  fontWeight: "600",
                  maxWidth: "110px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userName}
              </span>
            </button>

            {/* PROFILE MENU */}
            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: "10px",
                  width: "220px",
                  background: "#0F172A",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "14px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  padding: "8px",
                  zIndex: 100,
                }}
              >
                <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "white" }}>
                    {userName}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#94A3B8" }}>
                    {currentUser?.email}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    fontSize: "13px",
                    color: "#E2E8F0",
                    textDecoration: "none",
                    borderRadius: "8px",
                    marginTop: "4px",
                  }}
                >
                  <User size={15} color="#38BDF8" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    fontSize: "13px",
                    color: "#E2E8F0",
                    textDecoration: "none",
                    borderRadius: "8px",
                  }}
                >
                  <Settings size={15} color="#A855F7" />
                  <span>Account Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    fontSize: "13px",
                    color: "#F87171",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px",
                    textAlign: "left",
                    marginTop: "4px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "72px",
            left: 0,
            width: "100%",
            background: "#0A0F1E",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "16px 24px",
            zIndex: 49,
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 0",
                color: location.pathname === item.path ? "#38BDF8" : "#E2E8F0",
                textDecoration: "none",
                fontSize: "15px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* SEARCH MODAL */}
      {showSearchModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowSearchModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              background: "#0F172A",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "20px",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "white", fontSize: "18px" }}>
                Search Results for "{searchTerm}"
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {searchLoading ? (
              <p style={{ color: "#94A3B8", textAlign: "center", padding: "30px" }}>Searching BuildX...</p>
            ) : searchResults ? (
              <div>
                {/* Users */}
                <h4 style={{ color: "#38BDF8", fontSize: "14px", marginTop: "12px" }}>
                  Users ({searchResults.users?.length || 0})
                </h4>
                {searchResults.users?.length === 0 ? (
                  <p style={{ color: "#64748B", fontSize: "12px" }}>No users matched.</p>
                ) : (
                  searchResults.users.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        padding: "8px 12px",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "8px",
                        marginBottom: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                        alt=""
                        style={{ width: "28px", height: "28px", borderRadius: "50%" }}
                      />
                      <div>
                        <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{u.name}</div>
                        <div style={{ color: "#94A3B8", fontSize: "11px" }}>{u.role}</div>
                      </div>
                    </div>
                  ))
                )}

                {/* Ideas */}
                <h4 style={{ color: "#F59E0B", fontSize: "14px", marginTop: "16px" }}>
                  Ideas ({searchResults.ideas?.length || 0})
                </h4>
                {searchResults.ideas?.length === 0 ? (
                  <p style={{ color: "#64748B", fontSize: "12px" }}>No ideas matched.</p>
                ) : (
                  searchResults.ideas.map((i) => (
                    <Link
                      key={i.id}
                      to="/ideas"
                      onClick={() => setShowSearchModal(false)}
                      style={{
                        display: "block",
                        padding: "8px 12px",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "8px",
                        marginBottom: "6px",
                        textDecoration: "none",
                      }}
                    >
                      <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{i.title}</div>
                      <div style={{ color: "#94A3B8", fontSize: "11px" }}>{i.category}</div>
                    </Link>
                  ))
                )}

                {/* Projects */}
                <h4 style={{ color: "#10B981", fontSize: "14px", marginTop: "16px" }}>
                  Projects ({searchResults.projects?.length || 0})
                </h4>
                {searchResults.projects?.length === 0 ? (
                  <p style={{ color: "#64748B", fontSize: "12px" }}>No projects matched.</p>
                ) : (
                  searchResults.projects.map((p) => (
                    <Link
                      key={p.id}
                      to="/projects"
                      onClick={() => setShowSearchModal(false)}
                      style={{
                        display: "block",
                        padding: "8px 12px",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "8px",
                        marginBottom: "6px",
                        textDecoration: "none",
                      }}
                    >
                      <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{p.name}</div>
                      <div style={{ color: "#94A3B8", fontSize: "11px" }}>Status: {p.status}</div>
                    </Link>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .search-bar-wrap { width: 140px !important; }
        }
      `}</style>
    </>
  );
}

export default Navbar;
