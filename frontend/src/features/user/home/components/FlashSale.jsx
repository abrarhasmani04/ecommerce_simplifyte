import { useState, useEffect } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../products/components/ProductCard";
import api from "@/services/axios";

const useCountdown = (initialSeconds) => {
  const [time, setTime] = useState(initialSeconds);
  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);
  const h = String(Math.floor(time / 3600)).padStart(2, "0");
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const s = String(time % 60).padStart(2, "0");
  return { h, m, s };
};

const TimeUnit = ({ value, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "46px" }}>
    <span style={{ background: "#111827", color: "#fff", borderRadius: "8px", padding: "6px 10px", fontSize: "1.05rem", fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    <span style={{ fontSize: "0.6rem", color: "#6b7280", marginTop: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
  </div>
);

const Separator = () => (
  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#dc2626", lineHeight: 1, marginTop: "-8px" }}>:</span>
);

const FlashSale = () => {
  const { h, m, s } = useCountdown(8 * 3600);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/product/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.products ?? [];
        setProducts(list.filter((p) => !p.isFeatured).slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section style={{ marginTop: "60px" }}>
      {/* Header band */}
      <div style={{ background: "linear-gradient(135deg, #111827 0%, #1e1b4b 100%)", borderRadius: "18px 18px 0 0", padding: "20px 28px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        {/* Left: title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={20} color="#f87171" fill="#f87171" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "1.3rem", color: "#fff" }}>Flash Sale</h2>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#fca5a5", letterSpacing: "0.08em", textTransform: "uppercase" }}>Limited Time Offer</span>
          </div>
        </div>

        {/* Right: countdown + link */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <TimeUnit value={h} label="hrs" />
            <Separator />
            <TimeUnit value={m} label="min" />
            <Separator />
            <TimeUnit value={s} label="sec" />
          </div>
          <Link
            to="/products"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "8px 16px", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none" }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Products area */}
      <div style={{ border: "1px solid #f1f5f9", borderTop: "none", borderRadius: "0 0 18px 18px", padding: "24px", background: "#fff" }}>
        {loading ? (
          <div className="product-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse" style={{ borderRadius: "14px", border: "1px solid #f1f5f9", padding: "16px" }}>
                <div style={{ height: "180px", borderRadius: "10px", background: "#f1f5f9", marginBottom: "12px" }} />
                <div style={{ height: "12px", borderRadius: "6px", background: "#f1f5f9", width: "75%", marginBottom: "8px" }} />
                <div style={{ height: "12px", borderRadius: "6px", background: "#f1f5f9", width: "50%" }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
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
      </div>

      <style>{`
        .product-grid { display: grid; gap: 18px; grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>
    </section>
  );
};

export default FlashSale;
