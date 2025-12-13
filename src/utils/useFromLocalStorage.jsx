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