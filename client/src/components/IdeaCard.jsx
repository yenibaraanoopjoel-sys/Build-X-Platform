function IdeaCard({ idea }) {
  const techStack = Array.isArray(
    idea?.techStack
  )
    ? idea.techStack
    : [];

  return (
    <div
      style={{
        border: "1px solid #D1D5DB",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "white",
        boxShadow:
          "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {/* Idea Title */}
      <h2
        style={{
          marginBottom: "10px",
        }}
      >
        {idea?.title ||
          "Untitled Idea"}
      </h2>

      {/* Description */}
      <p
        style={{
          marginBottom: "15px",
          color: "#4B5563",
        }}
      >
        {idea?.description ||
          "No description available"}
      </p>

      {/* Tech Stack */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "15px",
        }}
      >
        {techStack.length > 0 ? (
          techStack.map(
            (tech, index) => (
              <span
                key={index}
                style={{
                  padding:
                    "5px 10px",
                  backgroundColor:
                    "#E5E7EB",
                  borderRadius:
                    "20px",
                  fontSize:
                    "14px",
                }}
              >
                {tech}
              </span>
            )
          )
        ) : (
          <span
            style={{
              color: "#9CA3AF",
              fontSize: "14px",
            }}
          >
            No Tech Stack
          </span>
        )}
      </div>

      {/* Creator Info */}
      <small
        style={{
          color: "#6B7280",
        }}
      >
        Posted by:{" "}
        {idea?.createdBy
          ?.name ||
          "Unknown User"}
      </small>
    </div>
  );
}

export default IdeaCard;