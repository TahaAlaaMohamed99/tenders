import React, { useMemo, useContext, useCallback, memo } from "react";
import CustomeSelect from "../Form/CustomSelect";
import { setLocalStorageBtoa } from "../../utils/localStorage";
import TranslationText from "../TranslationText";
import { TendersGridContext } from "./TendersGridContext";

// ============= Constants =============
const MAX_VISIBLE_PAGES = 5;
const PAGE_SIZE_OPTIONS = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  { label: "150", value: 150 },
  { label: "200", value: 200 },
];

// ============= Pure Functions =============
const calculatePaginationRange = (currentPage, totalPages) => {
  if (totalPages === 0) return [];
  
  const pages = [];
  
  if (totalPages <= MAX_VISIBLE_PAGES + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  pages.push(1);
  
  const halfVisible = Math.floor(MAX_VISIBLE_PAGES / 2);
  let startPage = Math.max(2, currentPage - halfVisible);
  let endPage = Math.min(totalPages - 1, startPage + MAX_VISIBLE_PAGES - 1);
  
  if (endPage === totalPages - 1) {
    startPage = Math.max(2, endPage - MAX_VISIBLE_PAGES + 1);
  }
  
  if (startPage > 2) pages.push("dots-start");
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  if (endPage < totalPages - 1) pages.push("dots-end");
  
  pages.push(totalPages);
  
  return pages;
};

const calculatePageRange = (currentPage, pageSize, totalRows, isTree) => {
  if (totalRows === 0) return { from: 0, to: 0 };
  
  const from = currentPage === 1 ? 1 : (currentPage - 1) * pageSize + 1;
  const to = isTree ? totalRows : Math.min(currentPage * pageSize, totalRows);
  
  return { from, to };
};

// ============= UI Components =============
const PageButton = memo(({ page, isActive, onClick, isDots }) => {
  if (isDots) {
    return (
      <span className="px-1 text-xs font-medium text-textColor dark:text-textColorDark flex items-center h-7">
        ...
      </span>
    );
  }
  
  return (
    <button
      className={`px-2 h-7 leading-none text-xs rounded min-w-[1.75rem] font-medium transition-colors duration-100 ${
        isActive
          ? "bg-primary dark:bg-primaryDark text-white"
          : "hover:bg-bgColor hover:text-titleColor hover:dark:bg-bgColorDark hover:dark:text-titleColorDark text-textColor dark:text-textColorDark"
      }`}
      onClick={onClick}
      type="button"
      disabled={isDots}
    >
      {page}
    </button>
  );
});
PageButton.displayName = "PageButton";

const NavigationButton = memo(({ direction, onClick, disabled }) => {
  const iconPath = direction === "prev"
    ? "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
    : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z";

  return (
    <button
      className={`arrow_Pagination ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      data-tooltip-content={direction === "prev" ? "previous" : "next"}
      data-resource-page="Grid"
      data-tooltip-id="global-tooltip"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
      </svg>
    </button>
  );
});
NavigationButton.displayName = "NavigationButton";

const PaginationInfo = memo(({ from, to, total, isHeader }) => (
  <div className="total_pages text-xs leading-none flex items-center">
    {!isHeader && (
      <span className="text-textColor dark:text-textColorDark">
        <TranslationText page="Grid" title="showing" />
      </span>
    )}
    <span className="text-titleColor dark:text-titleColorDark font-semibold mx-0.5">{from}</span>
    <span className="text-textColor dark:text-textColorDark">
      <TranslationText page="Grid" title="to" />
    </span>
    <span className="text-titleColor dark:text-titleColorDark font-semibold mx-0.5">{to}</span>
    <span className="text-textColor dark:text-textColorDark">
      <TranslationText page="Grid" title="of" />
    </span>
    <span className="text-titleColor dark:text-titleColorDark font-semibold mx-0.5">{total}</span>
    {!isHeader && (
      <span className="text-textColor dark:text-textColorDark">
        <TranslationText page="Grid" title="entries" />
      </span>
    )}
  </div>
));
PaginationInfo.displayName = "PaginationInfo";

const PageSizeSelector = memo(({ 
  pageSize, 
  options, 
  gridKey, 
  onPageSizeChange 
}) => {
  const selectedOption = useMemo(
    () => options.find(opt => opt.value === pageSize),
    [options, pageSize]
  );

  return (
    <CustomeSelect
      key={`pagesize-${gridKey}`}
      value={selectedOption}
      defaultValue={selectedOption}
      className="w-[70px] m-0 text-xs [&_.css-1q3qaqu-control]:flex-nowrap [&_.css-1q3qaqu-control]:h-8"
      options={options}
      isClearable={false}
      onChange={onPageSizeChange}
      menuPlacement="top"
      isSmall={true}
    />
  );
});
PageSizeSelector.displayName = "PageSizeSelector";

// ============= Main Component =============
const Pagination = ({ deviceType, isHeader = false }) => {
  const {
    pageSizeList = PAGE_SIZE_OPTIONS,
    isSelectPageSize = true,
    isTree = false,
    GridKey,
    totalRow,
    PageNumber,
    pageSize,
    handlePageChange,
    handlePageSize,
  } = useContext(TendersGridContext);

  const totalPages = useMemo(
    () => Math.ceil(totalRow / pageSize),
    [totalRow, pageSize]
  );

  const visiblePages = useMemo(
    () => totalRow > pageSize ? calculatePaginationRange(PageNumber, totalPages) : [],
    [PageNumber, totalPages, pageSize, totalRow]
  );

  const pageRange = useMemo(
    () => calculatePageRange(PageNumber, pageSize, totalRow, isTree),
    [PageNumber, pageSize, totalRow, isTree]
  );

  const handlePageSizeChange = useCallback(
    (option) => {
      setLocalStorageBtoa(`TendersGrid_${GridKey}_PageSize`, option.value);
      handlePageSize(1, option.value);
    },
    [GridKey, handlePageSize]
  );

  const handlePrevPage = useCallback(
    () => handlePageChange(Math.max(1, PageNumber - 1)),
    [PageNumber, handlePageChange]
  );

  const handleNextPage = useCallback(
    () => handlePageChange(Math.min(totalPages, PageNumber + 1)),
    [PageNumber, totalPages, handlePageChange]
  );

  const isMobile = deviceType === "mobile";
  const shouldShowPagination = visiblePages.length > 0;

  return (
    <div className={`Pagination_gird ${isHeader ? "card_Pagination" : "footer_Pagination mt-1"}`}>
      {/* Left - Info */}
      <div className={`text_color container_pagination ${isMobile ? "w-full" : ""}`}>
        <PaginationInfo
          from={pageRange.from}
          to={pageRange.to}
          total={totalRow}
          isHeader={isHeader}
        />
      </div>

      {/* Right - Navigation & Size Selector (all in one row) */}
      {isHeader ? null : (
        <div className={`flex flex-nowrap items-center gap-1.5 ${isMobile ? "w-full justify-between" : "justify-end"}`}>
          {shouldShowPagination && (
            <>
              <NavigationButton
                direction="prev"
                onClick={handlePrevPage}
                disabled={PageNumber === 1}
              />

              {visiblePages.map((page, index) => {
                const isDots = typeof page === "string";
                return (
                  <PageButton
                    key={isDots ? page : `page-${page}`}
                    page={isDots ? "..." : page}
                    isActive={!isDots && PageNumber === page}
                    onClick={() => !isDots && handlePageChange(page)}
                    isDots={isDots}
                  />
                );
              })}

              <NavigationButton
                direction="next"
                onClick={handleNextPage}
                disabled={PageNumber === totalPages}
              />
            </>
          )}

          {/* Separator */}
          {shouldShowPagination && !isMobile && isSelectPageSize && !isTree && (
            <div className="w-px h-5 bg-borderColor dark:bg-borderColorDark mx-1" />
          )}

          {/* Page Size Selector */}
          {!isMobile && isSelectPageSize && !isTree && (
            <PageSizeSelector
              pageSize={pageSize}
              options={pageSizeList}
              gridKey={GridKey}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Pagination);
