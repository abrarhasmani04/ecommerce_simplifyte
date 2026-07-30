import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/features/wishlist/wishlistSlice";
import Rating from "./Rating";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  // Check if this product is already in the wishlist (Redux only)
  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((item) => item.productId === product.id)
  );

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
      })
    );
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(
        addToWishlist({
          productId: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
        })
      );
    }
  };

  return (
    <div className="group rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-lg">
      {/* Product image */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="mx-auto h-48 w-full object-contain transition group-hover:scale-105"
        />
      </Link>

      {/* Title */}
      <Link to={`/product/${product.id}`}>
        <h3 className="mt-4 line-clamp-2 text-sm font-semibold hover:text-blue-600">
          {product.title}
        </h3>
      </Link>

      {/* Rating */}
      {product.rating != null && (
        <div className="mt-1">
          <Rating value={product.rating} />
        </div>
      )}

      {/* Price */}
      <div className="mt-2 flex items-center gap-2">
        <p className="text-xl font-bold text-blue-600">${product.price}</p>
        {product.originalPrice && (
          <p className="text-sm text-gray-400 line-through">
            ${product.originalPrice}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 py-2 text-sm text-white transition hover:bg-blue-700"
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
        <button
          onClick={handleWishlistToggle}
          className={`rounded-lg border px-3 transition hover:bg-gray-100 ${
            isWishlisted ? "text-red-500" : "text-gray-500"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} className={isWishlisted ? "fill-red-500" : ""} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
