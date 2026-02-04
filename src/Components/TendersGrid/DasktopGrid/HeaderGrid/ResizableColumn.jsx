import React, { useCallback, useRef, useEffect, useContext, useState } from "react";
import { IconsSortBto, IconsSortTop, IconTextField, IconGridSort, IconFilter } from "../../../../assets/Icons";
import TranslationText from "../../../TranslationText";
import useTranslationText from "../../../../Hooks/useTranslationText";
import { TendersGridContext } from "../../TendersGridContext";
import ActionModal from "../../../ActionModal";
import CustomInput from "../../../Form/CustomInput";
import CustomeSelect from "../../../Form/CustomSelect";
import CustomDateRangePicker from "../../../Form/CustomDateRangePicker";
import useGetLookup from "../../../../Hooks/useGetLookup";
import useGetGenerallist from "../../../../Hooks/useGetGenerallist";

const ResizableColumn = ({
  column,
  className,
}) => {
  const { 
    ResourcePage, 
    sortConfig, 
    handleResize, 
    handleSortDirection, 
    handleFilterGrid, 
    handleClearFilter, 
    valuesFilter,
    GridKey,
    currentLanguage
  } = useContext(TendersGridContext);

  const columnRef = useRef(null);
  const startXRef = useRef(null);
  const startWidthRef = useRef(null);
  const triggerRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState(valuesFilter?.[column.key] || "");
  
  const { getLookupFilterGrid } = useGetLookup();
  const { getGenerallist } = useGetGenerallist();

  // Resize Handlers
  const handleMouseDown = useCallback((e) => {
    startXRef.current = e.pageX;
    startWidthRef.current = columnRef.current.offsetWidth;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleMouseMove = useCallback((e) => {
      if (startXRef.current !== null && startWidthRef.current !== null) {
        const diff = e.pageX - startXRef.current;
        const maxAllowedWidth = column.maxWidth || 300;
        const newWidth = Math.max(
          column.minWidth || 50,
          Math.min(startWidthRef.current + diff, maxAllowedWidth)
        );
        handleResize(column.key, newWidth);
      }
    }, [column, handleResize]);

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

  // Sync local filter value with context
  useEffect(() => {
    setFilterValue(valuesFilter?.[column.key] || "");
  }, [valuesFilter, column.key]);

  // Fetch Options for Select Filters
  useEffect(() => {
    if (isMenuOpen && (column.generallist || column.lookupName) && dropdownOptions.length === 0) {
      setIsLoading(true);
      if (column.generallist) {
        getGenerallist(column.generallist, setIsLoading, (data) => setDropdownOptions(data));
      } else if (column.lookupName) {
         getLookupFilterGrid(
          column.lookupName,
          column?.keysLookup?.name || "name",
          column?.keysLookup?.recId || "recId",
          (data) => setDropdownOptions(data),
          column.keyRecId || "recId",
          column.keyGetLookup != false ? true : false
        );
      } else {
        setIsLoading(false);
      }
    }
  }, [isMenuOpen, column, dropdownOptions.length, getGenerallist, getLookupFilterGrid]);

  // Handlers
  const handleApplyFilter = () => {
    if (filterValue !== "" && filterValue !== null) {
       handleFilterGrid({ ...valuesFilter, [column.key]: filterValue }, [column.key]);
    } else {
      // If cleared/empty, remove this key from filter
      const newValues = { ...valuesFilter };
      delete newValues[column.key];
      const nonEmptyFields = Object.keys(newValues).filter(k => newValues[k] !== "" && newValues[k] !== null);
      
      if (nonEmptyFields.length === 0) {
        handleClearFilter();
      } else {
        handleFilterGrid(newValues, nonEmptyFields);
      }
    }
    setIsMenuOpen(false);
  };

  const handleClear = () => {
    setFilterValue("");
    const newValues = { ...valuesFilter };
    delete newValues[column.key];
    const nonEmptyFields = Object.keys(newValues).filter(k => newValues[k] !== "" && newValues[k] !== null);
    
    if (nonEmptyFields.length === 0) {
      handleClearFilter();
    } else {
      handleFilterGrid(newValues, nonEmptyFields);
    }
    setIsMenuOpen(false);
  };

  const currentSort = sortConfig.find(config => config.key === column.key);

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
            className="flex items-center w-full h-full cursor-pointer"
        >
            {column?.isDimension &&
                <span className="w-4 h-4">
                <IconTextField className="text-titleColor dark:text-titleColorDark w-full h-full" />
                </span>
            }
            <div className="title_header truncate px-2  ">
                <TranslationText
                page={column.generallist ? column?.generallist : column?.ResourcePage || ResourcePage}
                titleGenerallist={column.generallist ? true : false}
                title={column.generallist ? column.title : column.title}
                />
            </div>
            
            <span className="Icon_sortConfig flex items-center ms-auto">
                 <IconGridSort 
                    className={`w-4 transition-colors ${isMenuOpen ? "text-primary dark:text-primaryDark" : "text-gray-400 opacity-50"}`} 
                 />
            </span>
        </div>

        <div
            className="absolute inset-y-0 end-0 w-5 border-e-[1.5px] border-borderColor dark:border-borderColorDark cursor-col-resize"
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()}
        />
      </div>

      <ActionModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        mode="dropdown"
        triggerRef={triggerRef}
        className="w-72 p-4"
        position="bottom-start"
      >
        <div className="flex flex-col gap-4">
            {/* Sorting Section */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => { handleSortDirection(column.key, "asc"); setIsMenuOpen(false); }}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border-none transition-colors ${currentSort?.direction === "asc" ? "bg-primary/10 border-primary text-primary" :  "dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                    <IconsSortTop className="w-4 h-4" />
                    <span className="text-xs font-medium"><TranslationText title="sortAsc" page="Grid" /></span>
                </button>
                <button
                    type="button"
                    onClick={() => { handleSortDirection(column.key, "desc"); setIsMenuOpen(false); }}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border-none transition-colors ${currentSort?.direction === "desc" ? "bg-primary/10 border-primary text-primary" : "dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                    <IconsSortBto className="w-4 h-4" />
                    <span className="text-xs font-medium"><TranslationText title="sortDesc" page="Grid" /></span>
                </button>
            </div>

            {/* Filter Section */}
            {column.isFilter !== false && (
                <div className="flex flex-col gap-4 border-gray-100 dark:border-gray-700">
                    
                    {/* Render Input based on type */}
                    {(column.generallist || column.lookupName || column.isFilterSelect) ? (
                        <CustomeSelect
                            isMulti={column.lookupName ? true : false}
                            titleGenerallist={!!column.generallist}
                            value={filterValue}
                            ResourcePage={column?.ResourcePage || column?.generallist}
                            options={dropdownOptions}
                            onChange={(e) => setFilterValue(e)}
                            isLoading={isLoading}
                            isClearable
                            placeholder={useTranslationText({ page: "Grid", title: `Select`, lang: currentLanguage }) + ` ${useTranslationText({ page: column.generallist ? column.generallist : column.ResourcePage || ResourcePage, title: column.title, lang: currentLanguage })}`}
                            isSmall
                        />
                    ) : (column.type === "date" || column.type === "dateTime") ? (
                         <CustomDateRangePicker
                            ResourcePage={column?.ResourcePage}
                            value={filterValue}
                            onChange={(dateRange) => setFilterValue(dateRange)}
                            className="scale-90 origin-center" 
                        />
                    ) : (
                        <CustomInput
                            type={column.type === "number" ? "number" : "text"}
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            placeholder={useTranslationText({ page: "Grid", title: `Type`, lang: currentLanguage }) + ` ${useTranslationText({ page: column.generallist ? column.generallist : column.ResourcePage || ResourcePage, title: column.title, lang: currentLanguage })}`}
                            isSmall
                        />
                    )}

                    <div className="flex justify-between items-center mt-2">
                        <button
                            type="button"
                            onClick={handleApplyFilter}
                            disabled={!filterValue}
                            className="px-4 py-2 text-xs font-medium text-white bg-titleColor hover:bg-opacity-90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <TranslationText title="Apply" page="Grid" />
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-4 py-2 text-xs font-medium text-primary dark:text-primaryDark bg-white border border-borderColor dark:border-borderColorDark rounded-md hover:bg-gray-50 dark:bg-transparent transition-colors"
                        >
                            <TranslationText title="Clear" page="Grid" />
                        </button>
                    </div>
                </div>
            )}
        </div>
      </ActionModal>
    </>
  );
};

export default ResizableColumn;
