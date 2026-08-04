import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import {
  removeCartItem,
  updateCartItemQuantity,
  deleteAllCart,
} from "@/features/user/cart/cartSlice";
import QuantitySelector from "@/features/user/products/components/QuantitySelector";

const EmptyCart = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
    <ShoppingBag size={64} className="text-gray-200" />
    <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
    <p className="text-sm text-gray-400">
      Browse our products and add something you like!
    </p>
    <Link
      to="/products"
      className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      <ArrowRight size={16} />
      Shop Now
    </Link>
  </div>
);

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (item, newQty) => {
    if (!item._id) return;
    dispatch(updateCartItemQuantity({ id: item._id, quantity: newQty }));
  };

  const handleRemove = (item) => {
    if (!item._id) return;
    dispatch(removeCartItem(item._id));
  };

  const handleClearAll = () => {
    dispatch(deleteAllCart());
  };

  if (!loading && items.length === 0) return <EmptyCart />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
        </h1>
        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition hover:text-red-700"
          >
            <Trash2 size={15} />
            Clear All
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ── Item list ── */}
        <div className="lg:col-span-2 space-y-4">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-gray-100 bg-gray-50 p-4 h-28"
                />
              ))
            : items.map((item) => (
                <div
                  key={item._id ?? item.productId}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  {/* Image */}
                  <Link to={`/product/${item.productId}`} className="shrink-0">
                    <img
                      src={
                        item.image || "https://placehold.co/80x80?text=No+Image"
                      }
                      alt={item.title}
                      className="h-20 w-20 rounded-xl object-contain border border-gray-100"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.productId}`}
                        className="line-clamp-2 text-sm font-semibold text-gray-800 hover:text-blue-600 transition"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => handleRemove(item)}
                        className="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <QuantitySelector
                        value={item.quantity}
                        min={1}
                        max={99}
                        disabled={!item._id}
                        onChange={(newQty) =>
                          handleQuantityChange(item, newQty)
                        }
                      />
                      <span className="text-base font-bold text-blue-600">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* ── Order summary ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-gray-800">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>

            <hr className="my-4 border-gray-100" />

            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-blue-600">₹{subtotal.toFixed(2)}</span>
            </div>

            <button
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="mt-3 flex items-center justify-center gap-1.5 text-sm text-gray-400 transition hover:text-blue-600"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
