import { useRef, useState } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "@/redux/cartSlice";
import { toggleWishlist } from "@/redux/wishlistSlice";
import { useCartAnimation } from "@/context/CartAnimationContext";
import Rating from "./Rating";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { flyToCart } = useCartAnimation();
  const btnRef = useRef(null);
  const [adding, setAdding] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const isWishlisted = useSelector((state) =>
    state.wishlist.items.some((item) => item.productId === product.id)
  );

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }
    flyToCart(product.image, btnRef.current);
    setAdding(true);
    setTimeout(() => setAdding(false), 700);
    dispatch(
      addToCart({
        productId: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
      })
    );
    toast.success(`"${product.title}" added to cart.`);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      toggleWishlist({
        productId: product.id,
        isWishlisted,
        productData: {
          title: product.title,
          image: product.image,
          price: product.price,
        },
      })
    );
    toast.success(isWishlisted ? "Removed from wishlist." : "Added to wishlist.");
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <>
      <div className="pcard">
        {/* ── Image zone ── */}
        <div className="pcard__img-wrap">
          <Link to={`/product/${product.id}`} className="pcard__img-link" tabIndex={-1}>
            <img
              src={product.image || null}
              alt={product.title}
              className="pcard__img"
            />
          </Link>

          {/* Top badges row */}
          <div className="pcard__badges">
            {discount && (
              <span className="pcard__badge pcard__badge--sale">-{discount}%</span>
            )}
          </div>

          {/* Wishlist pill — always visible on mobile, hover on desktop */}
          <button
            onClick={handleWishlistToggle}
            className={`pcard__wish ${isWishlisted ? "pcard__wish--active" : ""}`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={15}
              strokeWidth={2.2}
              fill={isWishlisted ? "#ef4444" : "none"}
              color={isWishlisted ? "#ef4444" : "#64748b"}
            />
          </button>

          {/* Quick-view overlay on hover */}
          <div className="pcard__overlay">
            <Link
              to={`/product/${product.id}`}
              className="pcard__ov-btn"
              title="Quick view"
            >
              <Eye size={16} strokeWidth={2} color="#1e293b" />
              <span>Quick View</span>
            </Link>
          </div>
        </div>

        {/* ── Info zone ── */}
        <div className="pcard__body">
          {/* Title */}
          <Link to={`/product/${product.id}`} className="pcard__title-link">
            <h3 className="pcard__title">{product.title}</h3>
          </Link>

          {/* Rating */}
          {product.rating != null && (
            <div className="pcard__rating">
              <Rating value={product.rating} />
            </div>
          )}

          {/* Price row */}
          <div className="pcard__price-row">
            <span className="pcard__price">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <span className="pcard__orig">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            )}
            {discount && (
              <span className="pcard__saving">{discount}% off</span>
            )}
          </div>

          {/* CTA */}
          <button
            ref={btnRef}
            onClick={handleAddToCart}
            className={`pcard__cta ${adding ? "pcard__cta--adding" : ""}`}
          >
            <ShoppingCart size={15} strokeWidth={2.5} />
            <span>{adding ? "Added!" : "Add to Cart"}</span>
          </button>
        </div>
      </div>

      {/* Scoped styles — injected once per card, browser deduplicates identical <style> content */}
      <style>{`
        .pcard {
          position: relative;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #e8edf2;
          overflow: hidden;
          transition: box-shadow 0.22s ease, transform 0.22s ease;
          height: 100%;
        }
        .pcard:hover {
          box-shadow: 0 12px 36px rgba(15,23,42,0.11);
          transform: translateY(-4px);
        }

        /* ── Image zone ── */
        .pcard__img-wrap {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #f8fafc, #f1f5f9);
          aspect-ratio: 1 / 1;
          flex-shrink: 0;
        }
        .pcard__img-link { display: block; width: 100%; height: 100%; }
        .pcard__img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 14px;
          display: block;
          transition: transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .pcard:hover .pcard__img { transform: scale(1.07); }

        /* Badges */
        .pcard__badges {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pcard__badge {
          display: inline-flex;
          align-items: center;
          border-radius: 7px;
          padding: 3px 8px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          line-height: 1;
        }
        .pcard__badge--sale {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          box-shadow: 0 2px 8px rgba(239,68,68,0.35);
        }

        /* Wishlist button */
        .pcard__wish {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 0.2s, transform 0.2s, background 0.15s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .pcard:hover .pcard__wish,
        .pcard__wish--active {
          opacity: 1;
          transform: scale(1);
        }
        .pcard__wish:hover { background: #fff5f5; }
        .pcard__wish--active { background: #fff5f5; border-color: #fecaca; }

        /* Hover overlay */
        .pcard__overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px;
          background: linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 100%);
          display: flex;
          justify-content: center;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.22s, transform 0.22s;
        }
        .pcard:hover .pcard__overlay {
          opacity: 1;
          transform: translateY(0);
        }
        .pcard__ov-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          border-radius: 10px;
          padding: 7px 16px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #1e293b;
          text-decoration: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
          transition: background 0.15s;
        }
        .pcard__ov-btn:hover { background: #fff; }

        /* ── Body ── */
        .pcard__body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 6px;
        }

        /* Title */
        .pcard__title-link { text-decoration: none; }
        .pcard__title {
          font-size: 0.83rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
          transition: color 0.15s;
        }
        .pcard__title-link:hover .pcard__title { color: #2563eb; }

        /* Rating */
        .pcard__rating { margin-top: 2px; }

        /* Price */
        .pcard__price-row {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: auto;
          padding-top: 6px;
        }
        .pcard__price {
          font-size: 1.12rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .pcard__orig {
          font-size: 0.76rem;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }
        .pcard__saving {
          font-size: 0.68rem;
          font-weight: 700;
          color: #16a34a;
          background: #f0fdf4;
          border-radius: 5px;
          padding: 2px 6px;
        }

        /* CTA button */
        .pcard__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          margin-top: 10px;
          padding: 10px 0;
          border: none;
          border-radius: 12px;
          background: #0f172a;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.18s, transform 0.12s;
          letter-spacing: 0.01em;
        }
        .pcard__cta:hover { background: #1e293b; }
        .pcard__cta:active { transform: scale(0.97); }
        .pcard__cta--adding {
          background: #16a34a !important;
        }
      `}</style>
    </>
  );
};

export default ProductCard;
