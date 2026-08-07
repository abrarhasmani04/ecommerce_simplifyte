import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight, TrendingUp } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { toast } from "react-toastify";

const SHOP_LINKS = [
  { to: "/products",         label: "All Products"  },
  { to: "/wishlist",         label: "Wishlist"      },
  { to: "/cart",             label: "Cart"          },
];

const CUSTOMER_LINKS = [
  { to: "/profile",  label: "My Profile"  },
  { to: "/orders",   label: "My Orders"   },
];

const SOCIAL = [
  { Icon: FaFacebookF, color: "#1877f2", label: "Facebook" },
  { Icon: FaXTwitter,  color: "#000000", label: "Twitter"  },
  { Icon: FaInstagram, color: "#e1306c", label: "Instagram" },
  { Icon: FaLinkedinIn,color: "#0a66c2", label: "LinkedIn"  },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed to newsletter!");
    setEmail("");
  };

  return (
    <>
      {/* ── Main footer ── */}
      <footer style={{ background: "#0b0f1a", color: "#94a3b8" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 24px 0" }}>

          {/* ── Top grid ── */}
          <div className="ft-grid">

            {/* Brand column */}
            <div className="ft-brand">
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <TrendingUp size={20} color="#fff" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>TrendWave</span>
              </div>

              <p style={{ fontSize: "0.84rem", lineHeight: 1.75, color: "#64748b", maxWidth: "300px", marginBottom: "24px" }}>
                A modern multi-vendor e-commerce platform where customers discover quality products from trusted sellers — secure, fast, and seamless.
              </p>

              {/* Contact */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { Icon: MapPin, text: "Bhavnagar, Gujarat, India" },
                  { Icon: Phone,  text: "+91 99048 58858" },
                  { Icon: Mail,   text: "support@trendwave.com" },
                ].map(({ Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "8px",
                      background: "rgba(37,99,235,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={14} color="#3b82f6" />
                    </div>
                    <span style={{ fontSize: "0.82rem" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 style={{ margin: "0 0 20px", fontSize: "0.88rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Shop</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
                {SHOP_LINKS.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="ft-link"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.84rem", color: "#64748b", textDecoration: "none", transition: "color 0.15s" }}
                    >
                      <ArrowRight size={12} style={{ opacity: 0 }} className="ft-arrow" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer */}
            <div>
              <h3 style={{ margin: "0 0 20px", fontSize: "0.88rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Customer</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
                {CUSTOMER_LINKS.map(({ to, href, label }) => (
                  <li key={label}>
                    {to ? (
                      <Link
                        to={to}
                        className="ft-link"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.84rem", color: "#64748b", textDecoration: "none", transition: "color 0.15s" }}
                      >
                        <ArrowRight size={12} style={{ opacity: 0 }} className="ft-arrow" />
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="ft-link"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.84rem", color: "#64748b", textDecoration: "none", transition: "color 0.15s" }}
                      >
                        <ArrowRight size={12} style={{ opacity: 0 }} className="ft-arrow" />
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter + Social */}
            <div>
              <h3 style={{ margin: "0 0 12px", fontSize: "0.88rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>Stay Updated</h3>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "14px", lineHeight: 1.6 }}>
                Get exclusive deals and new arrivals in your inbox.
              </p>

              <form onSubmit={handleSubscribe} style={{ display: "flex", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "24px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.05)", border: "none", outline: "none",
                    padding: "11px 14px", fontSize: "0.8rem", color: "#f1f5f9",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff",
                    border: "none", padding: "0 16px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </form>

              {/* Social icons */}
              <div style={{ display: "flex", gap: "8px" }}>
                {SOCIAL.map(({ Icon, color, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="ft-social"
                    style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#64748b", textDecoration: "none",
                      transition: "background 0.18s, color 0.18s, border-color 0.18s",
                      "--hover-color": color,
                    }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{
            marginTop: "48px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "20px 0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569" }}>
              © {new Date().getFullYear()}{" "}
              <span style={{ fontWeight: 700, color: "#94a3b8" }}>TrendWave</span>.
              {" "}All rights reserved.
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {["Privacy Policy", "Terms & Conditions", "Contact Us"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="ft-bottom-link"
                  style={{ fontSize: "0.78rem", color: "#475569", textDecoration: "none", transition: "color 0.15s" }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .ft-grid { display: grid; gap: 40px; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .ft-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .ft-grid { grid-template-columns: 2fr 1fr 1fr 1.4fr; } }
        .ft-brand { grid-column: 1 / -1; }
        @media (min-width: 1024px) { .ft-brand { grid-column: auto; } }

        .ft-link:hover { color: #fff !important; }
        .ft-link:hover .ft-arrow { opacity: 1 !important; color: #3b82f6; }

        .ft-social:hover { background: rgba(255,255,255,0.12) !important; border-color: rgba(255,255,255,0.16) !important; color: #fff !important; }
        .ft-bottom-link:hover { color: #e2e8f0 !important; }
      `}</style>
    </>
  );
};

export default Footer;
