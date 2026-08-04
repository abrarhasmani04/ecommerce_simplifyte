import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { toggleWishlist } from "@/features/user/wishlist/wishlistSlice";
import { addToCart } from "@/features/user/cart/cartSlice";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  const handleRemove = (item) => {
    dispatch(toggleWishlist({ productId: item.productId, isWishlisted: true, productData: item }));
  };

  const handleMoveToCart = (item) => {
    dispatch(
      addToCart({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: 1,
      })
    );
    dispatch(toggleWishlist({ productId: item.productId, isWishlisted: true, productData: item }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading wishlist…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Heart size={24} className="text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        {items.length > 0 && (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-600">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
          <Heart size={48} className="text-gray-300" />
          <div>
            <p className="text-lg font-semibold text-gray-700">Your wishlist is empty</p>
            <p className="mt-1 text-sm text-gray-400">
              Browse products and click the heart icon to save them here.
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              {/* Image */}
              <Link to={`/product/${item.productId}`} className="shrink-0">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  className="h-20 w-20 rounded-lg object-contain"
                />
              </Link>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <Link
                  to={`/product/${item.productId}`}
                  className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-blue-600"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-base font-bold text-blue-600">
                  ₹{item.price?.toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  <ShoppingCart size={14} />
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>
                <button
                  onClick={() => handleRemove(item)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={14} />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
