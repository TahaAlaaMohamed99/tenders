import axios from "axios";
import { getLocalStorageAtob, getAuthStorage, clearAuthStorage } from "../utils/localStorage";
import { getApiBaseUrl } from "../config/apiConfig";

/**
 * API Service
 * 
 * Centralized Axios instance with interceptors for:
 * - Automatic token injection
 * - Dynamic language headers
 * - Comprehensive error handling
 * - 401/403 response handling
 * - Support for mock server via JSON server
 */

// Create base Axios instance
export const Api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: "*/*",
    // Note: Content-Type is set automatically by Axios based on request body
    // Setting it explicitly can break multipart/form-data uploads
  },
});

// Flag to prevent multiple redirects
let isRedirecting = false;

/**
 * Request Interceptor
 * 
 * Injects Authorization header and Accept-Language dynamically
 */
Api.interceptors.request.use(
  (config) => {
    // Get fresh token on each request
    const token = localStorage.getItem("userToken");
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add language header dynamically
    const currentLanguage = localStorage.getItem("language") || "en";
    config.headers["Accept-Language"] = currentLanguage;
    
    // Ensure base URL is set (handles lazy config loading)
    if (!config.baseURL) {
      config.baseURL = getApiBaseUrl();
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Handles:
 * - GET requests return data directly
 * - Network errors
 * - 401 Unauthorized (trigger logout)
 * - 403 Forbidden (permission denied)
 * - 4xx Client errors
 * - 5xx Server errors
 */
Api.interceptors.response.use(
  (response) => {
    // For GET requests, return data directly for convenience
    if (response.config.method === "get") {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Network-related errors (e.g., server down, no internet)
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject({
        message: "Network error. Please check your connection and try again.",
        details: error.message,
        isNetworkError: true
      });
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized
    if (status === 401) {
      console.error("Unauthorized access:", data);
      
      // Prevent redirect loop
      if (!isRedirecting && typeof window !== "undefined") {
        isRedirecting = true;
        
        // Clear auth data
        clearAuthStorage();
        
        // Use a small delay to allow state cleanup
        setTimeout(() => {
          window.location.href = "/login";
          isRedirecting = false;
        }, 100);
      }

      return Promise.reject({
        message: "Your session has expired. Please log in again.",
        details: data,
        isAuthError: true,
        status: 401
      });
    }

    // Handle 403 Forbidden (permission denied)
    if (status === 403) {
      console.error("Forbidden access:", data);
      return Promise.reject({
        message: "You do not have permission to perform this action.",
        details: data,
        isPermissionError: true,
        status: 403
      });
    }

    // Handle API server errors (5xx)
    if (status >= 500 && status < 600) {
      console.error("Server Error:", data);
      return Promise.reject({
        message: "Server error. Please try again later.",
        details: data,
        isServerError: true,
        status
      });
    }

    // Handle other client errors (4xx)
    if (status >= 400 && status < 500) {
      console.error("Client Error:", data);
      return Promise.reject({
        message: data?.message || error?.message || "An error occurred. Please try again.",
        details: data || error?.details,
        isClientError: true,
        status
      });
    }

    // Default error handling
    console.error("Unknown Error:", data);
    return Promise.reject({
      message: "An unexpected error occurred. Please try again.",
      details: data || error?.details,
      status
    });
  }
);

/**
 * Helper to update base URL after config loads
 * Call this after useConfig hook fetches the configuration
 */
export const updateApiBaseUrl = () => {
  // Don't overwrite base URL if in mock mode
  if (localStorage.getItem('USE_MOCK_SERVER') === 'true') {
     return;
  }

  const latestConfig = getLocalStorageAtob('Configuration') || {};
  if (latestConfig?.urlApi) {
    Api.defaults.baseURL = latestConfig.urlApi;
  }
};