const Divider = ({ label = "OR" }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0" }}>
      <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
      <span style={{ fontSize: "0.73rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.08em" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
    </div>
  );
};

export default Divider;
