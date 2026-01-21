import axios from "axios";
import { getLocalStorageAtob } from "../utils/useFromLocalStorage";

// const userTokenJSON = localStorage.getItem("userToken");
// const jsonString = atob(userTokenJSON);
// const userToken = JSON.parse(jsonString);
const currentLanguage = localStorage.getItem("language") || "en";
const config  = getLocalStorageAtob('Configuration') || {} 
export const Api = axios.create({
  baseURL: config?.urlApi,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
    "Accept-Language":currentLanguage|| "en",
    // Authorization: userToken.authorizationCode,
  },
});

Api.interceptors.response.use(
    (response) => {
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
        });
      }
  
      // Handle 401 Unauthorized (user not logged in)
      if (error.response.status === 401) {
        console.error("Unauthorized access:", error.response.data);
        // Redirect the user to the login page (using react-router for web, or react-navigation for React Native)
        if (typeof window !== "undefined") {
          // For web (using react-router)
          window.location.href = "/login"; // أو استخدم `history.push('/login')` إذا كنت تستخدم `useHistory`
        } else {
          
        }
  
        return Promise.reject({
          message: "You are not logged in. Please log in again.",
          details: error.response.data,
        });
      }
  
      // Handle API server errors (5xx) and other client errors (4xx)
      if (error.response.status >= 500 && error.response.status < 600) {
        console.error("Server Error:", error.response.data);
        return Promise.reject({
          message: "Server error. Please try again later.",
          details: error.response.data,
        });
      }
  
      if (error.response.status >= 400 && error.response.status < 500 ) {
        console.error("Client Error:", error.response.data);
        return Promise.reject({
          message: error.response.data.message || error?.message || "An error occurred. Please try again.",
          details: error.response.data || error?.details ,
        });
      }
  
      // Default error handling
      console.error("Unknown Error:", error.response.data);
      return Promise.reject({
        message: "An unexpected error occurred. Please try again.",
        details: error.response.data || error?.details
      });
    }
  );