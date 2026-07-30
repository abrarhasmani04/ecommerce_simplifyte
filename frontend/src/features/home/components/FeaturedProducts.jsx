import ProductCard from "../../products/components/ProductCard";

const FEATURED = [
  {
    id: 101,
    title: "MacBook Air M3",
    price: 1099,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
  },
  {
    id: 102,
    title: "Adidas Ultraboost 23",
    price: 149,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1651013691313-81b822df0044?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
  },
  {
    id: 103,
    title: "Dyson V15 Detect",
    price: 549,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1723816812847-1403087c84c1?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
  },
  {
    id: 104,
    title: "PlayStation 5 Console",
    price: 399,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
  },
  {
    id: 105,
    title: "Kindle Paperwhite",
    price: 129,
    originalPrice: 159,
    image: "https://images.unsplash.com/photo-1622122892817-45b38188db7e?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
  },
  {
    id: 106,
    title: "Levi's 501 Jeans",
    price: 59,
    originalPrice: 89,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop",
    rating: 4.4,
  },
  {
    id: 107,
    title: "GoPro Hero 12",
    price: 349,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1577486092192-59ded63a8dbd?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
  },
  {
    id: 108,
    title: "Instant Pot Duo 7-in-1",
    price: 79,
    originalPrice: 99,
    image: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="mt-14">
      <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
