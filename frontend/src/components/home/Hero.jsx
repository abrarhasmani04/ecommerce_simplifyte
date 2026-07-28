import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-10 py-20 text-white">
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest opacity-80">
          New Season Arrivals
        </p>

        <h1 className="text-5xl font-bold leading-tight">
          Shop the Latest Trends
        </h1>

        <p className="mt-5 text-lg opacity-90">
          Discover premium products across Electronics, Fashion, Beauty and
          more — all at the best prices with fast delivery.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/products"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-700 transition hover:bg-gray-100"
          >
            Shop Now
          </Link>

          <Link
            to="/products?category=Electronics"
            className="rounded-lg border border-white px-8 py-3 font-semibold transition hover:bg-white/10"
          >
            Explore Deals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
