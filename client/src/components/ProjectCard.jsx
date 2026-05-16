function ProjectCard({ project }) {
  return (
    <div
      style={{
        border: "1px solid #D1D5DB",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "white",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {/* Project Title */}
      <h2
        style={{
          marginBottom: "10px",
        }}
      >
        {project.title}
      </h2>

      {/* Project Description */}
      <p
        style={{
          marginBottom: "15px",
          color: "#4B5563",
        }}
      >
        {project.description}
      </p>

      {/* Members */}
      <div
        style={{
          marginBottom: "10px",
        }}
      >
        <strong>Members:</strong>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "10px",
          }}
        >
          {project.members &&
            project.members.map((member) => (
              <span
                key={member._id}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#E5E7EB",
                  borderRadius: "20px",
                  fontSize: "14px",
                }}
              >
                {member.name}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;