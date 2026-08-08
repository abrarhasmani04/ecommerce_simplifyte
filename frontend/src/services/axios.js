import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403 || status === 404) {
      return Promise.reject(error);
    }

    const silentCodes = [
      "ERR_CANCELED",
      "ECONNABORTED",
      "ECONNREFUSED",
      "ECONNRESET",
      "ERR_NETWORK",
      "ETIMEDOUT",
    ];
    if (!silentCodes.includes(error.code) && !status) {
      console.error(
        "[API Error]",
        error?.response?.data?.message ?? error.message
      );
    }

    return Promise.reject(error);
  }
);

export default api;
