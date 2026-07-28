const HeroBanner = () => {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-10 py-20 text-white">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold leading-tight">Big Fashion Sale</h1>

        <p className="mt-5 text-lg">
          Up to 70% OFF on Fashion, Electronics, Shoes and Accessories.
        </p>

        <button className="mt-8 rounded-lg bg-white px-8 py-3 font-semibold text-blue-700 transition hover:bg-gray-100">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;
