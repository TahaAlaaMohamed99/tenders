import { useContext, } from "react";
import { TendersGridContext } from "../../TendersGridContext";

import SharedRows from "../sharedRows";

export default function DefaultRows({ row, level = 0, rowsLength }) {
  const {
    onClickRow,
    selectedRows,
    isTree,
    keyId = "recId",
  } = useContext(TendersGridContext);

  return (
    <div
      className={"row_Grid  " + (onClickRow ? "cursor-pointer " : "") + (selectedRows.some(r => r[keyId] == row[keyId]) ? "selected" : "")}
      onClick={(e) => {
        if (onClickRow && e.target.type !== "checkbox") {
          onClickRow(row); 
        }
      }}
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
