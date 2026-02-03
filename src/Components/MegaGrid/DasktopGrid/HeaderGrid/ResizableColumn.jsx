import React, { useCallback, useRef, useEffect, useContext } from "react";
import { IconsSortBto, IconsSortTop, IconTextField } from "../../../../assets/Icons";
import TranslationText from "../../../TranslationText";
import { MegaGridContext } from "../../MegaGridContext";

const ResizableColumn = ({
  column,
  className,
  onClick,
}) => {
  const { ResourcePage, sortConfig, handleResize } = useContext(MegaGridContext)

  const columnRef = useRef(null);
  const startXRef = useRef(null);
  const startWidthRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    startXRef.current = e.pageX;
    startWidthRef.current = columnRef.current.offsetWidth;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

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

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      onClick={onClick}
      ref={columnRef}
      className={
        "relative header_Item   " + className + (column.secondKeyText ? " justify_start" : "")
      }
      style={{ width: column.width }}
    >
      {column?.isDimension &&
        <span className="w-4 h-4">
          <IconTextField className="text-titleColor dark:text-titleColorDark w-full h-full" />
        </span>
      }
      <div className="title_header truncate px-2  ">

        <TranslationText
          page={
            column.generallist
              ? column?.generallist
              : column?.ResourcePage || ResourcePage
          }
          titleGenerallist={column.generallist ? true : false}
          title={column.generallist ? column.title : column.title}
        />

      </div>{sortConfig.some(config => config.key === column.key) && (
        <span className="Icon_sortConfig flex items-center">
          {sortConfig.find(config => config.key === column.key)?.direction === "asc" ? (
            <IconsSortTop className="w-4 text-titleColor dark:text-titleColorDark text-opacity-75" />
          ) : (
            <IconsSortBto className="w-4 text-titleColor dark:text-titleColorDark text-opacity-75" />
          )}
        </span>
      )}

      <div
        className="absolute inset-y-0 end-0 w-5 border-e-[1.5px] border-borderColor dark:border-borderColorDark cursor-col-resize"
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ResizableColumn;
