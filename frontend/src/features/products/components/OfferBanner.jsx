const OfferBanner = () => {
  return (
    <section className="mt-14 rounded-2xl bg-orange-500 px-10 py-16 text-center text-white">
      <h2 className="text-4xl font-bold">Flash Sale</h2>
      <p className="mt-3 text-lg">Get up to 50% OFF on selected products.</p>
      <button className="mt-6 rounded-lg bg-white px-8 py-3 font-semibold text-orange-600 transition hover:bg-orange-50">
        Explore Offers
      </button>
    </section>
  );
};

export default OfferBanner;
