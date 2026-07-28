import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import ProductCard from "../product/ProductCard";

// Mock flash sale products — replace with API data
const flashProducts = [
  {
    id: 1,
    title: "Apple iPhone 15 Pro",
    price: 699,
    originalPrice: 999,
    image:
      "https://images.unsplash.com/photo-1710023038502-ba80a70a9f53?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Nike Air Max 270",
    price: 89,
    originalPrice: 149,
    image:
      "https://images.unsplash.com/photo-1580902215262-9b941bc6eab3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
  },
  {
    id: 3,
    title: 'Samsung 55" QLED TV',
    price: 799,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
  },
  {
    id: 4,
    title: "Sony WH-1000XM5",
    price: 249,
    originalPrice: 399,
    image:
      "https://images.unsplash.com/photo-1612858249816-5a91a9fb9886?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c29ueSUyMHdofGVufDB8fDB8fHww",
    rating: 4.9,
  },
];

const useCountdown = (targetHours = 8) => {
  const [time, setTime] = useState(targetHours * 3600);

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
  const { h, m, s } = useCountdown(8);

  return (
    <section className="mt-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">Flash Sale</h2>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
            LIMITED TIME
          </span>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 text-gray-700">
          <Timer size={18} className="text-red-500" />
          <span className="text-sm font-medium">Ends in:</span>
          <div className="flex gap-1">
            {[h, m, s].map((unit, i) => (
              <span
                key={i}
                className="rounded-lg bg-gray-900 px-2 py-1 text-sm font-bold text-white"
              >
                {unit}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {flashProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FlashSale;
