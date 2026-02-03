/**
 * @fileoverview ViewerRec Stub Component
 * 
 * Displays record data in a formatted viewer.
 * Used by HeaderPageAddEdit to show additional record info.
 * 
 * @module Components/ViewerRec
 */

import React from "react";
import TranslationText from "./TranslationText";

/**
 * ViewerRec Component - Displays record details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Record data to display
 * @param {Array} props.columns - Column definitions
 * @param {string} props.ResourcePage - Translation namespace
 * @returns {JSX.Element|null}
 */
export default function ViewerRec({ data, columns, ResourcePage = "" }) {
  if (!data || !columns || columns.length === 0) {
    return null;
  }

  return (
    <div className="viewer-rec bg-bgWhite dark:bg-bgWhiteDark p-4 rounded-lg border border-borderColor dark:border-borderColorDark">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {columns.map((col, index) => (
          <div key={index} className="flex flex-col gap-1">
            <span className="text-xs text-textColor dark:text-textColorDark">
              <TranslationText title={col.label || col.key} page={ResourcePage} />
            </span>
            <span className="text-sm font-medium text-titleColor dark:text-titleColorDark">
              {data[col.key] || "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
