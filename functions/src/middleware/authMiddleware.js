const admin = require("firebase-admin");

/**
 * Middleware to authenticate requests using Firebase ID tokens
 */
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Missing or malformed token",
      });
    }

    const idToken = authHeader.split("Bearer ")[1].trim();
    if (!idToken) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Empty token",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
      picture: decodedToken.picture || null,
      role: decodedToken.role || "developer",
      emailVerified: decodedToken.email_verified || false,
    };

    next();
  } catch (error) {
    console.error("Firebase auth verification error:", error.message);
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid or expired token",
    });
  }
};

/**
 * Optional authentication: attaches user if token is valid, continues anyway if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1].trim();
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || "User",
      };
    }
  } catch (err) {
    // Ignore and proceed unauthenticated
  }
  next();
};

module.exports = { verifyAuth, optionalAuth };

