const crypto = require("crypto");

const ZEGO_APP_ID = parseInt(process.env.ZEGO_APP_ID || "1777252686", 10);
const ZEGO_SERVER_SECRET = process.env.ZEGO_SERVER_SECRET || "daf69fd03520d41c4508322b3589b44e";

/**
 * Generate ZEGOCLOUD Kit Token securely on the server
 */
function generateKitToken(appId, serverSecret, roomId, userId, userName, expirySeconds = 3600) {
  const createTime = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomInt(10000000, 99999999);
  
  const payload = {
    app_id: appId,
    user_id: String(userId),
    nonce: nonce,
    ctime: createTime,
    expire: expirySeconds,
    room_id: String(roomId),
  };

  const payloadStr = JSON.stringify(payload);
  const hash = crypto.createHmac("sha256", serverSecret).update(payloadStr).digest("hex");
  
  const tokenObj = {
    ver: 1,
    hash: hash,
    data: Buffer.from(payloadStr).toString("base64"),
  };

  return "04" + Buffer.from(JSON.stringify(tokenObj)).toString("base64");
}

const generateVideoToken = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user?.uid || req.body.userId || `user_${Date.now()}`;
    const userName = req.user?.name || req.body.userName || "BuildX Collaborator";

    if (!roomId) {
      return res.status(400).json({
        success: false,
        error: "roomId is required",
      });
    }

    const kitToken = generateKitToken(ZEGO_APP_ID, ZEGO_SERVER_SECRET, roomId, userId, userName);

    return res.status(200).json({
      success: true,
      appID: ZEGO_APP_ID,
      token: kitToken,
      roomId,
      userId,
      userName,
    });
  } catch (error) {
    console.error("Video token error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate meeting credentials",
    });
  }
};

module.exports = { generateVideoToken };

