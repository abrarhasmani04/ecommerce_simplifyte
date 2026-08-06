import api from "@/services/axios";

export const createRazorpayOrderApi = (orderId) =>
  api.post("/payment/create-order", { orderId });

export const verifyRazorpayPaymentApi = (payload) =>
  api.post("/payment/verify", payload);
