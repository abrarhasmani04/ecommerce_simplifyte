import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/axios";

const BG_PALETTE = [
  "#f3f4f6", "#eff6ff", "#fff7ed", "#faf5ff",
  "#eef2ff", "#f0fdf4", "#fdf2f8", "#fefce8",
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
        // Collect unique, non-empty brand names
        const unique = [
          ...new Set(
            list
              .map((p) => p.brand)
              .filter((b) => b && b.trim() !== "")
          ),
        ];
        setBrands(unique);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mt-14">
        <h2 className="mb-8 text-3xl font-bold">Top Brands</h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse h-20 rounded-xl"
              style={{ backgroundColor: "#f3f4f6" }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-8 text-3xl font-bold">Top Brands</h2>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {brands.map((name, i) => (
          <div
            key={name}
            onClick={() => navigate(`/products?brand=${encodeURIComponent(name)}`)}
            className="flex h-20 cursor-pointer items-center justify-center rounded-xl transition hover:-translate-y-1 hover:shadow-md"
            style={{ backgroundColor: BG_PALETTE[i % BG_PALETTE.length] }}
          >
            <span className="text-base font-bold" style={{ color: "#374151" }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
