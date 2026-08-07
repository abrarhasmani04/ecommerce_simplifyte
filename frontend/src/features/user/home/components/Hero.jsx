import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, ShieldCheck, Truck, ChevronLeft, ChevronRight, Star, Tag } from "lucide-react";

/* ─── Slide data ─────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    badge: "New Season — 2025",
    badgeColor: "#22c55e",
    headline: ["Discover the Latest", "Trends", "& Deals"],
    accentGradient: "linear-gradient(90deg,#3b82f6,#a78bfa)",
    sub: "Electronics, Fashion, Beauty & more — premium brands at the best prices with fast, secure delivery.",
    cta: { label: "Shop Now", to: "/products" },
    ctaSecondary: { label: "Explore Deals", to: "/products?sort=discount" },
    bg: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80&auto=format&fit=crop",
    orb1: "rgba(59,130,246,0.28)",
    orb2: "rgba(139,92,246,0.20)",
    stats: [{ v: "50K+", l: "Happy Customers" }, { v: "10K+", l: "Products" }, { v: "4.9★", l: "Avg. Rating" }],
  },
  {
    id: 2,
    badge: "Flash Sale Live",
    badgeColor: "#f59e0b",
    headline: ["Unbeatable Prices on", "Electronics", "& Gadgets"],
    accentGradient: "linear-gradient(90deg,#f59e0b,#ef4444)",
    sub: "Grab the hottest deals on smartphones, laptops, and accessories before they're gone.",
    cta: { label: "Shop Now", to: "/products" },
    ctaSecondary: { label: "Explore Deals", to: "/products?sort=discount" },
    bg: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80&auto=format&fit=crop",
    orb1: "rgba(245,158,11,0.28)",
    orb2: "rgba(239,68,68,0.20)",
    stats: [{ v: "72h", l: "Sale Ends In" }, { v: "500+", l: "Deals Active" }, { v: "Up to 60%", l: "Off" }],
  },
  {
    id: 3,
    badge: "Premium Fashion",
    badgeColor: "#ec4899",
    headline: ["Elevate Your Style with", "Exclusive", "Collections"],
    accentGradient: "linear-gradient(90deg,#ec4899,#8b5cf6)",
    sub: "Curated fashion from top global brands. Look stunning every day with our handpicked styles.",
    cta: { label: "Shop Now", to: "/products" },
    ctaSecondary: { label: "Explore Deals", to: "/products?sort=discount" },
    bg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80&auto=format&fit=crop",
    orb1: "rgba(236,72,153,0.28)",
    orb2: "rgba(139,92,246,0.22)",
    stats: [{ v: "2K+", l: "Brands" }, { v: "Daily", l: "New Arrivals" }, { v: "Free", l: "Returns" }],
  },
  {
    id: 4,
    badge: "Beauty & Wellness",
    badgeColor: "#10b981",
    headline: ["Glow Up with", "Premium Beauty", "& Skincare"],
    accentGradient: "linear-gradient(90deg,#10b981,#06b6d4)",
    sub: "Authentic beauty products, skincare essentials, and wellness must-haves from trusted brands.",
    cta: { label: "Shop Now", to: "/products" },
    ctaSecondary: { label: "Explore Deals", to: "/products?sort=discount" },
    bg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&q=80&auto=format&fit=crop",
    orb1: "rgba(16,185,129,0.28)",
    orb2: "rgba(6,182,212,0.20)",
    stats: [{ v: "100%", l: "Authentic" }, { v: "1K+", l: "Beauty Brands" }, { v: "Next Day", l: "Delivery" }],
  },
  {
    id: 5,
    badge: "Home & Living",
    badgeColor: "#6366f1",
    headline: ["Transform Your Home with", "Modern Decor", "& Essentials"],
    accentGradient: "linear-gradient(90deg,#6366f1,#0ea5e9)",
    sub: "Discover furniture, decor, kitchen essentials, and smart home devices to upgrade your living space.",
    cta: { label: "Shop Now", to: "/products" },
    ctaSecondary: { label: "Explore Deals", to: "/products?sort=discount" },
    bg: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80&auto=format&fit=crop",
    orb1: "rgba(99,102,241,0.28)",
    orb2: "rgba(14,165,233,0.20)",
    stats: [{ v: "5K+", l: "Home Products" }, { v: "Exclusive", l: "Designs" }, { v: "Easy", l: "Assembly" }],
  },
];

const PERKS = [
  { Icon: Truck, label: "Free Delivery", sub: "Orders over ₹499" },
  { Icon: ShieldCheck, label: "Secure Payments", sub: "100% protected" },
  { Icon: Zap, label: "Flash Deals", sub: "Every day" },
  { Icon: Star, label: "Top Rated", sub: "4.9★ avg rating" },
  { Icon: Tag, label: "Best Prices", sub: "Price match guarantee" },
];

/* ─── Component ──────────────────────────────────────────────────── */
const Hero = () => {
  const [active, setActive] = useState(0);
  const [animDir, setAnimDir] = useState("next"); // "next" | "prev"
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (idx, dir) => {
      if (isAnimating || idx === active) return;
      setAnimDir(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setActive(idx);
        setIsAnimating(false);
      }, 420);
    },
    [active, isAnimating]
  );

  const next = useCallback(() => {
    goTo((active + 1) % SLIDES.length, "next");
  }, [active, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + SLIDES.length) % SLIDES.length, "prev");
  }, [active, goTo]);

  /* Auto-play */
  useEffect(() => {
    timerRef.current = setInterval(next, 5500);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5500);
  };

  const handleNext = () => { resetTimer(); next(); };
  const handlePrev = () => { resetTimer(); prev(); };
  const handleDot = (i) => { resetTimer(); goTo(i, i > active ? "next" : "prev"); };

  const slide = SLIDES[active];

  return (
    <section
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        background: "#080c14",
        boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {/* ── Slide area ── */}
      <div style={{ position: "relative", minHeight: "460px", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>

        {/* BG image */}
        <img
          key={slide.id}
          src={slide.bg}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 30%",
            opacity: 0.18,
            transition: "opacity 0.42s ease",
            display: "block",
          }}
          loading="eager"
        />

        {/* Dark vignette overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,12,20,0.92) 0%, rgba(8,12,20,0.60) 50%, rgba(8,12,20,0.30) 100%)", pointerEvents: "none" }} />

        {/* Decorative orbs */}
        <div key={`orb1-${slide.id}`} style={{ position: "absolute", top: "-80px", left: "-80px", width: "420px", height: "420px", borderRadius: "50%", background: `radial-gradient(circle, ${slide.orb1} 0%, transparent 70%)`, pointerEvents: "none", transition: "background 0.5s ease" }} />
        <div key={`orb2-${slide.id}`} style={{ position: "absolute", bottom: "-60px", right: "8%", width: "340px", height: "340px", borderRadius: "50%", background: `radial-gradient(circle, ${slide.orb2} 0%, transparent 70%)`, pointerEvents: "none", transition: "background 0.5s ease" }} />

        {/* Slide number tag */}
        <div style={{ position: "absolute", top: "20px", right: "24px", zIndex: 3, display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
            {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── Slide content ── */}
        <div
          className="hero-content"
          style={{
            position: "relative", zIndex: 2,
            padding: "52px 60px 44px",
            animation: isAnimating
              ? animDir === "next" ? "heroSlideOutLeft 0.42s ease forwards" : "heroSlideOutRight 0.42s ease forwards"
              : animDir === "next" ? "heroSlideInRight 0.42s ease forwards" : "heroSlideInLeft 0.42s ease forwards",
          }}
        >
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "5px 14px", marginBottom: "24px", backdropFilter: "blur(8px)" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: slide.badgeColor, flexShrink: 0, boxShadow: `0 0 8px ${slide.badgeColor}` }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{slide.badge}</span>
          </div>

          {/* Headline */}
          <h1 style={{ margin: "0 0 18px", fontWeight: 800, fontSize: "clamp(1.9rem, 4.2vw, 3.1rem)", lineHeight: 1.13, color: "#f1f5f9", maxWidth: "620px" }}>
            {slide.headline[0]}{" "}
            <span style={{ background: slide.accentGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {slide.headline[1]}
            </span>{" "}
            {slide.headline[2]}
          </h1>

          <p style={{ margin: "0 0 32px", fontSize: "0.97rem", lineHeight: 1.75, color: "#94a3b8", maxWidth: "460px" }}>
            {slide.sub}
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "40px" }}>
            <Link
              to={slide.cta.to}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: slide.accentGradient, color: "#fff", borderRadius: "12px", padding: "12px 26px", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", boxShadow: "0 6px 24px rgba(0,0,0,0.4)", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.4)"; }}
            >
              {slide.cta.label} <ArrowRight size={15} />
            </Link>
            <Link
              to={slide.ctaSecondary.to}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.06)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "12px", padding: "12px 26px", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", backdropFilter: "blur(8px)", transition: "background 0.15s ease, border-color 0.15s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.11)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
            >
              {slide.ctaSecondary.label}
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "center" }}>
            {slide.stats.map(({ v, l }, i) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", paddingRight: i < slide.stats.length - 1 ? "28px" : 0, borderRight: i < slide.stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <span style={{ fontWeight: 800, fontSize: "1.18rem", color: "#f1f5f9", lineHeight: 1 }}>{v}</span>
                <span style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "4px", fontWeight: 500 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Arrow buttons ── */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 4, width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", backdropFilter: "blur(8px)", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.18s ease, transform 0.18s ease", outline: "none" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next slide"
          style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 4, width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", backdropFilter: "blur(8px)", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.18s ease, transform 0.18s ease", outline: "none" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
        >
          <ChevronRight size={20} />
        </button>

        {/* ── Dot indicators ── */}
        <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", gap: "8px", alignItems: "center" }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === active ? "28px" : "8px",
                height: "8px",
                borderRadius: "999px",
                background: i === active ? slide.accentGradient : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.35s ease",
                outline: "none",
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.06)", zIndex: 4 }}>
          <div
            key={`prog-${active}`}
            style={{
              height: "100%",
              background: slide.accentGradient,
              animation: "heroProgress 5.5s linear forwards",
            }}
          />
        </div>
      </div>

      {/* ── Perks bar ── */}
      <div
        className="hero-perks"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexWrap: "wrap", background: "rgba(255,255,255,0.02)" }}
      >
        {PERKS.map(({ Icon, label, sub }, i) => (
          <div
            key={label}
            style={{ flex: "1 1 140px", display: "flex", alignItems: "center", gap: "11px", padding: "15px 22px", borderLeft: i !== 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
          >
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={16} color="#60a5fa" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8rem", color: "#e2e8f0" }}>{label}</p>
              <p style={{ margin: 0, fontSize: "0.68rem", color: "#475569" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes heroSlideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes heroSlideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes heroSlideOutLeft {
          from { opacity: 1; transform: translateX(0);    }
          to   { opacity: 0; transform: translateX(-40px);}
        }
        @keyframes heroSlideOutRight {
          from { opacity: 1; transform: translateX(0);   }
          to   { opacity: 0; transform: translateX(40px);}
        }
        @keyframes heroProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }

        @media (max-width: 640px) {
          .hero-content { padding: 32px 20px 44px !important; }
          .hero-perks > div { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.05); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
