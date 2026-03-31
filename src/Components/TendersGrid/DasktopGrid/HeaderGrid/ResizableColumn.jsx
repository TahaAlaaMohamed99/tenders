import { useCallback, useRef, useEffect, useContext, useState, useMemo } from "react";
import { IconGridSort, IconTextField } from "../../../../assets/Icons";
import TranslationText from "../../../TranslationText";
import { TendersGridContext } from "../../TendersGridContext";
import ColumnFilterPopover from "./ColumnFilterPopover";

/**
 * ResizableColumn
 * ---------------
 * Renders a single resizable grid header cell.
 *
 * Features:
 *   1. Column header label & dimension icon
 *   2. Mouse-drag column resizing
 *   3. Sort/filter UI via <ColumnFilterPopover />
 *   4. Active-filter highlight: sort icon turns primary color when a filter is applied
 *   5. Hover tooltip showing the current filter value(s) — cleared when filters are cleared
 */
const ResizableColumn = ({ column, className }) => {
  const { ResourcePage, handleResize, GridKey, valuesFilter } = useContext(TendersGridContext);

  const columnRef     = useRef(null);
  const startXRef     = useRef(null);
  const startWidthRef = useRef(null);
  const triggerRef    = useRef(null);

  const [isMenuOpen,   setIsMenuOpen]   = useState(false);
  const [showTooltip,  setShowTooltip]  = useState(false);

  // -------- Active filter detection ----------------------------------------
  const activeFilterValue = valuesFilter?.[column.key];
  const hasActiveFilter =
    activeFilterValue !== undefined &&
    activeFilterValue !== null &&
    activeFilterValue !== "" &&
    !(Array.isArray(activeFilterValue) && activeFilterValue.length === 0);

  /** Format the active filter value into a readable label for the tooltip */
  const filterLabel = useMemo(() => {
    if (!hasActiveFilter) return "";
    const val = activeFilterValue;

    // Date range { start, end }
    if (val && typeof val === "object" && !Array.isArray(val) && (val.start || val.end)) {
      const parts = [];
      if (val.start) parts.push(new Date(val.start).toLocaleDateString());
      if (val.end)   parts.push(new Date(val.end).toLocaleDateString());
      return parts.join(" → ");
    }

    // Multi-select array [{ value, label }]
    if (Array.isArray(val)) {
      return val.map((v) => v?.label || v?.value || String(v)).join(", ");
    }

    // Single select object { value, label }
    if (typeof val === "object" && val !== null) {
      return val.label || val.value || JSON.stringify(val);
    }

    // Primitive (string / number)
    return String(val);
  }, [activeFilterValue, hasActiveFilter]);

  // -------- Resize handlers ------------------------------------------------
  const handleMouseMove = useCallback(
    (e) => {
      if (startXRef.current !== null && startWidthRef.current !== null) {
        const diff = e.pageX - startXRef.current;
        const newWidth = Math.max(
          column.minWidth || 50,
          Math.min(startWidthRef.current + diff, column.maxWidth || 300)
        );
        handleResize(column.key, newWidth);
      }
    },
    [column, handleResize]
  );

  const handleMouseUp = useCallback(() => {
    startXRef.current = null;
    startWidthRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e) => {
      startXRef.current = e.pageX;
      startWidthRef.current = columnRef.current.offsetWidth;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // -------- Render ---------------------------------------------------------
  return (
    <>
      <div
        ref={columnRef}
        className={"relative header_Item " + className + (column.secondKeyText ? " justify_start" : "")}
        style={{ width: column.width }}
        onMouseEnter={() => hasActiveFilter && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Click area — opens filter popover */}
        <div
          ref={triggerRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center w-full h-full cursor-pointer"
        >
          {column?.isDimension && (
            <span className="w-4 h-4">
              <IconTextField className="text-titleColor dark:text-titleColorDark w-full h-full" />
            </span>
          )}

          <div className="title_header truncate px-2">
            <TranslationText
              page={column?.ResourcePage || ResourcePage || GridKey}
              titleGenerallist={false}
              title={column.title}
            />
          </div>

          {/*
            Sort/filter icon:
            - Primary color  → column has an active filter OR popover is open
            - Gray (dimmed)  → no active filter, popover closed
          */}
          <span className="Icon_sortConfig relative flex items-center ms-2">
            <IconGridSort
              className={`w-4 transition-colors ${
                hasActiveFilter || isMenuOpen
                  ? "text-primary dark:text-primaryDark"
                  : "text-gray-400 opacity-50"
              }`}
            />
            {/* Small dot badge when an active filter exists */}
            {hasActiveFilter && (
              <span className="absolute -top-1 -end-1 w-1.5 h-1.5 rounded-full bg-primary dark:bg-primaryDark" />
            )}
          </span>
        </div>

        {/* Hover tooltip — shows current filter value(s) */}
        {showTooltip && hasActiveFilter && (
          <div
            className="
              absolute top-full start-1/2 -translate-x-1/2 mt-2 z-[9999999]
              bg-gray-800 dark:bg-gray-900 text-white text-[11px] font-medium
              px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap
              pointer-events-none select-none
            "
          >
            {filterLabel}
            {/* Tooltip caret arrow */}
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800 dark:border-b-gray-900" />
          </div>
        )}

        {/* Column resize handle */}
        <div
          className="absolute inset-y-0 end-0 w-5 border-e-[1.5px] border-borderColor dark:border-borderColorDark cursor-col-resize"
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Filter / sort popover */}
      <ColumnFilterPopover
        column={column}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        triggerRef={triggerRef}
      />
    </>
  );
};

export default ResizableColumn;
