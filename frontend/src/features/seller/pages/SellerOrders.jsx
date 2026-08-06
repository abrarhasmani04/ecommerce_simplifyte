import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw, ShoppingCart, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchSellerOrders,
  updateSellerOrderStatus,
} from "@/redux/sellerSlice";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const NEXT_STATUS = {
  Pending: "Confirmed",
  Confirmed: "Processing",
  Processing: "Shipped",
  Shipped: "Delivered",
};

const fmtDate = (val) => {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmt = (val) =>
  val !== undefined && val !== null
    ? `₹${Number(val).toLocaleString("en-IN")}`
    : "—";

const SellerOrders = () => {
  const dispatch = useDispatch();
  const {
    items: orders,
    loading,
    error,
  } = useSelector((state) => state.seller.orders);

  // track which order's status is being updated
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchSellerOrders());
  };

  const handleStatusAdvance = async (orderId, nextStatus) => {
    setUpdatingId(orderId);
    try {
      await dispatch(
        updateSellerOrderStatus({ orderId, orderStatus: nextStatus }),
      ).unwrap();
      toast.success(`Order status updated to ${nextStatus}.`);
      dispatch(fetchSellerOrders());
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : (err?.message ?? "Failed to update order status."),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
          <p className="text-sm text-slate-500">
            Orders containing your products
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Errors */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <RefreshCw size={20} className="mr-2 animate-spin" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
            <ShoppingCart size={40} className="text-slate-300" />
            <p className="text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Buyer</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Products</th>
                  <th className="p-4 text-left">Your Total</th>
                  <th className="p-4 text-left">Payment</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => {
                  const id = order._id ?? order.id;
                  const rawStatus = order.orderStatus ?? "Pending";
                  const status = rawStatus.toLowerCase();
                  const payStatus = (order.paymentStatus ?? "").toLowerCase();
                  const nextStatus = NEXT_STATUS[rawStatus] ?? null;
                  const isUpdating = updatingId === id;

                  return (
                    <tr
                      key={id ?? idx}
                      className="border-t transition hover:bg-slate-50/60"
                    >
                      {/* Order ID */}
                      <td className="p-4 font-mono text-xs text-slate-600">
                        #
                        {typeof id === "string"
                          ? id.slice(-8).toUpperCase()
                          : id}
                      </td>

                      {/* Buyer */}
                      <td className="p-4">
                        <p className="font-medium text-slate-800">
                          {order.buyer?.name ?? "—"}
                        </p>
                        {order.buyer?.email && (
                          <p className="text-xs text-slate-400">
                            {order.buyer.email}
                          </p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="p-4 whitespace-nowrap text-slate-600">
                        {fmtDate(order.createdAt)}
                      </td>

                      {/* Product names */}
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          {(order.orderItems ?? []).map((item, i) => (
                            <span
                              key={i}
                              className="truncate max-w-45 text-xs text-slate-700 font-medium"
                            >
                              {item.product?.name ?? item.name ?? "—"}
                              <span className="ml-1 text-slate-400 font-normal">
                                ×{item.quantity}
                              </span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Seller total */}
                      <td className="p-4 font-semibold text-slate-800">
                        {fmt(order.sellerTotal)}
                      </td>

                      {/* Payment status */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            payStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : payStatus === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {payStatus || "pending"}
                        </span>
                      </td>

                      {/* Order status badge */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            STATUS_STYLES[status] ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {rawStatus}
                        </span>
                      </td>

                      {/* Advance status button */}
                      <td className="p-4">
                        {nextStatus ? (
                          <button
                            onClick={() => handleStatusAdvance(id, nextStatus)}
                            disabled={isUpdating}
                            className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                          >
                            {isUpdating ? (
                              <RefreshCw size={12} className="animate-spin" />
                            ) : (
                              <ChevronDown size={12} />
                            )}
                            {nextStatus}
                          </button>
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
        <p className="text-right text-xs text-slate-400">
          Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default SellerOrders;
