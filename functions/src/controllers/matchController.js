const admin = require("firebase-admin");

/**
 * Intelligent Skill Matching Algorithm:
 * Compares current user's skillsHave & skillsWant with all other users
 */
const getMatchingUsers = async (req, res) => {
  try {
    const currentUid = req.user?.uid;
    const db = admin.firestore();

    let currentUser = null;
    if (currentUid) {
      const userDoc = await db.collection("users").doc(currentUid).get();
      if (userDoc.exists) {
        currentUser = userDoc.data();
      }
    }

    const currentSkillsHave = (currentUser?.skills || currentUser?.skillsHave || []).map((s) => s.toLowerCase());
    const currentSkillsWant = (currentUser?.skillsToLearn || currentUser?.skillsWant || []).map((s) => s.toLowerCase());

    const snapshot = await db.collection("users").limit(100).get();
    const recommendations = [];

    snapshot.forEach((doc) => {
      if (doc.id === currentUid) return; // skip self

      const user = doc.data();
      const otherSkillsHave = (user.skills || user.skillsHave || []).map((s) => s.toLowerCase());
      const otherSkillsWant = (user.skillsToLearn || user.skillsWant || []).map((s) => s.toLowerCase());

      let score = 0;
      const matchedSkills = [];

      // User wants what other has (High match: +15)
      currentSkillsWant.forEach((skill) => {
        if (otherSkillsHave.some((s) => s.includes(skill) || skill.includes(s))) {
          score += 15;
          matchedSkills.push(`Can teach you: ${skill}`);
        }
      });

      // Other wants what user has (Complementary match: +15)
      otherSkillsWant.forEach((skill) => {
        if (currentSkillsHave.some((s) => s.includes(skill) || skill.includes(s))) {
          score += 15;
          matchedSkills.push(`Wants to learn: ${skill}`);
        }
      });

      // Common skills (+5 synergy)
      currentSkillsHave.forEach((skill) => {
        if (otherSkillsHave.some((s) => s === skill)) {
          score += 5;
        }
      });

      recommendations.push({
        id: doc.id,
        name: user.name || user.displayName || user.email?.split("@")[0] || "Innovator",
        email: user.email,
        role: user.role || "Developer",
        bio: user.bio || "Enthusiastic collaborator on BuildX.",
        avatar: user.avatar || user.photoURL || null,
        skills: user.skills || [],
        skillsToLearn: user.skillsToLearn || [],
        matchScore: score,
        matchedSkills,
      });
    });

    // Sort by descending match score
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      users: recommendations,
    });
  } catch (error) {
    console.error("Match algorithm error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate skill match recommendations",
    });
  }
};

module.exports = { getMatchingUsers };

