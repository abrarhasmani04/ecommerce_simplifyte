const Button = ({
  children,
  type = "button",
  disabled = false,
  variant = "primary",
  onClick,
}) => {
  const isPrimary = variant === "primary";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "11px 20px",
        borderRadius: "10px",
        fontWeight: 600,
        fontSize: "0.9rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "transform 0.15s, box-shadow 0.15s, background 0.15s",
        background: isPrimary
          ? "linear-gradient(135deg, #2563eb, #4f46e5)"
          : "#f1f5f9",
        color: isPrimary ? "#fff" : "#374151",
        border: isPrimary ? "none" : "1.5px solid #e2e8f0",
        boxShadow: isPrimary ? "0 3px 14px rgba(37,99,235,0.28)" : "none",
        letterSpacing: "0.01em",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = isPrimary
          ? "0 6px 22px rgba(37,99,235,0.38)"
          : "0 3px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isPrimary
          ? "0 3px 14px rgba(37,99,235,0.28)"
          : "none";
      }}
    >
      {children}
    </button>
  );
};

export default Button;
