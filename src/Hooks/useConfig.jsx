import { useEffect, useState } from "react";
import { setLocalStorageBtoa } from "../utils/localStorage";
import { updateApiBaseUrl } from "../services/Api";
import axios from "axios";

/**
 * Custom hook that fetches configuration data from a JSON file and stores it in localStorage.
 *
 * This hook fetches configuration from the `/Ip_config.json` endpoint and appends a timestamp
 * to prevent caching. The fetched data is stored in localStorage (Base64-encoded).
 * Also updates the API service base URL after loading configuration.
 *
 * @returns {Object|null} The fetched configuration data or null if not fetched.
 */
export default function useConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Cache-busting by appending a timestamp
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`/Ip_config.json?_=${Date.now()}`);
        let configData = response.data;
        if (typeof configData === 'string') {
          try {
            configData = JSON.parse(configData);
          } catch (error) {
            console.error("Failed to parse configuration JSON:", error);
          }
        }
        
        setConfig(configData); // Update state with fetched config
        setLocalStorageBtoa("Configuration", configData); // Save to localStorage
        
        // Update API service base URL with the loaded configuration
        updateApiBaseUrl();
      } catch (error) {
        // Phase 2 fix: Add fallback so API calls don't use an empty base URL
        // @see docs/07-action-plan.md#4-add-fallback-to-useconfig
        console.error("Failed to load Ip_config.json, using fallback:", error);
        const fallbackUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/";
        updateApiBaseUrl(fallbackUrl);
      }
    };

    fetchConfig();
  }, []);

  return config; // Return the configuration object
}
