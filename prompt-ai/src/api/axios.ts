import axios from "axios";

// Create a cache to store responses
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Create a debounce map to prevent duplicate requests
const pendingRequests = new Map();

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true, // Important for cookies
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Generate cache key
    const cacheKey = `${config.method}-${config.url}-${JSON.stringify(
      config.params || {}
    )}-${JSON.stringify(config.data || {})}`;

    // Check if request is already pending
    if (pendingRequests.has(cacheKey)) {
      return Promise.reject(new Error("Duplicate request cancelled"));
    }

    // Add to pending requests
    pendingRequests.set(cacheKey, true);

    // Check cache for GET requests
    if (config.method === "get") {
      const cachedResponse = responseCache.get(cacheKey);
      if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
        pendingRequests.delete(cacheKey);
        return Promise.reject({
          __CACHE__: true,
          data: cachedResponse.data,
        });
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Generate cache key
    const cacheKey = `${response.config.method}-${
      response.config.url
    }-${JSON.stringify(response.config.params || {})}-${JSON.stringify(
      response.config.data || {}
    )}`;

    // Remove from pending requests
    pendingRequests.delete(cacheKey);

    // Cache GET responses
    if (response.config.method === "get") {
      responseCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response;
  },
  async (error) => {
    // Handle cache hits
    if (error.__CACHE__) {
      return { data: error.data };
    }

    const originalRequest = error.config;
    const cacheKey = `${originalRequest.method}-${
      originalRequest.url
    }-${JSON.stringify(originalRequest.params || {})}-${JSON.stringify(
      originalRequest.data || {}
    )}`;

    // Remove from pending requests
    pendingRequests.delete(cacheKey);

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        await api.post("/auth/refresh");

        // Clear cache on authentication error
        responseCache.clear();

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Clear cache and redirect to login
        responseCache.clear();
        window.location.href = "/Login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Add method to clear cache
export const clearCache = () => {
  responseCache.clear();
};

export default api;
