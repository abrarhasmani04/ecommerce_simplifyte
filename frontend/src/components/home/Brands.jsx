const brands = [
  { name: "Apple", bg: "bg-gray-100" },
  { name: "Samsung", bg: "bg-blue-50" },
  { name: "Nike", bg: "bg-orange-50" },
  { name: "Adidas", bg: "bg-gray-100" },
  { name: "Sony", bg: "bg-indigo-50" },
  { name: "Dyson", bg: "bg-purple-50" },
];

const Brands = () => {
  return (
    <section className="mt-14">
      <h2 className="mb-8 text-3xl font-bold">Top Brands</h2>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className={`flex h-20 cursor-pointer items-center justify-center rounded-xl ${brand.bg} transition hover:-translate-y-1 hover:shadow-md`}
          >
            <span className="text-base font-bold text-gray-700">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
