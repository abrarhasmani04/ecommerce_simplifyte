import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import api from "@/services/axios";

const ACCENT_PALETTE = [
  { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
  { bg: "#fdf2f8", border: "#fbcfe8", text: "#be185d" },
  { bg: "#fff7ed", border: "#fed7aa", text: "#c2410c" },
  { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
  { bg: "#faf5ff", border: "#e9d5ff", text: "#7e22ce" },
  { bg: "#fefce8", border: "#fef08a", text: "#a16207" },
  { bg: "#eef2ff", border: "#c7d2fe", text: "#4338ca" },
  { bg: "#fff1f2", border: "#fecdd3", text: "#be123c" },
];

const Brands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/product/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.products ?? [];
        const unique = [...new Set(list.map((p) => p.brand).filter((b) => b && b.trim() !== ""))];
        setBrands(unique);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section style={{ marginTop: "60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
          <h2 style={{ margin: 0, fontSize: "1.55rem", fontWeight: 800, color: "#0f172a" }}>Top Brands</h2>
          <div style={{ flex: 1, height: "2px", background: "linear-gradient(to right, #e2e8f0, transparent)" }} />
        </div>
        <div className="brands-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse" style={{ height: "80px", borderRadius: "14px", background: "#f1f5f9" }} />
          ))}
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section style={{ marginTop: "60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <h2 style={{ margin: 0, fontSize: "1.55rem", fontWeight: 800, color: "#0f172a" }}>Top Brands</h2>
        <div style={{ flex: 1, height: "2px", background: "linear-gradient(to right, #e2e8f0, transparent)" }} />
      </div>

      <div className="brands-grid">
        {brands.map((name, i) => {
          const { bg, border, text } = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
          return (
            <div
              key={name}
              onClick={() => navigate(`/products?brand=${encodeURIComponent(name)}`)}
              className="brand-card"
              style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: "14px", height: "80px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", transition: "transform 0.18s, box-shadow 0.18s" }}
            >
              <span style={{ fontWeight: 800, fontSize: "0.95rem", color: text }}>{name}</span>
              <ArrowUpRight size={16} color={text} style={{ opacity: 0.6 }} />
            </div>
          );
        })}
      </div>

      <style>{`
        .brands-grid { display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); }
        @media (min-width: 640px) { .brands-grid { grid-template-columns: repeat(6, 1fr); } }
        .brand-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
      `}</style>
    </section>
  );
};

export default Brands;
