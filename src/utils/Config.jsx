/**
 * @fileoverview Config Utility
 * 
 * Application configuration and environment helpers.
 * Delegates permission logic to the permissions module (Single Responsibility Principle).
 * 
 * @module utils/Config
 */

import {
  isAllowed,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  canViewPage,
  PERMISSION_ACTIONS,
  PAGE_PERMISSION_BASE,
} from "./permissions";

/**
 * Configuration object with app settings and permission helpers
 * 
 * Note: Permission methods delegate to the permissions module for better separation of concerns.
 * This maintains backward compatibility while following SOLID principles.
 */
const Config = {
  /**
   * Check if user is allowed to perform action on a page
   * Delegates to permissions module for actual permission checking.
   * 
   * @param {string} action - Action type ("View", "Add", "Edit", "Delete", "Post", "UnPost", "Modify")
   * @param {Object|string} pageConfig - Page configuration object with keyPage, or page key string
   * @returns {boolean} Whether action is allowed
   * 
   * @example
   * if (Config.isAllow("Delete", confiPage)) {
   *   // Show delete button
   * }
   */
  isAllow: (action, pageConfig) => isAllowed(action, pageConfig, { allowInDev: Config.isDev() }),

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission,

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions,

  /**
   * Get all user permissions
   */
  getUserPermissions,

  /**
   * Check if user can view a specific page
   */
  canViewPage,

  /**
   * Permission action constants for external use
   */
  PERMISSION_ACTIONS,

  /**
   * Page permission base IDs for external use
   */
  PAGE_PERMISSION_BASE,

  /**
   * Get API base URL from environment
   */
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",

  /**
   * Get app environment
   */
  environment: import.meta.env.MODE || "development",

  /**
   * Check if running in development mode
   */
  isDev: () => import.meta.env.DEV === true,

  /**
   * Check if running in production mode
   */
  isProd: () => import.meta.env.PROD === true,
};

export default Config;
