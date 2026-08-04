import api from "@/services/axios";

export const addToCartApi = (productId, quantity) =>
  api.post("/cart/add", { productId, quantity });

export const getMyCartApi = () => api.get("/cart");

export const updateCartQuantityApi = (id, quantity) =>
  api.put(`/cart/${id}`, { quantity });

export const removeCartItemApi = (id) => api.delete(`/cart/${id}`);

export const deleteAllCartApi = () => api.delete("/cart/clear");
