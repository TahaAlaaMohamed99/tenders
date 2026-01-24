import { useSelector } from "react-redux";

/**
 * Safe version of useSelector that returns null if Redux Provider is not available
 * This prevents crashes when components are used outside Redux context
 */
export function useSafeSelector(selector, defaultValue = null) {
  try {
    return useSelector(selector);
  } catch (error) {
    // Redux context not available, return default value
    return defaultValue;
  }
}
