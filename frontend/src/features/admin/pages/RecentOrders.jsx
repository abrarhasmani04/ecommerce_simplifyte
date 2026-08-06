import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw, ShoppingCart, Clock } from "lucide-react";
import { fetchRecentOrders } from "@/redux/adminSlice";

const STATUS_STYLES = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100   text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100  text-green-700",
  cancelled:  "bg-red-100    text-red-700",
};

const fmt = (val) =>
  val != null ? `₹${Number(val).toLocaleString("en-IN")}` : "—";

const fmtDate = (val) => {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const getSellers = (order) => {
  const names = new Set();
  (order.orderItems ?? []).forEach((item) => {
    const name = item.product?.seller?.name;
    if (name) names.add(name);
  });
  return [...names];
};

const RecentOrders = () => {
  const dispatch = useDispatch();
  const { items: orders, loading, error } = useSelector((s) => s.admin.recentOrders);

  useEffect(() => {
    dispatch(fetchRecentOrders());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-slate-500" />
            <h1 className="text-2xl font-bold text-slate-800">Recent Orders</h1>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Latest 10 orders across the platform
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchRecentOrders())}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <RefreshCw size={20} className="mr-2 animate-spin" /> Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <ShoppingCart size={40} className="text-slate-300" />
            <p className="text-sm">No recent orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Seller(s)</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Products</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Order Status</th>
                  <th className="p-4 text-left">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => {
                  const id            = order._id ?? order.id;
                  const orderStatus   = (order.orderStatus ?? order.status ?? "pending").toLowerCase();
                  const paymentStatus = (order.paymentStatus ?? "").toLowerCase();
                  const sellers       = getSellers(order);

                  return (
                    <tr key={id ?? idx} className="border-t hover:bg-slate-50/60 transition">
                      {/* Order ID */}
                      <td className="p-4 font-mono text-xs text-slate-600">
                        #{typeof id === "string" ? id.slice(-8).toUpperCase() : id}
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <p className="font-medium text-slate-800">
                          {order.user?.name ?? order.customerName ?? "—"}
                        </p>
                        {order.user?.email && (
                          <p className="text-xs text-slate-400">{order.user.email}</p>
                        )}
                      </td>

                      {/* Sellers */}
                      <td className="p-4">
                        {sellers.length > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            {sellers.map((name, i) => (
                              <span
                                key={i}
                                className="inline-block rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 w-fit"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-600 whitespace-nowrap">
                        {fmtDate(order.createdAt)}
                      </td>

                      {/* Products */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5">
                          {(order.orderItems ?? []).map((item, i) => {
                            const imgSrc =
                              item.product?.images?.[0] ?? item.image ?? null;
                            const name =
                              item.product?.name ?? item.name ?? "—";
                            return (
                              <div key={i} className="flex items-center gap-2">
                                {imgSrc ? (
                                  <img
                                    src={imgSrc}
                                    alt={name}
                                    className="h-8 w-8 rounded object-cover border border-slate-200 shrink-0"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded bg-slate-100 border border-slate-200 shrink-0" />
                                )}
                                <span className="truncate max-w-[140px] text-xs text-slate-700 font-medium">
                                  {name}
                                  <span className="ml-1 text-slate-400 font-normal">×{item.quantity}</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-semibold text-slate-800">
                        {fmt(order.totalAmount ?? order.total ?? order.totalPrice)}
                      </td>

                      {/* Order Status */}
                      <td className="p-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[orderStatus] ?? "bg-slate-100 text-slate-600"}`}>
                          {orderStatus}
                        </span>
                      </td>

                      {/* Payment */}
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

      {/* Footer */}
      {!loading && orders.length > 0 && (
        <p className="text-xs text-slate-400 text-right">
          Showing {orders.length} most recent order{orders.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default RecentOrders;
