import { useState } from "react";
import { toast } from "react-toastify";
import { Mail, Gift, Bell, Tag } from "lucide-react";

const PERKS = [
  { Icon: Gift, label: "Exclusive deals" },
  { Icon: Bell, label: "New arrivals first" },
  { Icon: Tag, label: "Members-only offers" },
];

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You've subscribed to our newsletter!");
    setEmail("");
  };

  return (
    <section
      style={{
        marginTop: "60px",
        borderRadius: "24px",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        position: "relative",
      }}
    >
      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-40px", left: "5%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, padding: "52px 40px", textAlign: "center" }}>
        {/* Icon */}
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "16px", background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.3)", marginBottom: "20px" }}>
          <Mail size={26} color="#60a5fa" />
        </div>

        <h2 style={{ margin: "0 0 10px", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#f8fafc" }}>
          Stay in the Loop
        </h2>
        <p style={{ margin: "0 0 28px", fontSize: "1rem", color: "#94a3b8", maxWidth: "440px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
          Join 50,000+ shoppers and get exclusive deals, new arrivals, and member-only offers straight to your inbox.
        </p>

        {/* Perks */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
          {PERKS.map(({ Icon, label }) => (
            <div key={label} style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px", padding: "6px 14px" }}>
              <Icon size={14} color="#818cf8" />
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#c7d2fe" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", maxWidth: "460px", margin: "0 auto", gap: "0", borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "none", outline: "none", padding: "14px 20px", fontSize: "0.88rem", color: "#f1f5f9", backdropFilter: "blur(10px)" }}
          />
          <button
            type="submit"
            style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", border: "none", padding: "14px 24px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Subscribe
          </button>
        </form>

        <p style={{ marginTop: "16px", fontSize: "0.72rem", color: "#475569" }}>
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
