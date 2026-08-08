import api from "@/services/axios";


export const getProductsApi = (params = {}) =>
  api.get("/product/", { params });

export const getProductByIdApi = (id) =>
  api.get(`/product/${id}`);

export const getProductsByCategoryApi = (categoryId, params = {}) =>
  api.get(`/product/category/${categoryId}`, { params });

export const searchProductsApi = (query, params = {}) =>
  api.get("/product/search", { params: { q: query, ...params } });


export const createProductApi = (formData) =>
  api.post("/product/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProductApi = (id, formData) =>
  api.put(`/product/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProductApi = (id) =>
  api.delete(`/product/${id}`);
