import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login (keep behavior consistent with services/api.js)
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {}
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    console.error(error);
    return Promise.reject(error);
  }
);

export default axiosClient;
