import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ─── Build default profile from JWT response ─────────────────────────────────
const buildDefaultProfile = (userData) => ({
  uid: userData._id || userData.id || userData.uid,
  id: userData._id || userData.id || userData.uid,
  email: userData.email || "",
  name: userData.name || userData.email?.split("@")[0] || "BuildX Innovator",
  username: userData.username || userData.email?.split("@")[0] || "innovator",
  role: userData.role || "Developer",
  skills: userData.skills || ["JavaScript", "React", "Node.js"],
  skillsToLearn: userData.skillsToLearn || ["AI Integration", "Cloud Architecture"],
  areasOfInterest: userData.areasOfInterest || ["Full Stack", "Collaboration"],
  bio: userData.bio || "Passionate builder collaborating on the BuildX platform.",
  avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData._id || userData.email}`,
  socialLinks: userData.socialLinks || { github: "", linkedin: "", twitter: "", website: "" },
  achievements: userData.achievements || ["Early Innovator"],
  totalProjects: userData.totalProjects || 0,
  activeProjects: userData.activeProjects || 0,
  emailVerified: true,
  provider: "email",
  createdAt: userData.createdAt || new Date().toISOString(),
  updatedAt: userData.updatedAt || new Date().toISOString(),
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(localStorage.getItem("token") || null);

  const setToken = (t) => {
    setTokenState(t);
    if (t) {
      localStorage.setItem("token", t);
    } else {
      localStorage.removeItem("token");
    }
  };

  // ─── On mount: restore session from localStorage ─────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        setUserProfile(parsed);
        setTokenState(storedToken);

        // Verify token is still valid by calling /api/auth/me
        API.get("/auth/me")
          .then((res) => {
            const profile = buildDefaultProfile(res.data.user || res.data);
            setCurrentUser(profile);
            setUserProfile(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          })
          .catch(() => {
            // Token expired — clear session
            setCurrentUser(null);
            setUserProfile(null);
            setTokenState(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          })
          .finally(() => setLoading(false));
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // ─── Demo / Instant Access Session ───────────────────────────────────────────
  const createFallbackSession = useCallback((customEmail, customName) => {
    const email = customEmail || "demo@buildx.app";
    const name = customName || "Demo User";
    const uid = "demo-" + Math.random().toString(36).slice(2, 8);
    const fakeToken = "demo-token-" + uid;

    const demoProfile = {
      uid,
      id: uid,
      email,
      name,
      username: name.toLowerCase().replace(/\s+/g, "_"),
      role: "Developer",
      skills: ["React", "JavaScript", "Node.js", "MongoDB"],
      skillsToLearn: ["AI/ML", "Cloud Architecture", "DevOps"],
      areasOfInterest: ["Full Stack", "Collaboration", "Open Source"],
      bio: "Demo user exploring the BuildX platform.",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
      socialLinks: { github: "", linkedin: "", twitter: "", website: "" },
      achievements: ["Early Innovator", "Platform Pioneer"],
      totalProjects: 0,
      activeProjects: 0,
      emailVerified: true,
      provider: "demo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setToken(fakeToken);
    setCurrentUser(demoProfile);
    setUserProfile(demoProfile);
    localStorage.setItem("user", JSON.stringify(demoProfile));
    return demoProfile;
  }, []);

  // ─── Login with Email / Password ─────────────────────────────────────────────
  const loginWithEmail = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token: jwt, user } = res.data;

      setToken(jwt);
      const profile = buildDefaultProfile(user);
      setCurrentUser(profile);
      setUserProfile(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      const code = err.response?.status;
      const error = new Error(msg);
      if (code === 401) error.code = "auth/invalid-credential";
      else if (code === 429) error.code = "auth/too-many-requests";
      throw error;
    }
  };

  // ─── Register with Email ──────────────────────────────────────────────────────
  const registerWithEmail = async (email, password, extraData = {}) => {
    try {
      const res = await API.post("/auth/register", {
        email,
        password,
        name: extraData.name || email.split("@")[0],
        role: extraData.role || "Developer",
        skills: extraData.skills || [],
        skillsToLearn: extraData.skillsToLearn || [],
        areasOfInterest: extraData.areasOfInterest || [],
        bio: extraData.bio || "",
      });
      const { token: jwt, user } = res.data;

      setToken(jwt);
      const profile = buildDefaultProfile(user);
      setCurrentUser(profile);
      setUserProfile(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      const code = err.response?.status;
      const error = new Error(msg);
      if (code === 409) error.code = "auth/email-already-in-use";
      throw error;
    }
  };

  // ─── Google Sign-In (falls back to demo since backend OAuth not configured) ───
  const loginWithGoogle = async () => {
    try {
      // Try backend Google OAuth endpoint if available
      const res = await API.get("/auth/google");
      if (res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
        return;
      }
    } catch {
      // Not configured — provide instant demo session
    }
    return createFallbackSession("google-user@buildx.app", "Google User");
  };

  // ─── Quick Demo Login ─────────────────────────────────────────────────────────
  const quickDemoLogin = () => {
    return createFallbackSession("demo@buildx.app", "Anoop Joel");
  };

  // ─── Reset Password ───────────────────────────────────────────────────────────
  const resetPassword = async (email) => {
    try {
      await API.post("/auth/forgot-password", { email });
    } catch {
      // Silently resolve — don't reveal user existence
    }
    return Promise.resolve();
  };

  // ─── Logout ───────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {}
    setCurrentUser(null);
    setUserProfile(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ─── Update Profile ───────────────────────────────────────────────────────────
  const updateUserProfile = async (updates) => {
    try {
      if (token && !token.startsWith("demo-")) {
        const res = await API.put("/auth/profile", updates);
        const profile = buildDefaultProfile(res.data.user || res.data);
        setUserProfile(profile);
        setCurrentUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
        return;
      }
    } catch {}

    // Local-only update for demo sessions
    setUserProfile((prev) => {
      const merged = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const refreshUserProfile = async () => {
    if (!token || token.startsWith("demo-")) return;
    try {
      const res = await API.get("/auth/me");
      const profile = buildDefaultProfile(res.data.user || res.data);
      setCurrentUser(profile);
      setUserProfile(profile);
      localStorage.setItem("user", JSON.stringify(profile));
    } catch {}
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    token,
    setToken,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    quickDemoLogin,
    logout,
    resetPassword,
    updateUserProfile,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
