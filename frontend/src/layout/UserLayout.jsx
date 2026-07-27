import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <h2>User Navbar</h2>

      <Outlet />

      <h2>User Footer</h2>
    </>
  );
};

export default UserLayout;
