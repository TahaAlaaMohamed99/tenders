/**
 * @fileoverview ModaRemoveBookmark Component
 * 
 * Modal for confirming bookmark removal.
 * Phase 1 fix: Corrected prop names to match ConfirmationModal interface
 * (isVisible, onCancel, description, confirmButtonLabel, cancelButtonLabel).
 * 
 * @see docs/06-unused-and-gaps.md#13-modaremovebookmarkjsx
 * @module Components/Layout/componentsNavbar/ModaRemoveBookmark
 */

import React from "react";
import ConfirmationModal from "../../ConfirmationModal";

/**
 * ModaRemoveBookmark - Bookmark removal confirmation
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onConfirm - Confirm handler
 * @param {Function} props.onClose - Close/cancel handler
 * @returns {JSX.Element|null}
 */
export default function ModaRemoveBookmark({ 
  isOpen, 
  onConfirm, 
  onClose 
}) {
  if (!isOpen) return null;

  return (
    <ConfirmationModal
      isVisible={isOpen}
      onConfirm={onConfirm}
      onCancel={onClose}
      title="removeBookmark"
      description="confirmRemoveBookmark"
      confirmButtonLabel="remove"
      cancelButtonLabel="cancel"
      type="delete"
    />
  );
}
