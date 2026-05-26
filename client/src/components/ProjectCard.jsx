function ProjectCard({
  project,
  deleteProject,
  openWorkspace,
}) {
  //
  // SAFE PROJECT
  //
  const safeProject =
    project || {};

  //
  // STATUS COLOR
  //
  const getStatusColor =
    (status) => {
      switch (status) {
        case "Completed":
          return "#10B981";

        case "In Progress":
          return "#F59E0B";

        default:
          return "#EF4444";
      }
    };

  //
  // PROGRESS COLOR
  //
  const getProgressColor =
    (progress) => {
      if (progress >= 100)
        return "#10B981";

      if (progress >= 50)
        return "#8B5CF6";

      return "#3B82F6";
    };

  return (
    <div
      style={{
        position: "relative",

        overflow: "hidden",

        borderRadius: "24px",

        padding: "28px",

        marginBottom: "24px",

        background:
          "rgba(255,255,255,0.05)",

        border:
          "1px solid rgba(255,255,255,0.08)",

        backdropFilter:
          "blur(14px)",

        boxShadow:
          "0 0 30px rgba(124,58,237,0.12)",
      }}
    >
      {/* GLOW */}
      <div
        style={{
          position: "absolute",

          width: "220px",

          height: "220px",

          background:
            "rgba(168,85,247,0.08)",

          borderRadius: "50%",

          filter: "blur(90px)",

          top: "-90px",

          right: "-60px",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "start",

          gap: "20px",

          marginBottom: "24px",

          position: "relative",

          zIndex: 2,
        }}
      >
        <div>
          {/* TITLE */}
          <h2
            style={{
              fontSize: "32px",

              marginBottom: "12px",

              color: "white",
            }}
          >
            {safeProject?.title ||
              "Untitled Project"}
          </h2>

          {/* DESCRIPTION */}
          <p
            style={{
              color: "#CBD5E1",

              lineHeight: "1.9",

              fontSize: "15px",

              maxWidth: "760px",
            }}
          >
            {safeProject?.description ||
              "No description available"}
          </p>
        </div>

        {/* DELETE */}
        <button
          onClick={() =>
            deleteProject?.(
              safeProject?._id
            )
          }
          style={{
            padding: "10px 18px",

            borderRadius: "14px",

            border: "none",

            background:
              "linear-gradient(135deg, #EF4444, #DC2626)",

            color: "white",

            fontWeight: "600",

            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>

      {/* DETAILS */}
      <div
        style={{
          display: "flex",

          flexWrap: "wrap",

          gap: "14px",

          marginBottom: "22px",

          position: "relative",

          zIndex: 2,
        }}
      >
        {/* STATUS */}
        <div
          style={{
            padding: "10px 16px",

            borderRadius: "18px",

            background:
              getStatusColor(
                safeProject?.status
              ),

            color: "white",

            fontSize: "14px",

            fontWeight: "600",
          }}
        >
          📌{" "}
          {safeProject?.status ||
            "Pending"}
        </div>

        {/* PROGRESS */}
        <div
          style={{
            padding: "10px 16px",

            borderRadius: "18px",

            background:
              "rgba(255,255,255,0.05)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            color: "white",

            fontSize: "14px",
          }}
        >
          🚀{" "}
          {safeProject?.completionPercentage ||
            0}
          % Completed
        </div>

        {/* TOTAL TASKS */}
        <div
          style={{
            padding: "10px 16px",

            borderRadius: "18px",

            background:
              "rgba(255,255,255,0.05)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            color: "white",

            fontSize: "14px",
          }}
        >
          📋 Total Tasks:{" "}
          {safeProject?.totalTasks ||
            0}
        </div>

        {/* COMPLETED TASKS */}
        <div
          style={{
            padding: "10px 16px",

            borderRadius: "18px",

            background:
              "rgba(16,185,129,0.16)",

            color: "#34D399",

            fontSize: "14px",

            fontWeight: "600",
          }}
        >
          ✅ Completed:{" "}
          {safeProject?.completedTasks ||
            0}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div
        style={{
          marginBottom: "28px",

          position: "relative",

          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            marginBottom: "10px",

            color: "#CBD5E1",

            fontSize: "14px",
          }}
        >
          <span>
            Project Progress
          </span>

          <span>
            {safeProject?.completionPercentage ||
              0}
            %
          </span>
        </div>

        <div
          style={{
            width: "100%",

            height: "14px",

            background:
              "rgba(255,255,255,0.08)",

            borderRadius: "20px",

            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${
                safeProject?.completionPercentage ||
                0
              }%`,

              height: "100%",

              background:
                getProgressColor(
                  safeProject?.completionPercentage ||
                    0
                ),

              borderRadius: "20px",

              transition:
                "0.4s ease",
            }}
          />
        </div>
      </div>

      {/* MEMBERS */}
      <div
        style={{
          marginBottom: "28px",

          position: "relative",

          zIndex: 2,
        }}
      >
        <h3
          style={{
            marginBottom: "14px",

            color: "white",

            fontSize: "18px",
          }}
        >
          👥 Team Members
        </h3>

        <div
          style={{
            display: "flex",

            flexWrap: "wrap",

            gap: "12px",
          }}
        >
          {Array.isArray(
            safeProject?.members
          ) &&
          safeProject.members
            .length > 0 ? (
            safeProject.members.map(
              (member) => (
                <div
                  key={
                    member?._id
                  }
                  style={{
                    display: "flex",

                    alignItems:
                      "center",

                    gap: "10px",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "18px",

                    background:
                      "rgba(255,255,255,0.05)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    color:
                      "white",

                    fontSize:
                      "14px",
                  }}
                >
                  <div
                    style={{
                      width:
                        "34px",

                      height:
                        "34px",

                      borderRadius:
                        "50%",

                      background:
                        "linear-gradient(135deg, #7C3AED, #EC4899)",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      fontWeight:
                        "bold",

                      color:
                        "white",
                    }}
                  >
                    {member?.name
                      ?.charAt(
                        0
                      )
                      ?.toUpperCase() ||
                      "U"}
                  </div>

                  <span>
                    {member?.name ||
                      "Unknown"}
                  </span>
                </div>
              )
            )
          ) : (
            <p
              style={{
                color:
                  "#CBD5E1",
              }}
            >
              No members added
            </p>
          )}
        </div>
      </div>

      {/* LINKED IDEA */}
      {safeProject?.linkedIdea && (
        <div
          style={{
            marginBottom: "24px",

            padding: "18px",

            borderRadius: "18px",

            background:
              "rgba(124,58,237,0.12)",

            border:
              "1px solid rgba(124,58,237,0.20)",

            color: "white",

            position: "relative",

            zIndex: 2,
          }}
        >
          💡 Linked Idea Connected
        </div>
      )}

      {/* ACTIONS */}
      <div
        style={{
          display: "flex",

          flexWrap: "wrap",

          gap: "14px",

          position: "relative",

          zIndex: 2,
        }}
      >
        <button
          onClick={() =>
            openWorkspace?.(
              safeProject?._id
            )
          }
          style={{
            padding: "14px 22px",

            borderRadius: "16px",

            border: "none",

            background:
              "linear-gradient(135deg, #2563EB, #7C3AED)",

            color: "white",

            fontWeight: "700",

            cursor: "pointer",

            fontSize: "14px",
          }}
        >
          Open Workspace
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;