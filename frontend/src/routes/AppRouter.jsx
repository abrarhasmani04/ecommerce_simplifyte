import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { ROUTES } from "../constants/routes";

import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import HomePage from "../features/home/pages/HomePage";
import ProductsPage from "../features/products/pages/ProductsPage";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import LoginOTP from "../features/auth/pages/LoginOTP";
import VerifyLoginOTP from "../features/auth/pages/VerifyLoginOTP";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";

const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const role = user?.role?.toUpperCase();
  if (role === "ADMIN") return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  if (role === "SELLER") return <Navigate to={ROUTES.SELLER_DASHBOARD} replace />;
  return <Navigate to={ROUTES.HOME} replace />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<RootRedirect />} />

        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME}     element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN}            element={<GuestRoute><Login /></GuestRoute>} />
          <Route path={ROUTES.REGISTER}         element={<GuestRoute><Register /></GuestRoute>} />
          <Route path={ROUTES.VERIFY_EMAIL}     element={<GuestRoute><VerifyEmail /></GuestRoute>} />
          <Route path={ROUTES.LOGIN_OTP}        element={<GuestRoute><LoginOTP /></GuestRoute>} />
          <Route path={ROUTES.VERIFY_LOGIN_OTP} element={<GuestRoute><VerifyLoginOTP /></GuestRoute>} />
          <Route path={ROUTES.FORGOT_PASSWORD}  element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path={ROUTES.RESET_PASSWORD}   element={<GuestRoute><ResetPassword /></GuestRoute>} />
        </Route>

        {/* User protected */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path={ROUTES.USER_DASHBOARD} element={<h1>User Dashboard</h1>} />
          <Route path={ROUTES.CART}           element={<h1>Cart</h1>} />
          <Route path={ROUTES.WISHLIST}       element={<h1>Wishlist</h1>} />
          <Route path={ROUTES.ORDERS}         element={<h1>My Orders</h1>} />
          <Route path={ROUTES.PROFILE}        element={<h1>Profile</h1>} />
        </Route>

        {/* Seller protected */}
        <Route element={<RoleGuard allowedRoles={["SELLER"]}><MainLayout /></RoleGuard>}>
          <Route path={ROUTES.SELLER_DASHBOARD} element={<h1>Seller Dashboard</h1>} />
        </Route>

        {/* Admin protected */}
        <Route element={<RoleGuard allowedRoles={["ADMIN"]}><MainLayout /></RoleGuard>}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<h1>Admin Dashboard</h1>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404 — Page Not Found</h1>} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
