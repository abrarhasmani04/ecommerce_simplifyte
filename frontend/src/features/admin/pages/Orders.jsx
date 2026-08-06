import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RefreshCw, ShoppingCart, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/services/axios";

// ─── constants
const VALID_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100   text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100  text-green-700",
  cancelled: "bg-red-100    text-red-700",
};

// ─── helpers
const fmt = (val) =>
  val != null ? `₹${Number(val).toLocaleString("en-IN")}` : "—";

const fmtDate = (val) => {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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

const isSellerOrder = (order, adminId) =>
  (order.orderItems ?? []).length > 0 &&
  (order.orderItems ?? []).every((item) => {
    const sellerId = item.product?.seller?._id ?? item.product?.seller;
    if (!sellerId) return false; // no seller populated → admin product
    return sellerId.toString() !== adminId?.toString(); // differs from admin → seller product
  });

const StatusDropdown = ({ orderId, current, disabled, onUpdated }) => {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === current) return;
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
      onUpdated(orderId, data.order?.orderStatus ?? newStatus);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (disabled) {
    const lc = (current ?? "pending").toLowerCase();
    return (
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
          STATUS_STYLES[lc] ?? "bg-slate-100 text-slate-600"
        }`}
      >
        {current}
      </span>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={current}
        onChange={handleChange}
        disabled={updating || current === "Cancelled"}
        className={`appearance-none rounded-full border py-1 pl-3 pr-7 text-xs font-medium capitalize focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-60 cursor-pointer ${
          STATUS_STYLES[(current ?? "pending").toLowerCase()] ??
          "bg-slate-100 text-slate-600"
        } border-transparent`}
      >
        {VALID_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {updating ? (
        <RefreshCw
          size={11}
          className="pointer-events-none absolute right-2 animate-spin text-current opacity-70"
        />
      ) : (
        <ChevronDown
          size={11}
          className="pointer-events-none absolute right-2 text-current opacity-70"
        />
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Orders = () => {
  const { user: adminUser } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/all-orders");
      const list = data?.recentOrders ?? data?.orders ?? data?.data ?? data;
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
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

  // Patch single order status in local state after update
  const handleStatusUpdated = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        (o._id ?? o.id) === orderId ? { ...o, orderStatus: newStatus } : o,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 text-sm">
            All customer orders — seller orders are view-only
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
            orders…
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
                  const id = order._id ?? order.id;
                  const paymentStatus = (
                    order.paymentStatus ??
                    order.payment?.status ??
                    ""
                  ).toLowerCase();
                  const sellers = getSellers(order);
                  const sellerOwned = isSellerOrder(order, adminUser?._id);

                  return (
                    <tr
                      key={id ?? idx}
                      className={`border-t transition ${
                        sellerOwned
                          ? "bg-slate-50/40 hover:bg-slate-50"
                          : "hover:bg-slate-50/60"
                      }`}
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

                      {/* Products — thumbnail + name */}
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          {(order.orderItems ?? []).map((item, i) => {
                            const img =
                              item.image ?? item.product?.images?.[0] ?? null;
                            const name = item.name ?? item.product?.name ?? "—";
                            return (
                              <div key={i} className="flex items-center gap-2">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={name}
                                    className="h-9 w-9 rounded-md object-cover border border-slate-100 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="h-9 w-9 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <ShoppingCart
                                      size={14}
                                      className="text-slate-300"
                                    />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="truncate max-w-[140px] text-xs font-medium text-slate-700">
                                    {name}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    ×{item.quantity}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-semibold text-slate-800">
                        {fmt(
                          order.totalAmount ?? order.total ?? order.totalPrice,
                        )}
                      </td>

                      {/* Status — dropdown for admin products, badge-only for seller orders */}
                      <td className="p-4">
                        <StatusDropdown
                          orderId={id}
                          current={order.orderStatus ?? "Pending"}
                          disabled={sellerOwned}
                          onUpdated={handleStatusUpdated}
                        />
                        {sellerOwned && (
                          <p className="mt-1 text-xs text-slate-400">
                            Managed by seller
                          </p>
                        )}
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
