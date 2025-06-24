import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true, // Important for cookies
  timeout: 10000, // 10 second timeout
});

// Token refresh management
let refreshTimeout: NodeJS.Timeout | null = null;
let isRefreshing = false;
let lastRefreshTime = 0;

// Function to schedule token refresh
const scheduleTokenRefresh = () => {
  // Clear existing timeout
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  // Schedule refresh 1 minute before expiration (14 minutes after login)
  const refreshTime = 14 * 60 * 1000; // 14 minutes in milliseconds
  refreshTimeout = setTimeout(async () => {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing) {
      console.log("🔄 Auto-refresh: Already refreshing, skipping...");
      return;
    }

    // Prevent refreshing too frequently (at least 30 seconds between refreshes)
    const now = Date.now();
    if (now - lastRefreshTime < 30000) {
      console.log(
        "🔄 Auto-refresh: Too soon since last refresh, rescheduling..."
      );
      scheduleTokenRefresh();
      return;
    }

    isRefreshing = true;
    try {
      console.log("🔄 Auto-refreshing token before expiration...");
      await api.post("/auth/refresh");
      console.log("✅ Token auto-refresh successful");
      lastRefreshTime = Date.now();
      // Schedule next refresh
      scheduleTokenRefresh();
    } catch (error) {
      console.log("❌ Auto-refresh failed:", error);
      // Don't redirect immediately on auto-refresh failure
      // Let the middleware handle it
    } finally {
      isRefreshing = false;
    }
  }, refreshTime);
};

// Function to start auto-refresh (call this after successful login)
export const startAutoRefresh = () => {
  scheduleTokenRefresh();
};

// Function to stop auto-refresh (call this on logout)
export const stopAutoRefresh = () => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
  isRefreshing = false;
};

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 Making request to: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // If error is 401, redirect to login (middleware should handle refresh)
    if (error.response?.status === 401) {
      console.log("❌ Unauthorized request, redirecting to login");
      stopAutoRefresh(); // Stop auto-refresh on logout
      window.location.href = "/SignIn";
    }

    return Promise.reject(error);
  }
);

export default api;
