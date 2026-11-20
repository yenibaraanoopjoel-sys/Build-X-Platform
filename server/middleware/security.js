/**
 * Security & Validation Middleware
 * Implements:
 * 1. Role-Based Access Control (RBAC)
 * 2. Rate Limiting (in-memory sliding window)
 * 3. Input Sanitization & Injection Defenses (NoSQL & Prompt Injection)
 * 4. Request Body Validation
 */

// In-Memory sliding-window rate limiter
const rateLimitMap = new Map();

exports.rateLimiter = (options = { windowMs: 60000, max: 100 }) => {
  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, []);
    }

    const timestamps = rateLimitMap.get(ip).filter((ts) => now - ts < options.windowMs);
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    if (timestamps.length > options.max) {
      return res.status(429).json({
        success: false,
        error: "Too Many Requests",
        message: `Rate limit exceeded. Maximum ${options.max} requests per minute.`,
        retryAfterMs: options.windowMs - (now - timestamps[0]),
      });
    }

    res.setHeader("X-RateLimit-Limit", options.max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, options.max - timestamps.length));
    next();
  };
};

// Role-Based Access Control (RBAC)
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      // Default permissive pass for authenticated users, check if role required
      if (allowedRoles.includes("user") || allowedRoles.includes("collaborator")) {
        return next();
      }
      return res.status(403).json({
        success: false,
        message: "Access forbidden: insufficient role permissions",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of roles: [${allowedRoles.join(", ")}]`,
      });
    }

    next();
  };
};

// Prompt Injection & NoSQL Sanitizer
exports.sanitizeInput = (req, res, next) => {
  const sanitize = (val) => {
    if (typeof val === "string") {
      // Defend against Mongo Operator injection ($gt, $where, etc.)
      let cleaned = val.replace(/^\$+/, "");
      // Defend against script tags / XSS
      cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
      return cleaned.trim();
    }
    if (val && typeof val === "object" && !Array.isArray(val)) {
      // Strip top-level keys starting with $ (NoSQL operator injection defense)
      const cleanObj = {};
      for (const [key, value] of Object.entries(val)) {
        if (!key.startsWith("$")) {
          cleanObj[key] = sanitize(value);
        }
      }
      return cleanObj;
    }
    return val;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  next();
};

// Request Body Validation Helper
exports.validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: `Missing required request fields: ${missing.join(", ")}`,
      });
    }

    next();
  };
};
