import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/axios";

// Fallback colours & emojis keyed by lowercase category name
const STYLE_MAP = {
  electronics:  { emoji: "💻", bg: "#eff6ff" },
  fashion:      { emoji: "👗", bg: "#fdf2f8" },
  shoes:        { emoji: "👟", bg: "#fff7ed" },
  beauty:       { emoji: "💄", bg: "#fff1f2" },
  furniture:    { emoji: "🛋️", bg: "#fefce8" },
  sports:       { emoji: "⚽", bg: "#f0fdf4" },
  books:        { emoji: "📚", bg: "#eef2ff" },
  toys:         { emoji: "🧸", bg: "#faf5ff" },
  clothing:     { emoji: "👕", bg: "#fdf2f8" },
  food:         { emoji: "🍔", bg: "#fff7ed" },
  health:       { emoji: "💊", bg: "#f0fdf4" },
  grocery:      { emoji: "🛒", bg: "#ecfdf5" },
  automotive:   { emoji: "🚗", bg: "#eff6ff" },
};

const FALLBACK_COLORS = [
  "#eff6ff", "#fdf2f8", "#fff7ed", "#fff1f2",
  "#fefce8", "#f0fdf4", "#eef2ff", "#faf5ff",
];
const FALLBACK_EMOJIS = ["🏷️", "🛍️", "📦", "🎁", "🔖", "💡", "🎯", "✨"];

const getStyle = (name, index) => {
  const key = name?.toLowerCase();
  if (STYLE_MAP[key]) return STYLE_MAP[key];
  return {
    emoji: FALLBACK_EMOJIS[index % FALLBACK_EMOJIS.length],
    bg: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  };
};

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
      <section className="mt-14">
        <h2 className="mb-8 text-3xl font-bold">Shop By Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex flex-col items-center rounded-xl p-5"
              style={{ backgroundColor: "#f3f4f6", height: "100px" }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-8 text-3xl font-bold">Shop By Category</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((cat, i) => {
          const { emoji, bg } = getStyle(cat.name, i);
          return (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="flex flex-col items-center rounded-xl p-5 transition hover:-translate-y-1 hover:shadow-md"
              style={{ backgroundColor: bg }}
            >
              <span style={{ fontSize: "2.25rem", lineHeight: 1 }}>{emoji}</span>
              <h3
                className="mt-3 text-center text-sm font-semibold"
                style={{ color: "#1f2937" }}
              >
                {cat.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
