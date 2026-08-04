import { useState, useEffect, useCallback } from "react";
import { RefreshCw, ShoppingCart } from "lucide-react";
import api from "@/services/axios";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-600",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/all-orders");

      const list = data?.orders ?? data?.data ?? data;
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        // route not yet implemented on backend — show empty state, not error
        setOrders([]);
      } else {
        setError(err?.response?.data?.message ?? "Failed to load orders.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fmt = (val) =>
    val !== undefined && val !== null
      ? `₹${Number(val).toLocaleString("en-IN")}`
      : "—";

  const fmtDate = (val) => {
    if (!val) return "—";
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 text-sm">
            All customer orders across the platform
          </p>
        </div>
        <button
          onClick={fetchOrders}
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
            <RefreshCw size={20} className="mr-2 animate-spin" /> Loading
            orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <ShoppingCart size={40} className="text-slate-300" />
            <p className="text-sm">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Items</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => {
                  const id = order._id ?? order.id;
                  const status = (order.status ?? "pending").toLowerCase();
                  const paymentStatus = (
                    order.paymentStatus ??
                    order.payment?.status ??
                    ""
                  ).toLowerCase();

                  return (
                    <tr
                      key={id ?? idx}
                      className="border-t hover:bg-slate-50/60 transition"
                    >
                      {/* Order ID */}
                      <td className="p-4 font-mono text-xs text-slate-600">
                        #
                        {typeof id === "string"
                          ? id.slice(-8).toUpperCase()
                          : id}
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <p className="font-medium text-slate-800">
                          {order.user?.name ?? order.customerName ?? "—"}
                        </p>
                        {order.user?.email && (
                          <p className="text-xs text-slate-400">
                            {order.user.email}
                          </p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-600 whitespace-nowrap">
                        {fmtDate(order.createdAt)}
                      </td>

                      {/* Items count */}
                      <td className="p-4 text-slate-600">
                        {order.items?.length ?? order.orderItems?.length ?? "—"}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-semibold text-slate-800">
                        {fmt(
                          order.totalAmount ?? order.total ?? order.totalPrice,
                        )}
                      </td>

                      {/* Status badge */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            STATUS_STYLES[status] ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Payment status */}
                      <td className="p-4">
                        {paymentStatus ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                              paymentStatus === "paid"
                                ? "bg-green-100 text-green-700"
                                : paymentStatus === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
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

      {/* Footer count */}
      {!loading && orders.length > 0 && (
        <p className="text-xs text-slate-400 text-right">
          Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default Orders;
