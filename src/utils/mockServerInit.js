/**
 * Mock Server Initialization
 * 
 * Run this on app startup to enable mock mode when needed.
 * This is automatically imported in index.html.
 */

const MOCK_MODE_ENABLED = localStorage.getItem('USE_MOCK_SERVER') === 'true';

if (MOCK_MODE_ENABLED) {
  console.log('%c🔵 MOCK SERVER MODE ENABLED', 'color: blue; font-size: 14px; font-weight: bold;');
  console.log('API Base URL: http://localhost:3001');
  console.log('To disable: toggleMockServer(false)');
} else {
  console.log('%c🟢 Production API Mode', 'color: green; font-size: 14px; font-weight: bold;');
  console.log('To enable mock server: toggleMockServer(true)');
}

// Show visual indicator in the app
document.addEventListener('DOMContentLoaded', () => {
  if (MOCK_MODE_ENABLED) {
    // Add a visual indicator to the page
    const indicator = document.createElement('div');
    indicator.id = 'mock-mode-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 9999;
      background: #3b82f6;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: all 0.3s;
    `;
    indicator.textContent = '🔵 MOCK SERVER MODE';
    indicator.title = 'Click to disable mock mode';
    indicator.onclick = () => {
      toggleMockServer(false);
      window.location.reload();
    };
    document.body.appendChild(indicator);
  }
});
