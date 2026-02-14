/**
 * @fileoverview Route Memory Hook
 * 
 * Provides centralized route tracking for "Go Back" navigation.
 * Stores previous routes in localStorage for persistence across refreshes.
 * 
 * @module Hooks/useRouteMemory
 */

import { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setLocalStorageBtoa, getLocalStorageAtob } from "../utils/localStorage";

/**
 * Route storage keys by context
 * @constant
 */
const ROUTE_KEYS = {
  SETUP: "prevRoute_Setups",
  GENERAL: "prevRoute_General",
  LAST: "prevRoute_Last"
};

/**
 * useRouteMemory - Centralized route tracking hook
 * 
 * @param {string} context - Route context ("setup" | "general")
 * @returns {Object} Route memory utilities
 * 
 * @example
 * // In VendorsAddEdit
 * const { goBack, savePrevRoute, getPrevRoute } = useRouteMemory("setup");
 * 
 * // Save before navigation
 * savePrevRoute();
 * navigate("/somewhere");
 * 
 * // Go back to previous
 * <button onClick={goBack}>Back</button>
 */
export default function useRouteMemory(context = "general") {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine storage key based on context
  const storageKey = context === "setup" ? ROUTE_KEYS.SETUP : ROUTE_KEYS.GENERAL;
  
  /**
   * Save current route before navigating away
   */
  const savePrevRoute = useCallback(() => {
    setLocalStorageBtoa(storageKey, location.pathname);
    setLocalStorageBtoa(ROUTE_KEYS.LAST, location.pathname);
  }, [location.pathname, storageKey]);
  
  /**
   * Get the previous route
   * @returns {string} Previous route or fallback
   */
  const getPrevRoute = useCallback((fallback = "/") => {
    return getLocalStorageAtob(storageKey, fallback);
  }, [storageKey]);
  
  /**
   * Navigate back to previous route
   * @param {string} fallback - Fallback route if no previous exists
   */
  const goBack = useCallback((fallback = "/") => {
    const prev = getPrevRoute(fallback);
    navigate(prev);
  }, [getPrevRoute, navigate]);
  
  /**
   * Clear route memory for this context
   */
  const clearRouteMemory = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);
  
  // Auto-save route on mount (optional - can be disabled)
  useEffect(() => {
    // Only save if it's a list/grid page, not add/edit
    const isAddEditPage = location.pathname.includes("/add/") || 
                          location.pathname.includes("/edit/");
    if (!isAddEditPage) {
      setLocalStorageBtoa(storageKey, location.pathname);
    }
  }, [location.pathname, storageKey]);
  
  return {
    currentPath: location.pathname,
    savePrevRoute,
    getPrevRoute,
    goBack,
    clearRouteMemory
  };
}

// Phase 6: Commented out dead export — not imported anywhere
// @see docs/06-unused-and-gaps.md#42-useroutememorygetprevroutestatic
/*
export const getPrevRouteStatic = (context = "general", fallback = "/") => {
  const key = context === "setup" ? ROUTE_KEYS.SETUP : ROUTE_KEYS.GENERAL;
  return getLocalStorageAtob(key, fallback);
};
*/
