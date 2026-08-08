import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import ProductCard from "../../products/components/ProductCard";
import api from "@/services/axios";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/product/", { params: { isFeatured: true } })
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.products ?? [];
        setProducts(list.filter((p) => p.isFeatured));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section style={{ marginTop: "60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
          <h2 style={{ margin: 0, fontSize: "1.55rem", fontWeight: 800, color: "#0f172a" }}>Featured Products</h2>
          <div style={{ flex: 1, height: "2px", background: "linear-gradient(to right, #e2e8f0, transparent)" }} />
        </div>
        <div className="product-grid-fp">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse" style={{ borderRadius: "14px", border: "1px solid #f1f5f9", padding: "16px", background: "#fff" }}>
              <div style={{ height: "180px", borderRadius: "10px", background: "#f1f5f9", marginBottom: "12px" }} />
              <div style={{ height: "12px", borderRadius: "6px", background: "#f1f5f9", width: "75%", marginBottom: "8px" }} />
              <div style={{ height: "12px", borderRadius: "6px", background: "#f1f5f9", width: "50%" }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section style={{ marginTop: "60px" }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Star size={18} color="#f59e0b" fill="#f59e0b" />
          </div>
          <h2 style={{ margin: 0, fontSize: "1.55rem", fontWeight: 800, color: "#0f172a" }}>Featured Products</h2>
        </div>
        <Link
          to="/products"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 600, color: "#2563eb", textDecoration: "none", background: "#eff6ff", borderRadius: "8px", padding: "6px 14px" }}
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div className="product-grid-fp">
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

      <style>{`
        .product-grid-fp { display: grid; gap: 18px; grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 768px) { .product-grid-fp { grid-template-columns: repeat(4, 1fr); } }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
