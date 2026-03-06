import { useContext, useState, useCallback, memo } from "react";
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
  IconSearch,
  IconTrash,
  IconGridMore,
} from "../../assets/Icons";
import ExcelExportButton from "../ExcelExportButton";
import Pagination from "./Pagination";
import FilterGrid from "./FilterGrid";
import CustomInput from "../Form/CustomInput";
import "../../Styles/Components/Tender_Grid/Grid.css";
import useDeviceType from "../../Hooks/useDeviceType";
import TranslationText from "../TranslationText";

// ============= Helper Components =============
const ActionButton = memo(({ 
  icon, 
  label, 
  onClick, 
  disabled = false, 
  tooltip, 
  className = "", 
  badge = null 
}) => (
  <button
    className={`btn_text_icon ${className}`}
    type="button"
    onClick={onClick}
    disabled={disabled}
  >
    <div className="relative">
      {icon}
      {badge !== null && (
        <span className="absolute flex items-center justify-center w-[18px] h-[18px] rounded-full -right-2 -top-2 text-titleColorDark dark:text-titleColor bg-titleColor dark:bg-titleColorDark text-[10px]">
          {badge}
        </span>
      )}
    </div>
    <span className="hidden md:inline">
      <TranslationText title={label} page="Grid" />
    </span>
  </button>
));
ActionButton.displayName = "ActionButton";

// ============= Main Grid Component =============
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
  const hasSelectedRows = selectedRows.length > 0;

  const handleFilterToggle = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const handleDelete = useCallback(() => {
    if (hasSelectedRows && context.handleDelete) {
      context.handleDelete();
    }
  }, [hasSelectedRows, context]);

  return (
    <div className="Tender_Grid">
      {/* ============= Toolbar ============= */}
      <div className="flex justify-between items-center gap-3 h-auto min-h-[2.25rem] bg-bgWhite dark:bg-bgWhiteDark rounded-lg px-2 mb-2">
        {/* Left Actions */}
        <div className="flex items-center gap-3 justify-start">
          {AddBtn && (
            <ActionButton
              icon={<IconAddDoc />}
              label="New"
              onClick={AddBtn.onClick}
              tooltip="New"
            />
          )}

          <ActionButton
            icon={<IconTrash />}
            label="Delete"
            onClick={handleDelete}
            disabled={!hasSelectedRows}
            tooltip="Delete"
            className={!hasSelectedRows ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500'}
          />

          {!isInsert && SelectedActions && (
            <div className={!hasSelectedRows ? "opacity-50 pointer-events-none" : ""}>
              <DropdownGrid
                className="btn_text_icon"
                classNameMenu="start-[1px] w-44"
                menuItems={SelectedActions}
                ResourcePage="Grid"
                title="Actions"
                startIcon={<IconGridMore className="w-5 h-5" />}
                icon={<IconArrowDown className="!w-2.5 !h-2.5 text-gray-400" />}
                setRowTransaction={setRowTransaction}
                disabled={!hasSelectedRows}
                tooltip="Actions"
              />
            </div>
          )}
        </div>

        {/* Center Search */}
        {isSearch && (
          <div className="flex justify-center w-full flex-1">
            <div className="w-full max-w-xl">
              <CustomInput
                type="text"
                ResourcePage="Grid"
                className="form-group_iconSearch w-full [&_input]:h-[34px] [&_input]:min-h-[34px] [&_input]:py-0 [&_input]:px-2 [&_input]:text-[13px] [&_input]:border [&_input]:border-gray-200 dark:[&_input]:border-gray-700 [&_input]:bg-gray-50 dark:[&_input]:bg-gray-800 [&_input]:focus:bg-white dark:[&_input]:focus:bg-gray-900 [&_input]:transition-colors"
                placeholder="Search"
                lang={currentLanguage}
                autoComplete="on"
                icon={<IconSearch className="w-3.5 h-3.5 text-gray-400" />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex gap-2 justify-end items-center">
          {setIsVisibleModalFill && (
            <ActionButton
              icon={<IconCalendar />}
              label="calculate"
              onClick={() => setIsVisibleModalFill(true)}
              tooltip="calculate"
            />
          )}

          {isFilterGrid && (
            <ActionButton
              icon={<IconFilter />}
              label="Filter"
              onClick={handleFilterToggle}
              tooltip="Filter"
              badge={filterFields?.length > 0 ? filterFields.length : null}
              className={isVisible ? 'bg-gray-100 dark:bg-gray-700' : ''}
            />
          )}

          {ExcelExport && (
            <ExcelExportButton
              showText={true}
              columns={columnState.all}
              data={getData}
              fileName={`${ExportName}.xls`}
              ResourcePage={ResourcePage}
              currentLanguage={currentLanguage}
            />
          )}

          {isCustomizeColumn && <CustomizeColumn showText={true} />}
        </div>
      </div>

      {/* ============= Grid Content ============= */}
      {isViewerGrid ? <DasktopGrid /> : <MobileGrid />}

      {/* ============= Filter Panel ============= */}
      {isFilterGrid && (
        <FilterGrid
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      )}

      {/* ============= Pagination ============= */}
      {!isTree && isPagination !== false && (
        <Pagination deviceType={deviceType} />
      )}
    </div>
  );
}

// ============= Main Export =============
export default function TendersGrid(props) {
  return (
    <TendersGridProvider {...props}>
      <TendersGridInner />
    </TendersGridProvider>
  );
}
