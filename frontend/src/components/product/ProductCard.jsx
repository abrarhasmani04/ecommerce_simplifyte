import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const ProductCard = ({ product }) => {
  return (
    <div className="group rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-lg">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="mx-auto h-48 w-full object-contain transition group-hover:scale-105"
        />
      </Link>

      <Link to={`/product/${product.id}`}>
        <h3 className="mt-4 line-clamp-2 text-sm font-semibold hover:text-blue-600">
          {product.title}
        </h3>
      </Link>

      {product.rating != null && (
        <div className="mt-1">
          <Rating value={product.rating} />
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <p className="text-xl font-bold text-blue-600">${product.price}</p>
        {product.originalPrice && (
          <p className="text-sm text-gray-400 line-through">
            ${product.originalPrice}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 py-2 text-sm text-white hover:bg-blue-700">
          <ShoppingCart size={16} /> Add to Cart
        </button>

        <button className="rounded-lg border px-3 hover:bg-gray-100">
          <Heart size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
