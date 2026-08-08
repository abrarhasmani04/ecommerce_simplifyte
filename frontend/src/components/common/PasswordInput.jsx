import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(({ label, ...props }, ref) => {
  const [show, setShow] = useState(false);

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
      <div style={{ position: "relative" }}>
        <input
          ref={ref}
          type={show ? "text" : "password"}
          {...props}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 40px 10px 14px",
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            color: "#0f172a",
            fontSize: "0.88rem",
            outline: "none",
            transition: "border-color 0.18s, box-shadow 0.18s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#3b82f6";
            e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.boxShadow = "none";
            props.onBlur?.(e);
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={{
            position: "absolute", right: "12px", top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "#9ca3af", padding: "2px",
            display: "flex", alignItems: "center",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#374151"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
