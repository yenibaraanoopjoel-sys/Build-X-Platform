function Loader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#050816,#111827,#1E1B4B)",
        color: "white",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "65px",
          height: "65px",
          border: "6px solid rgba(160, 86, 195, 0.15)",
          borderTop: "6px solid #8B5CF6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <h2
        style={{
          fontWeight: 700,
          letterSpacing: "1px",
        }}
      >
        Loading BuildX...
      </h2>

      <style>{`
        @keyframes spin{
          from{transform:rotate(0deg);}
          to{transform:rotate(360deg);}
        }
      `}</style>
    </div>
  );
}

export default Loader;