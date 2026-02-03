import React, { useState, useEffect, useContext } from "react";
import CustomeSelect from "../Form/CustomSelect";
import { setLocalStorageBtoa } from "../../utils/useFromLocalStorage";
import TranslationText from "../TranslationText";
import { TendersGridContext } from "./TendersGridContext";

const Pagination = ({
  children,
  deviceType,
  isHeader = false,
  context = TendersGridContext
}) => {
  const { pageSizeList = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "150", value: 150 },
    { label: "200", value: 200 },

  ], isSelectPageSize = true, isTree = false, GridKey, totalRow, PageNumber, pageSize, handlePageChange, handlePageSize } = useContext(context)
  const maxVisiblePages = 5
  const [visiblePages, setVisiblePages] = useState([]);
  const [pageSizeShow, setPageSizeShow] = useState(pageSize);

  const totalPages = Math.ceil(totalRow / pageSizeShow);

  useEffect(() => {
    const calculateVisiblePages = () => {
      if (totalRow > pageSizeShow) {
        let startPage = Math.max(
          1,
          PageNumber - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        );
      } else {
        return [];
      }
    };

    setVisiblePages(calculateVisiblePages());
  }, [PageNumber, totalPages, maxVisiblePages]);
  return (
    <div className={`Pagination_gird  ${isHeader ? "card_Pagination" : "footer_Pagination mt-4"}`}>
      <div className={` text_color container_pagination ${deviceType == "mobile" ? "w-full" : ""} `}>

        <div className="total_pages">
          {!isHeader && <>
            <TranslationText page="Grid" title="showing" />
          </>}
          <span>
            {PageNumber == " 1"
              ? totalRow > 0
                ? " 1 "
                : " 0 "
              : PageNumber * pageSizeShow + 1 - pageSizeShow}
            <TranslationText page="Grid" title="to" />
            <span className="font-semibold  title_color mx-1">
              {isTree ? totalRow : totalRow > pageSizeShow * PageNumber
                ? pageSizeShow * PageNumber
                : totalRow}
            </span>{" "}
          </span>

          <TranslationText page="Grid" title="of" /> {totalRow}
          {!isHeader &&
            <>
              {" "}
              <TranslationText page="Grid" title="entries" />
            </>
          }
        </div>
      </div>
      {isHeader ?
        children({ visiblePages, PageNumber, handlePageChange, totalPages })
        :
        <div className={`flex items-center  space-x-2 rtl:space-x-reverse ${deviceType == "mobile" ? "w-full justify-between" : "justify-end"}`}>
          {children({ visiblePages, PageNumber, handlePageChange, totalPages })}
          {
            deviceType !== "mobile" && isSelectPageSize && !isTree && (
              <CustomeSelect
                key="mega_Showing"
                defaultValue={pageSizeList.find(
                  (option) => option.value == pageSizeShow
                )}
                className="w-24 m-0"
                value={pageSizeList.find((option) => option.value == pageSizeShow)}
                options={pageSizeList}
                isClearable={false}
                onChange={(e) => {
                  setLocalStorageBtoa(`TendersGrid_${GridKey}_PageSize`, e.value);
                  setPageSizeShow(e.value);
                  handlePageSize(1, e.value);
                }}
                menuPlacement="top"
              />)}
        </div>

      }



    </div>
  );
};

const PageButton = ({ page, isActive, onClick }) => {
  return (
    <button
      className={`px-2 py-1.5 leading-[normal] text-sm rounded ${isActive
        ? "bg-primary dark:bg-primaryDark text-bgColor font-semibold"
        : "hover:bg-bgColor hover:text-titleColor hover:dark:bg-bgColorDark hover:dark:text-titleColorDark text-textColor dark:text-textColorDark"
        }`}
      onClick={onClick}
      type="button"
    >
      {page}
    </button>
  );
};
const NavigationButton = ({ direction, onClick, disabled }) => {
  const iconPath =
    direction === "prev"
      ? "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z";

  return (
    <button
      className={`arrow_Pagination  ${disabled
        ? "disabled"
        : ""
        }`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
      </svg>
    </button>
  );
};

Pagination.PageButton = PageButton;
Pagination.NavigationButton = NavigationButton;

export default Pagination;
