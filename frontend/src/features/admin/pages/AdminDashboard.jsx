import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Package, ShoppingCart, DollarSign, RefreshCw, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAdminDashboard } from "@/redux/adminSlice";
import { fetchRecentOrders } from "@/redux/adminSlice";

const STATUS_STYLES = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100   text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100  text-green-700",
  completed:  "bg-green-100  text-green-700",
  cancelled:  "bg-red-100    text-red-700",
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
  const dispatch = useDispatch();
  const { dashboard: d, dashboardLoading, dashboardError } = useSelector((s) => s.admin);
  const { items: recentOrders, loading: ordersLoading } = useSelector((s) => s.admin.recentOrders);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
    dispatch(fetchRecentOrders());
  }, [dispatch]);

  const loading = dashboardLoading;
  const error   = dashboardError;

  const stats = d ?? {};

  const statCards = [
    { title: "Total Users",    value: loading ? "..." : (stats.totalUsers    ?? "—"), icon: Users,        color: "bg-blue-100 text-blue-600"    },
    { title: "Total Products", value: loading ? "..." : (stats.totalProducts ?? "—"), icon: Package,      color: "bg-green-100 text-green-600"  },
    { title: "Total Orders",   value: loading ? "..." : (stats.totalOrders   ?? "—"), icon: ShoppingCart, color: "bg-purple-100 text-purple-600" },
    { title: "Revenue",        value: loading ? "..." : (stats.totalRevenue  != null ? fmt(stats.totalRevenue) : "—"), icon: DollarSign, color: "bg-yellow-100 text-yellow-600" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, Admin</p>
        </div>
        <button
          onClick={() => { dispatch(fetchAdminDashboard()); dispatch(fetchRecentOrders()); }}
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
        <div className="p-5 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-slate-500" />
            <h2 className="font-semibold text-lg">Recent Orders</h2>
          </div>
          <Link
            to="/admin/recent-orders"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            View all →
          </Link>
        </div>

        {ordersLoading ? (
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
                  <th className="p-4 text-left">Products</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => {
                  const id            = order._id ?? order.id;
                  const orderStatus   = (order.orderStatus ?? order.status ?? "pending").toLowerCase();
                  const paymentStatus = (order.paymentStatus ?? "").toLowerCase();
                  return (
                    <tr key={id ?? idx} className="border-t hover:bg-slate-50/60 transition">
                      <td className="p-4 font-mono text-xs text-slate-500">
                        #{typeof id === "string" ? id.slice(-8).toUpperCase() : id ?? idx + 1}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-slate-800">
                          {order.user?.name ?? order.customerName ?? "—"}
                        </p>
                        {order.user?.email && (
                          <span className="block text-xs text-slate-400">{order.user.email}</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 whitespace-nowrap">{fmtDate(order.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          {(order.orderItems ?? []).slice(0, 2).map((item, i) => (
                            <span key={i} className="truncate max-w-[160px] text-xs text-slate-700 font-medium">
                              {item.product?.name ?? item.name ?? "—"}
                              <span className="ml-1 text-slate-400 font-normal">×{item.quantity}</span>
                            </span>
                          ))}
                          {(order.orderItems ?? []).length > 2 && (
                            <span className="text-xs text-slate-400">+{order.orderItems.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {fmt(order.totalAmount ?? order.total ?? order.totalPrice)}
                      </td>
                      <td className="p-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[orderStatus] ?? "bg-slate-100 text-slate-600"}`}>
                          {orderStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {paymentStatus ? (
                          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : paymentStatus === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {paymentStatus}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
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
