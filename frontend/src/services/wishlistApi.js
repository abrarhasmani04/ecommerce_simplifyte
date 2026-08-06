import api from "@/services/axios";

export const fetchWishlistApi = () => api.get("/wishlist/");

export const addWishlistApi = (productId) => api.post(`/wishlist/${productId}/`);

export const removeWishlistApi = (productId) => api.delete(`/wishlist/${productId}`);
