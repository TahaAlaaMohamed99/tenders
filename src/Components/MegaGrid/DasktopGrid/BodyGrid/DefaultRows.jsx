import { useContext, } from "react";
import { MegaGridContext } from "../../MegaGridContext";

import SharedRows from "../sharedRows";

export default function DefaultRows({ row, level = 0, rowsLength }) {
  const {
    onClickRow,
    selectedRows,
    isTree,
  } = useContext(MegaGridContext);

  return (
    <div
      className={"row_Grid  " + (onClickRow ? "cursor-pointer " : "") + (selectedRows.some(r => r.recId == row.recId) ? "selected" : "")}
      onClick={() => onClickRow && onClickRow(row)}
    >
      {isTree && (
        <div
          className="row_Item"
          style={{ paddingInlineStart: `${level * 40}px` }}
        ></div>
      )}
      <SharedRows row={row} type={"default"} />
    </div>
  );
}
