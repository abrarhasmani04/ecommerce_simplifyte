import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, Search, User, Settings, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/redux/authSlice";
import api from "@/services/axios";

const SellerNavbar = ({ onToggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch (_) {}
    dispatch(clearUser());
    navigate("/login", { replace: true });
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "S";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            className="rounded-lg p-2 hover:bg-slate-100"
            onClick={onToggleSidebar}
          >
            <Menu size={24} />
          </button>

          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="w-80 rounded-xl border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Notification */}
          <button className="relative rounded-xl p-2 hover:bg-slate-100">
            <Bell size={22} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Profile dropdown — same style as user ProfileMenu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100"
            >
              <div className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {initial}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 md:block">
                {user?.name?.split(" ")[0] ?? "Seller"}
              </span>
            </button>

            {open && (
              <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                {/* User info */}
                <div className="border-b border-gray-100 px-4 pb-3 pt-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name ?? "Seller"}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {user?.email ?? ""}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/seller/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <Link
                    to="/seller/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Settings size={15} /> Settings
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerNavbar;
