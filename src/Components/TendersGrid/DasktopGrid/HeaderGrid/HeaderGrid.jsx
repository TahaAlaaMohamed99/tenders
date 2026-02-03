import React, { useContext } from "react";
import FixedColumns from "./FixedColumns";
import DefaultColumns from "./DefaultColumns";
import { TendersGridContext } from "../../TendersGridContext";

export default function HeaderGrid({
  handleScroll,
  totalDefaultColumnsWidthPx,
  scrollableContainerHeaderRef,
}) {
  const { rowActionList } = useContext(TendersGridContext)

  return (
    <div className="header_Grid ">
      <div className="container_Header_Grid">
      <FixedColumns />
      <div
        className={"scrollable_container " + (rowActionList ? " rounded-none" : "rounded-se-lg")}
        ref={scrollableContainerHeaderRef}
        onScroll={() => handleScroll("header")}
      >
        <DefaultColumns
          totalDefaultColumnsWidthPx={totalDefaultColumnsWidthPx}
        />

      </div>
         {rowActionList && (
        <div className="header_Item h-10  rounded-se-lg w-10"></div>
      )}
      </div>
   
    </div>
  );
}
