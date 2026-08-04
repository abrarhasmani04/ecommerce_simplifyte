import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        // Keep only featured products (double-check in case API doesn't filter)
        setProducts(list.filter((p) => p.isFeatured));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mt-14">
        <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
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
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <Link
          to="/products"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

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
    </section>
  );
};

export default FeaturedProducts;
