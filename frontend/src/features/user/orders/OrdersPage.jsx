import { useEffect, useState, useCallback } from "react";
import useScrollLock from "@/hooks/useScrollLock";
import { toast } from "react-toastify";
import {
  ShoppingBag, ChevronRight, X,
  FileText, XCircle, MapPin, CreditCard, Loader2, Star,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  getMyOrdersApi,
  getOrderByIdApi,
  cancelOrderApi,
  downloadInvoiceApi,
} from "@/services/orderApi";
import { AddReviewFormInline } from "@/features/user/products/components/ReviewSection";
import { getProductReviewsApi } from "@/services/reviewApi";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

const fmt = (v) =>
  v != null ? `₹${Number(v).toLocaleString("en-IN")}` : "—";

const STATUS_PILL = {
  Pending:    "bg-yellow-100 text-yellow-700",
  Confirmed:  "bg-blue-100   text-blue-700",
  Processing: "bg-indigo-100 text-indigo-700",
  Shipped:    "bg-purple-100 text-purple-700",
  Delivered:  "bg-green-100  text-green-700",
  Cancelled:  "bg-red-100    text-red-700",
};

const PAY_PILL = {
  Pending: "bg-yellow-100 text-yellow-700",
  Paid:    "bg-green-100  text-green-700",
  Failed:  "bg-red-100    text-red-700",
};

