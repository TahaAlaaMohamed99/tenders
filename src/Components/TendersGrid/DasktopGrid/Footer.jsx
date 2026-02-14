import React, { useContext, useEffect, useState } from "react";
import FixedColumns from "./HeaderGrid/FixedColumns";
import DefaultColumns from "./HeaderGrid/DefaultColumns";
import { TendersGridContext } from "../TendersGridContext";
import useFormatNumber from "../../../utils/formatNumber";
import TranslationText from "../../TranslationText";

const Footer = ({ totalDefaultColumnsWidthPx, scrollableContainerDataRef }) => {
  const {
    columnState,

    isTree,
    onClickRow,
    isOpenInNewTab,

    isSelected,
    EditCulomsRow,
    isOpenChildGrid,
    isEditRows,

    getData,
  } = useContext(TendersGridContext);
  const { rowActionList } = useContext(TendersGridContext);
  const [originalTotals, setOriginalTotals] = useState({});
  /**
   * Phase 1 fix: The reduce callback was missing `return acc` in the else
   * branch, causing `undefined` accumulator after the first row that lacked
   * the column key, which produced NaN totals.
   * @see docs/07-action-plan.md#6-deduplicate-filter-logic
   */
  const handleTotalAmount = (columnKey) => {
    const total = getData.reduce((acc, current) => {
      if (current[columnKey]) {
        return acc + Number(current[columnKey]);
      }
      return acc;
    }, 0);
    return useFormatNumber(total);
  };

  const viewTotal =
    columnState?.all.find((col) => col.isTotal) && getData.length > 0;
  return (
    viewTotal && (
      <div className="grid_footer">
           <div className={`row_Grid  rounded-s-lg  `}>
            {isSelected && <div className="row_Item w-10"></div>}
            {onClickRow && <div className="row_Item   h-11 w-10 "></div>}

            {isOpenInNewTab && <div className="w-10"></div>}
            {isOpenChildGrid && <div className="w-10"></div>}
            {isTree && <div className="w-10"></div>}

            {columnState?.fixed &&
              columnState.fixed.map((column) => (
                <div key={column.key}>
                  {column.isTotal ? (
                    <div
                      className={
                        "row_Item  " + (isTree ? "row_Item_start" : "")
                      }
                      style={{ width: column.width }}
                    >
                      <span className="text-primary text-sm">
                        {handleTotalAmount(column.key)}
                      </span>
                    </div>
                  ) : column.footerKey ? (
                    <div
                      className={
                        "row_Item " + (isTree ? "row_Item_start" : "")
                      }
                      style={{ width: column.width }}
                    >
                      <span className="font-bold text-sm">
                        <TranslationText
                          page="General"
                          title={column.footerKey}
                        />
                        {column.showOriginalTotal && originalTotals}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={
                        "row_Item " + (isTree ? "row_Item_start" : "")
                      }
                      style={{ width: column.width }}
                    ></div>
                  )}
                </div>
              ))}
          </div>
          <div className="overflow-hidden" ref={scrollableContainerDataRef}>
            <div
              className="default_Data"
              style={{ width: totalDefaultColumnsWidthPx }}
            >
              <div className={"row_Grid  "}>
                {/* Phase 0 fix: `level` was undefined here (P0 bug from docs/07-action-plan.md#1.4).
                   Footer does not track tree depth, so we use 0. */}
                {isTree && (
                  <div
                    className="row_Item"
                    style={{ paddingInlineStart: "0px" }}
                  ></div>
                )}
                {columnState?.default &&
                  columnState?.default.map((column) => (
                    <div
                      className={
                        "flex items-center  h-11 " +
                        (isTree ? "row_Item_start" : "")
                      }
                      style={{ width: column.width }}
                      key={column.key}
                    >
                      <div key={column.key}>
                        {column.isTotal ? (
                          <div
                            className={
                              ((EditCulomsRow != null
                                ? EditCulomsRow[column.key] ?? true
                                : column?.isEdit) && isEditRows
                                ? " text-start  ps-3"
                                : " justify-center text-center") +
                              " flex items-center h-11 " +
                              (isTree ? " row_Item_start" : "")
                            }
                            style={{ width: column.width }}
                          >
                            <span className="text-primary text-start text-sm font-bold">
                              {handleTotalAmount(column.key)}
                            </span>
                          </div>
                        ) : column.footerKey ? (
                          <div
                            className={
                              "row_Item " +
                              (isTree ? "row_Item_start" : "")
                            }
                            style={{ width: column.width }}
                          >
                            <span className="font-bold text-sm">
                              <TranslationText
                                page="General"
                                title={column.footerKey}
                              />
                            </span>
                          </div>
                        ) : (
                          <div
                            className={
                              "row_Item " +
                              (isTree ? "row_Item_start" : "")
                            }
                            style={{ width: column.width }}
                          ></div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
             <div className="row_Card_action_list shadow_none"></div>
         </div>
     )
  );
};

export default Footer;
