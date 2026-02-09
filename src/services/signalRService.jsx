/**
 * @fileoverview SignalR Service Stub
 * 
 * Provides real-time communication capabilities using SignalR.
 * This is a stub implementation - replace with actual SignalR client.
 * 
 * @module services/signalRService
 */

/**
 * SignalR Service - Real-time communication
 * 
 * @example
 * // Subscribe to updates
 * signalRService.on("recordUpdated", (data) => {
 *   console.log("Record updated:", data);
 * });
 * 
 * // Send a message
 * signalRService.send("updateRecord", { id: 123 });
 */
const signalRService = {
  /**
   * Connection status
   */
  isConnected: false,

  /**
   * Event handlers map
   */
  handlers: new Map(),

  /**
   * Connect to SignalR hub
   * @returns {Promise<void>}
   */
  connect: async () => {
    // TODO: Implement actual SignalR connection
    console.log("[signalRService] Stub: connect called");
    signalRService.isConnected = true;
  },

  /**
   * Disconnect from SignalR hub
   */
  disconnect: () => {
    console.log("[signalRService] Stub: disconnect called");
    signalRService.isConnected = false;
  },

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  on: (event, handler) => {
    if (!signalRService.handlers.has(event)) {
      signalRService.handlers.set(event, []);
    }
    signalRService.handlers.get(event).push(handler);
  },

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler to remove
   */
  off: (event, handler) => {
    const handlers = signalRService.handlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) handlers.splice(index, 1);
    }
  },

  /**
   * Send a message to the hub
   * @param {string} method - Method name
   * @param {any} data - Data to send
   */
  send: (method, data) => {
    console.log("[signalRService] Stub: send called", { method, data });
  },

  /**
   * Send notification to a user (Phase 2 fix)
   * Called by useWorkflowActions during approval cycle.
   * @see docs/06-unused-and-gaps.md#52-signalrservicejsx
   * @param {number} userRecId
   * @param {number} transactionRecId
   * @param {string} transactionName
   * @param {string} code
   * @param {number} type
   */
  sendNotification: (userRecId, transactionRecId, transactionName, code, type) => {
    // TODO: Replace with actual SignalR hub invocation when implemented
    console.log("[signalRService] Stub: sendNotification called", {
      userRecId, transactionRecId, transactionName, code, type,
    });
  },
};

export default signalRService;