const Pill = ({ label, map }) => (
  <span
    className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
      map[label] ?? "bg-gray-100 text-gray-600"
    }`}
  >
    {label}
  </span>
);

// ─── Order List Card ──────────────────────────────────────────────────────────
const OrderCard = ({ order, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md text-left"
  >
    {/* First item image */}
    <img
      src={order.orderItems?.[0]?.image || "https://placehold.co/56x56?text=Img"}
      alt=""
      className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 object-contain"
    />

    {/* Info */}
    <div className="flex-1 min-w-0">
      <p className="text-xs font-mono text-gray-400 mb-0.5">
        #{order._id.slice(-8).toUpperCase()}
      </p>
      <p className="text-sm font-semibold text-gray-800 truncate">
        {order.orderItems?.length === 1
          ? order.orderItems[0].name
          : `${order.orderItems?.[0]?.name} + ${(order.orderItems?.length ?? 1) - 1} more`}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{fmtDate(order.createdAt)}</p>
    </div>

    {/* Right side */}
    <div className="flex flex-col items-end gap-1.5 shrink-0">
      <Pill label={order.orderStatus} map={STATUS_PILL} />
      <span className="text-sm font-bold text-blue-600">{fmt(order.totalPrice)}</span>
    </div>

    <ChevronRight size={16} className="text-gray-300 shrink-0" />
  </button>
);

// ─── Per-item review block (shown only for Delivered orders) ──────────────────
const ItemReviewBlock = ({ item, orderId, userId }) => {
  // item.product is the productId (ObjectId stored in orderItem.product)
  const productId = item.product?._id ?? item.product ?? null;
  const [reviewed, setReviewed]   = useState(false);
  const [checking, setChecking]   = useState(true);

  useEffect(() => {
    if (!productId || !userId) { setChecking(false); return; }
    getProductReviewsApi(productId)
      .then(({ data }) => {
        const found = (data.reviews ?? []).some(
          (r) => r.user?._id?.toString() === userId?.toString()
        );
        setReviewed(found);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [productId, userId]);

  if (!productId || checking) return null;

  return (
    <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/30 p-3">
      <AddReviewFormInline
        productId={productId}
        orderId={orderId}
        alreadyReviewed={reviewed}
        onSuccess={() => setReviewed(true)}
      />
    </div>
  );
};

// ─── Order Detail Panel ───────────────────────────────────────────────────────
const OrderDetail = ({ orderId, onClose, onCancelled }) => {
  useScrollLock(true);
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    getOrderByIdApi(orderId)
      .then(({ data }) => { if (alive) setOrder(data.order); })
      .catch((err) => { if (alive) setError(err?.response?.data?.message ?? "Failed to load order."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const { data } = await cancelOrderApi(orderId);
      setOrder(data.order);
      onCancelled(data.order);
      toast.success("Order cancelled successfully.");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Could not cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  const handleInvoice = async () => {
    setDownloading(true);
    try {
      const response = await downloadInvoiceApi(orderId);
      const url  = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href     = url;
      link.download = `invoice-${orderId.slice(-8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download invoice.");
    } finally {
      setDownloading(false);
    }
  };

  const canCancel =
    order &&
    !["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-mono text-gray-400">
              {order ? `#${order._id.slice(-8).toUpperCase()}` : "Loading…"}
            </p>
            <h2 className="text-base font-bold text-gray-900">Order Details</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">

          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 size={24} className="animate-spin mr-2" /> Loading…
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {order && (
            <>
              {/* Status row */}
              <div className="flex flex-wrap items-center gap-2">
                <Pill label={order.orderStatus}  map={STATUS_PILL} />
                <Pill label={order.paymentStatus} map={PAY_PILL} />
                <span className="ml-auto text-xs text-gray-400">{fmtDate(order.createdAt)}</span>
              </div>

              {/* Items */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Items
                </p>
                <div className="space-y-3">
                  {order.orderItems.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                        <img
                          src={item.image || "https://placehold.co/48x48?text=Img"}
                          alt={item.name}
                          className="h-12 w-12 shrink-0 rounded-lg border border-gray-100 object-contain"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">× {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-700 shrink-0">
                          {fmt(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Review form — only for Delivered orders */}
                      {order.orderStatus === "Delivered" && (
                        <ItemReviewBlock
                          item={item}
                          orderId={orderId}
                          userId={user?._id}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="rounded-xl bg-gray-50 p-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">{fmt(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">{fmt(order.totalPrice)}</span>
                </div>
              </div>

              {/* Payment & Shipping */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <CreditCard size={12} /> Payment
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{order.paymentMethod}</p>
                  {order.paidAt && (
                    <p className="text-xs text-gray-400 mt-0.5">Paid {fmtDate(order.paidAt)}</p>
                  )}
                </div>
                <div className="rounded-xl border border-gray-100 p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <MapPin size={12} /> Delivering to
                  </div>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">
                    {order.shippingAddress?.fullName}
                  </p>
                  <p className="text-xs text-gray-400 leading-snug mt-0.5">
                    {order.shippingAddress?.addressLine1},{" "}
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleInvoice}
                  disabled={downloading}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-60"
                >
                  {downloading
                    ? <Loader2 size={15} className="animate-spin" />
                    : <FileText size={15} />}
                  Get Invoice
                </button>

                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {cancelling
                      ? <Loader2 size={15} className="animate-spin" />
                      : <XCircle size={15} />}
                    Cancel Order
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Orders Page ──────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedId, setSelectedId]   = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyOrdersApi();
      setOrders(data.orders ?? []);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // When an order is cancelled inside the detail panel, patch it in the list
  const handleCancelled = (updated) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updated._id ? { ...o, orderStatus: updated.orderStatus } : o))
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <ShoppingBag size={22} className="text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-400">
            Click an order to view details, cancel or download invoice
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-gray-100 bg-gray-50" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && orders.length === 0 && !error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <ShoppingBag size={44} className="text-gray-200" />
          <p className="text-sm font-medium text-gray-500">No orders yet</p>
          <p className="text-xs text-gray-400">Your placed orders will appear here</p>
        </div>
      )}

      {/* Order list */}
      {!loading && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onClick={() => setSelectedId(order._id)}
            />
          ))}
          <p className="pt-1 text-right text-xs text-gray-400">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Detail modal */}
      {selectedId && (
        <OrderDetail
          orderId={selectedId}
          onClose={() => setSelectedId(null)}
          onCancelled={handleCancelled}
        />
      )}
    </div>
  );
};

export default OrdersPage;
