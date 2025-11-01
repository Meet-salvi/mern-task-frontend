import axios from "axios";

export const API = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API,
  withCredentials: true,
});

// ✅ Attach token from localStorage
instance.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Refresh token interceptor
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      try {
        const refresh = await instance.post("/api/auth/refresh-token");
        localStorage.setItem("token", refresh.data.accessToken);

        err.config.headers.Authorization = `Bearer ${refresh.data.accessToken}`;
        return instance(err.config);
      } catch {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
