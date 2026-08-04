import api from "@/services/axios";

// ─── Seller API calls ──────────────────────────────────────────────────────

/** Get seller dashboard stats */
export const getSellerDashboardApi = () =>
  api.get("/seller/dashboard");

/** Get seller's own products (paginated) */
export const getSellerProductsApi = (params = {}) =>
  api.get("/seller/products", { params });

/** Get seller's orders (paginated) */
export const getSellerOrdersApi = (params = {}) =>
  api.get("/seller/orders", { params });

/** Submit become-seller application */
export const applySellerApi = (formData) =>
  api.post("/seller/apply", formData);

/** Get current seller application status */
export const getSellerApplicationStatusApi = () =>
  api.get("/seller/application-status");

export default api;
