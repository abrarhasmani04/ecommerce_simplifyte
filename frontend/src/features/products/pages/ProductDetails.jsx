import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import api from "@/api/axios";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ReviewSection from "../components/ReviewSection";
import RelatedProducts from "../components/RelatedProducts";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />
);

const ProductDetailsSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <Skeleton className="mb-8 h-4 w-64" />
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <Skeleton className="h-96 w-full" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-16" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────
const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        // Fetch single product — adjust endpoint if yours differs
        const { data } = await api.get(`/product/${id}`);
        const prod = data.product ?? data;
        setProduct(prod);

        // Fetch related products by category (optional — ignore if not available)
        if (prod?.category?._id || prod?.category) {
          const catId = prod.category?._id ?? prod.category;
          try {
            const rel = await api.get("/product/", {
              params: { category: catId, limit: 10 },
            });
            const list = Array.isArray(rel.data)
              ? rel.data
              : (rel.data.products ?? []);
            // Exclude current product from related list
            setRelated(list.filter((p) => p._id !== id));
          } catch {
            // related products are optional — silently skip
          }
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setError("Product not found.");
        } else {
          setError("Failed to load product. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ── Loading ──
  if (loading) return <ProductDetailsSkeleton />;

  // ── Error ──
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold text-red-500">{error}</p>
        <Link
          to="/products"
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const reviews = product.reviews ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Breadcrumb ── */}
      <nav className="mb-8 flex items-center gap-1.5 text-xs text-gray-400">
        <Link
          to="/home"
          className="flex items-center gap-1 hover:text-blue-600 transition"
        >
          <Home size={13} />
          Home
        </Link>
        <ChevronRight size={13} />
        <Link to="/products" className="hover:text-blue-600 transition">
          Products
        </Link>
        {product.category?.name && (
          <>
            <ChevronRight size={13} />
            <Link
              to={`/products?category=${product.category._id}`}
              className="hover:text-blue-600 transition"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={13} />
        <span className="line-clamp-1 max-w-[200px] text-gray-600">
          {product.name}
        </span>
      </nav>

      {/* ── Product main section ── */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <ProductGallery images={product.images ?? []} title={product.name} />

        {/* Info */}
        <ProductInfo product={product} />
      </div>

      {/* ── Specs / Attributes table ── */}
      {product.attributes && Object.keys(product.attributes).length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Specifications
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.attributes).map(([key, val], i) => (
                  <tr
                    key={key}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="w-1/3 px-5 py-3 font-medium capitalize text-gray-500">
                      {key}
                    </td>
                    <td className="px-5 py-3 text-gray-800">{String(val)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Reviews ── */}
      <ReviewSection reviews={reviews} rating={product.rating} />

      {/* ── Related Products ── */}
      <RelatedProducts products={related} />
    </div>
  );
};

export default ProductDetails;
