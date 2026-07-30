import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

import SearchBar from "./navbar/SearchBar";
import ProfileMenu from "./navbar/ProfileMenu";
import CategoryDropdown from "./navbar/CategoryDropdown";
import MobileMenu from "./navbar/MobileMenu";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        {/* Logo */}
        <Link to="/home" className="shrink-0 text-2xl font-bold text-blue-600">
          Simplifyte
        </Link>

        {/* Category dropdown — desktop only */}
        <CategoryDropdown />

        {/* Search bar — desktop only */}
        <div className="hidden flex-1 md:flex">
          <SearchBar />
        </div>

        {/* Right icons — desktop only */}
        <div className="hidden items-center gap-5 md:flex">
          <Link to="/wishlist" className="text-gray-600 hover:text-blue-600">
            <Heart size={22} />
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-blue-600">
            <ShoppingCart size={22} />
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
