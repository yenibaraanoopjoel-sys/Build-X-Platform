const admin = require("firebase-admin");

const syncUserProfile = async (req, res) => {
  try {
    const { uid, email, name, role, skills, skillsToLearn, bio, areasOfInterest } = req.body;
    const authUid = req.user?.uid || uid;

    if (!authUid) {
      return res.status(400).json({
        success: false,
        error: "Missing user identity",
      });
    }

    const db = admin.firestore();
    const userRef = db.collection("users").doc(authUid);
    const existingDoc = await userRef.get();

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    if (!existingDoc.exists) {
      const newUser = {
        uid: authUid,
        email: email || req.user?.email || "",
        name: name || req.user?.name || email?.split("@")[0] || "Innovator",
        role: role || "Developer",
        skills: Array.isArray(skills) ? skills : ["JavaScript", "React"],
        skillsToLearn: Array.isArray(skillsToLearn) ? skillsToLearn : ["AI", "UI/UX"],
        areasOfInterest: Array.isArray(areasOfInterest) ? areasOfInterest : ["Full Stack", "Collaboration"],
        bio: bio || "Building impactful software with the BuildX community.",
        avatar: req.user?.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${authUid}`,
        totalProjects: 0,
        activeProjects: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await userRef.set(newUser);
      return res.status(201).json({
        success: true,
        user: newUser,
        message: "User profile created",
      });
    }

    // Existing user: update allowed fields
    const updates = { updatedAt: timestamp };
    if (name) updates.name = name;
    if (role) updates.role = role;
    if (skills) updates.skills = skills;
    if (skillsToLearn) updates.skillsToLearn = skillsToLearn;
    if (bio) updates.bio = bio;
    if (areasOfInterest) updates.areasOfInterest = areasOfInterest;

    await userRef.update(updates);
    return res.status(200).json({
      success: true,
      message: "User profile updated",
    });
  } catch (error) {
    console.error("User sync error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to synchronize profile",
    });
  }
};

module.exports = { syncUserProfile };

