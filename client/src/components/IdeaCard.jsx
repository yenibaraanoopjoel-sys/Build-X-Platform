function IdeaCard({ idea = {} }) {
  const techStack = Array.isArray(idea.techStack)
    ? idea.techStack
    : [];

  return (
    <div
      style={{
        border: "1px solid #586e90",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "white",
        boxShadow: "0 2px 5px rgba(59, 53, 53, 0.1)",
      }}
    >
      <h2
        style={{
          marginBottom: "10px",
        }}
      >
        {idea.title || "Untitled Idea"}
      </h2>

      <p
        style={{
          marginBottom: "15px",
          color: "#4B5563",
        }}
      >
        {idea.description || "No description available"}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "15px",
        }}
      >
        {techStack.length ? (
          techStack.map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              style={{
                padding: "5px 10px",
                backgroundColor: "#d6378c",
                borderRadius: "20px",
                fontSize: "14px",
              }}
            >
              {tech}
            </span>
          ))
        ) : (
          <span
            style={{
              color: "#6b8bc2",
              fontSize: "14px",
            }}
          >
            No Tech Stack
          </span>
        )}
      </div>

      <small
        style={{
          color: "#6B7280",
        }}
      >
        Posted by: {idea.createdBy?.name || "Unknown User"}
      </small>
    </div>
  );
}

export default IdeaCard;