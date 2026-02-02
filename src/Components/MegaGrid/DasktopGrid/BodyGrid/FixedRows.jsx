import CustomCheckbox from "../../../Form/CustomCheckbox";
import {
  IconBook,
  IconBookOpen,
  IconEdit,
  IconNewTab,
  IconTreeViwe,
} from "../../../../assets/Icons/IconsSvg";
import { Link } from "react-router-dom";
import { MegaGridContext } from "../../MegaGridContext";
import { useContext } from "react";
import useTranslationText from "../../../../Hooks/useTranslationText";
import SharedRows from "../sharedRows";
import { Tooltip } from "react-tooltip";

export default function FixedRows({ row, toggleRow, isOpen, level = 0 }) {
  const {
    selectedRows,
    isTree,
    onClickRow,
    isOpenInNewTab,
    routeKey,
    handleRowSelect,
    isSelected,
    currentLanguage,
    isOpenChildGrid,
    toggleChildGrid,
    openedChildGrid,
    setOpenedChildGrid,
   } = useContext(MegaGridContext);

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
          />
        </div>
      )}
      {onClickRow && (
        <>
          <div
            className="icon_action_row"
            onClick={(e) => {
              if (onClickRow && e.target.type !== "checkbox") {
                onClickRow(row);
              }
            }}
            data-tooltip-content={useTranslationText({
              page: "General",
              title: "edit",
              lang: currentLanguage,
             })}
            data-tooltip-id="Edit"

          >
            <IconEdit />
          </div>
          <Tooltip
            className="tooltip_Mega"
            id="Edit"
            place="bottom"
          />
        </>

      )}

      {isOpenInNewTab && (
        <>
          <Link
            data-tooltip-content={useTranslationText({
              page: "GeneralField",
              title: "openInNewTab",
              lang: currentLanguage,
             })}
            data-tooltip-id="openInNewTab"

            className="icon_action_row "
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            to={`${routeKey}/${row[isOpenInNewTab.keyId]}${isOpenInNewTab.stepper ? `/${btoa(0)}` : ""
              }`}
          >
            <IconNewTab />
          </Link>
          <Tooltip
            className="tooltip_Mega"
            id="openInNewTab"
            place="bottom"
          />
        </>

      )}
      {isOpenChildGrid && (
        <>
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
            data-tooltip-content={useTranslationText({
              title: `${openedChildGrid == row ? "closedChild" : "openedChild"}`,
              lang: currentLanguage,
               page: "Grid",
            })}
            data-tooltip-id="tooltipChild"

          >
            {openedChildGrid == row ? <IconBookOpen /> : <IconBook />}
          </button>
          <Tooltip
            className="tooltip_Mega"
            id="tooltipChild"
            place="bottom"
          />
        </>

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
        >
          {row.children && row.children.length > 0 && <IconTreeViwe />}
        </button>
      )}

      <SharedRows row={row} type={"fixed"} />
    </div>
  );
}
