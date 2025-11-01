import axios from "axios";

export const API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true, // ✅ allow cookies
});

// ✅ Attach access token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Auto refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // ✅ IMPORTANT: use axios (not axiosInstance) to avoid infinite loop
        const refreshResponse = await axios.post(
          `${API}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // ✅ Save new access token
        localStorage.setItem("token", newAccessToken);

        // ✅ Add token to retried request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // retry
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
