import { useCallback, useRef, useEffect, useContext, useState } from "react";
import { IconGridSort, IconTextField } from "../../../../assets/Icons";
import TranslationText from "../../../TranslationText";
import { TendersGridContext } from "../../TendersGridContext";
import ColumnFilterPopover from "./ColumnFilterPopover";

/**
 * ResizableColumn
 * ---------------
 * Renders a single resizable grid header cell.
 *
 * Responsibilities (after Phase 7, P3 #14 SRP extraction):
 *   1. Column header label & dimension icon
 *   2. Mouse-drag column resizing
 *   3. Delegates sort/filter UI to <ColumnFilterPopover />
 *
 * @see docs/05-solid-clean-architecture.md — SRP: ResizableColumn
 */
const ResizableColumn = ({ column, className }) => {
  const { ResourcePage, handleResize, GridKey } = useContext(TendersGridContext);

  const columnRef = useRef(null);
  const startXRef = useRef(null);
  const startWidthRef = useRef(null);
  const triggerRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // -------- Resize handlers --------
  const handleMouseMove = useCallback(
    (e) => {
      if (startXRef.current !== null && startWidthRef.current !== null) {
        const diff = e.pageX - startXRef.current;
        const maxAllowedWidth = column.maxWidth || 300;
        const newWidth = Math.max(
          column.minWidth || 50,
          Math.min(startWidthRef.current + diff, maxAllowedWidth)
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

  // -------- Render --------
  return (
    <>
      <div
        ref={columnRef}
        className={"relative header_Item " + className + (column.secondKeyText ? " justify_start" : "")}
        style={{ width: column.width }}
      >
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
          <div className="title_header truncate px-2  ">
            <TranslationText
              page={column?.ResourcePage || ResourcePage || GridKey}
              titleGenerallist={false}
              title={column.title}
            />
          </div>

          <span className="Icon_sortConfig flex items-center  ms-2">
            <IconGridSort
              className={`w-4 transition-colors ${
                isMenuOpen ? "text-primary dark:text-primaryDark" : "text-gray-400 opacity-50"
              }`}
            />
          </span>
        </div>

        <div
          className="absolute inset-y-0 end-0 w-5 border-e-[1.5px] border-borderColor dark:border-borderColorDark cursor-col-resize"
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

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
