import { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import api from "@/services/axios";

const LowStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/admin/low-stock");
      setProducts(data.products || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch low stock products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  const getStockBadge = (stock) => {
    if (stock === 0)
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          Out of Stock
        </span>
      );
    if (stock <= 3)
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
          Critical — {stock} left
        </span>
      );
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        Low — {stock} left
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Low Stock Warning</h1>
            <p className="text-sm text-slate-500">
              Products with fewer than 10 units in stock
            </p>
          </div>
        </div>
        <button
          onClick={fetchLowStock}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <RefreshCw size={24} className="animate-spin mr-2" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-10 text-center">
          <p className="text-base font-semibold text-green-700">All products are well-stocked!</p>
          <p className="mt-1 text-sm text-green-600">No items below the threshold of 10 units.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{products.length}</span> product{products.length !== 1 ? "s" : ""} requiring attention.
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Brand</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3 text-right">Price</th>
                  <th className="px-5 py-3 text-center">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50 transition">
                    <td className="flex items-center gap-3 px-5 py-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex-shrink-0" />
                      )}
                      <span className="font-medium text-slate-800 line-clamp-1">{product.name}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{product.brand || "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{product.category?.name || "—"}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-800">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3 text-center">{getStockBadge(product.stock)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LowStock;
