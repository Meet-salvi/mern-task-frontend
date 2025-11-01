import axios from "axios";

export const API = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API,
  withCredentials: true, // Always send cookies
});

// ✅ Attach Access Token to Requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Auto Refresh Access Token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired & not retried before
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Refresh access token using cookies
        const refreshResponse = await instance.post("/api/auth/refresh");

        const newAccessToken = refreshResponse.data.accessToken;

        // Save new token
        localStorage.setItem("token", newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        
        localStorage.removeItem("token");
        window.location.href = "/login"; 
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
