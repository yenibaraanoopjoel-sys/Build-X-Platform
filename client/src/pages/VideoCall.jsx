import { useEffect, useRef } from "react";

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

      maxUsers: 4,

      layout: "Grid",
    });
  }, [roomId]);

  return (
    <div
      ref={meetingRef}
      style={{
        width: "100vw",

        height: "100vh",
      }}
    />
  );
}

export default VideoCall;