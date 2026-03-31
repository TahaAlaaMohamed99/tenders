import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { IconColsed } from "../assets/Icons";

/**
 * ActionModal - A flexible modal component supporting multiple display modes.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {() => void} props.onClose - Callback when checking outside or pressing Escape.
 * @param {string} [props.title] - Optional title displayed in the header.
 * @param {ReactNode} props.children - The content to display inside the modal.
 * @param {'full' | 'dropdown' | 'sidebar'} [props.mode='full'] - The display mode:
 *   - 'full': Standard centered modal with overlay (default).
 *   - 'dropdown': Positioned relative to the trigger element (popover style).
 *   - 'sidebar': Slide-out panel (can be customized for left/right).
 * @param {RefObject} [props.triggerRef] - Required for 'dropdown' mode. The ref of the button/element that triggers the modal.
 * @param {string} [props.position='bottom-right'] - Alignment for 'dropdown'. 'bottom-start' | 'bottom-end' (logical) or 'bottom-left' | 'bottom-right' (physical).
 * @param {string} [props.className] - Custom tailwind classes for the container.
 * @param {boolean} [props.unstyled=false] - If true, removes default white background/padding/shadows, allowing full custom styling via children/className.
 */
export default function ActionModal({
  isOpen,
  onClose,
  title,
  children,
  mode = "full",
  triggerRef,
  position = "bottom-right",
  className = "",
  unstyled = false,
}) {
  const modalRef = useRef(null);
  const [coords, setCoords] = useState({});

  // --- 1. Handle Escape Key ---
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Lock scroll only for full modal
      if (mode === "full") document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, mode]);

  // --- 2. Handle Click Outside ---
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      // If clicking trigger, let the trigger handle toggling (don't close immediately here to avoid conflict)
      if (triggerRef?.current && triggerRef.current.contains(event.target)) {
        return;
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  // --- 3. Calculate Position for Dropdown/Sidebar (viewport-aware) ---
  useLayoutEffect(() => {
    if (!isOpen || mode !== "dropdown" || !triggerRef?.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const isRTL = document.documentElement.dir === "rtl";
    const MODAL_WIDTH  = 288; // w-72 = 18rem = 288px
    const MODAL_HEIGHT = 380; // conservative estimate for dropdown height
    const PADDING      = 8;   // min gap from viewport edges

    const style = {
      position: "fixed",
      zIndex: 999999,
    };

    // ── Vertical: prefer below, flip above if no room ──────────────────────
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow >= MODAL_HEIGHT || spaceBelow >= spaceAbove) {
      // Place below trigger
      style.top = rect.bottom - 5.5;
    } else {
      // Flip above trigger
      style.top = "auto";
      style.bottom = window.innerHeight - rect.top + 5.5;
    }

    // ── Horizontal: respect position prop, flip if overflow ───────────────
    const wantsRight =
      position === "bottom-end" && !isRTL ||
      position === "bottom-right" ||
      (position === "bottom-start" && isRTL);

    if (wantsRight) {
      // Align right edge of modal with right edge of trigger
      const rightAnchor = window.innerWidth - rect.right;
      if (rect.right - MODAL_WIDTH - PADDING >= 0) {
        // Enough space to the left → align right
        style.left = "auto";
        style.right = rightAnchor;
      } else {
        // Not enough room → flip: align left edge with trigger left
        style.left = Math.max(PADDING, rect.left);
        style.right = "auto";
      }
    } else {
      // Align left edge of modal with left edge of trigger
      const leftAnchor = rect.left;
      if (leftAnchor + MODAL_WIDTH + PADDING <= window.innerWidth) {
        // Enough space to the right → align left
        style.left = Math.max(PADDING, leftAnchor);
        style.right = "auto";
      } else {
        // Not enough room → flip: align right edge with trigger right
        style.left = "auto";
        style.right = window.innerWidth - rect.right;
      }
    }

    setCoords(style);
  }, [isOpen, mode, triggerRef, position]);


  if (!isOpen) return null;

  // --- Render based on Mode ---

  // Mode: 'full' (Standard Centered Modal)
  if (mode === "full") {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
        <div
          ref={modalRef}
          className={`${
            unstyled
              ? "relative w-full mx-4"
              : "bg-white dark:bg-bgCardDark rounded-2xl w-full max-w-md mx-4 p-6 relative border border-borderColor dark:border-borderColorDark"
          } animate-in zoom-in-95 duration-200 ${className}`}
        >
          {/* Header - Only render if NOT unstyled OR if title exists (optional behavior, strictly unstyled means NO header by default) */}
          {!unstyled && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-titleColor dark:text-titleColorDark">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-error transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <IconColsed className="w-6 h-6" />
              </button>
            </div>
          )}
          {/* Content */}
          <div
            className={
              unstyled ? "" : "text-textColor dark:text-textColorDark"
            }
          >
            {children}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Mode: 'dropdown' (Inline Popover)
  if (mode === "dropdown") {
    return createPortal(
      <div
        ref={modalRef}
        style={coords}
        className={`bg-white dark:bg-bgCardDark border border-borderColor dark:border-borderColorDark rounded-xl p-4 w-64 animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}
      >
        {/* Optional Header for dropdown */}
        {title && (
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {title}
            </h3>
          </div>
        )}
        <div className="text-textColor dark:text-textColorDark">{children}</div>
      </div>,
      document.body
    );
  }

  // Mode: 'sidebar' (Implementation similar to existing Sidebar Floating Menu logic can go here if needed)
  if (mode === "sidebar") {
     // TODO: Implement specific sidebar logic if different from dropdown
     return null; 
  }

  return null;
}
