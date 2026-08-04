import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FlashSale from "../components/FlashSale";
import FeaturedProducts from "../components/FeaturedProducts";
import Brands from "../components/Brands";
import Newsletter from "../components/Newsletter";

const HomePage = () => {
  return (
    <div
      className="mx-auto max-w-7xl px-6 pb-20 pt-6"
      style={{ backgroundColor: "#ffffff" }}
    >
      <Hero />
      <Categories />
      <FlashSale />
      <FeaturedProducts />
      <Brands />
      <Newsletter />
    </div>
  );
};

export default HomePage;
