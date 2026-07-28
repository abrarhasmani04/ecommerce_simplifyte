import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";
import CategoryDropdown from "./CategoryDropdown";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        {/* Logo */}
        <Link
          to="/home"
          className="shrink-0 text-2xl font-bold text-blue-600"
        >
          Simplifyte
        </Link>

        {/* Category Dropdown (desktop) */}
        <CategoryDropdown />

        {/* Search */}
        <div className="hidden flex-1 md:flex">
          <SearchBar />
        </div>

        {/* Right icons (desktop) */}
        <div className="hidden items-center gap-5 md:flex">
          <Link to="/wishlist" className="hover:text-blue-600">
            <Heart size={22} />
          </Link>

          <Link to="/cart" className="hover:text-blue-600">
            <ShoppingCart size={22} />
          </Link>

          <ProfileMenu />
        </div>

        {/* Mobile hamburger */}
        <MobileMenu />
      </div>
    </header>
  );
};

export default Navbar;
