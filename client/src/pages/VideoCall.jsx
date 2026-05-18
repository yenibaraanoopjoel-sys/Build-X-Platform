import {
  useEffect,
  useRef,
} from "react";

import { useParams } from "react-router-dom";

import {
  ZegoUIKitPrebuilt,
} from "@zegocloud/zego-uikit-prebuilt";

function VideoCall() {
  const meetingRef = useRef(null);

  const { roomId } = useParams();

  useEffect(() => {
    const appID = 1777252686;

    const serverSecret =
      "daf69fd03520d41c4508322b3589b44e";

    const kitToken =
      ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        "BuildX User"
      );

    const zp =
      ZegoUIKitPrebuilt.create(
        kitToken
      );

    zp.joinRoom({
      container:
        meetingRef.current,

      sharedLinks: [
        {
          name:
            "Copy Meeting Link",

          url:
            window.location.href,
        },
      ],

      scenario: {
        mode:
          ZegoUIKitPrebuilt
            .GroupCall,
      },

      showScreenSharingButton:
        true,

      showTextChat: true,

      showUserList: true,

      maxUsers: 6,

      layout: "Grid",
    });
  }, [roomId]);

  return (
    <div
      style={{
        width: "100vw",

        height: "100vh",

        position: "relative",

        overflow: "hidden",

        background:
          "linear-gradient(135deg, #050816 0%, #0B1023 45%, #1E1B4B 100%)",
      }}
    >
      {/* Glow Effects */}
      <div
        style={{
          position: "absolute",

          width: "500px",

          height: "500px",

          background:
            "rgba(59,130,246,0.10)",

          borderRadius: "50%",

          filter: "blur(140px)",

          top: "-180px",

          left: "-120px",

          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",

          width: "450px",

          height: "450px",

          background:
            "rgba(124,58,237,0.12)",

          borderRadius: "50%",

          filter: "blur(130px)",

          bottom: "-150px",

          right: "-100px",

          zIndex: 0,
        }}
      />

      {/* TOP BAR */}
      <div
        style={{
          position: "absolute",

          top: 0,

          left: 0,

          width: "100%",

          height: "82px",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          padding:
            "0 34px",

          zIndex: 10,

          background:
            "rgba(5,8,22,0.45)",

          backdropFilter:
            "blur(18px)",

          borderBottom:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* LEFT */}
        <div>
          <h1
            className="welcome-title"
            style={{
              fontSize: "34px",

              color: "white",

              letterSpacing: "2px",
            }}
          >
            BUILDX
          </h1>

          <p
            style={{
              color: "#CBD5E1",

              fontSize: "13px",

              marginTop: "4px",
            }}
          >
            AI Collaboration Meeting
          </p>
        </div>

        {/* RIGHT */}
        <div
          style={{
            display: "flex",

            gap: "14px",

            alignItems: "center",
          }}
        >
          <div
            style={{
              padding:
                "10px 18px",

              borderRadius:
                "16px",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              color: "#E2E8F0",

              fontSize: "14px",
            }}
          >
            Room: {roomId}
          </div>

          <div
            style={{
              width: "12px",

              height: "12px",

              borderRadius:
                "50%",

              background:
                "#10B981",

              boxShadow:
                "0 0 12px #10B981",
            }}
          />
        </div>
      </div>

      {/* VIDEO CONTAINER */}
      <div
        ref={meetingRef}
        style={{
          width: "100%",

          height: "100%",

          position: "relative",

          zIndex: 2,

          paddingTop: "82px",
        }}
      />
    </div>
  );
}

export default VideoCall;