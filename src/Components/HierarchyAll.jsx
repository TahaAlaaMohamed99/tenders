/**
 * @fileoverview HierarchyAll Stub Component
 * 
 * Displays hierarchical structure of records.
 * Placeholder for future implementation.
 * 
 * @module Components/HierarchyAll
 */

import React from "react";
import TranslationText from "./TranslationText";

/**
 * HierarchyAll Component - Shows hierarchy view
 * @returns {JSX.Element|null}
 */
export default function HierarchyAll({ 
  data, 
  config, 
  isOpen = false, 
  onClose,
  ResourcePage = "General"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-bgWhite dark:bg-bgWhiteDark p-6 rounded-xl max-w-lg w-full mx-4">
        <h3 className="text-lg font-semibold text-titleColor dark:text-titleColorDark mb-4">
          <TranslationText title="hierarchyView" page={ResourcePage} />
        </h3>
        <p className="text-textColor dark:text-textColorDark text-sm">
          <TranslationText title="hierarchyViewPlaceholder" page={ResourcePage} />
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-primary dark:bg-primaryDark text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <TranslationText title="close" page={ResourcePage} />
        </button>
      </div>
    </div>
  );
}

