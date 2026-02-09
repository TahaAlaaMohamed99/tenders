import CustomCheckbox from "../../../Form/CustomCheckbox";
import {
  IconBook,
  IconBookOpen,
  IconEdit,
  IconNewTab,
  IconTreeView,
} from "../../../../assets/Icons";
import { Link } from "react-router-dom";
import { TendersGridContext } from "../../TendersGridContext";
import { useContext } from "react";
import useTranslationText from "../../../../Hooks/useTranslationText";
import SharedRows from "../sharedRows";


export default function FixedRows({ row, toggleRow, isOpen, level = 0 }) {
  const {
    selectedRows,
    isTree,
    onClickRow,
    isOpenInNewTab,
    routeKey,
    handleRowSelect,
    isSelected,
    disableRowSelect,
    currentLanguage,
    isOpenChildGrid,
    toggleChildGrid,
    openedChildGrid,
    setOpenedChildGrid,
   } = useContext(TendersGridContext);

  // Per-row checkbox disabled check (e.g. status !== "new")
  const isRowSelectDisabled = disableRowSelect ? disableRowSelect(row) : false;

  return (
    <div
      className={` row_Grid rounded-s-lg ${onClickRow ? "cursor-pointer " : ""} ${selectedRows.some(r => r.recId === row.recId) ? "selected" : ""}`}
      style={{ paddingInlineStart: `${level * 40}px` }}
      onClick={(e) => {
        if (onClickRow && e.target.type !== "checkbox") {
          onClickRow(row);
        }
      }}
    >
      {isSelected && (
        <div className="row_Item w-10">
          <CustomCheckbox
            value={selectedRows.some(r => r.recId == row.recId)}
            onChange={() => handleRowSelect(row)}
            aria-label={`Select row ${row.recId}`}
            disabled={isRowSelectDisabled}
          />
        </div>
      )}
      {/* IconEdit action removed as per user request */}

      {isOpenInNewTab && (
        <Link
            data-tooltip-content="openInNewTab"
            data-resource-page="GeneralField"
            data-tooltip-id="global-tooltip"

            className="icon_action_row "
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            to={`${routeKey}/${row[isOpenInNewTab.keyId]}${isOpenInNewTab.stepper ? `/${btoa(0)}` : ""
              }`}
          >
            <IconNewTab />
          </Link>

      )}
      {isOpenChildGrid && (
          <button
            type="button"
            className={
              "icon_action_row" +
              (openedChildGrid == row ? "active" : "")
            }
            onClick={(e) => {
              e.stopPropagation();
              if (openedChildGrid != row) {
                toggleChildGrid(row);
                setOpenedChildGrid(row);
              } else {
                toggleChildGrid(null);
                setOpenedChildGrid(null);
              }
            }}
            data-tooltip-content={openedChildGrid == row ? "closedChild" : "openedChild"}
            data-resource-page="Grid"
            data-tooltip-id="global-tooltip"

          >
            {openedChildGrid == row ? <IconBookOpen /> : <IconBook />}
          </button>
      )}
      {isTree && (
        <button
          type="button"
          className={"icon_action_row " + (isOpen ? "active" : "")}
          onClick={(e) => {
            if (row.children && row.children.length > 0) {
              e.stopPropagation();
              toggleRow(row.recId, row.children);
            }
          }}
          data-tooltip-content={isOpen ? "collapse" : "expand"}
          data-resource-page="Grid"
          data-tooltip-id="global-tooltip"
        >
          {row.children && row.children.length > 0 && <IconTreeView />}
        </button>
      )}

      <SharedRows row={row} type={"fixed"} />
    </div>
  );
}
