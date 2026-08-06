import api from "@/services/axios";

export const addReviewApi = (payload) =>
  api.post("/reviews", payload);

export const getProductReviewsApi = (productId) =>
  api.get(`/reviews/${productId}`);

export const updateReviewApi = (id, payload) =>
  api.put(`/reviews/${id}`, payload);

export const deleteReviewApi = (id) =>
  api.delete(`/reviews/${id}`);
