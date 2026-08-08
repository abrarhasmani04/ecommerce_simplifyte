import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FlashSale from "../components/FlashSale";
import FeaturedProducts from "../components/FeaturedProducts";
import Brands from "../components/Brands";
import Newsletter from "../components/Newsletter";

const HomePage = () => {
  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 24px 80px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
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
