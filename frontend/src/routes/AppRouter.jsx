import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { ROUTES } from "../constants/routes";

import GuestRoute from "./GuestRoute";
import RoleGuard from "./RoleGuard";
import ScrollToTop from "../components/common/ScrollToTop";
import PageLoader from "../components/common/PageLoader";

// ─── Layouts (all from layouts/) ───────────────────────────────────────────
import MainLayout   from "../layouts/MainLayout";
import AuthLayout   from "../layouts/AuthLayout";
import UserLayout   from "../layouts/UserLayout";
import AdminLayout  from "../layouts/AdminLayout";
import SellerLayout from "../layouts/SellerLayout";

// ─── Public / User — Home ──────────────────────────────────────────────────
import HomePage from "../features/user/home/pages/HomePage";

// ─── Public — Products (browsing, detail) ─────────────────────────────────
import ProductsPage   from "../features/user/products/pages/ProductsPage";
import ProductDetails from "../features/user/products/pages/ProductDetails";

// ─── Auth Pages ────────────────────────────────────────────────────────────
import Login           from "../features/auth/pages/Login";
import Register        from "../features/auth/pages/Register";
import VerifyEmail     from "../features/auth/pages/VerifyEmail";
import LoginOTP        from "../features/auth/pages/LoginOTP";
import VerifyLoginOTP  from "../features/auth/pages/VerifyLoginOTP";
import ForgotPassword  from "../features/auth/pages/ForgotPassword";
import ResetPassword   from "../features/auth/pages/ResetPassword";

// ─── User Pages (protected) ────────────────────────────────────────────────
import UserProfile  from "../features/user/pages/UserProfile";
import CartPage     from "../features/user/cart/pages/CartPage";
import WishlistPage from "../features/user/wishlist/pages/WishlistPage";
import BecomeSeller    from "../features/user/pages/BecomeSeller";
import CheckoutPage    from "../features/user/checkout/pages/CheckoutPage";
import OrdersPage      from "../features/user/orders/OrdersPage";

// ─── Seller Pages ──────────────────────────────────────────────────────────
import SellerDashboard    from "../features/seller/pages/SellerDashboard";
import SellerProfile      from "../features/seller/pages/SellerProfile";
import SellerProducts     from "../features/seller/pages/SellerProducts";
import SellerAddProduct   from "../features/seller/pages/SellerAddProduct";
import SellerEditProduct  from "../features/seller/pages/SellerEditProduct";
import SellerOrders       from "../features/seller/pages/SellerOrders";
import SellerStatistics   from "../features/seller/pages/SellerStatistics";

// ─── Admin Pages ───────────────────────────────────────────────────────────
import AdminDashboard      from "../features/admin/pages/AdminDashboard";
import AdminProfile        from "../features/admin/pages/AdminProfile";
import Products            from "../features/admin/pages/Products";
import AddProduct          from "../features/admin/pages/AddProduct";
import EditProduct         from "../features/admin/pages/EditProduct";
import Categories          from "../features/admin/pages/Categories";
import Sellers             from "../features/admin/pages/Sellers";
import SellerApplications  from "../features/admin/pages/SellerApplications";
import Statistics          from "../features/admin/pages/Statistics";
import Orders              from "../features/admin/pages/Orders";
import RecentOrders        from "../features/admin/pages/RecentOrders";
import MonthlySales        from "../features/admin/pages/MonthlySales";
import Users               from "../features/admin/pages/Users";
import LowStock            from "../features/admin/pages/LowStock";
import Sales               from "../features/admin/pages/Sales";

// ─── Root redirect ─────────────────────────────────────────────────────────
const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return <PageLoader />;

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  const role = user?.role?.toUpperCase();
  if (role === "ADMIN")  return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  if (role === "SELLER") return <Navigate to={ROUTES.SELLER_DASHBOARD} replace />;

  return <Navigate to={ROUTES.HOME} replace />;
};

// ─── Router ────────────────────────────────────────────────────────────────
const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<RootRedirect />} />

        {/* PUBLIC — no auth required */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME}           element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS}       element={<ProductsPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetails />} />
        </Route>

        {/* AUTH — guests only */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN}            element={<GuestRoute><Login /></GuestRoute>} />
          <Route path={ROUTES.REGISTER}         element={<GuestRoute><Register /></GuestRoute>} />
          <Route path={ROUTES.VERIFY_EMAIL}     element={<GuestRoute><VerifyEmail /></GuestRoute>} />
          <Route path={ROUTES.LOGIN_OTP}        element={<GuestRoute><LoginOTP /></GuestRoute>} />
          <Route path={ROUTES.VERIFY_LOGIN_OTP} element={<GuestRoute><VerifyLoginOTP /></GuestRoute>} />
          <Route path={ROUTES.FORGOT_PASSWORD}  element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path={ROUTES.RESET_PASSWORD}   element={<GuestRoute><ResetPassword /></GuestRoute>} />
        </Route>

        {/* USER — protected (UserLayout = auth guard + MainLayout) */}
        <Route element={<UserLayout />}>
          <Route path={ROUTES.USER_DASHBOARD} element={<h1 className="p-8 text-2xl font-bold">User Dashboard</h1>} />
          <Route path={ROUTES.CART}           element={<CartPage />} />
          <Route path={ROUTES.CHECKOUT}       element={<CheckoutPage />} />
          <Route path={ROUTES.WISHLIST}       element={<WishlistPage />} />
          <Route path={ROUTES.ORDERS}         element={<OrdersPage />} />
          <Route path={ROUTES.PROFILE}        element={<UserProfile />} />
          <Route path={ROUTES.BECOME_SELLER}  element={<BecomeSeller />} />
        </Route>

        {/* SELLER — protected + role guard */}
        <Route
          path="/seller"
          element={
            <RoleGuard allowedRoles={["SELLER"]}>
              <SellerLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"           element={<SellerDashboard />} />
          <Route path="products"            element={<SellerProducts />} />
          <Route path="products/add"        element={<SellerAddProduct />} />
          <Route path="products/:id/edit"   element={<SellerEditProduct />} />
          <Route path="orders"              element={<SellerOrders />} />
          <Route path="statistics"          element={<SellerStatistics />} />
          <Route path="profile"             element={<SellerProfile />} />
        </Route>

        {/* ADMIN — protected + role guard */}
        <Route
          path="/admin"
          element={
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"          element={<AdminDashboard />} />
          <Route path="products"           element={<Products />} />
          <Route path="products/add"       element={<AddProduct />} />
          <Route path="products/:id/edit"  element={<EditProduct />} />
          <Route path="categories"         element={<Categories />} />
          <Route path="orders"             element={<Orders />} />
          <Route path="recent-orders"      element={<RecentOrders />} />
          <Route path="monthly-sales"      element={<MonthlySales />} />
          <Route path="users"              element={<Users />} />
          <Route path="sellers"            element={<Sellers />} />
          <Route path="applications"       element={<SellerApplications />} />
          <Route path="statistics"         element={<Statistics />} />
          <Route path="profile"            element={<AdminProfile />} />
          <Route path="low-stock"          element={<LowStock />} />
          <Route path="sales"              element={<Sales />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center">
              <h1 className="text-3xl font-bold text-slate-700">404 — Page Not Found</h1>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
