import ProductCard from "./ProductCard";

const ProductGrid = ({ title, products = [] }) => {
  if (!products.length) {
    return (
      <section className="mt-14">
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <p className="text-gray-400">No products found.</p>
      </section>
    );
  }

  return (
    <section className="mt-14">
      {title && (
        <h2
          className="
      mb-8 text-3xl font-bold"
        >
          {title}
        </h2>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
