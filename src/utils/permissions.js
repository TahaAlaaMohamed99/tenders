/**
 * @fileoverview Permission Utilities
 * 
 * Provides permission checking functionality for role-based access control.
 * Follows Single Responsibility Principle - handles only permission logic.
 * 
 * @module utils/permissions
 */

import { getAuthStorage } from "./localStorage";

/**
 * Permission action types and their offsets
 * Each page has a set of permissions: View, Add, Edit, Delete, Post, UnPost, Modify
 * Permission IDs follow the pattern: baseId + actionOffset
 */
export const PERMISSION_ACTIONS = Object.freeze({
  View: 0,
  Add: 1,
  Edit: 2,
  Delete: 3,
  Post: 4,
  UnPost: 5,
  Modify: 6,
  Submit: 7,
  Approve: 8,
  Reject: 9,
});

/**
 * Page permission base IDs
 * Maps page keys to their base permission ID
 * This should match your backend permission configuration
 */
export const PAGE_PERMISSION_BASE = Object.freeze({
  Dashboard: 49,
  Journal: 56,
  SubmissionDocuments: 63,
  Reports: 70,
  Setup: 77,
  Vendors: 84,
  VendorGroups: 91,
  Currencies: 98,
  Items: 105,
  Departments: 112,
  Settings: 119,
});

// Number of actions per page
export const ACTIONS_PER_PAGE = 7;

/**
 * Get page key from page configuration
 * 
 * @param {Object|string} pageConfig - Page configuration object or page key string
 * @returns {string|null} Page key or null
 */
const getPageKey = (pageConfig) => {
  if (typeof pageConfig === 'string') return pageConfig;
  return pageConfig?.keyPage ?? null;
};

/**
 * Calculate permission ID for a given action and page
 * 
 * @param {string} action - Action type (Delete, Post, UnPost, Modify, etc.)
 * @param {Object|string} pageConfig - Page configuration object or page key
 * @returns {number|null} Permission ID or null if not found
 */
export const calculatePermissionId = (action, pageConfig) => {
  const pageKey = getPageKey(pageConfig);
  if (!pageKey) return null;
  
  const baseId = PAGE_PERMISSION_BASE[pageKey];
  if (baseId === undefined) {
    console.warn(`Page "${pageKey}" not found in permission mapping.`);
    return null;
  }
  
  const actionOffset = PERMISSION_ACTIONS[action];
  if (actionOffset === undefined) {
    console.warn(`Action "${action}" not found in permission actions.`);
    return null;
  }
  
  return baseId + actionOffset;
};

/**
 * Get current user's permissions from storage
 * 
 * @returns {number[]} Array of permission IDs
 */
export const getUserPermissions = () => {
  const authData = getAuthStorage();
  return authData?.user?.permissions ?? [];
};

/**
 * Check if user is allowed to perform action on a page
 * 
 * @param {string} action - Action type ("View", "Add", "Edit", "Delete", "Post", "UnPost", "Modify")
 * @param {Object|string} pageConfig - Page configuration object with keyPage, or page key string
 * @param {Object} options - Optional configuration
 * @param {boolean} options.allowInDev - Allow action in development mode if no permissions found
 * @returns {boolean} Whether action is allowed
 */
export const isAllowed = (action, pageConfig, options = {}) => {
  const { allowInDev = true } = options;
  const isDev = import.meta.env.DEV === true;
  
  const userPermissions = getUserPermissions();
  
  // If no permissions found
  if (!userPermissions.length) {
    if (isDev && allowInDev) {
      console.warn('No permissions found. Dev mode: allowing action.');
      return true;
    }
    return false;
  }
  
  // Calculate the required permission ID
  const permissionId = calculatePermissionId(action, pageConfig);
  
  // If permission ID couldn't be calculated, allow by default (graceful degradation)
  if (permissionId === null) {
    return true;
  }
  
  return userPermissions.includes(permissionId);
};

/**
 * Check if user has any of the specified permissions
 * 
 * @param {number[]} permissionIds - Array of permission IDs
 * @returns {boolean} Whether user has any of the permissions
 */
export const hasAnyPermission = (permissionIds) => {
  const userPermissions = getUserPermissions();
  return permissionIds.some(id => userPermissions.includes(id));
};

/**
 * Check if user has all of the specified permissions
 * 
 * @param {number[]} permissionIds - Array of permission IDs
 * @returns {boolean} Whether user has all permissions
 */
export const hasAllPermissions = (permissionIds) => {
  const userPermissions = getUserPermissions();
  return permissionIds.every(id => userPermissions.includes(id));
};

/**
 * Check if user can view a specific page
 * 
 * @param {string} pageKey - Page key from SidebarLogs
 * @returns {boolean} Whether user can view the page
 */
export const canViewPage = (pageKey) => {
  return isAllowed("View", pageKey);
};
