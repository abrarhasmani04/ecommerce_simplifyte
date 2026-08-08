import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import Rating from "./Rating";

const RelatedProducts = ({ products = [] }) => {
  const dispatch = useDispatch();

  if (!products.length) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-5 text-xl font-bold text-gray-900">Related Products</h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <div
            key={p._id}
            className="group w-48 shrink-0 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md"
          >
            {/* Image */}
            <Link to={`/product/${p._id}`}>
              <div className="overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={p.images?.[0] || null}
                  alt={p.name}
                  className="h-36 w-full object-contain p-2 transition group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Title */}
            <Link to={`/product/${p._id}`}>
              <p className="mt-2 line-clamp-2 text-xs font-semibold text-gray-800 hover:text-blue-600 leading-snug">
                {p.name}
              </p>
            </Link>

            {/* Rating */}
            {p.rating != null && (
              <div className="mt-1">
                <Rating value={p.rating} />
              </div>
            )}

            {/* Price */}
            <p className="mt-1 text-sm font-bold text-blue-600">
              ₹{(p.discountPrice ?? p.price).toFixed(2)}
            </p>

            {/* Add to cart */}
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    productId: p._id,
                    title: p.name,
                    image: p.images?.[0] ?? "",
                    price: p.discountPrice ?? p.price,
                    quantity: 1,
                  })
                )
              }
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-blue-600 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              <ShoppingCart size={13} />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
