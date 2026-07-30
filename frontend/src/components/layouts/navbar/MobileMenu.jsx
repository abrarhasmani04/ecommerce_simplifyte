import { useState } from "react";
import { Menu, X, Home, ShoppingCart, Heart, User, Package, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";

const NAV_LINKS = [
  { to: "/home",     icon: Home,         label: "Home" },
  { to: "/cart",     icon: ShoppingCart, label: "Cart" },
  { to: "/wishlist", icon: Heart,        label: "Wishlist" },
  { to: "/orders",   icon: Package,      label: "My Orders" },
  { to: "/profile",  icon: User,         label: "Profile" },
];

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-xl transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="text-xl font-bold text-blue-600">Simplifyte</span>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                  ${active
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut size={18} className="shrink-0" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
