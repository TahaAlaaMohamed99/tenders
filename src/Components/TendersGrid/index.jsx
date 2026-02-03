import { useContext, useState, useMemo, useCallback } from "react";
import { TendersGridContext, TendersGridProvider } from "./TendersGridContext";
import DasktopGrid from "./DasktopGrid/DasktopGrid";
import MobileGrid from "./MobileGrid";
import DropdownGrid from "./DropdownGrid";
import CustomizeColumn from "./CustomizeColumn";
import {
  IconAddDoc,
  IconArrowDown,
  IconCalendar,
  IconFilter,
 
  IconRowActions,
  IconSearch,
 } from "../../assets/Icons";
import ExcelExportButton from "../ExcelExportButton";
import PrintComponent from "../PrintComponent/PrintComponent";
import Pagination from "./Pagination";
import FilterGrid from "./FilterGrid";
import CustomInput from "../Form/CustomInput";
import "../../Styles/Components/Mega_Grid/Grid.css";
import useDeviceType from "../../Hooks/useDeviceType";
 import useTranslationText from "../../Hooks/useTranslationText";
 import TranslationText from "../TranslationText";
import { Tooltip } from "react-tooltip";

 

const FilterButton = ({ 
  deviceType, 
  isVisible, 
  setIsVisible, 
  closeSheet, 
  isInsert, 
  filterFields,
  tooltipContent 
}) => (
  <>
    <button
      className={deviceType !== "mobile" ? "btn_icon_action relative" : "btn_action"}
      type="button"
      onClick={() => {
        setIsVisible(!isVisible);
        if (deviceType === "mobile") closeSheet(true);
      }}
      data-tooltip-content={tooltipContent}
      data-tooltip-id="filter"
      disabled={isInsert}
    >
      <IconFilter />
      {filterFields?.length > 0 && (
        <span className="absolute flex items-center justify-center w-[18px] h-[18px] rounded-full right-[-10px] top-[-4px] text-titleColorDark dark:text-titleColor bg-titleColor dark:bg-titleColorDark text-[10px]">
          {filterFields.length}
        </span>
      )}
      {deviceType === "mobile" && (
        <span className="title_action">
          <TranslationText title="filter" page="Grid" />
        </span>
      )}
    </button>
    <Tooltip className="tooltip_Mega" id="filter" place="bottom" />
  </>
);

