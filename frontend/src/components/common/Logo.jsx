import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { ROUTES } from "../../constants/routes";

const TrendWaveLogo = ({ size = "md" }) => {
  const iconSize = size === "sm" ? 14 : size === "lg" ? 22 : 16;
  const boxSize  = size === "sm" ? 28 : size === "lg" ? 44 : 34;
  const radius   = size === "sm" ? 8  : size === "lg" ? 13 : 10;
  const fontSize = size === "sm" ? "1rem" : size === "lg" ? "1.45rem" : "1.2rem";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        width: boxSize, height: boxSize, borderRadius: radius,
        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 3px 12px rgba(37,99,235,0.3)",
        flexShrink: 0,
      }}>
        <TrendingUp size={iconSize} color="#fff" strokeWidth={2.5} />
      </div>
      <span style={{
        fontSize, fontWeight: 800, letterSpacing: "-0.03em",
        color: "#0f172a", lineHeight: 1,
      }}>
        Trend<span style={{
          backgroundImage: "linear-gradient(90deg, #2563eb, #7c3aed)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>Wave</span>
      </span>
    </div>
  );
};

const Logo = ({ variant = "auth" }) => {
  if (variant === "navbar") {
    return (
      <Link to={ROUTES.HOME} style={{ textDecoration: "none" }}>
        <TrendWaveLogo size="sm" />
      </Link>
    );
  }

  // auth variant — shown only on mobile (desktop left panel shows it)
  return (
    <Link
      to={ROUTES.HOME}
      style={{ display: "flex", justifyContent: "flex-start", marginBottom: "28px", textDecoration: "none" }}
    >
      <TrendWaveLogo size="md" />
    </Link>
  );
};

export { TrendWaveLogo };
export default Logo;
