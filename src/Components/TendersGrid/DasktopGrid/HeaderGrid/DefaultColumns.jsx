import { useContext } from "react";
import ResizableColumn from "./ResizableColumn";
import { TendersGridContext } from "../../TendersGridContext";

const DefaultColumns = ({
  totalDefaultColumnsWidthPx
}) => {
  const { columnState, handleSort } = useContext(TendersGridContext)



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
