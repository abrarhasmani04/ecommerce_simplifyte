import CategoryCard from "./CategoryCard";

const categories = [
  {
    title: "Electronics",
    image: "https://via.placeholder.com/100",
  },
  {
    title: "Fashion",
    image: "https://via.placeholder.com/100",
  },
  {
    title: "Shoes",
    image: "https://via.placeholder.com/100",
  },
  {
    title: "Beauty",
    image: "https://via.placeholder.com/100",
  },
  {
    title: "Furniture",
    image: "https://via.placeholder.com/100",
  },
  {
    title: "Sports",
    image: "https://via.placeholder.com/100",
  },
];

const CategorySection = () => {
  return (
    <section className="mt-14">
      <h2 className="mb-8 text-3xl font-bold">Shop By Category</h2>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((item) => (
          <CategoryCard
            key={item.title}
            title={item.title}
            image={item.image}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
