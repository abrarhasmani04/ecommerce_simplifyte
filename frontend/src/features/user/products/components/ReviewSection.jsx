import { Star, UserCircle2 } from "lucide-react";
import Rating from "./Rating";

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

const ReviewSection = ({ reviews = [], rating = null }) => {
  const total = reviews.length;

  // count per star 1-5
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        Customer Reviews
        {total > 0 && (
          <span className="ml-2 text-base font-normal text-gray-400">
            ({total})
          </span>
        )}
      </h2>

      {total === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
          No reviews yet. Be the first to review this product.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          {/* Summary */}
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <span className="text-5xl font-extrabold text-gray-900">
              {rating != null ? rating.toFixed(1) : "-"}
            </span>
            {rating != null && <Rating value={rating} />}
            <span className="text-xs text-gray-400">{total} reviews</span>
            <div className="mt-2 w-full space-y-1.5">
              {counts.map(({ star, count }) => (
                <StarBar key={star} star={star} count={count} total={total} />
              ))}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <div
                key={review._id ?? i}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <UserCircle2
                    size={36}
                    className="shrink-0 text-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {review.user?.name ?? "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                    <Rating value={review.rating ?? 0} />
                    {review.comment && (
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
