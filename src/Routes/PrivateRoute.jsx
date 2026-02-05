import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getAuthStorage, isTokenExpired } from "../utils/useFromLocalStorage";

import Loading from "../Components/loader";

/**
 * PrivateRoute Component
 * 
 * Protects routes that require authentication.
 * Checks for:
 * - Authentication state
 * - Token validity and expiration
 * - Auto-logout on token expiration
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  // Check token expiration on route changes
  useEffect(() => {
    if (isAuthenticated) {
      const authData = getAuthStorage();
      
      if (!authData?.token || isTokenExpired()) {
        console.warn('Token expired or invalid. Logging out...');
        logout();
      }
    }
  }, [isAuthenticated, location.pathname, logout]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  // Additional token validation
  if (isAuthenticated) {
    const authData = getAuthStorage();
    
    // If token is missing or expired, redirect to login
    if (!authData?.token || isTokenExpired()) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
