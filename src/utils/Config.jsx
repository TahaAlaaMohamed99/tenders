/**
 * @fileoverview Config Utility
 * 
 * Application configuration and permission helpers.
 * 
 * @module utils/Config
 */

/**
 * Configuration object with permission helpers
 */
const Config = {
  /**
   * Check if user is allowed to perform action
   * 
   * @param {string} permission - Permission key
   * @param {string} action - Action type ("view", "edit", "delete")
   * @returns {boolean} Whether action is allowed
   * 
   * @example
   * if (Config.isAllow("Vendors", "delete")) {
   *   // Show delete button
   * }
   */
  isAllow: (permission, action = "view") => {
    // TODO: Implement proper permission checking with user roles
    // For now, allow all actions
    return true;
  },

  /**
   * Get API base URL
   */
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",

  /**
   * Get app environment
   */
  environment: import.meta.env.MODE || "development",

  /**
   * Check if development mode
   */
  isDev: () => import.meta.env.DEV === true,
};

export default Config;
