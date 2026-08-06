import { useState, useEffect, useCallback } from "react";
import { RefreshCw, TrendingUp, Tag, Package, ShoppingBag } from "lucide-react";
import api from "@/services/axios";

const fmt = (val) =>
  val !== undefined && val !== null
    ? `₹${Number(val).toLocaleString("en-IN")}`
    : "—";

const Sales = () => {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/admin/top-products"),
        api.get("/admin/top-categories"),
      ]);
      setProducts(prodRes.data?.products   ?? []);
      setCategories(catRes.data?.topCategories ?? []);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load sales data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* Max sold values for bar widths */
  const maxProductSold  = Math.max(...products.map((p)  => p.totalSold ?? 0), 1);
  const maxCategorySold = Math.max(...categories.map((c) => c.totalSold ?? 0), 1);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales</h1>
          <p className="text-sm text-slate-500">Top-selling products and categories</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <RefreshCw size={20} className="mr-2 animate-spin" /> Loading...
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* ── Top Selling Products ───────────────────────────────────── */}
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b p-4">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <Package size={18} />
              </div>
              <h2 className="font-semibold text-slate-800">Top Selling Products</h2>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                <ShoppingBag size={40} className="text-slate-300" />
                <p className="text-sm">No product sales data available.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {products.map((item, i) => {
                  const product  = item._id ?? item.product ?? {};
                  const name     = product.name  ?? item.name  ?? "Unknown Product";
                  const brand    = product.brand ?? item.brand ?? null;
                  const price    = product.price ?? item.price ?? null;
                  const image    = product.images?.[0] ?? null;
                  const sold     = item.totalSold ?? 0;
                  const barPct   = Math.round((sold / maxProductSold) * 100);

                  return (
                    <li key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50/60 transition">
                      {/* Rank badge */}
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {i + 1}
                      </span>

                      {/* Thumbnail */}
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="h-12 w-12 flex-shrink-0 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <Package size={20} />
                        </div>
                      )}

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800">{name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          {brand && <span>{brand}</span>}
                          {price && <span>{fmt(price)}</span>}
                        </div>
                        {/* Bar */}
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-blue-500 transition-all"
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Sold count */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-slate-800">{sold.toLocaleString("en-IN")}</p>
                        <p className="text-xs text-slate-400">units sold</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* ── Top Categories ─────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b p-4">
              <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                <Tag size={18} />
              </div>
              <h2 className="font-semibold text-slate-800">Top Categories</h2>
            </div>

            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                <TrendingUp size={40} className="text-slate-300" />
                <p className="text-sm">No category sales data available.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {categories.map((item, i) => {
                  const cat    = item.category ?? item._id ?? {};
                  const name   = cat.name ?? item.name ?? "Unknown Category";
                  const sold   = item.totalSold ?? 0;
                  const barPct = Math.round((sold / maxCategorySold) * 100);

                  return (
                    <li key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50/60 transition">
                      {/* Rank badge */}
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                        {i + 1}
                      </span>

                      {/* Color dot */}
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                        <Tag size={22} />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800">{name}</p>
                        {/* Bar */}
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-purple-500 transition-all"
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Sold count */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-slate-800">{sold.toLocaleString("en-IN")}</p>
                        <p className="text-xs text-slate-400">units sold</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Sales;
