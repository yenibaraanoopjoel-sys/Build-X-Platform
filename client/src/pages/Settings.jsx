import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Save,
  CheckCircle,
} from "lucide-react";

function Settings() {
  const { currentUser, updateUserProfile, resetPassword } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [success, setSuccess] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await updateUserProfile({
        settings: {
          notificationsEnabled,
          soundEnabled,
          publicProfile,
        },
      });
      setSuccess("Platform preferences updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!currentUser?.email) return;
    try {
      await resetPassword(currentUser.email);
      setResetSuccess("Password reset instructions dispatched to your email!");
      setTimeout(() => setResetSuccess(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050816", color: "#F8FAFC" }}>
      <Navbar />

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#A855F7", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
            <SettingsIcon size={16} />
            <span>ACCOUNT & SYSTEM PREFERENCES</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "#FFFFFF" }}>
            Settings
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94A3B8", fontSize: "14px" }}>
            Manage notification preferences, account credentials, and platform behaviors.
          </p>
        </div>

        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              borderRadius: "12px",
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

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* SECTION 1: ACCOUNT & SECURITY */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <Shield size={18} color="#38BDF8" />
              <h3 style={{ margin: 0, fontSize: "16px", color: "white" }}>Authentication & Security</h3>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>Registered Email</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>{currentUser?.email}</div>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  color: currentUser?.emailVerified ? "#10B981" : "#F59E0B",
                  fontWeight: "600",
                }}
              >
                {currentUser?.emailVerified ? "Verified" : "Verification Sent"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>Password Reset</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>Receive a secure reset link to change password</div>
              </div>
              <button
                onClick={handleSendResetEmail}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  color: "#38BDF8",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Send Reset Link
              </button>
            </div>
            {resetSuccess && (
              <p style={{ color: "#6EE7B7", fontSize: "12px", margin: "10px 0 0" }}>{resetSuccess}</p>
            )}
          </div>

          {/* SECTION 2: PREFERENCES */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <Bell size={18} color="#A855F7" />
              <h3 style={{ margin: 0, fontSize: "16px", color: "white" }}>Notification & Interface</h3>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>Push Notifications</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>Receive alerts for new collabs and skill swap requests</div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>Public Innovation Profile</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>Allow your profile and skills to appear in recommendations</div>
              </div>
              <input
                type="checkbox"
                checked={publicProfile}
                onChange={(e) => setPublicProfile(e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>Audio Feedback</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>Play subtle tones for chat and video meeting events</div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={loading}
              style={{
                marginTop: "24px",
                padding: "12px 20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                border: "none",
                color: "white",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Save size={16} />
              <span>{loading ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
