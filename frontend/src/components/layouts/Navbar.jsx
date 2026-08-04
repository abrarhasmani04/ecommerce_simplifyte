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
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        {/* Logo */}
        <div className="shrink-0">
          <Logo variant="navbar" />
        </div>

        {/* Category dropdown — desktop only */}
        <CategoryDropdown />

        {/* Search bar — desktop only */}
        <div className="hidden flex-1 md:flex">
          <SearchBar />
        </div>

        {/* Right icons — desktop only */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/wishlist"
            className="relative text-gray-600 hover:text-blue-600"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold leading-none text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-blue-600"
          >
            <ShoppingCart id="cart-icon" size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold leading-none text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <ProfileMenu />
        </div>

        {/* Hamburger — mobile only */}
        <MobileMenu />
      </div>
    </header>
  );
};

export default Navbar;
