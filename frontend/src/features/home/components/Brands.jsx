const BRANDS = [
  { name: "Apple",   bg: "#f3f4f6" },
  { name: "Samsung", bg: "#eff6ff" },
  { name: "Nike",    bg: "#fff7ed" },
  { name: "Adidas",  bg: "#f3f4f6" },
  { name: "Sony",    bg: "#eef2ff" },
  { name: "Dyson",   bg: "#faf5ff" },
];

const Brands = () => {
  return (
    <section className="mt-14">
      <h2 className="mb-8 text-3xl font-bold">Top Brands</h2>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {BRANDS.map(({ name, bg }) => (
          <div
            key={name}
            className="flex h-20 cursor-pointer items-center justify-center rounded-xl transition hover:-translate-y-1 hover:shadow-md"
            style={{ backgroundColor: bg }}
          >
            <span className="text-base font-bold" style={{ color: "#374151" }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
