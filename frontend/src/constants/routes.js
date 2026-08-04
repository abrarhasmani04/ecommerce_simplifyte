export const ROUTES = {
  // ─── Public ────────────────────────────────────────────────────────────
  HOME:           "/home",
  PRODUCTS:       "/products",
  PRODUCT_DETAIL: "/product/:id",

  // ─── Auth ──────────────────────────────────────────────────────────────
  LOGIN:             "/login",
  REGISTER:          "/register",
  VERIFY_EMAIL:      "/verify-email",
  LOGIN_OTP:         "/login-otp",
  VERIFY_LOGIN_OTP:  "/verify-login-otp",
  FORGOT_PASSWORD:   "/forgot-password",
  RESET_PASSWORD:    "/reset-password",

  // ─── User (protected) ──────────────────────────────────────────────────
  USER_DASHBOARD: "/dashboard",
  CART:           "/cart",
  WISHLIST:       "/wishlist",
  ORDERS:         "/orders",
  PROFILE:        "/profile",
  BECOME_SELLER:  "/become-seller",

  // ─── Seller (protected + role: SELLER) ─────────────────────────────────
  SELLER_DASHBOARD:   "/seller/dashboard",
  SELLER_PRODUCTS:    "/seller/products",
  SELLER_ORDERS:      "/seller/orders",
  SELLER_STATISTICS:  "/seller/statistics",
  SELLER_PROFILE:     "/seller/profile",
  SELLER_SETTINGS:    "/seller/settings",

  // ─── Admin (protected + role: ADMIN) ───────────────────────────────────
  ADMIN_DASHBOARD:      "/admin/dashboard",
  ADMIN_PRODUCTS:       "/admin/products",
  ADMIN_PRODUCT_ADD:    "/admin/products/add",
  ADMIN_PRODUCT_EDIT:   "/admin/products/:id/edit",
  ADMIN_CATEGORIES:     "/admin/categories",
  ADMIN_ORDERS:         "/admin/orders",
  ADMIN_MONTHLY_SALES:  "/admin/monthly-sales",
  ADMIN_USERS:          "/admin/users",
  ADMIN_SELLERS:        "/admin/sellers",
  ADMIN_APPLICATIONS:   "/admin/applications",
  ADMIN_STATISTICS:     "/admin/statistics",
  ADMIN_PROFILE:        "/admin/profile",
  ADMIN_SETTINGS:       "/admin/settings",
};
