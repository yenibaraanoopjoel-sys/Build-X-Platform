import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../services/dataService";
import {
  Edit3,
  Save,
  CheckCircle,
} from "lucide-react";

function Profile() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [userProjects, setUserProjects] = useState([]);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || currentUser?.displayName || "");
      setRole(userProfile.role || "Developer");
      setBio(userProfile.bio || "Building modern collaborative software on BuildX.");
      setSkills(Array.isArray(userProfile.skills) ? userProfile.skills.join(", ") : "");
      setSkillsToLearn(Array.isArray(userProfile.skillsToLearn) ? userProfile.skillsToLearn.join(", ") : "");
      setGithubUrl(userProfile.socialLinks?.github || "");
      setLinkedinUrl(userProfile.socialLinks?.linkedin || "");
      setWebsiteUrl(userProfile.socialLinks?.website || "");
      setAvatarSeed(userProfile.avatar || "");
    }
  }, [userProfile, currentUser]);

  // Load user's projects
  useEffect(() => {
    if (currentUser) {
      getProjects().then((all) => {
        const owned = all.filter((p) => p.ownerId === currentUser.uid);
        setUserProjects(owned);
      });
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const parsedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
      const parsedWant = skillsToLearn.split(",").map((s) => s.trim()).filter(Boolean);

      await updateUserProfile({
        name,
        role,
        bio,
        skills: parsedSkills,
        skillsToLearn: parsedWant,
        socialLinks: {
          github: githubUrl,
          linkedin: linkedinUrl,
          website: websiteUrl,
        },
      });

      setSuccess("Profile successfully updated!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const userAvatar =
    avatarSeed ||
    userProfile?.avatar ||
    currentUser?.photoURL ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.uid || "user"}`;

  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "36px 24px" }}>
        {/* PROFILE HEADER CARD */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "28px",
            padding: "36px",
            marginBottom: "32px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "28px",
            }}
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <img
                src={userAvatar}
                alt=""
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#1E293B",
                  border: "3px solid #3B82F6",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                }}
              />
              <div>
                <h1 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "800", color: "#FFFFFF" }}>
                  {name || "Innovator"}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "8px",
                      background: "rgba(56, 189, 248, 0.15)",
                      color: "#38BDF8",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {role || "Developer"}
                  </span>
                  <span style={{ color: "#94A3B8", fontSize: "13px" }}>{currentUser?.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "12px",
                background: isEditing ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                border: "none",
                color: "white",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <Edit3 size={15} />
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
          </div>

          {success && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#6EE7B7",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* EDIT FORM OR VIEW MODE */}
          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Professional Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
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
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                  Biography
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
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
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#CBD5E1", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                    Skills to Learn (For Swap)
                  </label>
                  <input
                    type="text"
                    value={skillsToLearn}
                    onChange={(e) => setSkillsToLearn(e.target.value)}
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
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  border: "none",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                <Save size={16} />
                <span>{loading ? "Saving to Firestore..." : "Save Profile Changes"}</span>
              </button>
            </form>
          ) : (
            <div>
              <p style={{ color: "#CBD5E1", fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px" }}>
                {bio}
              </p>

              {/* SKILLS DISPLAY */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", textTransform: "uppercase" }}>
                    Skills Available
                  </span>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                    {(userProfile?.skills || []).map((sk, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "8px",
                          background: "rgba(16, 185, 129, 0.12)",
                          color: "#34D399",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", textTransform: "uppercase" }}>
                    Skills to Learn
                  </span>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                    {(userProfile?.skillsToLearn || []).map((sk, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "8px",
                          background: "rgba(59, 130, 246, 0.12)",
                          color: "#60A5FA",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PROJECTS SECTION */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#FFFFFF", marginBottom: "16px" }}>
            My Project Portfolio ({userProjects.length})
          </h2>

          {userProjects.length === 0 ? (
            <p style={{ color: "#64748B", fontSize: "14px" }}>
              You haven't published any projects yet. Head to Projects to launch one!
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {userProjects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: "20px",
                    background: "rgba(15, 23, 42, 0.7)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>{p.name}</div>
                  <div style={{ fontSize: "13px", color: "#94A3B8", margin: "6px 0 12px" }}>{p.description}</div>
                  <div style={{ fontSize: "12px", color: "#38BDF8" }}>Sprint Progress: {p.progress}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;
