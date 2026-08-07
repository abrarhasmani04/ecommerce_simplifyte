import { forwardRef } from "react";

const Input = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {label && (
        <label style={{
          fontSize: "0.78rem", fontWeight: 600,
          color: "#374151", letterSpacing: "0.02em",
        }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "10px 14px",
          background: "#fff",
          border: `1.5px solid ${error ? "#ef4444" : "#e2e8f0"}`,
          borderRadius: "10px",
          color: "#0f172a",
          fontSize: "0.88rem",
          outline: "none",
          transition: "border-color 0.18s, box-shadow 0.18s",
          ...props.style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#3b82f6";
          e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0";
          e.target.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      />
      {error && (
        <p style={{ margin: 0, fontSize: "0.74rem", color: "#ef4444" }}>{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
