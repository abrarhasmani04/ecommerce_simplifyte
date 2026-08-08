import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/axios";

const STYLE_MAP = {
  electronics:  { emoji: "💻", from: "#dbeafe", to: "#bfdbfe", accent: "#2563eb" },
  fashion:      { emoji: "👗", from: "#fce7f3", to: "#fbcfe8", accent: "#db2777" },
  shoes:        { emoji: "👟", from: "#ffedd5", to: "#fed7aa", accent: "#ea580c" },
  beauty:       { emoji: "💄", from: "#ffe4e6", to: "#fecdd3", accent: "#e11d48" },
  furniture:    { emoji: "🛋️", from: "#fefce8", to: "#fef08a", accent: "#ca8a04" },
  sports:       { emoji: "⚽", from: "#dcfce7", to: "#bbf7d0", accent: "#16a34a" },
  books:        { emoji: "📚", from: "#e0e7ff", to: "#c7d2fe", accent: "#4f46e5" },
  toys:         { emoji: "🧸", from: "#f3e8ff", to: "#e9d5ff", accent: "#9333ea" },
  clothing:     { emoji: "👕", from: "#fce7f3", to: "#fbcfe8", accent: "#db2777" },
  food:         { emoji: "🍔", from: "#ffedd5", to: "#fed7aa", accent: "#ea580c" },
  health:       { emoji: "💊", from: "#dcfce7", to: "#bbf7d0", accent: "#16a34a" },
  grocery:      { emoji: "🛒", from: "#d1fae5", to: "#a7f3d0", accent: "#059669" },
  automotive:   { emoji: "🚗", from: "#dbeafe", to: "#bfdbfe", accent: "#2563eb" },
};

const FALLBACK = [
  { from: "#dbeafe", to: "#bfdbfe", accent: "#2563eb" },
  { from: "#fce7f3", to: "#fbcfe8", accent: "#db2777" },
  { from: "#ffedd5", to: "#fed7aa", accent: "#ea580c" },
  { from: "#ffe4e6", to: "#fecdd3", accent: "#e11d48" },
  { from: "#fefce8", to: "#fef08a", accent: "#ca8a04" },
  { from: "#dcfce7", to: "#bbf7d0", accent: "#16a34a" },
  { from: "#e0e7ff", to: "#c7d2fe", accent: "#4f46e5" },
  { from: "#f3e8ff", to: "#e9d5ff", accent: "#9333ea" },
];
const FALLBACK_EMOJIS = ["🏷️", "🛍️", "📦", "🎁", "🔖", "💡", "🎯", "✨"];

const getStyle = (name, index) => {
  const key = name?.toLowerCase();
  if (STYLE_MAP[key]) return STYLE_MAP[key];
  return { ...FALLBACK[index % FALLBACK.length], emoji: FALLBACK_EMOJIS[index % FALLBACK_EMOJIS.length] };
};

const SectionHeader = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
    <h2 style={{ margin: 0, fontSize: "1.55rem", fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap" }}>{title}</h2>
    <div style={{ flex: 1, height: "2px", background: "linear-gradient(to right, #e2e8f0, transparent)" }} />
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/category/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.categories ?? [];
        setCategories(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section style={{ marginTop: "60px" }}>
        <SectionHeader title="Shop By Category" />
        <div className="cat-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse" style={{ borderRadius: "16px", background: "#f1f5f9", height: "112px" }} />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section style={{ marginTop: "60px" }}>
      <SectionHeader title="Shop By Category" />

      <div className="cat-grid">
        {categories.map((cat, i) => {
          const { emoji, from, to, accent } = getStyle(cat.name, i);
          return (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="cat-card"
              style={{ background: `linear-gradient(135deg, ${from}, ${to})`, borderRadius: "16px", border: `1.5px solid ${accent}22`, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "22px 12px", gap: "10px", transition: "transform 0.18s, box-shadow 0.18s" }}
            >
              <span style={{ fontSize: "2.4rem", lineHeight: 1, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))" }}>{emoji}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: accent, textAlign: "center", letterSpacing: "0.01em" }}>{cat.name}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        .cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        @media (min-width: 1024px) { .cat-grid { grid-template-columns: repeat(8, 1fr); } }
        @media (max-width: 480px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
        .cat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
      `}</style>
    </section>
  );
};

export default Categories;
