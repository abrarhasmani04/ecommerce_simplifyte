import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Star, UserCircle2, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Rating from "./Rating";
import {
  addReviewApi,
  getProductReviewsApi,
  updateReviewApi,
  deleteReviewApi,
} from "@/services/reviewApi";

// ─── Star bar ─────────────────────────────────────────────────────────────────
const StarBar = ({ count, total, star }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="w-3 text-right">{star}</span>
      <Star size={11} className="fill-yellow-400 text-yellow-400" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-yellow-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right">{count}</span>
    </div>
  );
};

// ─── Interactive star picker ───────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition"
          aria-label={`${n} star`}
        >
          <Star
            size={22}
            className={
              n <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
};

// ─── Inline edit form ─────────────────────────────────────────────────────────
const EditForm = ({ review, onSave, onCancel }) => {
  const [rating, setRating]   = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [saving, setSaving]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error("Please select a rating."); return; }
    if (!comment.trim()) { toast.error("Comment is required."); return; }
    setSaving(true);
    try {
      const { data } = await updateReviewApi(review._id, { rating, comment });
      toast.success("Review updated.");
      onSave(data.review);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to update review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Update your comment…"
        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Update
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// ─── Review Section ────────────────────────────────────────────────────────────
// productId  — required to fetch reviews from API
// showAddForm / addFormProps — injected by OrdersPage when order is Delivered
const ReviewSection = ({ productId, showAddForm = false, addFormProps = null }) => {
  const { user } = useSelector((state) => state.auth);

  const [reviews, setReviews]       = useState([]);
  const [avgRating, setAvgRating]   = useState(0);
  const [loading, setLoading]       = useState(true);
  const [editingId, setEditingId]   = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const { data } = await getProductReviewsApi(productId);
      setReviews(data.reviews ?? []);
      setAvgRating(data.averageRating ?? 0);
    } catch {
      // silently skip
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async (reviewId, productIdOfReview) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await deleteReviewApi(reviewId);
      toast.success("Review deleted.");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to delete review.");
    }
  };

  const handleEdited = (updated) => {
    setReviews((prev) => prev.map((r) => (r._id === updated._id ? { ...r, ...updated } : r)));
    setEditingId(null);
  };

  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        Customer Reviews
        {total > 0 && (
          <span className="ml-2 text-base font-normal text-gray-400">({total})</span>
        )}
      </h2>

      {/* ── Add-review form injected from OrdersPage ── */}
      {showAddForm && addFormProps && (
        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
          <AddReviewFormInline
            {...addFormProps}
            onSuccess={(newReview) => {
              setReviews((prev) => [newReview, ...prev]);
              if (addFormProps.onSuccess) addFormProps.onSuccess(newReview);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 size={20} className="animate-spin mr-2" /> Loading reviews…
        </div>
      ) : total === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
          No reviews yet. Be the first to review this product.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          {/* Summary */}
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <span className="text-5xl font-extrabold text-gray-900">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </span>
            {avgRating > 0 && <Rating value={avgRating} />}
            <span className="text-xs text-gray-400">{total} reviews</span>
            <div className="mt-2 w-full space-y-1.5">
              {counts.map(({ star, count }) => (
                <StarBar key={star} star={star} count={count} total={total} />
              ))}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {reviews.map((review, i) => {
              const isOwn = user && review.user?._id?.toString() === user._id?.toString();
              return (
                <div
                  key={review._id ?? i}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <UserCircle2 size={36} className="shrink-0 text-gray-300" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-sm font-semibold text-gray-800">
                          {review.user?.name ?? "Anonymous"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                })
                              : ""}
                          </span>
                          {/* Own review actions */}
                          {isOwn && editingId !== review._id && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingId(review._id)}
                                className="rounded-lg p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                title="Edit review"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(review._id)}
                                className="rounded-lg p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                                title="Delete review"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {editingId === review._id ? (
                        <EditForm
                          review={review}
                          onSave={handleEdited}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <>
                          <Rating value={review.rating ?? 0} />
                          {review.comment && (
                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                              {review.comment}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

// ─── Inline add form (used from OrdersPage via props injection) ────────────────
export const AddReviewFormInline = ({ productId, orderId, onSuccess, alreadyReviewed }) => {
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving]   = useState(false);

  if (alreadyReviewed) {
    return (
      <p className="text-sm text-green-600 font-medium">
        ✓ You have already reviewed this product.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating)          { toast.error("Please select a rating."); return; }
    if (!comment.trim())  { toast.error("Comment is required."); return; }
    setSaving(true);
    try {
      const { data } = await addReviewApi({
        productId,
        orderId,
        rating,
        comment,
      });
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      if (onSuccess) onSuccess(data.review);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to submit review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm font-semibold text-gray-800">Write a Review</p>
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share your experience with this product…"
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        Submit Review
      </button>
    </form>
  );
};

export default ReviewSection;
