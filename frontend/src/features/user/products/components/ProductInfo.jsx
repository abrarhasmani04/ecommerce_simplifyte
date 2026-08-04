import { useRef, useState } from "react";
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/features/user/cart/cartSlice";
import { toggleWishlist } from "@/features/user/wishlist/wishlistSlice";
import { useCartAnimation } from "@/context/CartAnimationContext";
import Rating from "./Rating";
import QuantitySelector from "./QuantitySelector";

const ProductInfo = ({ product }) => {
  const dispatch = useDispatch();
  const { flyToCart } = useCartAnimation();
  const btnRef = useRef(null);
  const [qty, setQty] = useState(1);

  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((item) => item.productId === product._id)
  );

  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  const handleAddToCart = () => {
    flyToCart(product.images?.[0] ?? "", btnRef.current);
    dispatch(
      addToCart({
        productId: product._id,
        title: product.name,
        image: product.images?.[0] ?? "",
        price: product.discountPrice ?? product.price,
        quantity: qty,
      })
    );
  };

  const handleWishlistToggle = () => {
    dispatch(
      toggleWishlist({
        productId: product._id,
        isWishlisted,
        productData: {
          title: product.name,
          image: product.images?.[0] ?? "",
          price: product.discountPrice ?? product.price,
        },
      })
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Category badge */}
      {product.category?.name && (
        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          {product.category.name}
        </span>
      )}

      {/* Title */}
      <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
        {product.name}
      </h1>

      {/* Rating + sold count */}
      <div className="flex items-center gap-3">
        {product.rating != null && <Rating value={product.rating} />}
        {product.soldCount != null && (
          <span className="text-xs text-gray-400">{product.soldCount}+ sold</span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-extrabold text-blue-600">
          ₹{(product.discountPrice ?? product.price).toFixed(2)}
        </span>
        {product.discountPrice && (
          <span className="mb-0.5 text-lg text-gray-400 line-through">
            ₹{product.price.toFixed(2)}
          </span>
        )}
        {discountPercent && (
          <span className="mb-0.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            -{discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Description */}
      {product.description && (
        <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
      )}

      {/* Stock */}
      {product.stock != null && (
        <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
        </p>
      )}

      {/* Quantity + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector
          value={qty}
          onChange={setQty}
          max={product.stock || 99}
        />

        <button
          ref={btnRef}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>

        <button
          onClick={handleWishlistToggle}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
            isWishlisted
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={17} className={isWishlisted ? "fill-red-500" : ""} />
        </button>

        <button
          onClick={handleShare}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
          aria-label="Copy link"
        >
          <Share2 size={17} />
        </button>
      </div>

      {/* Trust badges */}
      <div className="mt-2 grid grid-cols-3 gap-3">
        {[
          { icon: Truck, label: "Free Delivery" },
          { icon: ShieldCheck, label: "Secure Payment" },
          { icon: RotateCcw, label: "Easy Returns" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 py-3 text-center"
          >
            <Icon size={18} className="text-blue-500" />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
