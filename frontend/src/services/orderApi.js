import api from "@/services/axios";

export const placeOrderApi    = (payload) => api.post("/orders", payload);

export const getMyOrdersApi   = ()         => api.get("/orders/my");

export const getOrderByIdApi  = (id)       => api.get(`/orders/${id}`);

export const cancelOrderApi   = (id)       => api.put(`/orders/${id}/cancel`);

export const downloadInvoiceApi = (id) =>
  api.get(`/orders/${id}/invoice`, { responseType: "blob" });
