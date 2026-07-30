import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import api from "@/api/axios";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate("/login");

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch {}
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100"
      >
        {/* Avatar */}
        <div className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {initial}
        </div>
        <span className="hidden text-sm font-medium text-gray-700 md:block">
          {user?.name?.split(" ")[0] ?? "Account"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
          {/* User info */}
          <div className="border-b border-gray-100 px-4 pb-3 pt-2">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.email ?? ""}
            </p>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <User size={15} /> My Profile
            </Link>
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <ShoppingBag size={15} /> My Orders
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <Heart size={15} /> Wishlist
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
  );
};

export default ProfileMenu;
