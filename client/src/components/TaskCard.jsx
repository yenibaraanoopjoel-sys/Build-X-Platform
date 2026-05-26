function TaskCard({
  task,
  updateTaskStatus,
  deleteTask,
}) {
  //
  // SAFE TASK
  //
  const safeTask =
    task || {};

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
  // PRIORITY COLOR
  //
  const getPriorityColor =
    (priority) => {
      switch (priority) {
        case "High":
          return "#EF4444";

        case "Medium":
          return "#F59E0B";

        default:
          return "#3B82F6";
      }
    };

  //
  // HANDLE STATUS CHANGE
  //
  const handleStatusChange =
    (status) => {
      let progress = 0;

      if (
        status ===
        "In Progress"
      ) {
        progress = 50;
      }

      if (
        status ===
        "Completed"
      ) {
        progress = 100;
      }

      updateTaskStatus(
        safeTask?._id,
        status,
        progress
      );
    };

  return (
    <div
      style={{
        position: "relative",

        overflow: "hidden",

        borderRadius: "24px",

        padding: "28px",

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
            "rgba(124,58,237,0.08)",

          borderRadius: "50%",

          filter: "blur(80px)",

          top: "-80px",

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

          marginBottom: "22px",

          position: "relative",

          zIndex: 2,
        }}
      >
        <div>
          {/* TITLE */}
          <h2
            style={{
              fontSize: "30px",

              marginBottom: "12px",

              color: "white",
            }}
          >
            {safeTask?.title ||
              "Untitled Task"}
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
            {safeTask?.description ||
              "No description available"}
          </p>
        </div>

        {/* DELETE */}
        <button
          onClick={() =>
            deleteTask(
              safeTask?._id
            )
          }
          style={{
            padding: "10px 16px",

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
        {/* ASSIGNED USER */}
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
          👤{" "}
          {safeTask
            ?.assignedTo
            ?.name ||
            "No User"}
        </div>

        {/* PRIORITY */}
        <div
          style={{
            padding: "10px 16px",

            borderRadius: "18px",

            background:
              getPriorityColor(
                safeTask?.priority
              ),

            color: "white",

            fontSize: "14px",

            fontWeight: "600",
          }}
        >
          ⚡{" "}
          {safeTask?.priority ||
            "Medium"}
        </div>

        {/* STATUS */}
        <div
          style={{
            padding: "10px 16px",

            borderRadius: "18px",

            background:
              getStatusColor(
                safeTask?.status
              ),

            color: "white",

            fontSize: "14px",

            fontWeight: "600",
          }}
        >
          📌{" "}
          {safeTask?.status ||
            "Pending"}
        </div>

        {/* DEADLINE */}
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
          📅{" "}
          {safeTask?.deadline
            ? new Date(
                safeTask.deadline
              ).toLocaleDateString()
            : "No Deadline"}
        </div>
      </div>

      {/* PROGRESS */}
      <div
        style={{
          marginBottom: "24px",

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
            Progress
          </span>

          <span>
            {safeTask?.progress ||
              0}
            %
          </span>
        </div>

        <div
          style={{
            width: "100%",

            height: "12px",

            background:
              "rgba(255,255,255,0.08)",

            borderRadius: "20px",

            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${
                safeTask?.progress ||
                0
              }%`,

              height: "100%",

              background:
                "linear-gradient(135deg, #2563EB, #7C3AED)",

              borderRadius: "20px",

              transition:
                "0.4s ease",
            }}
          />
        </div>
      </div>

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
            handleStatusChange(
              "Pending"
            )
          }
          style={{
            padding: "12px 18px",

            borderRadius: "14px",

            border: "none",

            background:
              "rgba(239,68,68,0.16)",

            color: "#F87171",

            cursor: "pointer",

            fontWeight: "600",
          }}
        >
          Pending
        </button>

        <button
          onClick={() =>
            handleStatusChange(
              "In Progress"
            )
          }
          style={{
            padding: "12px 18px",

            borderRadius: "14px",

            border: "none",

            background:
              "rgba(245,158,11,0.16)",

            color: "#FBBF24",

            cursor: "pointer",

            fontWeight: "600",
          }}
        >
          In Progress
        </button>

        <button
          onClick={() =>
            handleStatusChange(
              "Completed"
            )
          }
          style={{
            padding: "12px 18px",

            borderRadius: "14px",

            border: "none",

            background:
              "rgba(16,185,129,0.16)",

            color: "#34D399",

            cursor: "pointer",

            fontWeight: "600",
          }}
        >
          Completed
        </button>
      </div>
    </div>
  );
}

export default TaskCard;