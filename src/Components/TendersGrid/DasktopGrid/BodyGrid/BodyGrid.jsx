import React, { useContext, useMemo, useCallback, memo, useState, useEffect, useRef } from "react";
import FixedRows from "./FixedRows";
import DefaultRows from "./DefaultRows";
import DropdownGrid from "../../DropdownGrid";
import NotData from "../../NotData";
import { TendersGridContext } from "../../TendersGridContext";

const RowAction = memo(({ row, rowActionList, isSelected }) => {
  if (!rowActionList) {
    return <div className="row_Card_action_list" />;
  }

  return (
    <DropdownGrid
      classNameMenu="end-3 w-44"
      menuItems={rowActionList}
      ResourcePage="Grid"
      row={row}
      position="fixed"
      isRowAction={true}
      className={`row_Card_action_list ${isSelected ? "selected" : ""}`}
    />
  );
});

RowAction.displayName = "RowAction";

const EmptyRow = memo(() => (
  <div className="default_Data w-full">
    <div className="row_Grid">
      <div className="row_Item" />
    </div>
  </div>
));

EmptyRow.displayName = "EmptyRow";

const flattenRows = (rows, openRows, level = 0) => {
  const flattened = [];

  rows.forEach((row) => {
    flattened.push({ ...row, level });

    if (openRows[row.recId] && row.children && row.children.length > 0) {
      flattened.push(...flattenRows(row.children, openRows, level + 1));
    }
  });

  return flattened;
};

const ROWS_PER_BATCH = 25;
const THRESHOLD = 20;

const BodyGrid = ({
  totalDefaultColumnsWidthPx,
  handleScroll,
  scrollableContainerDataRef,
}) => {
  const {
    columnState,
    openRows,
    toggleRow,
    selectedRows,
    theme,
    rowActionList,
    getData,
    isSelectorHight,
  } = useContext(TendersGridContext);

  const [displayedRowsCount, setDisplayedRowsCount] = useState(ROWS_PER_BATCH);
  const isLoadingMore = useRef(false);
  const lastScrollTop = useRef(0);

  const viewTotal = useMemo(
    () => columnState?.all.find((col) => col.isTotal) && getData.length > 0,
    [columnState, getData.length]
  );

  const hasDefaultColumns = useMemo(
    () => columnState?.default.length > 0,
    [columnState?.default.length]
  );

  const gridClassName = useMemo(() => {
    if (viewTotal) return "data_Grid_custom";
    if (isSelectorHight) return "data_Grid_Selector";
    return "data_Grid";
  }, [viewTotal, isSelectorHight]);
 

  const flattenedRows = useMemo(
    () => flattenRows(getData, openRows),
    [getData, openRows]
  );

  const displayedRows = useMemo(
    () => flattenedRows.slice(0, displayedRowsCount),
    [flattenedRows, displayedRowsCount]
  );

  useEffect(() => {
    setDisplayedRowsCount(ROWS_PER_BATCH);
  }, [getData, openRows]);

  const renderRowsFixed = useCallback(
    (rows) => {
      return rows.map((row, rowIndex) => {
        const isOpen = !!openRows[row.recId];
        return (
          <React.Fragment key={row.recId || rowIndex}>
            <FixedRows
              row={row}
              openRows={openRows}
              isOpen={isOpen}
              toggleRow={toggleRow}
              level={row.level}
            />
          </React.Fragment>
        );
      });
    },
    [openRows, toggleRow]
  );

  const renderRows = useCallback(
    (rows) => {
      return rows.map((row, rowIndex) => {
        return (
          <React.Fragment key={row.recId || rowIndex}>
            <DefaultRows
              row={row}
              level={row.level}
              rowsLength={rows.length}
            />
          </React.Fragment>
        );
      });
    },
    []
  );

  const renderRowsEmpty = useCallback(
    (rows) => {
      return rows.map((row, rowIndex) => {
        return (
          <React.Fragment key={row.recId || rowIndex}>
            <EmptyRow />
          </React.Fragment>
        );
      });
    },
    []
  );

  const renderRowActionList = useCallback(
    (rows) => {
      return rows.map((row, rowIndex) => {
        const isSelected = selectedRows.some(r => r.recId == row.recId);
         return (
          <React.Fragment key={row.recId || rowIndex}>
            <RowAction
              row={row}
              rowActionList={rowActionList}
              isSelected={isSelected}
            />
          </React.Fragment>
        );
      });
    },
    [rowActionList,selectedRows]
  );

  const loadMoreRows = useCallback(() => {
    if (isLoadingMore.current) return;
    if (displayedRowsCount >= flattenedRows.length) return;

    isLoadingMore.current = true;

    requestAnimationFrame(() => {
      setDisplayedRowsCount(prev => {
        const newCount = Math.min(prev + ROWS_PER_BATCH, flattenedRows.length);
        return newCount;
      });
      isLoadingMore.current = false;
    });
  }, [displayedRowsCount, flattenedRows.length]);

  const handleScrollCallback = useCallback(() => {
    handleScroll("getData");
  }, [handleScroll]);

  const handleGridScroll = useCallback((e) => {
    const element = e.target;
    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;

    const currentVisibleRows = Math.ceil((scrollTop + clientHeight) / 44);

    if (
      currentVisibleRows >= displayedRowsCount - (ROWS_PER_BATCH - THRESHOLD) &&
      displayedRowsCount < flattenedRows.length
    ) {
      loadMoreRows();
    }

    lastScrollTop.current = scrollTop;
  }, [displayedRowsCount, flattenedRows.length, loadMoreRows]);

  if (getData.length === 0) {
    return (
      <div className={gridClassName}>
        <NotData theme={theme} />
      </div>
    );
  }

  return (
    <div
      className={gridClassName}
      onScroll={handleGridScroll}
    >
      <div
        className="flex w-full flex-nowrap"
        style={{
          minHeight: displayedRows.length * 44 + "px"
        }}
      >
        <div className="fixed_Data">
          {renderRowsFixed(displayedRows)}
        </div>

        <div
          className="scrollable-container overflow-hidden"
          ref={scrollableContainerDataRef}
          onScroll={handleScrollCallback}
        >
          {hasDefaultColumns ? (
            <div
              className="default_Data"
              style={{
                width: totalDefaultColumnsWidthPx,
                minHeight: flattenedRows.length * 44 + "px"
              }}
            >
              {renderRows(displayedRows)}
            </div>
          ) : (
            <div style={{ minHeight: flattenedRows.length * 44 + "px" }}>
              {renderRowsEmpty(displayedRows)}
            </div>
          )}
        </div>

        <div className="fixed_Data">
          {renderRowActionList(displayedRows)}
        </div>
      </div>
    </div>
  );
};

export default memo(BodyGrid);