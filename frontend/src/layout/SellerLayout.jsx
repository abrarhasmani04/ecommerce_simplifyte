import { Outlet } from "react-router-dom";

const SellerLayout = () => {
  return (
    <>
      <h2>Seller Navbar</h2>

      <Outlet />

      <h2>Seller Footer</h2>
    </>
  );
};

export default SellerLayout;
