import api from "@/services/axios";


export const getSellerDashboardApi = () =>
  api.get("/seller/dashboard");

export const getSellerProductsApi = (params = {}) =>
  api.get("/seller/products", { params });

export const getSellerOrdersApi = (params = {}) =>
  api.get("/seller/orders", { params });

export const applySellerApi = (formData) =>
  api.post("/seller/apply", formData);
export const getSellerApplicationStatusApi = () =>
  api.get("/seller/application-status");
