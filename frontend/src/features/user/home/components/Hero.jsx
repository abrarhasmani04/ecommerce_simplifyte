import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        minHeight: "340px",
        display: "flex",
        alignItems: "center",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* ── full-bleed background photo ── */}
      <img
        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80&auto=format&fit=crop"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
        loading="eager"
      />

      {/* ── gradient overlay: strong left → fades right so photo peeks through ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(248,250,255,0.97) 0%, rgba(248,250,255,0.88) 42%, rgba(248,250,255,0.45) 68%, rgba(248,250,255,0.08) 100%)",
        }}
      />

      {/* ── content sits on top ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "44px 48px",
          maxWidth: "520px",
        }}
        className="hero-content"
      >
        {/* tag pill */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "999px",
            padding: "4px 12px",
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#2563eb",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#22c55e",
              flexShrink: 0,
            }}
          />
          New Season Arrivals
        </span>

        <h1
          style={{
            margin: "0 0 12px",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)",
            lineHeight: 1.2,
            color: "#111827",
          }}
        >
          Shop the Latest{" "}
          <span style={{ color: "#2563eb" }}>Trends</span>
        </h1>

        <p
          style={{
            margin: "0 0 26px",
            fontSize: "0.93rem",
            lineHeight: 1.7,
            color: "#4b5563",
            maxWidth: "380px",
          }}
        >
          Discover premium Electronics, Fashion, Beauty &amp; more — at the
          best prices with fast delivery.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: "9px",
              padding: "10px 22px",
              fontWeight: 600,
              fontSize: "0.88rem",
              textDecoration: "none",
            }}
          >
            Shop Now →
          </Link>
          <Link
            to="/products?sort=discount"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.85)",
              color: "#374151",
              border: "1px solid #e5e7eb",
              borderRadius: "9px",
              padding: "10px 22px",
              fontWeight: 600,
              fontSize: "0.88rem",
              textDecoration: "none",
            }}
          >
            Explore Deals
          </Link>
        </div>

        {/* trust row */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(229,231,235,0.8)",
          }}
        >
          {[
            { v: "50K+", l: "Customers" },
            { v: "10K+", l: "Products" },
            { v: "4.9★", l: "Rating" },
          ].map(({ v, l }) => (
            <div key={l}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "#111827" }}>{v}</p>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "#9ca3af" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* responsive */}
      <style>{`
        @media (max-width: 640px) {
          .hero-content {
            padding: 28px 20px 24px !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
