import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Heart, LogOut, Store, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import api from "@/services/axios";

const MENU_ITEMS = [
  { to: "/profile",  Icon: User,        label: "My Profile" },
  { to: "/orders",   Icon: ShoppingBag, label: "My Orders" },
  { to: "/wishlist", Icon: Heart,       label: "Wishlist" },
];

const ROLE_COLORS = {
  admin:  { bg: "#fef3c7", color: "#92400e", label: "Admin" },
  seller: { bg: "#dbeafe", color: "#1e40af", label: "Seller" },
  user:   { bg: "#dcfce7", color: "#166534", label: "Customer" },
};

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try { await api.post("/user/logout"); } catch {}
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";
  const firstName = user?.name?.split(" ")[0] ?? "Account";
  const role = user?.role?.toLowerCase() ?? "user";
  const roleStyle = ROLE_COLORS[role] ?? ROLE_COLORS.user;

  return (
    <>
      <div className="relative" ref={ref}>
        {/* Trigger */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="pm-trigger"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 10px 5px 5px",
            borderRadius: "12px",
            border: `1.5px solid ${open ? "#2563eb" : "#e2e8f0"}`,
            background: open ? "#eff6ff" : "#f8fafc",
            cursor: "pointer",
            transition: "border-color 0.15s, background 0.15s",
          }}
        >
          {/* Avatar */}
          <div style={{
            width: "32px", height: "32px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem", fontWeight: 800, color: "#fff",
            flexShrink: 0, userSelect: "none",
          }}>
            {initial}
          </div>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: open ? "#2563eb" : "#374151", whiteSpace: "nowrap" }}>
            {firstName}
          </span>
          <ChevronDown
            size={13}
            color={open ? "#2563eb" : "#94a3b8"}
            strokeWidth={2.5}
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s" }}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 10px)",
            zIndex: 50,
            width: "232px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            boxShadow: "0 16px 48px rgba(15,23,42,0.14)",
            overflow: "hidden",
          }}>
            {/* User info header */}
            <div style={{
              padding: "16px",
              background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", fontWeight: 800, color: "#fff",
                flexShrink: 0,
              }}>
                {initial}
              </div>
              <div style={{ overflow: "hidden" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.name ?? "User"}
                </p>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.email ?? ""}
                </p>
                <span style={{ display: "inline-block", marginTop: "4px", fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", borderRadius: "999px", background: roleStyle.bg, color: roleStyle.color }}>
                  {roleStyle.label}
                </span>
              </div>
            </div>

            {/* Nav links */}
            <div style={{ padding: "6px" }}>
              {MENU_ITEMS.map(({ to, Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="pm-item"
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px", borderRadius: "12px",
                    fontSize: "0.83rem", fontWeight: 500, color: "#374151",
                    textDecoration: "none",
                    transition: "background 0.13s, color 0.13s",
                  }}
                >
                  <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={15} color="#475569" />
                  </div>
                  {label}
                </Link>
              ))}

              {role === "user" && (
                <Link
                  to="/become-seller"
                  onClick={() => setOpen(false)}
                  className="pm-item"
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px", borderRadius: "12px",
                    fontSize: "0.83rem", fontWeight: 500, color: "#374151",
                    textDecoration: "none",
                    transition: "background 0.13s, color 0.13s",
                  }}
                >
                  <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Store size={15} color="#475569" />
                  </div>
                  Become a Seller
                </Link>
              )}
            </div>

            {/* Logout */}
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "6px" }}>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  width: "100%", padding: "10px 12px", borderRadius: "12px",
                  fontSize: "0.83rem", fontWeight: 600, color: "#ef4444",
                  background: "none", border: "none", cursor: "pointer",
                  transition: "background 0.13s",
                }}
                className="pm-logout"
              >
                <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <LogOut size={15} color="#ef4444" />
                </div>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .pm-trigger:hover { border-color: #cbd5e1 !important; background: #f1f5f9 !important; }
        .pm-item:hover { background: #f8fafc !important; color: #2563eb !important; }
        .pm-item:hover > div { background: #eff6ff !important; }
        .pm-logout:hover { background: #fff5f5 !important; }
      `}</style>
    </>
  );
};

export default ProfileMenu;
