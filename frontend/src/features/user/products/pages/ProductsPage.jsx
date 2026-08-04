import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "@/services/axios";

const PAGE_SIZE = 12;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const selectedCategory = searchParams.get("category") ?? "";
  const selectedBrand = searchParams.get("brand") ?? "";
  const searchQuery = searchParams.get("q") ?? "";

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedBrand, searchQuery]);

  // Fetch categories once
  useEffect(() => {
    api
      .get("/category/")
      .then(({ data }) => {
        setCategories(Array.isArray(data) ? data : data.categories ?? []);
      })
      .catch(() => {});
  }, []);

  // Fetch products whenever filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit: PAGE_SIZE };
        if (selectedCategory) params.category = selectedCategory;
        if (searchQuery) params.q = searchQuery;
        if (selectedBrand) params.brand = selectedBrand;

        const { data } = await api.get("/product/", { params });

        // Backend may return paginated object OR plain array
        if (Array.isArray(data)) {
          // Plain array — do client-side pagination
          let list = data;
          if (selectedBrand) {
            list = list.filter(
              (p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase()
            );
          }
          const tp = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
          const safePg = Math.min(page, tp);
          setProducts(list.slice((safePg - 1) * PAGE_SIZE, safePg * PAGE_SIZE));
          setTotalProducts(list.length);
          setTotalPages(tp);
        } else {
          // Paginated response: { products, total, totalPages, page, ... }
          const list =
            data.products ??
            data.data ??
            data.result ??
            data.items ??
            [];
          const total =
            data.total ??
            data.totalProducts ??
            data.count ??
            list.length;
          const tp =
            data.totalPages ??
            data.pages ??
            Math.max(1, Math.ceil(total / PAGE_SIZE));
          setProducts(list);
          setTotalProducts(total);
          setTotalPages(tp);
        }
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedBrand, searchQuery, page]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    const next = new URLSearchParams(searchParams);
    if (val) next.set("category", val);
    else next.delete("category");
    next.delete("brand");
    setSearchParams(next);
  };

  const clearBrand = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("brand");
    setSearchParams(next);
  };

  const safePage = Math.min(page, totalPages);

  const goTo = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build page number array with ellipsis
  const pageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums = new Set(
      [1, totalPages, safePage, safePage - 1, safePage + 1].filter(
        (n) => n >= 1 && n <= totalPages
      )
    );
    const sorted = [...nums].sort((a, b) => a - b);
    const result = [];
    sorted.forEach((n, i) => {
      if (i > 0 && n - sorted[i - 1] > 1) result.push("…");
      result.push(n);
    });
    return result;
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#111827" }}>
            {selectedBrand ? `Brand: ${selectedBrand}` : "All Products"}
          </h1>
          {!loading && (
            <p className="mt-1 text-sm text-gray-400">
              {totalProducts} product{totalProducts !== 1 ? "s" : ""} found
              {totalPages > 1 && ` · Page ${safePage} of ${totalPages}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {selectedBrand && (
            <span
              className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium"
              style={{ borderColor: "#3b82f6", color: "#3b82f6" }}
            >
              {selectedBrand}
              <button
                onClick={clearBrand}
                className="ml-1 font-bold hover:text-red-500"
                aria-label="Remove brand filter"
              >
                ×
              </button>
            </span>
          )}

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border rounded-lg px-3 py-2 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(PAGE_SIZE)].map((_, i) => (
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

      {/* Error */}
      {error && !loading && (
        <p className="text-red-500 text-center py-16">{error}</p>
      )}

      {/* Empty */}
      {!loading && !error && totalProducts === 0 && (
        <p className="text-slate-400 text-center py-16">
          No products found
          {selectedBrand ? ` for brand "${selectedBrand}"` : ""}
          {selectedCategory ? " in this category" : ""}.
        </p>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
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

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div
          className="mt-10 flex items-center justify-center gap-1"
          style={{ flexWrap: "wrap" }}
        >
          {/* Prev */}
          <button
            onClick={() => goTo(safePage - 1)}
            disabled={safePage === 1}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: safePage === 1 ? "#f9fafb" : "#ffffff",
              color: safePage === 1 ? "#d1d5db" : "#374151",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: safePage === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Prev
          </button>

          {/* Page numbers */}
          {pageNumbers().map((n, i) =>
            n === "…" ? (
              <span
                key={`ellipsis-${i}`}
                style={{
                  padding: "8px 4px",
                  color: "#9ca3af",
                  fontSize: "0.85rem",
                }}
              >
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => goTo(n)}
                style={{
                  minWidth: "36px",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: n === safePage ? "#2563eb" : "#e5e7eb",
                  background: n === safePage ? "#2563eb" : "#ffffff",
                  color: n === safePage ? "#ffffff" : "#374151",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {n}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => goTo(safePage + 1)}
            disabled={safePage === totalPages}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: safePage === totalPages ? "#f9fafb" : "#ffffff",
              color: safePage === totalPages ? "#d1d5db" : "#374151",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: safePage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
