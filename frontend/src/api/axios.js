import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.181:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Silently reject — 401/404 on session-check is expected when not logged in
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 404) {
      return Promise.reject(error); // expected: no cookie / not logged in
    }
    if (error.code !== "ERR_CANCELED") {
      console.error("[API Error]", error?.response?.data?.message ?? error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
