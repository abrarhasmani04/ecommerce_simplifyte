import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Tags,
  UserCheck,
  BarChart3,
  TrendingUp,
  Store,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import api from "@/services/axios";

const menuItems = [
  { name: "Dashboard",           path: "/admin/dashboard",     icon: LayoutDashboard },
  { name: "Products",            path: "/admin/products",      icon: Package },
  { name: "Categories",          path: "/admin/categories",    icon: Tags },
  { name: "Orders",              path: "/admin/orders",        icon: ShoppingCart },
  { name: "Monthly Sales",       path: "/admin/monthly-sales", icon: TrendingUp },
  { name: "Users",               path: "/admin/users",         icon: Users },
  { name: "Sellers",             path: "/admin/sellers",       icon: Store },
  { name: "Seller Applications", path: "/admin/applications",  icon: UserCheck },
  { name: "Statistics",          path: "/admin/statistics",    icon: BarChart3 },
  { name: "Settings",            path: "/admin/settings",      icon: Settings },
];

const AdminSidebar = ({ isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch (_) {}
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`h-screen bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-300 overflow-hidden ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className={`h-full flex flex-col ${isOpen ? "w-64" : "w-16"}`}>

        {/* Logo */}
        <div
          className={`h-20 border-b flex items-center ${
            isOpen ? "px-5" : "justify-center"
          }`}
        >
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-2 text-white">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Admin Panel</h2>
                <p className="text-xs text-slate-500">Simplifyte</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <LayoutDashboard size={20} />
            </div>
          )}
        </div>

        {/* Menu */}
        <nav
          className={`mt-4 space-y-1 flex-1 ${isOpen ? "px-4" : "px-2"}`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                title={!isOpen ? item.name : ""}
                className={({ isActive }) =>
                  `flex items-center rounded-lg py-3 text-sm transition ${
                    isOpen ? "gap-3 px-4" : "justify-center"
                  } ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={20} />
                {isOpen && <span className="font-medium">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className={`border-t bg-white p-3 ${!isOpen && "flex justify-center"}`}>
          <button
            onClick={handleLogout}
            title={!isOpen ? "Logout" : ""}
            className={`flex items-center gap-2 rounded-xl border border-red-200 py-3 font-semibold text-red-600 transition hover:bg-red-50 ${
              isOpen ? "w-full justify-center px-4" : "justify-center px-3"
            }`}
          >
            <LogOut size={18} />
            {isOpen && "Logout"}
          </button>
        </div>

      </div>
    </aside>
  );
};

export default AdminSidebar;
