import { Link } from "react-router-dom";

const categoriesList = [
  { title: "Electronics", emoji: "💻", color: "bg-blue-50" },
  { title: "Fashion", emoji: "👗", color: "bg-pink-50" },
  { title: "Shoes", emoji: "👟", color: "bg-orange-50" },
  { title: "Beauty", emoji: "💄", color: "bg-red-50" },
  { title: "Furniture", emoji: "🛋️", color: "bg-yellow-50" },
  { title: "Sports", emoji: "⚽", color: "bg-green-50" },
  { title: "Books", emoji: "📚", color: "bg-indigo-50" },
  { title: "Toys", emoji: "🧸", color: "bg-purple-50" },
];

const Categories = () => {
  return (
    <section className="mt-14">
      <h2 className="mb-8 text-3xl font-bold">Shop By Category</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categoriesList.map((item) => (
          <Link
            key={item.title}
            to={`/products?category=${encodeURIComponent(item.title)}`}
            className={`flex flex-col items-center rounded-xl p-5 ${item.color} cursor-pointer transition hover:-translate-y-1 hover:shadow-md`}
          >
            <span className="text-4xl">{item.emoji}</span>
            <h3 className="mt-3 text-center text-sm font-semibold">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
