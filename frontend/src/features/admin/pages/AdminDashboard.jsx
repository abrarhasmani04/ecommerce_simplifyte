import { useState, useEffect, useCallback } from "react";
import { Users, Package, ShoppingCart, DollarSign, RefreshCw } from "lucide-react";
import api from "@/services/axios";

const STATUS_STYLES = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  completed:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

const fmt = (val) =>
  val !== undefined && val !== null
    ? `₹${Number(val).toLocaleString("en-IN")}`
    : "—";

const fmtDate = (val) => {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const AdminDashboard = () => {
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/dashboard");
      console.log("📦 Dashboard API response:", data); // check browser console
      setDashData(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setDashData({});
      } else {
        setError(err?.response?.data?.message ?? "Failed to load dashboard.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // API shape: { success: true, dashboard: { totalUsers, totalProducts, totalOrders, totalRevenue, ... } }
  const d = dashData?.dashboard ?? dashData ?? {};

  const statCards = [
    { title: "Total Users",    value: loading ? "..." : (d.totalUsers    ?? "—"), icon: Users,        color: "bg-blue-100 text-blue-600"    },
    { title: "Total Products", value: loading ? "..." : (d.totalProducts ?? "—"), icon: Package,      color: "bg-green-100 text-green-600"  },
    { title: "Total Orders",   value: loading ? "..." : (d.totalOrders   ?? "—"), icon: ShoppingCart, color: "bg-purple-100 text-purple-600" },
    { title: "Revenue",        value: loading ? "..." : (d.totalRevenue  != null ? fmt(d.totalRevenue) : "—"), icon: DollarSign, color: "bg-yellow-100 text-yellow-600" },
  ];

  const recentOrders = d.recentOrders ?? d.latestOrders ?? d.orders ?? [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, Admin</p>
        </div>
        <button
          onClick={fetchDashboard}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
                </div>
                <div className={`p-3 rounded-full ${item.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b">
          <h2 className="font-semibold text-lg">Recent Orders</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <RefreshCw size={18} className="mr-2 animate-spin" /> Loading...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">No recent orders.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => {
                  const id     = order._id ?? order.id;
                  const status = (order.status ?? "pending").toLowerCase();
                  return (
                    <tr key={id ?? idx} className="border-t hover:bg-slate-50/60 transition">
                      <td className="p-4 font-mono text-xs text-slate-500">
                        #{typeof id === "string" ? id.slice(-8).toUpperCase() : id ?? idx + 1}
                      </td>
                      <td className="p-4 font-medium text-slate-800">
                        {order.user?.name ?? order.customerName ?? order.userName ?? "—"}
                        {order.user?.email && (
                          <span className="block text-xs text-slate-400">{order.user.email}</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 whitespace-nowrap">{fmtDate(order.createdAt)}</td>
                      <td className="p-4 font-semibold text-slate-800">
                        {fmt(order.totalAmount ?? order.total ?? order.totalPrice)}
                      </td>
                      <td className="p-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
