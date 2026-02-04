export const setLocalStorageBtoa = (key, value) => {
  // Convert the value (object or any data) into a JSON string
  const jsonString = JSON.stringify(value);

  // Encode the JSON string into UTF-8 bytes
  const utf8Bytes = new TextEncoder().encode(jsonString);

  // Convert the UTF-8 bytes into a binary string (characters)
  const binary = utf8Bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');

  // Encode the binary string into a Base64 string
  const base64 = btoa(binary);

  // Store the Base64 string in localStorage using the provided key
  localStorage.setItem(key, base64);
};


export const getLocalStorageAtob = (key, defaultValue) => {
  try {
    // Retrieve the stored item from localStorage using the given key
    const storedItem = localStorage.getItem(key);

    // Check if the item exists in localStorage
    if (storedItem) {
      // Decode the Base64 string using atob to get the binary string
      const binary = atob(storedItem);

      // Convert the binary string into an array of UTF-8 bytes
      // Each character is converted to its decimal value using charCodeAt
      const utf8Bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

      // Use TextDecoder to decode the UTF-8 bytes into a string
      const decodedItem = new TextDecoder().decode(utf8Bytes);

      // Parse the decoded string into a JavaScript object using JSON.parse
      return JSON.parse(decodedItem);
    }
  } catch (error) {
    // If any error occurs (e.g., data is invalid or error during decoding), return the default value
    return defaultValue;
  }

  // If the item is not found in localStorage, return the default value
  return defaultValue;
};


export const getLocalStorageAll= () => {
  Object.fromEntries(
    Object.entries(localStorage).filter(([key]) => key !== 'theme' && key !== 'language')
  );
};

// ==================== Auth Storage Utilities ====================

export const AUTH_STORAGE_KEY = 'AuthData';

/**
 * Store authentication data securely in localStorage
 * @param {string} token - JWT token
 * @param {Object} user - Parsed user data from token
 * @param {string} expiration - Token expiration datetime
 */
export const setAuthStorage = (token, user, expiration) => {
  setLocalStorageBtoa(AUTH_STORAGE_KEY, { token, user, expiration });
};

/**
 * Retrieve authentication data from localStorage
 * @returns {Object|null} Auth data { token, user, expiration } or null
 */
export const getAuthStorage = () => {
  return getLocalStorageAtob(AUTH_STORAGE_KEY, null);
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem('isAuthenticated');
};

/**
 * Check if the stored token is expired
 * @returns {boolean} True if token is expired or not found
 */
export const isTokenExpired = () => {
  const authData = getAuthStorage();
  if (!authData?.expiration) return true;
  
  const expirationDate = new Date(authData.expiration);
  return expirationDate <= new Date();
};

/**
 * Parse JWT token and extract payload
 * @param {string} token - JWT token string
 * @returns {Object} Decoded token payload
 */
export const parseJwtToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    
    return {
      userId: payload.UserId,
      userName: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      permissions: payload.Permissions?.split(',').map(Number) || [],
      exp: payload.exp,
      jti: payload.jti
    };
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
};