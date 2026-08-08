import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";

import SearchBar from "./navbar/SearchBar";
import ProfileMenu from "./navbar/ProfileMenu";
import CategoryDropdown from "./navbar/CategoryDropdown";
import MobileMenu from "./navbar/MobileMenu";
import Logo from "../common/Logo";

const Navbar = () => {
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <>
      <header
        className="nb-root"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(226,232,240,0.8)",
          boxShadow: "0 1px 0 rgba(226,232,240,0.6), 0 4px 24px rgba(15,23,42,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "0 24px",
            height: "64px",
          }}
        >
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Logo variant="navbar" />
          </div>

          {/* Category dropdown — desktop */}
          <div className="nb-desktop">
            <CategoryDropdown />
          </div>

          {/* Search — desktop */}
          <div className="nb-search nb-desktop">
            <SearchBar />
          </div>

          {/* Right icons — desktop */}
          <div className="nb-desktop" style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="nb-icon-btn"
              title="Wishlist"
            >
              <Heart size={20} strokeWidth={2} />
              {wishlistCount > 0 && (
                <span className="nb-badge nb-badge--red">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="nb-icon-btn"
              title="Cart"
            >
              <ShoppingCart id="cart-icon" size={20} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="nb-badge nb-badge--blue">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div style={{ width: "1px", height: "24px", background: "#e2e8f0", margin: "0 4px" }} />

            <ProfileMenu />
          </div>

          {/* Mobile hamburger */}
          <div className="nb-mobile" style={{ marginLeft: "auto" }}>
            <MobileMenu />
          </div>
        </div>
      </header>

      <style>{`
        .nb-desktop { display: none; }
        @media (min-width: 768px) { .nb-desktop { display: flex; align-items: center; } }
        .nb-mobile { display: flex; }
        @media (min-width: 768px) { .nb-mobile { display: none; } }

        .nb-search { flex: 1; }

        .nb-icon-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          color: #475569;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .nb-icon-btn:hover {
          background: #f1f5f9;
          color: #2563eb;
        }
        .nb-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 16px;
          height: 16px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          line-height: 1;
          border: 1.5px solid #fff;
        }
        .nb-badge--red  { background: #ef4444; }
        .nb-badge--blue { background: #2563eb; }
      `}</style>
    </>
  );
};

export default Navbar;
