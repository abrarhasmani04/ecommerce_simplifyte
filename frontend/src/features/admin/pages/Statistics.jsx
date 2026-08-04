import { useState, useEffect, useCallback } from "react";
import { Users, Package, ShoppingCart, DollarSign, Store, RefreshCw, TrendingUp } from "lucide-react";
import api from "@/services/axios";

const Statistics = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data: res } = await api.get("/admin/dashboard");
      setData(res?.dashboard ?? res ?? {});
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const fmt = (val) =>
    val != null ? `₹${Number(val).toLocaleString("en-IN")}` : "—";

  const d = data ?? {};

  const cards = [
    {
      title: "Total Users",
      value: d.totalUsers    ?? "—",
      icon:  Users,
      bg:    "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Total Products",
      value: d.totalProducts ?? "—",
      icon:  Package,
      bg:    "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: d.totalOrders   ?? "—",
      icon:  ShoppingCart,
      bg:    "bg-purple-50",
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: d.totalRevenue  != null ? fmt(d.totalRevenue) : "—",
      icon:  DollarSign,
      bg:    "bg-yellow-50",
      color: "text-yellow-600",
    },
    {
      title: "Total Sellers",
      value: d.totalSellers  ?? "—",
      icon:  Store,
      bg:    "bg-pink-50",
      color: "text-pink-600",
    },
    {
      title: "Pending Applications",
      value: d.pendingApplications ?? d.pendingSellers ?? "—",
      icon:  TrendingUp,
      bg:    "bg-orange-50",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Statistics</h1>
          <p className="text-sm text-slate-500">System-wide analytics</p>
        </div>
        <button
          onClick={fetchStats}
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <h2 className="text-2xl font-bold mt-2 text-slate-800">
                    {loading ? (
                      <span className="inline-block h-7 w-16 animate-pulse rounded bg-slate-100" />
                    ) : (
                      item.value
                    )}
                  </h2>
                </div>
                <div className={`rounded-full p-3 ${item.bg}`}>
                  <Icon size={24} className={item.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Statistics;
