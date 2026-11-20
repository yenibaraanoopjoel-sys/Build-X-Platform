const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "buildx_secret_key_change_in_prod";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

// ─── Helper: sign JWT ─────────────────────────────────────────────────────────
const signToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

// ─── Helper: format user for response ────────────────────────────────────────
const formatUser = (user) => ({
  id: user._id,
  _id: user._id,
  uid: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "Developer",
  skills: user.skills || [],
  skillsToLearn: user.skillsToLearn || [],
  areasOfInterest: user.areasOfInterest || [],
  bio: user.bio || "",
  avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user._id}`,
  socialLinks: user.socialLinks || {},
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, skills, skillsToLearn, areasOfInterest, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "Developer",
      skills: Array.isArray(skills) ? skills : [],
      skillsToLearn: Array.isArray(skillsToLearn) ? skillsToLearn : [],
      areasOfInterest: Array.isArray(areasOfInterest) ? areasOfInterest : [],
      bio: bio || `Passionate ${role || "Developer"} building the future on BuildX.`,
    });

    const token = signToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const userId = req.userId || req.user;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: formatUser(user) });
  } catch (error) {
    console.error("GET_ME ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  // JWT is stateless — client removes the token
  // Here we just confirm the logout server-side
  res.json({ message: "Logged out successfully" });
};

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // We don't reveal whether the email exists (security best practice)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      // In production: send reset email via SendGrid/Nodemailer
      // For now: generate a time-limited reset token and log it
      const resetToken = jwt.sign(
        { id: user._id, type: "password_reset" },
        JWT_SECRET,
        { expiresIn: "15m" }
      );
      console.log(`[Password Reset] Token for ${email}: ${resetToken}`);
    }

    res.json({ message: "If this email exists, a reset link has been sent" });
  } catch (error) {
    console.error("FORGOT_PASSWORD ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId || req.user;
    const { name, bio, role, skills, skillsToLearn, areasOfInterest, avatar, socialLinks } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (bio !== undefined) updateFields.bio = bio;
    if (role) updateFields.role = role;
    if (skills) updateFields.skills = Array.isArray(skills) ? skills : skills.split(",").map((s) => s.trim());
    if (skillsToLearn) updateFields.skillsToLearn = Array.isArray(skillsToLearn) ? skillsToLearn : skillsToLearn.split(",").map((s) => s.trim());
    if (areasOfInterest) updateFields.areasOfInterest = Array.isArray(areasOfInterest) ? areasOfInterest : areasOfInterest.split(",").map((s) => s.trim());
    if (avatar) updateFields.avatar = avatar;
    if (socialLinks) updateFields.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user: formatUser(user) });
  } catch (error) {
    console.error("UPDATE_PROFILE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
