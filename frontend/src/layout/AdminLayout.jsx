import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <h2>Admin Navbar</h2>

      <Outlet />

      <h2>Admin Footer</h2>
    </>
  );
};

export default AdminLayout;
