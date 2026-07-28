import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Layout
import AuthLayout from "../features/auth/components/AuthLayout";

// Auth Pages
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import LoginOTP from "../features/auth/pages/LoginOTP";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import ResetPassword from "../features/auth/pages/ResetPassword";
import VerifyLoginOTP from "../features/auth/pages/VerifyLoginOTP";

// Protected Routes
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

// Layouts
import UserLayout from "../layout/UserLayout";
import SellerLayout from "../layout/SellerLayout";
import AdminLayout from "../layout/AdminLayout";

// User Pages
import Home from "../pages/user/Home";
import ProductDetails from "../pages/user/ProductDetails";
import Cart from "../pages/user/Cart";
import Wishlist from "../pages/user/Wishlist";
import Checkout from "../pages/user/Checkout";
import Orders from "../pages/user/Orders";
import OrderDetails from "../pages/user/OrderDetails";
import Invoice from "../pages/user/Invoice";
import Profile from "../pages/user/Profile";

// Seller Pages
import SellerDashboard from "../pages/seller/SellerDashboard";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/Users";
import AdminSellers from "../pages/admin/Sellers";
import SellerApplications from "../pages/admin/SellerApplications";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";
import Categories from "../pages/admin/Categories";
import Analytics from "../pages/admin/Analytics";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import AdminProfile from "../pages/admin/Profile";
import Notifications from "../pages/admin/Notifications";

// Misc Pages
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ================= AUTH ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-otp" element={<LoginOTP />} />
          <Route path="/verify-login-otp" element={<VerifyLoginOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ================= PROTECTED ================= */}
        <Route element={<ProtectedRoute />}>

          {/* USER */}
          <Route element={<RoleProtectedRoute allowedRoles={["USER"]} />}>
            <Route element={<UserLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/orders/:id/invoice" element={<Invoice />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* SELLER */}
          <Route element={<RoleProtectedRoute allowedRoles={["SELLER"]} />}>
            <Route element={<SellerLayout />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
            </Route>
          </Route>

          {/* ADMIN */}
          <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/sellers" element={<AdminSellers />} />
              <Route path="/admin/seller-applications" element={<SellerApplications />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/notifications" element={<Notifications />} />
            </Route>
          </Route>

        </Route>

        {/* ================= MISC ================= */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
