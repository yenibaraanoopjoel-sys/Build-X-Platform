function TaskCard({ task }) {
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
      {/* Task Title */}
      <h2
        style={{
          marginBottom: "10px",
        }}
      >
        {task.title}
      </h2>

      {/* Assigned User */}
      <p
        style={{
          marginBottom: "10px",
          color: "#4B5563",
        }}
      >
        Assigned To:{" "}
        {task.assignedTo?.name || "No User"}
      </p>

      {/* Task Status */}
      <div
        style={{
          display: "inline-block",
          padding: "6px 12px",
          borderRadius: "20px",
          backgroundColor:
            task.status === "Completed"
              ? "#10B981"
              : task.status === "In Progress"
              ? "#F59E0B"
              : "#EF4444",
          color: "white",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {task.status}
      </div>
    </div>
  );
}

export default TaskCard;