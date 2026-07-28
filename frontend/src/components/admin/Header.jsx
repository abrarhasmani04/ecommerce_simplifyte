import { Menu, Bell, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ADMIN_NAV_ITEMS, ADMIN_NAV_BOTTOM } from "@/constants/adminNav";

const allNavItems = [...ADMIN_NAV_ITEMS, ...ADMIN_NAV_BOTTOM];

const getPageTitle = (pathname) => {
  const match = allNavItems.find((item) => item.path === pathname);
  return match ? match.label : "Admin";
};

const AdminHeader = ({ onMenuToggle }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user);

  const title = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-white/40 shadow-sm">
      <div className="h-20 px-5 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            onClick={onMenuToggle}
            className="md:hidden w-11 h-11 rounded-xl bg-slate-100 hover:bg-indigo-100 transition-all flex items-center justify-center"
          >
            <Menu size={20} />
          </button>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>

            <p className="text-sm text-slate-500">Welcome back 👋</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-2 w-72">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent outline-none w-full text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Notification */}
          <button className="relative w-11 h-11 rounded-2xl bg-slate-100 hover:bg-indigo-100 transition-all flex items-center justify-center">
            <Bell size={20} className="text-slate-700" />

            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-3 bg-slate-100 rounded-2xl pl-2 pr-4 py-2 hover:bg-indigo-50 transition-all cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white font-bold flex items-center justify-center">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="hidden md:block">
              <h4 className="font-semibold text-slate-800">
                {user?.name || "Admin"}
              </h4>

              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
