import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="rounded-2xl px-10 py-20"
      style={{
        background: "linear-gradient(to right, #2563eb, #4f46e5, #9333ea)",
        color: "#ffffff",
      }}
    >
      <div className="max-w-2xl">
        <p
          className="mb-3 text-sm font-semibold uppercase"
          style={{ letterSpacing: "0.15em", opacity: 0.82 }}
        >
          New Season Arrivals
        </p>

        <h1 className="text-5xl font-bold leading-tight">
          Shop the Latest Trends
        </h1>

        <p className="mt-5 text-lg" style={{ opacity: 0.9 }}>
          Discover premium products across Electronics, Fashion, Beauty and
          more — all at the best prices with fast delivery.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/products"
            className="rounded-lg bg-white px-8 py-3 font-semibold transition hover:bg-gray-100"
            style={{ color: "#1d4ed8" }}
          >
            Shop Now
          </Link>
          <Link
            to="/products?category=Electronics"
            className="rounded-lg px-8 py-3 font-semibold transition"
            style={{
              border: "1.5px solid rgba(255,255,255,0.85)",
              color: "#ffffff",
            }}
          >
            Explore Deals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
