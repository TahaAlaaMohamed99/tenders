/**
 * @fileoverview useFullRouteChain Hook
 * 
 * Returns the full route chain for breadcrumb building.
 * 
 * @module hooks/useFullRouteChain
 */

import { useLocation } from "react-router-dom";

/**
 * Get full route chain from current location
 * @returns {Array} Route chain array
 */
export default function useFullRouteChain() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  return pathSegments.map((segment, index) => ({
    path: "/" + pathSegments.slice(0, index + 1).join("/"),
    label: segment,
    isLast: index === pathSegments.length - 1
  }));
}
