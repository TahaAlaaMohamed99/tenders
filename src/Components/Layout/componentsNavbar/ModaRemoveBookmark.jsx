/**
 * @fileoverview ModaRemoveBookmark Component
 * 
 * Modal for confirming bookmark removal.
 * 
 * @module Components/Layout/componentsNavbar/ModaRemoveBookmark
 */

import React from "react";
import ConfirmationModal from "../../ConfirmationModal";

/**
 * ModaRemoveBookmark - Bookmark removal confirmation
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onConfirm - Confirm handler
 * @param {Function} props.onClose - Close handler
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
      isOpen={isOpen}
      onConfirm={onConfirm}
      onClose={onClose}
      title="removeBookmark"
      message="confirmRemoveBookmark"
      confirmText="remove"
      cancelText="cancel"
    />
  );
}
