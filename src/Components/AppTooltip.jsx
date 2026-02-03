import React from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import TranslationText from "./TranslationText";

/**
 * AppTooltip Component
 *
 * A single source of truth for tooltips in the application.
 * Wraps 'react-tooltip' and automatically handles translation via TranslationText.
 *
 * Usage:
 * Add the following attributes to any element:
 * - data-tooltip-id="global-tooltip"
 * - data-tooltip-content="TranslationKey"
 * - data-resource-page="ResourceName" (Optional, defaults to 'General')
 * - data-tooltip-place="top" (Optional)
 *
 * @returns {JSX.Element}
 */
const AppTooltip = () => {
  return (
    <Tooltip
      id="global-tooltip"
      // Use efficient strategy: only render content when active
      render={({ content, activeAnchor }) => {
        if (!content || !activeAnchor) return null;

        // Extract the resource page from the anchor element's data attribute
        const resourcePage =
          activeAnchor.getAttribute("data-resource-page") || "General";

        return <TranslationText page={resourcePage} title={content} />;
      }}
      // Global styling (can be adjusted via CSS targeting .app-tooltip)
      className="app-tooltip remove-arrow"
      // Animation settings
      delayShow={200}
      offset={10}
      noArrow={false}
      // Ensure it renders in the correct stacking context (portal) - react-tooltip does this by default usually
    />
  );
};

export default AppTooltip;
