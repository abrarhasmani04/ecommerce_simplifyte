import { NavLink, useNavigate } from "react-router-dom";
import { Store, LogOut, LayoutDashboard, Package, ShoppingCart, BarChart2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/redux/authSlice";
import api from "@/services/axios";

const sellerMenu = [
  { title: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard },
  { title: "Products", path: "/seller/products", icon: Package },
  { title: "Orders", path: "/seller/orders", icon: ShoppingCart },
  { title: "Statistics", path: "/seller/statistics", icon: BarChart2 },
];

const SellerSidebar = ({ isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch (_) {}
    dispatch(clearUser());
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`
        h-screen
        bg-white
        border-r
        border-slate-200
        flex-shrink-0
        transition-all
        duration-300
        overflow-hidden

        ${isOpen ? "w-64" : "w-16"}
      `}
    >
      <div
        className={`
          h-full
          flex
          flex-col

          ${isOpen ? "w-64" : "w-16"}
        `}
      >
        {/* Logo */}
        <div
          className={`
            h-20
            border-b
            flex
            items-center

            ${isOpen ? "px-5" : "justify-center"}
          `}
        >
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-2 text-white">
                <Store size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Seller Panel</h2>
                <p className="text-xs text-slate-500">E-Commerce</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <Store size={20} />
            </div>
          )}
        </div>

        {/* Menu */}
        <nav
          className={`
            mt-4
            space-y-1
            flex-1

            ${isOpen ? "px-4" : "px-2"}
          `}
        >
          {sellerMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={!isOpen ? item.title : ""}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  rounded-lg
                  py-3
                  text-sm
                  transition

                  ${isOpen ? "gap-3 px-4" : "justify-center"}

                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }
                  `
                }
              >
                <Icon size={20} />
                {isOpen && <span className="font-medium">{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className={`border-t bg-white p-3 ${!isOpen && "flex justify-center"}`}>
          <button
            onClick={handleLogout}
            title={!isOpen ? "Logout" : ""}
            className={`
              flex items-center gap-2
              rounded-xl
              border border-red-200
              py-3
              font-semibold
              text-red-600
              transition
              hover:bg-red-50

              ${isOpen ? "w-full justify-center px-4" : "justify-center px-3"}
            `}
          >
            <LogOut size={18} />
            {isOpen && "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SellerSidebar;
