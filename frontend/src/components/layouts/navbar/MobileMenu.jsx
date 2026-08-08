import { useState } from "react";
import useScrollLock from "@/hooks/useScrollLock";
import { Menu, X, Home, ShoppingCart, Heart, User, Package, LogOut, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";

const NAV_LINKS = [
  { to: "/home",     Icon: Home,         label: "Home",      color: "#2563eb" },
  { to: "/cart",     Icon: ShoppingCart, label: "Cart",      color: "#8b5cf6" },
  { to: "/wishlist", Icon: Heart,        label: "Wishlist",  color: "#ef4444" },
  { to: "/orders",   Icon: Package,      label: "My Orders", color: "#f59e0b" },
  { to: "/profile",  Icon: User,         label: "Profile",   color: "#10b981" },
];

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  useScrollLock(open);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const user = useSelector((state) => state.auth.user);
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  };

  return (
    <>
      <div>
        {/* Hamburger */}
        <button
          onClick={() => setOpen((p) => !p)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "40px", height: "40px", borderRadius: "12px",
            border: "1.5px solid #e2e8f0", background: "#f8fafc",
            color: "#475569", cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
        </button>

        {/* Backdrop */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(15,23,42,0.5)",
              backdropFilter: "blur(2px)",
            }}
          />
        )}

        {/* Slide-in drawer */}
        <div style={{
          position: "fixed", left: 0, top: 0, zIndex: 50,
          height: "100%", width: "280px",
          background: "#fff",
          boxShadow: "8px 0 40px rgba(15,23,42,0.18)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          display: "flex", flexDirection: "column",
        }}>
          {/* Drawer header */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
            padding: "20px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.9rem", fontWeight: 800, color: "#fff",
              }}>
                {initial}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem", color: "#fff" }}>
                  {user?.name?.split(" ")[0] ?? "Welcome"}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                  <Zap size={10} color="#fbbf24" fill="#fbbf24" />
                  <span style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 500 }}>TrendWave</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "32px", height: "32px", borderRadius: "9px",
                background: "rgba(255,255,255,0.1)", border: "none",
                color: "#94a3b8", cursor: "pointer",
              }}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
            {NAV_LINKS.map(({ to, Icon, label, color }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "11px 14px", borderRadius: "12px", marginBottom: "2px",
                    fontSize: "0.86rem", fontWeight: active ? 700 : 500,
                    color: active ? "#fff" : "#374151",
                    background: active ? color : "transparent",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  className={`mm-link ${!active ? "mm-link--idle" : ""}`}
                >
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "9px",
                    background: active ? "rgba(255,255,255,0.2)" : "#f8fafc",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, position: "relative",
                  }}>
                    <Icon size={17} strokeWidth={2} color={active ? "#fff" : color} />
                    {to === "/cart" && cartCount > 0 && (
                      <span style={{
                        position: "absolute", top: "-4px", right: "-4px",
                        minWidth: "16px", height: "16px", borderRadius: "999px",
                        background: "#ef4444", color: "#fff",
                        fontSize: "9px", fontWeight: 800,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "0 3px", border: "1.5px solid #fff",
                      }}>
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </div>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "10px" }}>
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                width: "100%", padding: "11px 14px", borderRadius: "12px",
                fontSize: "0.86rem", fontWeight: 600, color: "#ef4444",
                background: "none", border: "none", cursor: "pointer",
                transition: "background 0.15s",
              }}
              className="mm-logout"
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <LogOut size={17} strokeWidth={2} color="#ef4444" />
              </div>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .mm-link--idle:hover { background: #f8fafc !important; }
        .mm-logout:hover { background: #fff5f5 !important; }
      `}</style>
    </>
  );
};

export default MobileMenu;
