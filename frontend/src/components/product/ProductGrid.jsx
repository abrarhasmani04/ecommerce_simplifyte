import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    title: "Apple iPhone 15",
    price: 799,
    image: "https://via.placeholder.com/250",
  },
  {
    id: 2,
    title: "Nike Shoes",
    price: 129,
    image: "https://via.placeholder.com/250",
  },
  {
    id: 3,
    title: "Samsung TV",
    price: 999,
    image: "https://via.placeholder.com/250",
  },
  {
    id: 4,
    title: "Gaming Laptop",
    price: 1499,
    image: "https://via.placeholder.com/250",
  },
];

const ProductGrid = ({ title }) => {
  return (
    <section className="mt-14">
      <h2 className="mb-8 text-3xl font-bold">{title}</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
