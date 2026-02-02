import React, { useContext } from "react";
import ResizableColumn from "./ResizableColumn";
import { MegaGridContext } from "../../MegaGridContext";

const DefaultColumns = ({
  totalDefaultColumnsWidthPx
}) => {
  const { columnState, handleSort } = useContext(MegaGridContext)



  return (
    <div
      className="default_Columns "
      style={{ width: totalDefaultColumnsWidthPx }}
    >
      {columnState?.default?.map((column, index) => (
        <ResizableColumn
          onClick={() => handleSort(column.key)}
          key={column.key || index}
          column={column}
        />
      ))}

    </div>
  );
};

export default DefaultColumns;
