import api from "@/services/axios";

// ─── Public Product API ────────────────────────────────────────────────────

/** Get paginated list of products (public) */
export const getProductsApi = (params = {}) =>
  api.get("/product/", { params });

/** Get a single product by ID (public) */
export const getProductByIdApi = (id) =>
  api.get(`/product/${id}`);

/** Get products by category (public) */
export const getProductsByCategoryApi = (categoryId, params = {}) =>
  api.get(`/product/category/${categoryId}`, { params });

/** Search products (public) */
export const searchProductsApi = (query, params = {}) =>
  api.get("/product/search", { params: { q: query, ...params } });

// ─── Admin Product API ─────────────────────────────────────────────────────

/** Create a new product (admin) */
export const createProductApi = (formData) =>
  api.post("/product/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** Update an existing product (admin) */
export const updateProductApi = (id, formData) =>
  api.put(`/product/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** Delete a product (admin) */
export const deleteProductApi = (id) =>
  api.delete(`/product/${id}`);
