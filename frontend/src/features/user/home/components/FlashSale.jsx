import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../products/components/ProductCard";
import api from "@/services/axios";

// Countdown hook — pure in-memory timer
const useCountdown = (initialSeconds) => {
  const [time, setTime] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");
  return { h, m, s };
};

const FlashSale = () => {
  const { h, m, s } = useCountdown(8 * 3600); // 8-hour timer

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/product/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.products ?? [];
        // Flash Sale = products that are NOT featured
        const nonFeatured = list.filter((p) => !p.isFeatured);
        // Show up to 8 products
        setProducts(nonFeatured.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Don't render the section if no products and not loading
  if (!loading && products.length === 0) return null;

  return (
    <section className="mt-14">
      {/* Header row */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">Flash Sale</h2>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}
          >
            LIMITED TIME
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Countdown timer */}
          <div className="flex items-center gap-2" style={{ color: "#374151" }}>
            <Timer size={18} style={{ color: "#ef4444" }} />
            <span className="text-sm font-medium">Ends in:</span>
            <div className="flex gap-1">
              {[h, m, s].map((unit, i) => (
                <span
                  key={i}
                  className="rounded-lg px-2 py-1 text-sm font-bold"
                  style={{ backgroundColor: "#111827", color: "#ffffff" }}
                >
                  {unit}
                </span>
              ))}
            </div>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border bg-white p-4 space-y-3"
            >
              <div className="h-48 rounded-lg bg-gray-100" />
              <div className="h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
              <div className="h-9 rounded-lg bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* Products */}
      {!loading && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                title: product.name,
                price: product.discountPrice ?? product.price,
                originalPrice: product.discountPrice ? product.price : null,
                image: product.images?.[0] ?? "",
                rating: product.rating ?? null,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FlashSale;
