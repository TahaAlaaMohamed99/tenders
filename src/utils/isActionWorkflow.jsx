/**
 * @fileoverview isActionWorkflow Utility
 * 
 * Determines if a specific workflow action should be shown
 * based on record status and workflow levels.
 * 
 * @module utils/isActionWorkflow
 */

/**
 * Check if workflow action should be visible
 * 
 * @param {string} action - Action name (e.g., "submit", "approve")
 * @param {number} statusId - Current record status
 * @param {number} workflowLevel - Current workflow level
 * @returns {boolean} Whether action should be shown
 * 
 * @example
 * if (isActionWorkflow("submit", record.statusId, record.level)) {
 *   // Show submit button
 * }
 */
export function isActionWorkflow(action, statusId, workflowLevel = 0) {
  // Status IDs:
  // 0 = Draft
  // 1 = Submitted
  // 2 = FullyApproved
  // 3 = Rejected
  // 4 = Posted

  switch (action) {
    case "submit":
      return statusId === 0; // Only show Submit for Draft
    
    case "approve":
    case "reject":
      return statusId === 1; // Only show for Submitted
    
    case "post":
      return statusId === 2; // Only show for FullyApproved
    
    case "unpost":
      return statusId === 4; // Only show for Posted
    
    case "resubmit":
      return statusId === 3; // Only show for Rejected
    
    default:
      return false;
  }
}
