import React, { useContext, useMemo, useCallback, memo } from "react";
import CustomeSelect from "../../Form/CustomSelect";
import { TendersGridContext } from "../TendersGridContext";
import { formatDataGrid } from "../../../utils/formatDataGrid";
import CustomInput from "../../Form/CustomInput";
import CustomCheckbox from "../../Form/CustomCheckbox";
import CustomDatePicker from "../../Form/CustomDatePicker";
import dayjs from "dayjs";

const updateRowInList = (list, row, columnKey, value, keyId) => {
  const index = list.findIndex((item) => {
    const itemId = item[keyId] ?? item.recId;
    const rowId = row[keyId] ?? row.recId;
    return itemId === rowId;
  });

  if (index > -1) {
    const updated = [...list];
    updated[index] = {
      ...updated[index],
      [columnKey]: value,
    };
    return updated;
  } else {
    const newRow = {
      ...row,
      [columnKey]: value,
    };
    return [...list, newRow];
  }
};

const checkIsEditable = (column, row, EditCulomsRow) => {
  if (column?.isCheckBothEditConditions === true) {
    const hasEditColumn =
      EditCulomsRow != null &&
      EditCulomsRow[column.key] !== undefined &&
      EditCulomsRow[column.key] &&
      column.checkedEditRow;

    if (hasEditColumn) {
      return Object.entries(column.checkedEditRow).every(([key, values]) =>
        values.includes(row[key])
      );
    }

    return column?.isEdit;
  }

  if (EditCulomsRow != null && EditCulomsRow[column.key] !== undefined) {
    return EditCulomsRow[column.key];
  }

  if (column.checkedEditRow) {
    return Object.entries(column.checkedEditRow).every(([key, values]) =>
      values.includes(row[key])
    );
  }

  return column?.isEdit;
};

const GridCell = memo(({
  column,
  row,
  isEditable,
  gridListColumns,
  keyId,
  setRowsEdited,
  setGetData,
  setRowsEditedPerPage,
  routeKey,
  currentLanguage,
 }) => {
  const handleSelectChange = useCallback(
    (e) => {
      const columnKey = column.sendKey || column.keyRecId;
      if (e?.value != row[columnKey]) {
        setRowsEdited((prev) =>
          updateRowInList(prev, row, columnKey, e.value, keyId)
        );
        setGetData((prev) =>
          updateRowInList(prev, row, columnKey, e.value, keyId)
        );
      }
    },
    [column.sendKey, column.keyRecId, row, keyId, setRowsEdited, setGetData]
  );

  const handleCheckboxChange = useCallback(
    (e) => {
      const value = e.target.value === "false";
      const columnKey = column?.secondKey || column.key;
      const numValue = value ? 2 : 1;

      setRowsEdited((prev) =>
        updateRowInList(prev, row, columnKey, numValue, keyId)
      );
      setGetData((prev) =>
        updateRowInList(prev, row, columnKey, numValue, keyId)
      );
    },
    [column.secondKey, column.key, row, keyId, setRowsEdited, setGetData]
  );

  const handleDateChange = useCallback(
    (date) => {
      if (!(date instanceof Date) || isNaN(date)) return;

      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const columnKey = column?.secondKey || column.key;

      setRowsEdited((prev) =>
        updateRowInList(prev, row, columnKey, formattedDate, keyId)
      );
      setGetData((prev) =>
        updateRowInList(prev, row, columnKey, formattedDate, keyId)
      );
    },
    [column.secondKey, column.key, row, keyId, setRowsEdited, setGetData]
  );

  const handleInputChange = useCallback(
    (e) => {
      const columnKey = column.key;
      if (e.target.value != row[columnKey]) {
        const valueColumn =
          column?.type === "number"
            ? Number(e.target.value)
            : e.target.value;

        setRowsEdited((prev) =>
          updateRowInList(prev, row, columnKey, valueColumn, keyId)
        );
        setGetData((prev) =>
          updateRowInList(prev, row, columnKey, valueColumn, keyId)
        );

        if (setRowsEditedPerPage) {
          setRowsEditedPerPage((prev) =>
            updateRowInList(prev, row, columnKey, e.target.value, keyId)
          );
        }
      }
    },
    [
      column.key,
      column.type,
      row,
      keyId,
      setRowsEdited,
      setGetData,
      setRowsEditedPerPage,
    ]
  );

  const selectValue = useMemo(() => {
    const key = column?.sendKey || column?.keyRecId;
    return (
      gridListColumns[column.key]?.find((item) => item.value == row[key]) ||
      null
    );
  }, [gridListColumns, column.key, column.sendKey, column.keyRecId, row]);

  const checkboxValue = useMemo(() => {
    const key = column?.secondKey || column.key;
    return row[key] == 2;
  }, [row, column.secondKey, column.key]);

  const dateValue = useMemo(() => {
    const key = column?.secondKey || column.key;
    return row[key] || null;
  }, [row, column.secondKey, column.key]);

  if (isEditable) {
    if (
      column.isFilterSelect ||
      column.lookupName ||
      (column.generallist && !column.checkbox)
    ) {
      return (
        <CustomeSelect
          key={`mega_${column.key}_${row.recId}`}
          titleGenerallist={!!column.generallist}
          options={gridListColumns[column.key] || []}
          isClearable={column?.isClearSelect || false}
          value={selectValue}
          onChange={handleSelectChange}
          menuPlacement="auto"
          isSelectGrid={true}
          className="Selected_row_Grid"
          menuPosition="fixed"
        />
      );
    }

    if (column.checkbox) {
      return (
        <CustomCheckbox
          value={checkboxValue}
          checked={checkboxValue}
          onChange={handleCheckboxChange}
          ResourcePage="General"
          className="mb-4"
        />
      );
    }

    if (column.date) {
      return (
        <CustomDatePicker
          value={dateValue}
          onChange={handleDateChange}
          ResourcePage="General"
        />
      );
    }

    return (
      <CustomInput
        key={`mega_${column.key}`}
        className="input_row_Grid"
        value={row[column.key]}
        isNumber={column?.type === "number"}
        onChange={handleInputChange}
      />
    );
  }

  return formatDataGrid(
    column,
    row,
    routeKey,
    currentLanguage,
    "text_row",
   );
});

GridCell.displayName = "GridCell";

const SharedRows = ({ type, row }) => {
  const {
    columnState,
    setRowsEdited,
    setGetData,
    routeKey,
    isTree,
    currentLanguage,
     gridListColumns = {},
    setRowsEditedPerPage,
    isEditRows = true,
    EditCulomsRow,
    keyId = "id",
  } = useContext(TendersGridContext);

  const visibleColumns = useMemo(() => {
    return columnState[type]?.filter((col) => !col.hiddenShow) || [];
  }, [columnState, type]);

  return (
    <>
      {visibleColumns.map((column) => {
        const isEditable =
          isEditRows && checkIsEditable(column, row, EditCulomsRow);

        const cellClassName = 
          "row_Item h-11 " +
          (isTree ? "row_Item_start " : "") +
          (column?.secondKeyText ? "justify_start " : "");

        return (
          <div
            className={cellClassName}
            style={{ width: column.width }}
            key={column.key}
          >
            <GridCell
              column={column}
              row={row}
              isEditable={isEditable}
              gridListColumns={gridListColumns}
              keyId={keyId}
              setRowsEdited={setRowsEdited}
              setGetData={setGetData}
              setRowsEditedPerPage={setRowsEditedPerPage}
              routeKey={routeKey}
              currentLanguage={currentLanguage}
             />
          </div>
        );
      })}
    </>
  );
};

export default memo(SharedRows);