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

// Pages
import Home from "../pages/user/Home";
import SellerDashboard from "../pages/seller/SellerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ROUTES ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-otp" element={<LoginOTP />} />
          <Route path="/verify-login-otp" element={<VerifyLoginOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          {/* USER */}
          <Route element={<RoleProtectedRoute allowedRoles={["USER"]} />}>
            <Route element={<UserLayout />}>
              <Route path="/home" element={<Home />} />
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
            </Route>
          </Route>
        </Route>

        {/* ================= 404 PAGE ================= */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center">
              <h1 className="text-3xl font-bold">404 | Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
