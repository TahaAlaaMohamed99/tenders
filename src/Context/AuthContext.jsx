import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getApiBaseUrl } from "../config/apiConfig";
import {
  getAuthStorage,
  setAuthStorage,
  clearAuthStorage,
  parseJwtToken,
  getLocalStorageAtob
} from "../utils/localStorage";

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * 
 * Provides authentication state and methods throughout the application.
 * Handles JWT token management, user data, and permissions.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authData = getAuthStorage();
        
        if (authData?.token && authData?.expiration) {
          const expirationDate = new Date(authData.expiration);
          
          // Check if token is still valid
          if (expirationDate > new Date()) {
            setToken(authData.token);
            setUser(authData.user);
            setIsAuthenticated(true);
          } else {
            // Token expired, clear storage
            clearAuthStorage();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        clearAuthStorage();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login with credentials
   * 
   * @param {string} userName - User's username
   * @param {string} password - User's password
   * @param {boolean} rememberMe - Whether to persist session
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = useCallback(async (userName, password, rememberMe = true) => {
    try {
      // Get API base URL from centralized config
      const baseUrl = getApiBaseUrl();
      
      const response = await axios.post(`${baseUrl}Authentication/Login`, {
        userName,
        password,
        remmberMe: rememberMe // Note: API uses 'remmberMe' (typo in backend)
      });

      const { token: jwtToken, expiration } = response.data;

      if (!jwtToken) {
        return { success: false, error: 'Invalid response from server' };
      }

      // Parse the JWT token to extract user data and permissions
      const parsedUser = parseJwtToken(jwtToken);
      
      if (!parsedUser) {
        return { success: false, error: 'Failed to parse authentication token' };
      }

      // Store auth data
      setAuthStorage(jwtToken, parsedUser, expiration);
      
      // Update state
      setToken(jwtToken);
      setUser(parsedUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      
      // -------------------------------------------------------------
      // 1. ORIGINAL ERROR HANDLING (For Real Server Responses)
      // -------------------------------------------------------------
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        // Parse error message - API may return array, object with message, or string
        let errorMessage = 'Login failed. Please try again.';
        if (Array.isArray(data)) {
          // API returns array of error messages: ["Invalid username or password."]
          errorMessage = data[0] || errorMessage;
        } else if (typeof data === 'object' && data !== null) {
          // API returns object: { message: "..." } or { errors: [...] }
          errorMessage = data.message || data.title || (data.errors?.[0]) || errorMessage;
        } else if (typeof data === 'string') {
          // API returns plain string
          errorMessage = data;
        }
        
        // If it's a validation error (Forbidden/Bad Request), show the real error.
        // We only want Mock Login if the server is BROKEN or DOWN.
        if (status === 401 || status === 400) {
          return { success: false, error: errorMessage };
        }
        
        // For other status codes (like 404 or 500), we might want to fall through to Mock Mode
        // if we are in this specific "Offline/Dev" scenario.
        // If you want strictly real errors for everything except Network Error, uncomment the next line:
        // return { success: false, error: errorMessage };
      }

      // -------------------------------------------------------------
      // ORIGINAL NETWORK/GENERIC ERROR HANDLING (Uncomment for Production)
      // -------------------------------------------------------------
      if (error.code === 'ERR_NETWORK') {
        return { success: false, error: 'Network error. Please check your connection.' };
      }
      
      return { success: false, error: 'An unexpected error occurred' };

      // -------------------------------------------------------------
      // 2. MOCK LOGIN FALLBACK (For Offline/Dev Mode/Network Error)
      // -------------------------------------------------------------
      // console.warn("Backend unavailable (Network Error or Server Error). Enabling MOCK LOGIN mode.");
      
      // const mockUser = {
      //   name: "Mock Admin",
      //   sub: "mock_user",
      //   permissions: Array.from({length: 100}, (_, i) => i + 1) 
      // };
      
      // const mockToken = "mock_jwt_token_" + Date.now();
      // const mockExpiration = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();

      // setAuthStorage(mockToken, mockUser, mockExpiration);
      // setToken(mockToken);
      // setUser(mockUser);
      // setIsAuthenticated(true);

      // return { success: true };
    }
  }, []);

  /**
   * Logout and clear all auth data
   */
  const logout = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Check if user has a specific permission
   * 
   * @param {number} permissionId - Permission ID to check
   * @returns {boolean}
   */
  const hasPermission = useCallback((permissionId) => {
    return user?.permissions?.includes(permissionId) ?? false;
  }, [user]);

  /**
   * Get all user permissions
   * 
   * @returns {number[]}
   */
  const getPermissions = useCallback(() => {
    return user?.permissions || [];
  }, [user]);

  const value = {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Methods
    login,
    logout,
    hasPermission,
    getPermissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access auth context
 * 
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
