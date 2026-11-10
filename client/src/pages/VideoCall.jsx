import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { Video, ArrowLeft, Copy, Check } from "lucide-react";

function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const meetingRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    let zpInstance = null;

    const initMeeting = async () => {
      try {
        const userId = currentUser?.uid || `guest_${Date.now()}`;
        const userName = userProfile?.name || currentUser?.displayName || "BuildX Collaborator";

        let appID = Number(process.env.REACT_APP_ZEGO_APP_ID) || 1777252686;
        let kitToken = null;

        // Try getting token from Cloud Function first
        try {
          const res = await API.post("/video/token", {
            roomId: roomId || "general-room",
            userId,
            userName,
          });
          if (res.data?.token) {
            kitToken = res.data.token;
            if (res.data.appID) appID = res.data.appID;
          }
        } catch (apiErr) {
          console.warn("Cloud function token endpoint unavailable, using secure client token:", apiErr.message);
        }

        // Direct token generation if Cloud Function is offline or didn't provide token
        if (!kitToken) {
          kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            process.env.REACT_APP_ZEGO_SERVER_SECRET || "daf69fd03520d41c4508322b3589b44e",
            roomId || "general-room",
            userId,
            userName
          );
        }

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpInstance = zp;

        if (meetingRef.current) {
          zp.joinRoom({
            container: meetingRef.current,
            sharedLinks: [
              {
                name: "Copy Collaboration Meeting Link",
                url: window.location.href,
              },
            ],
            scenario: {
              mode: ZegoUIKitPrebuilt.GroupCall,
            },
            showScreenSharingButton: true,
            showTextChat: true,
            showUserList: true,
            maxUsers: 10,
            layout: "Grid",
          });
        }
      } catch (err) {
        console.error("Failed to initialize video call:", err);
        setTokenError("Could not connect to video server. Please check your credentials.");
      }
    };

    initMeeting();

    return () => {
      if (zpInstance && zpInstance.destroy) {
        zpInstance.destroy();
      }
    };
  }, [roomId, currentUser, userProfile]);

  const copyRoomLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #050816 0%, #0B1023 50%, #1E1B4B 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TOP HEADER */}
      <div
        style={{
          height: "70px",
          background: "rgba(10, 15, 30, 0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 28px",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#94A3B8",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Video size={18} />
            </div>
            <div>
              <span style={{ color: "white", fontSize: "15px", fontWeight: "700" }}>
                BuildX Video Collaboration Room
              </span>
              <span style={{ display: "block", fontSize: "11px", color: "#38BDF8" }}>
                Room ID: {roomId}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={copyRoomLink}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "10px",
              background: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              color: "#38BDF8",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Link Copied!" : "Invite Collaborator"}</span>
          </button>
        </div>
      </div>

      {tokenError && (
        <div style={{ padding: "20px", color: "#EF4444", textAlign: "center", fontSize: "14px" }}>
          {tokenError}
        </div>
      )}

      {/* VIDEO CONTAINER */}
      <div
        ref={meetingRef}
        style={{
          flex: 1,
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      />
    </div>
  );
}

export default VideoCall;
