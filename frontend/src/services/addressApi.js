import api from "@/services/axios";

export const getMyAddressesApi = () => api.get("/address");

export const addAddressApi = (payload) => api.post("/address", payload);

export const updateAddressApi = (id, payload) => api.put(`/address/${id}`, payload);

export const deleteAddressApi = (id) => api.delete(`/address/${id}`);
