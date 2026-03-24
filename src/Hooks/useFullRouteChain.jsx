/**
 * @fileoverview useFullRouteChain Hook
 * 
 * Returns the full route chain for breadcrumb building.
 * 
 * @module Hooks/useFullRouteChain
 */

import { useLocation, useNavigate, useParams } from "react-router-dom";

/**
 * Get full route chain from current location and extract parameters
 * @returns {Object} Route parameters and navigation helpers
 */
export default function useFullRouteChain() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const { option, id, step: stepRaw } = params;

  // step is usually base64 encoded string from URL
  let step = 0;
  if (stepRaw) {
    try {
      step = parseInt(atob(stepRaw)) || 0;
    } catch (e) {
      step = 0;
    }
  }

  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const routeChain = pathSegments.map((segment, index) => ({
    path: "/" + pathSegments.slice(0, index + 1).join("/"),
    label: segment,
    isLast: index === pathSegments.length - 1
  }));

  // prevRoute logic: usually up 2 or 3 levels depending on if step is present
  // /Module/Page/edit/5 -> /Module/Page
  // /Module/Page/edit/5/MA== -> /Module/Page
  const paramCount = (option ? 1 : 0) + (id ? 1 : 0) + (stepRaw ? 1 : 0);
  const prevRoute = "/" + pathSegments.slice(0, pathSegments.length - paramCount).join("/");

  const goBackInChain = () => {
    navigate(prevRoute);
  };

  const navigateStep = (newStep) => {
    const stepEncoded = btoa(newStep.toString());
    // Path structure: .../option/id/step
    // Current segments: [...base, option, id, stepRaw] (if stepRaw exists)
    const baseSegments = stepRaw 
      ? pathSegments.slice(0, -1) 
      : pathSegments;
    
    navigate("/" + baseSegments.join("/") + "/" + stepEncoded);
  };

  const openInNewTabErrorLog = (route, state) => {
      navigate(route, { state });
  };

  return { 
    routeChain, 
    goBackInChain, 
    openInNewTabErrorLog,
    option,
    id: parseInt(id) || 0,
    step,
    prevRoute,
    navigateStep
  };
}
