import { Link } from "react-router-dom";

const CATEGORIES = [
  { title: "Electronics", emoji: "💻", bg: "#eff6ff" },
  { title: "Fashion",     emoji: "👗", bg: "#fdf2f8" },
  { title: "Shoes",       emoji: "👟", bg: "#fff7ed" },
  { title: "Beauty",      emoji: "💄", bg: "#fff1f2" },
  { title: "Furniture",   emoji: "🛋️", bg: "#fefce8" },
  { title: "Sports",      emoji: "⚽", bg: "#f0fdf4" },
  { title: "Books",       emoji: "📚", bg: "#eef2ff" },
  { title: "Toys",        emoji: "🧸", bg: "#faf5ff" },
];

const Categories = () => {
  return (
    <section className="mt-14">
      <h2 className="mb-8 text-3xl font-bold">Shop By Category</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {CATEGORIES.map(({ title, emoji, bg }) => (
          <Link
            key={title}
            to={`/products?category=${encodeURIComponent(title)}`}
            className="flex flex-col items-center rounded-xl p-5 transition hover:-translate-y-1 hover:shadow-md"
            style={{ backgroundColor: bg }}
          >
            <span style={{ fontSize: "2.25rem", lineHeight: 1 }}>{emoji}</span>
            <h3
              className="mt-3 text-center text-sm font-semibold"
              style={{ color: "#1f2937" }}
            >
              {title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
