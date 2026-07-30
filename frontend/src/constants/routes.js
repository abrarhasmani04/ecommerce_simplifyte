export const ROUTES = {
  // Public
  HOME: "/home",
  PRODUCTS: "/products",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  LOGIN_OTP: "/login-otp",
  VERIFY_LOGIN_OTP: "/verify-login-otp",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // User (protected)
  USER_DASHBOARD: "/dashboard",
  CART: "/cart",
  WISHLIST: "/wishlist",
  ORDERS: "/orders",
  PROFILE: "/profile",

  // Seller (protected + role)
  SELLER_DASHBOARD: "/seller/dashboard",

  // Admin (protected + role)
  ADMIN_DASHBOARD: "/admin/dashboard",
};
