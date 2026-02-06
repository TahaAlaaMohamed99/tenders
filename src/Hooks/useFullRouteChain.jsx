/**
 * @fileoverview useFullRouteChain Hook
 * 
 * Returns the full route chain for breadcrumb building.
 * 
 * @module Hooks/useFullRouteChain
 */

import { useLocation, useNavigate } from "react-router-dom";

/**
 * Get full route chain from current location
 * @returns {Array} Route chain array
 */
export default function useFullRouteChain() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const routeChain = pathSegments.map((segment, index) => ({
    path: "/" + pathSegments.slice(0, index + 1).join("/"),
    label: segment,
    isLast: index === pathSegments.length - 1
  }));

  const goBackInChain = () => {
    navigate(-1);
  };

  const openInNewTabErrorLog = (route, state) => {
      // For now, negotiate "new tab" as "navigate" to ensure state passing works reliably
      // or use window.open if state can be serialised. 
      // Given the complex state, navigate is safer.
      navigate(route, { state });
  };

  return { routeChain, goBackInChain, openInNewTabErrorLog };
}
