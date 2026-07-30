import ProductCard from "../components/ProductCard";

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    title: "Apple iPhone 15",
    price: 799,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1710023038502-ba80a70a9f53?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Nike Air Max 270",
    price: 129,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1580902215262-9b941bc6eab3?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: 'Samsung 55" TV',
    price: 999,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "MacBook Air M3",
    price: 1099,
    rating: 4.9,
    originalPrice: 1299,
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop",
  },
];

const ProductsPage = () => {
  const products = SAMPLE_PRODUCTS;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold" style={{ color: "#111827" }}>
        All Products
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
