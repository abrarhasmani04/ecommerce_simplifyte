import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import FlashSale from "../../components/home/FlashSale";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import Brands from "../../components/home/Brands";
import Newsletter from "../../components/home/Newsletter";

const Home = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Hero />
      <Categories />
      <FlashSale />
      <FeaturedProducts />
      <Brands />
      <Newsletter />
    </div>
  );
};

export default Home;
