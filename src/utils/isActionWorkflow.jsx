/**
 * @fileoverview isActionWorkflow Utility
 * 
 * Determines if a workflow action should be available based on
 * workflow level data, user permissions, and record status.
 * 
 * Phase 0 fix: Rewritten to match actual consumer (HeaderPageAddEdit.jsx)
 * which expects { show: boolean, level: object | null }.
 * 
 * Previous implementation returned a simple boolean with a different
 * signature (action, statusId, workflowLevel), but the only consumer
 * calls it as isActionWorkflow(LevelsWorkFlow?.data, isAllowedModify, statusId)
 * and reads .show and .level from the result.
 * 
 * @see docs/07-action-plan.md#1.5
 * @module utils/isActionWorkflow
 */

/**
 * Check if a workflow action should be visible and get the current level.
 * 
 * @param {Array|null} workflowLevels - Array of workflow level objects from LevelsWorkFlow.data
 * @param {boolean} isAllowedModify - Whether the user has permission to modify
 * @param {number} statusId - Current record status (0=Draft, 1=Submitted, 2=FullyApproved, 3=Rejected, 4=Posted)
 * @returns {{ show: boolean, level: object|null }} Whether the action is available and the current level data
 * 
 * @example
 * const canTakeAction = isActionWorkflow(LevelsWorkFlow?.data, isAllowedModify, statusId);
 * if (canTakeAction?.show) {
 *   // Render approval/rejection buttons
 *   const currentLevel = canTakeAction.level; // { recId, levelNumber, status, ... }
 * }
 */
export function isActionWorkflow(workflowLevels, isAllowedModify, statusId) {
  // No workflow data or not submitted — no action available
  if (!workflowLevels || !Array.isArray(workflowLevels) || statusId !== 1) {
    return { show: false, level: null };
  }

  // Find the first pending level (status === 1 means pending approval)
  const pendingLevel = workflowLevels.find(
    (level) => level.status === 1
  );

  if (!pendingLevel) {
    return { show: false, level: null };
  }

  return {
    show: isAllowedModify === true,
    level: pendingLevel,
  };
}
