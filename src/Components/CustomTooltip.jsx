import React from "react";
import { createPortal } from "react-dom";
import TranslationText from "./TranslationText";

/**
 * A reusable Tooltip component with portal rendering, automatic translation, 
 * dynamic positioning, and RTL support.
 *
 * @param {Object} props
 * @param {string} props.content - Text or Translation Key.
 * @param {DOMRect} props.rect - The bounding rectangle of the target element.
 * @param {boolean} props.visible - Whether the tooltip is visible.
 * @param {string} [props.ResourcePage="General"] - Translation namespace.
 * @param {string} [props.placement="right"] - Position: 'top', 'bottom', 'left', 'right'.
 *                                              Note: 'right' means physically to the right.
 *                                              For RTL mirroring (e.g. sidebar), layout logic should pass 'left'.
 */
const CustomTooltip = ({
  content,
  rect,
  visible,
  ResourcePage = "General",
  placement = "right",
}) => {
  if (!visible || !rect) return null;

  // Gap between target and tooltip
  const GAP = 10;
  // Offset for the arrow center (approximate)
  const ARROW_SIZE = 6; 

  const style = {
    position: "fixed",
    zIndex: 9999,
  };

  // Triangle/Arrow Styles
  let arrowStyle = {
    position: "absolute",
    width: "12px",
    height: "12px",
    backgroundColor: "inherit", // Matches tooltip background
    zIndex: -1, // Behind the content but part of the tooltip visual
  };
  
  // We use CSS transforms for centering to avoid needing exact width/height of tooltip
  // and specific positioning for the arrow.

  switch (placement) {
    case "top":
      style.top = rect.top - GAP;
      style.left = rect.left + rect.width / 2;
      style.transform = "translate(-50%, -100%)";
      // Arrow at bottom
      arrowStyle = { ...arrowStyle, bottom: "-4px", left: "50%", transform: "translateX(-50%) rotate(45deg)" };
      break;

    case "bottom":
      style.top = rect.bottom + GAP;
      style.left = rect.left + rect.width / 2;
      style.transform = "translate(-50%, 0)";
      // Arrow at top
      arrowStyle = { ...arrowStyle, top: "-4px", left: "50%", transform: "translateX(-50%) rotate(45deg)" };
      break;

    case "left":
      style.top = rect.top + rect.height / 2;
      style.left = rect.left - GAP;
      style.transform = "translate(-100%, -50%)";
      // Arrow at right
      arrowStyle = { ...arrowStyle, right: "-4px", top: "50%", transform: "translateY(-50%) rotate(45deg)" };
      break;

    case "right":
    default:
      style.top = rect.top + rect.height / 2;
      style.left = rect.right + GAP;
      style.transform = "translate(0, -50%)";
      // Arrow at left
      arrowStyle = { ...arrowStyle, left: "-4px", top: "50%", transform: "translateY(-50%) rotate(45deg)" };
      break;
  }

  return createPortal(
    <div
      style={style}
      className={`
        px-3 py-2 
        bg-primary text-white text-xs rounded-md shadow-xl 
        whitespace-nowrap pointer-events-none fade-in
        flex items-center justify-center
      `}
    >
      <TranslationText page={ResourcePage} title={content} />
      
      {/* 
        Changes: Using a rotated square div for the arrow is often easier/cleaner than clip-path for 
        dynamic sides, as it naturally creates the point. 
        However, the passed color must match. 
        Legacy clip-path approach is fine too, but rotation is more generic for 4 sides.
      */}
      <div className="bg-primary w-2 h-2 absolute" style={arrowStyle}></div>
    </div>,
    document.body
  );
};

export default CustomTooltip;