function TendersGridInner() {
  const deviceType = useDeviceType();
  const context = useContext(TendersGridContext);
  
   const {
    SelectedActions,
    AddBtn,
    GridKey,
     ExcelExport,
    isPrint = true,
    isCustomizeColumn = true,
    isSwitchView = true,
    isSearch,
    isFilterGrid,
    ResourcePage,
    isTree = false,
    isPagination = true,
    columnState,
    selectedRows,
    getData,
    currentLanguage,
    handleSearch,
    ExportName,
    rowsEdited,
    setRowsEdited,
    handleSaveAllChanges,
    ImportExcel,
    handleImport,
    importData,
    handleClearAllGrid,
    setIsVisibleModalFill,
    setRowTransaction,
    handleOpenSelector,
    selectorKey = null,
    isInsert = false,
    filterFields,
    StopsaveAndClear = false,
    showSaveAllChanges = null,
    handleCustomClearAll,
    isAddBenefitEnrollment,
    isViewerGrid,
    setIsViewerGrid,
    storageViewerGrid,
  } = context;

  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

   const handleOpenSheet = useCallback(() => {
    setIsOpenBottomSheet(true);
  }, []);

  const closeSheet = useCallback(() => {
    setIsOpenBottomSheet(false);
  }, []);

  const handleSwitchView = useCallback(() => {
    const newViewerGrid = !isViewerGrid;
    setIsViewerGrid(newViewerGrid);
    localStorage.setItem(storageViewerGrid, newViewerGrid);
  }, [isViewerGrid, setIsViewerGrid, storageViewerGrid]);

  const handleModalOpen = useCallback(() => {
    setShowModal(true);
    if (deviceType === "mobile") closeSheet();
  }, [deviceType, closeSheet]);

  const handleClearAllWrapper = useCallback(() => {
    setRowsEdited([]);
    handleClearAllGrid();
    if (isAddBenefitEnrollment) {
      handleCustomClearAll();
    }
  }, [setRowsEdited, handleClearAllGrid, isAddBenefitEnrollment, handleCustomClearAll]);

  const handleSaveAllWrapper = useCallback(() => {
    const dataToSave = GridKey === "BenefitEnrollmentRequestPayment" ? getData : rowsEdited;
    handleSaveAllChanges(dataToSave);
  }, [GridKey, getData, rowsEdited, handleSaveAllChanges]);

   const tooltipContents = useMemo(() => ({
    insert: useTranslationText({
      page: "Grid",
      title: "insert",
      lang: currentLanguage,
     }),
    importExcel: useTranslationText({
      page: "Grid",
      title: "importExcel",
      lang: currentLanguage,
     }),
    filter: useTranslationText({
      page: "Grid",
      title: "filter",
      lang: currentLanguage,
     }),
    switchView: useTranslationText({
      page: "Grid",
      title: !isViewerGrid ? "switchToGridView" : "switchToListView",
      lang: currentLanguage,
     }),
    calculate: useTranslationText({
      page: ResourcePage,
      title: "calculate",
      lang: currentLanguage,
     }),
    add: useTranslationText({
      page: "Grid",
      title: "add",
      }),
  }), [currentLanguage, isViewerGrid, ResourcePage]);

   const renderActionsList = useMemo(() => {
    const actions = [];

 

    // // زر Import Excel
    // if (ImportExcel) {
    //   actions.push(
    //     <div key="importExcel">
    //       <button
    //         className={deviceType !== "mobile" ? "btn_icon_action" : "btn_action"}
    //         type="button"
    //         onClick={handleModalOpen}
    //         data-tooltip-content={tooltipContents.importExcel}
    //         data-tooltip-id="importExcel"
    //       >
    //         <IconImportHeader />
    //         {deviceType === "mobile" && (
    //           <span className="title_action">
    //             <TranslationText title="importExcel" page="Grid" />
    //           </span>
    //         )}
    //       </button>
    //       <Tooltip className="tooltip_Mega" id="importExcel" place="bottom" />
    //     </div>
    //   );
    // }

    // زر Filter
    if (isFilterGrid) {
      actions.push(
        <div key="filter">
          <FilterButton
            deviceType={deviceType}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            closeSheet={closeSheet}
            isInsert={isInsert}
            filterFields={filterFields}
            tooltipContent={tooltipContents.filter}
          />
        </div>
      );
    }

    // زر Excel Export
    if (ExcelExport) {
      actions.push(
        <ExcelExportButton
          key="excelExport"
          columns={columnState.all}
          data={getData}
          fileName={`${ExportName}.xls`}
          ResourcePage={ResourcePage}
           currentLanguage={currentLanguage}
        />
      );
    }

    // زر Print
    if (isPrint) {
      actions.push(
        <PrintComponent
          key="print"
          data={getData}
          ResourcePage={ResourcePage}
          Columns={columnState.all}
          currentLanguage={currentLanguage}
           header="https://be-quran.netlify.app/asstes/header.png"
          footer="https://be-quran.netlify.app/asstes/footer.png"
        />
      );
    }

    return actions;
  }, [
    selectorKey,
    ImportExcel,
    isFilterGrid,
    ExcelExport,
    isPrint,
    deviceType,
    handleOpenSelector,
    handleModalOpen,
    isVisible,
    isInsert,
    filterFields,
    columnState.all,
    getData,
    ExportName,
    ResourcePage,
     currentLanguage,
    tooltipContents,
    closeSheet,
  ]);

  // تحسين: حساب الشروط مرة واحدة
  const showSaveAndCancel = useMemo(
    () => showSaveAllChanges || (rowsEdited.length > 0 && !StopsaveAndClear),
    [showSaveAllChanges, rowsEdited.length, StopsaveAndClear]
  );

  const isMobile = deviceType === "mobile";
  const hasActions = renderActionsList.length > 0;

  return (
    <div className="Mega_Grid">
      <div className={`header_actions_Grid ${isInsert ? "mb-2" : "mb-4"}`}>
        {/* Left Actions */}
        <div className="flex md:gap-4 gap-2.5 items-center">
          {selectedRows.length > 0 && !isInsert && (
            <DropdownGrid
              className="Selected_actions"
              classNameMenu="start-[1px] w-44"
              menuItems={SelectedActions}
              ResourcePage="Grid"
              title="actions"
              icon={<IconArrowDown className="w-2.5" />}
              setRowTransaction={setRowTransaction}
            />
          )}

          {isCustomizeColumn && <CustomizeColumn />}
          
      

          {isSearch && (
            <div className="md:w-3/5 w-4/5">
              <CustomInput
                type="text"
                ResourcePage="Grid"
                className="form-group_iconSearch input_Search_Grid"
                placeholder="search"
                lang={true}
                icon={<IconSearch className="text-textColor" />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex md:gap-4 gap-2.5 justify-end items-center">
          {/* Pagination Header */}
          <Pagination isHeader={true} deviceType={deviceType}>
            {({ visiblePages, PageNumber, handlePageChange, totalPages }) =>
              !isTree && visiblePages.length > 0 && isPagination !== false && (
                <div className="flex items-center gap-1">
                  <Pagination.NavigationButton
                    direction="prev"
                    isHeader
                    onClick={() => handlePageChange(Math.max(1, PageNumber - 1))}
                    disabled={PageNumber === 1}
                  />
                  <Pagination.NavigationButton
                    direction="next"
                    isHeader
                    onClick={() => handlePageChange(Math.min(totalPages, PageNumber + 1))}
                    disabled={PageNumber === totalPages}
                  />
                </div>
              )
            }
          </Pagination>

    

          {/* Desktop Actions */}
          {!isMobile && renderActionsList.map((action, index) => (
            <div key={index}>{action}</div>
          ))}

          {/* Mobile Actions Button */}
          {hasActions && isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenSheet();
              }}
              className="bg-bgWhite dark:bg-bgWhiteDark w-8 p-2 flex items-center justify-center rounded text-titleColor dark:text-titleColorDark btn-primary"
              type="button"
            >
              <span className="icon_action">
                <IconRowActions />
              </span>
            </button>
          )}

          {/* Calculate Button */}
          {setIsVisibleModalFill && (
            <>
              <button
                className="btn_icon_action"
                data-tooltip-content={tooltipContents.calculate}
                data-tooltip-id="calculate"
                type="button"
                onClick={() => setIsVisibleModalFill(true)}
              >
                <IconCalendar />
              </button>
              <Tooltip className="tooltip_Mega" id="calculate" place="bottom" />
            </>
          )}

          {/* Add Button */}
          {AddBtn && (
            <>
              <button
                className="btn_icon_action primary_border"
                data-tooltip-content={tooltipContents.add}
                data-tooltip-id="add"
                type="button"
                onClick={AddBtn.onClick}
              >
                <IconAddDoc className="text-primary dark:text-primaryDark icon_3" />
              </button>
              <Tooltip className="tooltip_Mega" id="add" place="bottom" />
            </>
          )}
        </div>
      </div>

      {/* Grid View */}
      {isViewerGrid ? <DasktopGrid /> : <MobileGrid />}

      {/* Filter Grid */}
      <FilterGrid
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        key="filterGrid"
      />

    

  

      {/* Pagination Footer */}
      <Pagination deviceType={deviceType}>
        {({ visiblePages, PageNumber, handlePageChange, totalPages }) =>
          !isTree && visiblePages.length > 0 && isPagination !== false && (
            <div className="flex items-center gap-1 bg-bgWhite dark:bg-bgWhiteDark  rounded-lg p-2 min-h-10">
              <Pagination.NavigationButton
                direction="prev"
                onClick={() => handlePageChange(Math.max(1, PageNumber - 1))}
                disabled={PageNumber === 1}
              />
              
              {visiblePages[0] > 1 && (
                <>
                  <Pagination.PageButton
                    page={1}
                    onClick={() => handlePageChange(1)}
                  />
                  {visiblePages[0] > 2 && (
                    <span className="px-2 text-textColor dark:text-textColorDark">
                      ...
                    </span>
                  )}
                </>
              )}

              {visiblePages.map((page) => (
                <Pagination.PageButton
                  key={page}
                  page={page}
                  isActive={PageNumber === page}
                  onClick={() => handlePageChange(page)}
                />
              ))}

              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className="px-2 text-textColor dark:text-textColorDark">
                      ...
                    </span>
                  )}
                  <Pagination.PageButton
                    page={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                  />
                </>
              )}

              <Pagination.NavigationButton
                direction="next"
                onClick={() => handlePageChange(Math.min(totalPages, PageNumber + 1))}
                disabled={PageNumber === totalPages}
              />
            </div>
          )
        }
      </Pagination>
    </div>
  );
}

 export default function TendersGrid(props) {
  return (
    <TendersGridProvider {...props}>
      <TendersGridInner />
    </TendersGridProvider>
  );
}