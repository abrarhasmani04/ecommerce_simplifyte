import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import ProductCard from "../../products/components/ProductCard";

const FLASH_PRODUCTS = [
  {
    id: 201,
    title: "Apple iPhone 15 Pro",
    price: 699,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1710023038502-ba80a70a9f53?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
  },
  {
    id: 202,
    title: "Nike Air Max 270",
    price: 89,
    originalPrice: 149,
    image: "https://images.unsplash.com/photo-1580902215262-9b941bc6eab3?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
  },
  {
    id: 203,
    title: 'Samsung 55" QLED TV',
    price: 799,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
  },
  {
    id: 204,
    title: "Sony WH-1000XM5",
    price: 249,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1612858249816-5a91a9fb9886?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
  },
];

// Countdown hook — pure in-memory timer, no localStorage
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
  const { h, m, s } = useCountdown(8 * 3600); // 8 hours

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
      </div>

      {/* Products */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FLASH_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FlashSale;
