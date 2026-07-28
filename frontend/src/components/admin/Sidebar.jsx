import { NavLink, useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  ADMIN_NAV_ITEMS,
  ADMIN_NAV_BOTTOM,
  LOGOUT_ITEM,
} from "@/constants/adminNav";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

const Sidebar = ({ collapsed, onCollapse, mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300
    ${
      isActive
        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={linkClass}
      title={collapsed ? item.label : undefined}
    >
      <item.icon
        size={20}
        className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
      />

      {!collapsed && <span className="truncate font-medium">{item.label}</span>}
    </NavLink>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white/90 backdrop-blur-xl">
      {/* Logo */}
      <div className="relative border-b border-slate-200 p-5">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                SimplifyTE
              </h2>

              <p className="text-xs text-slate-500 mt-1">Admin Dashboard</p>
            </div>
          )}

          {/* Desktop Collapse */}
          <button
            onClick={() => onCollapse(!collapsed)}
            className="hidden md:flex w-10 h-10 rounded-xl bg-slate-100 hover:bg-indigo-100 items-center justify-center transition"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close */}
          <button
            onClick={onMobileClose}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-200 p-4 space-y-2">
        {ADMIN_NAV_BOTTOM.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? LOGOUT_ITEM.label : undefined}
          className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <LOGOUT_ITEM.icon
            size={20}
            className="group-hover:rotate-12 transition"
          />

          {!collapsed && (
            <span className="font-medium">{LOGOUT_ITEM.label}</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-screen
        bg-white/90 backdrop-blur-xl border-r border-slate-200 shadow-xl
        transition-all duration-300 z-40
        ${collapsed ? "w-24" : "w-72"}`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72
        bg-white shadow-2xl
        transition-transform duration-300 z-50 md:hidden
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
