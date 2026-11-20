const calculateMatchScore = (currentUser, otherUser) => {
  // Skills user has
  const currentSkillsHave =
    currentUser.skillsHave || [];

  // Skills user wants
  const currentSkillsWant =
    currentUser.skillsWant || [];

  // Other user's skills
  const otherSkillsHave =
    otherUser.skillsHave || [];

  const otherSkillsWant =
    otherUser.skillsWant || [];

  let score = 0;

  // Match current user's wanted skills
  // with other user's existing skills
  currentSkillsWant.forEach((skill) => {
    if (otherSkillsHave.includes(skill)) {
      score += 10;
    }
  });

  // Match other user's wanted skills
  // with current user's existing skills
  otherSkillsWant.forEach((skill) => {
    if (currentSkillsHave.includes(skill)) {
      score += 10;
    }
  });

  // Bonus for shared skills
  currentSkillsHave.forEach((skill) => {
    if (otherSkillsHave.includes(skill)) {
      score += 5;
    }
  });

  return score;
};

module.exports = calculateMatchScore;