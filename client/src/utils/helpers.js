// Format Date
export const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
};

// Shorten Long Text
export const truncateText = (
  text,
  maxLength = 100
) => {
  if (!text) return "";

  return text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
};

// Generate User Initials
export const getInitials = (name) => {
  if (!name) return "";

  return name
    .split(" ")
    .filter((w) => w && w.length > 0)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

// Get Status Color
export const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "#10B981";

    case "In Progress":
      return "#F59E0B";

    case "Pending":
      return "#EF4444";

    default:
      return "#6B7280";
  }
};

// Capitalize Text
export const capitalizeText = (text) => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() +
    text.slice(1);
};