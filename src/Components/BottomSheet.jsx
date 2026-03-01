/**
 * @fileoverview BottomSheet Component
 * 
 * Mobile-first bottom sheet for actions.
 * Slides up from bottom on mobile devices.
 * 
 * @module Components/BottomSheet
 */

import { useEffect } from "react";

/**
 * BottomSheet Component - Mobile action sheet
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sheet is visible
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Sheet title
 * @param {React.ReactNode} props.children - Content
 * @returns {JSX.Element|null}
 */
export default function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) {
  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-bgWhite dark:bg-bgWhiteDark rounded-t-2xl shadow-lg animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
        
        {/* Title */}
        {title && (
          <div className="px-4 pb-2 border-b border-borderColor dark:border-borderColorDark">
            <h3 className="text-lg font-semibold text-titleColor dark:text-titleColorDark">
              {typeof title === 'string' ? title : title}
            </h3>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
