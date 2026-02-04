import React, { useContext } from "react";
import CustomCheckbox from "../../../Form/CustomCheckbox";
import ResizableColumn from "./ResizableColumn";
import { TendersGridContext } from "../../TendersGridContext";
import { IconTreeView } from "../../../../assets/Icons";

export default function FixedColumns() {
  const { columnState, isSelectedAll, onClickRow, handleSelectAll, isSelected, isOpenInNewTab, isTree, handleSort, toggleAllRows, isOpenAll, isOpenChildGrid } = useContext(TendersGridContext)
  return (
    <div className="fixed_Columns flex flex-nowrap">
      {isSelected && (
        <div
          className="header_Item rounded-ss-lg  "
        >
          <CustomCheckbox
            checked={isSelectedAll}
            onChange={handleSelectAll}
            aria-label="Select all rows"
          />
        </div>
      )}
      {/* Placeholder removed since we are removing the action column */}
      {isOpenInNewTab && (
        <div className="header_Item h-10 w-10">
        </div>
      )}
      {isOpenChildGrid && (
        <div className="header_Item h-10 w-10">
        </div>
      )}
      {isTree && (
        <div onClick={() => toggleAllRows()} className="header_Item h-10 w-10">
          <IconTreeView className={"w-5 h-5 " + (isOpenAll ? "text-primary dark:text-primaryDark" : "text-textColor dark:text-textColorDark")} />
        </div>
      )}
      {columnState?.fixed?.filter((col) => !col.hiddenShow)?.map((column, index) => (
        <ResizableColumn
          onClick={() => handleSort(column.key)}
          className={!isSelected ? "first:rounded-ss-lg" : ""}
          key={column.key || index}
          column={column}
        />
      ))}

    </div>
  );
}
