import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { TrendingUp, ShoppingBag, Star, Shield, Truck, Zap } from "lucide-react";
import heroImg from "../assets/hero.png";
import { ROUTES } from "../constants/routes";

const AuthLayout = () => {
  return (
    <div className="al-root">

      {/* ══════════════════════════════════════
          LEFT PANEL
      ══════════════════════════════════════ */}
      <div className="al-left">

        {/* Animated background orbs */}
        <div className="al-orb al-orb-1" />
        <div className="al-orb al-orb-2" />
        <div className="al-orb al-orb-3" />

        {/* Top logo */}
        <div className="al-top-logo">
          <Link to={ROUTES.HOME} style={{ textDecoration: "none" }}>
            <div className="al-brand">
              <div className="al-brand-icon">
                <TrendingUp size={18} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="al-brand-name">
                Trend<span className="al-brand-wave">Wave</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Centre content */}
        <div className="al-centre">
          {/* Animated badge */}
          <div className="al-badge">
            <span className="al-badge-dot" />
            <span>India's fastest growing marketplace</span>
          </div>

          <h1 className="al-headline">
            Ride the wave<br />
            <span className="al-headline-accent">of trends.</span>
          </h1>

          <p className="al-subtext">
            Discover millions of trending products from trusted sellers — delivered fast, with zero compromise.
          </p>

          {/* Floating illustration card */}
          <div className="al-illustration-wrap">
            <div className="al-illustration-ring al-ring-1" />
            <div className="al-illustration-ring al-ring-2" />
            <div className="al-illustration-glow" />
            <img src={heroImg} alt="Shopping illustration" className="al-illustration" />

            {/* Floating micro-cards */}
            <div className="al-floatcard al-floatcard-tl">
              <Zap size={12} color="#f59e0b" />
              <span>Flash Sale</span>
              <span className="al-floatcard-pill">-40%</span>
            </div>
            <div className="al-floatcard al-floatcard-br">
              <ShoppingBag size={12} color="#2563eb" />
              <span>Order placed!</span>
            </div>
          </div>

          {/* Stats */}
          <div className="al-stats">
            {[
              { value: "2M+",  label: "Products" },
              { value: "50K+", label: "Sellers"  },
              { value: "4.9★", label: "Rating"   },
            ].map(({ value, label }) => (
              <div key={label} className="al-stat">
                <span className="al-stat-value">{value}</span>
                <span className="al-stat-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Trust chips */}
          <div className="al-chips">
            {[
              { Icon: Shield, text: "Secure Payments" },
              { Icon: Truck,  text: "Fast Delivery"   },
              { Icon: Star,   text: "Top Rated"       },
            ].map(({ Icon, text }) => (
              <div key={text} className="al-chip">
                <Icon size={12} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — form
      ══════════════════════════════════════ */}
      <div className="al-right">
        <div className="al-card">
          <Outlet />
        </div>
        <p className="al-footer-note">
          © {new Date().getFullYear()} TrendWave. All rights reserved.
        </p>
      </div>

      {/* ══════════════════════════════════════
          STYLES
      ══════════════════════════════════════ */}
      <style>{`
        /* ─── Reset & root ─── */
        .al-root {
          display: flex;
          min-height: 100vh;
          background: #fff;
          font-family: -apple-system, "Segoe UI", system-ui, sans-serif;
        }

        /* ════════════════════════
           LEFT PANEL
        ════════════════════════ */
        .al-left {
          display: none;
          flex-direction: column;
          position: relative;
          flex: 0 0 50%;
          background: linear-gradient(150deg, #f0f7ff 0%, #e8f0fe 45%, #ede9fe 100%);
          overflow: hidden;
          padding: 32px 48px 40px;
        }
        @media (min-width: 1024px) { .al-left { display: flex; } }

        /* Dot grid overlay */
        .al-left::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #b8d0f7 1px, transparent 1px);
          background-size: 26px 26px;
          opacity: 0.5;
          pointer-events: none;
        }

        /* ── Animated background orbs ── */
        .al-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          opacity: 0.5;
        }
        .al-orb-1 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, #bfdbfe, transparent 70%);
          top: -80px; left: -80px;
          animation: orbDrift1 10s ease-in-out infinite alternate;
        }
        .al-orb-2 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #ddd6fe, transparent 70%);
          bottom: -60px; right: -60px;
          animation: orbDrift2 12s ease-in-out infinite alternate;
        }
        .al-orb-3 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, #a5f3fc, transparent 70%);
          top: 50%; left: 60%;
          animation: orbDrift3 8s ease-in-out infinite alternate;
        }
        @keyframes orbDrift1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 20px) scale(1.1); }
        }
        @keyframes orbDrift2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-20px, -30px) scale(1.08); }
        }
        @keyframes orbDrift3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-25px, 15px) scale(0.92); }
        }

        /* ── TrendWave brand ── */
        .al-top-logo {
          position: relative;
          z-index: 2;
          margin-bottom: 28px;
          animation: alFadeDown 0.55s cubic-bezier(.22,1,.36,1) both;
        }
        .al-brand {
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }
        .al-brand-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(37,99,235,0.35);
          flex-shrink: 0;
          animation: iconPulse 3s ease-in-out infinite;
        }
        @keyframes iconPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(37,99,235,0.35); }
          50%       { box-shadow: 0 4px 24px rgba(124,58,237,0.5); }
        }
        .al-brand-name {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
        }
        .al-brand-wave {
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Centre content ── */
        .al-centre {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          animation: alFadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.1s both;
        }

        /* Badge */
        .al-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fff;
          border: 1px solid #dbeafe;
          color: #2563eb;
          font-size: 0.71rem;
          font-weight: 600;
          padding: 5px 13px;
          border-radius: 100px;
          margin-bottom: 20px;
          width: fit-content;
          box-shadow: 0 2px 10px rgba(37,99,235,0.12);
          letter-spacing: 0.01em;
        }
        .al-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.4);
          animation: dotPing 2s ease-in-out infinite;
        }
        @keyframes dotPing {
          0%  { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          70% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
          100%{ box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        /* Headline */
        .al-headline {
          margin: 0 0 14px;
          font-size: clamp(1.9rem, 3vw, 2.7rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.12;
          letter-spacing: -0.03em;
        }
        .al-headline-accent {
          background: linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s linear infinite;
        }
        @keyframes gradientShift {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .al-subtext {
          margin: 0 0 28px;
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.75;
          max-width: 380px;
        }

        /* ── Illustration ── */
        .al-illustration-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          height: 220px;
        }

        /* Pulsing rings behind illustration */
        .al-illustration-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(99,102,241,0.18);
        }
        .al-ring-1 {
          width: 220px; height: 220px;
          animation: ringPulse 3s ease-in-out infinite;
        }
        .al-ring-2 {
          width: 280px; height: 280px;
          animation: ringPulse 3s ease-in-out infinite 0.8s;
        }
        @keyframes ringPulse {
          0%,100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.15; transform: scale(1.05); }
        }

        .al-illustration-glow {
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%);
          filter: blur(28px);
          animation: glowPulse 4s ease-in-out infinite alternate;
        }
        @keyframes glowPulse {
          from { opacity: 0.6; transform: scale(1); }
          to   { opacity: 1; transform: scale(1.15); }
        }

        .al-illustration {
          height: 180px;
          width: auto;
          object-fit: contain;
          position: relative;
          z-index: 2;
          animation: alFloat 4s ease-in-out infinite alternate;
          filter: drop-shadow(0 16px 32px rgba(99,102,241,0.25));
        }
        @keyframes alFloat {
          from { transform: translateY(0) rotate(-1deg); }
          to   { transform: translateY(-14px) rotate(1deg); }
        }

        /* Floating micro-cards */
        .al-floatcard {
          position: absolute;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 5px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 6px 10px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #334155;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          white-space: nowrap;
        }
        .al-floatcard-tl {
          top: 8px; left: -8px;
          animation: cardFloat1 5s ease-in-out infinite alternate;
        }
        .al-floatcard-br {
          bottom: 8px; right: -8px;
          animation: cardFloat2 5s ease-in-out infinite alternate;
        }
        @keyframes cardFloat1 {
          from { transform: translateY(0) translateX(0); }
          to   { transform: translateY(-6px) translateX(4px); }
        }
        @keyframes cardFloat2 {
          from { transform: translateY(0) translateX(0); }
          to   { transform: translateY(6px) translateX(-4px); }
        }
        .al-floatcard-pill {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          color: #fff;
          border-radius: 100px;
          padding: 1px 6px;
          font-size: 0.62rem;
          font-weight: 700;
        }

        /* ── Stats ── */
        .al-stats {
          display: flex;
          gap: 28px;
          margin-bottom: 20px;
        }
        .al-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: countUp 0.8s cubic-bezier(.22,1,.36,1) both;
        }
        .al-stat:nth-child(2) { animation-delay: 0.1s; }
        .al-stat:nth-child(3) { animation-delay: 0.2s; }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .al-stat-value {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.02em;
        }
        .al-stat-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        /* ── Trust chips ── */
        .al-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .al-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fff;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 5px 11px;
          border-radius: 100px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .al-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.1);
        }

        /* ════════════════════════
           RIGHT PANEL
        ════════════════════════ */
        .al-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px 24px;
          background: #fff;
          min-height: 100vh;
          /* Subtle mesh pattern */
          background-image:
            radial-gradient(circle at 20% 20%, rgba(219,234,254,0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(237,233,254,0.4) 0%, transparent 50%);
        }

        .al-card {
          width: 100%;
          max-width: 420px;
          animation: alSlideIn 0.65s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes alSlideIn {
          from { opacity: 0; transform: translateY(26px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .al-footer-note {
          margin-top: 32px;
          font-size: 0.72rem;
          color: #94a3b8;
          text-align: center;
        }

        /* ── Shared keyframes ── */
        @keyframes alFadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes alFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .al-card { max-width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
