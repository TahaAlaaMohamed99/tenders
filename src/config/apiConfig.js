/**
 * API Configuration
 * 
 * This file manages the API base URL based on environment.
 * Use http://localhost:3001 for JSON server (development/testing)
 * Use the production URL from localStorage for production
 * 
 * To use mock server during development:
 * 1. Run: npm run mock-server (in another terminal)
 * 2. Run: npm run dev
 * 3. Set useMockServer to true below, or use localStorage
 */

// Set to true to use JSON server mock, false for production API
const USE_MOCK_SERVER = localStorage.getItem('USE_MOCK_SERVER') === 'true';

export const getApiBaseUrl = () => {
  if (USE_MOCK_SERVER) {
    return 'http://localhost:3001/api/';
  }
  
  // Fallback to stored configuration
  try {
    const config = JSON.parse(atob(localStorage.getItem('Configuration') || ''));
    return config?.urlApi || 'http://localhost:5000';
  } catch {
    return 'http://localhost:5000';
  }
};

/**
 * Toggle mock server
 * 
 * Usage in browser console:
 * - toggleMockServer(true)  // Enable mock server
 * - toggleMockServer(false) // Disable mock server
 */
export const toggleMockServer = (enabled) => {
  if (enabled) {
    localStorage.setItem('USE_MOCK_SERVER', 'true');
    console.log('Mock server ENABLED. Reload the page.');
  } else {
    localStorage.setItem('USE_MOCK_SERVER', 'false');
    console.log('Mock server DISABLED. Using production API. Reload the page.');
  }
};

// Make available globally for console access
window.toggleMockServer = toggleMockServer;
window.getMockServerStatus = () => localStorage.getItem('USE_MOCK_SERVER') === 'true';
