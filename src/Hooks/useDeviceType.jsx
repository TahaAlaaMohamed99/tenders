import { useState, useLayoutEffect } from "react";

/**
 * Function: getDeviceType
 * Determines the device type based on the window width.
 *
 * @param {number} width - The current window width.
 * @returns {string} - Returns "mobile", "tablet", or "desktop".
 */
const getDeviceType = (width) => {
  if (width < 641) return "mobile"; // Width less than 768px is mobile
  if (width >= 641 && width < 1024) return "tablet"; // Width between 768px and 1024px is tablet
  return "desktop"; // Width greater than 1024px is desktop
};

/**
 * Custom Hook: useDeviceType
 * Tracks the current device type based on the window width.
 *
 * @returns {string} deviceType - Returns "mobile", "tablet", or "desktop".
 */
const useDeviceType = () => {
  // State to track the current device type
  const [deviceType, setDeviceType] = useState(getDeviceType(window.innerWidth));

  useLayoutEffect(() => {
    /**
     * Event handler to update the device type when the window is resized.
     */
    const handleResize = () => {
      setDeviceType(getDeviceType(window.innerWidth));
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Runs only on mount and unmount

  return deviceType; // Return the current device type
};

export default useDeviceType;
