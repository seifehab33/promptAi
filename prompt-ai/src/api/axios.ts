import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true, // Important for cookies
  timeout: 10000, // 10 second timeout
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("🔄 Access token expired, attempting refresh...");

      try {
        // Call refresh token endpoint
        await api.post("/auth/refresh");
        console.log("✅ Token refresh successful");

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.log("❌ Token refresh failed, redirecting to login");
        window.location.href = "/SignIn";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
