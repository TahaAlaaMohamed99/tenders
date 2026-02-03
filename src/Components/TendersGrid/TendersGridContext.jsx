"use client";

import { createContext, useState, useCallback, useEffect, useRef, useMemo } from "react";
import { setLocalStorageBtoa } from "../../utils/useFromLocalStorage";
import { useSelector } from "react-redux";
 
export const TendersGridContext = createContext();

const mergeColumns = (savedColumns, newColumns, dimensionsColumns, editsColumns, protectedKeys) => {
  const mergedColumns = savedColumns.map((oldCol) => {
    const newCol = newColumns.find((c) => c.key === oldCol.key);
    if (!newCol) return oldCol;

    const updated = { ...oldCol };
    Object.keys(newCol).forEach((key) => {
      if (!protectedKeys.includes(key)) {
        if (oldCol[key] !== newCol[key]) updated[key] = newCol[key];
      }
    });
    return updated;
  });

  newColumns.forEach((newCol) => {
    if (!mergedColumns.find((col) => col.key === newCol.key)) {
      mergedColumns.push(newCol);
    }
  });

  dimensionsColumns.forEach((col) => {
    if (!mergedColumns.find((c) => c.key === col.key && c.title === col.title)) {
      mergedColumns.push(col);
    }
  });

  editsColumns.forEach((col) => {
    if (!mergedColumns.find((c) => c.key === col.key && c.title === col.title)) {
      mergedColumns.push(col);
    }
  });

  return mergedColumns;
};

export const TendersGridProvider = ({ children, ...props }) => {

  const [columnState, setColumnState] = useState({
    all: [],
    default: [],
    defaultMobile: [],
    fixed: [],
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsEdited, setRowsEdited] = useState([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [getData, setGetData] = useState(props.data);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openedChildGrid, setOpenedChildGrid] = useState(null);
  const [isViewerGrid, setIsViewerGrid] = useState(true);
  const [sortConfig, setSortConfig] = useState([]);
  const [openRows, setOpenRows] = useState({});
  const [isOpenAll, setIsOpenAll] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const localStorageCache = useRef(new Map());

  const { currentLanguage, theme } = useSelector((state) => state.themeSlice);
 
  const protectedKeys = useMemo(() => ["hidden", "hiddenMobile", "width"], []);
  const storageKey = useMemo(() => `TendersGrid_${props.GridKey}`, [props.GridKey]);

  const getFromLocalStorage = useCallback((key) => {
    if (localStorageCache.current.has(key)) {
      return localStorageCache.current.get(key);
    }

    try {
      const value = localStorage.getItem(key);
      if (value) {
        const parsed = JSON.parse(atob(value));
        localStorageCache.current.set(key, parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return null;
  }, []);

  const updateLocalStorage = useCallback((key, data) => {
    try {
      setLocalStorageBtoa(key, data);
      localStorageCache.current.set(key, data);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, []);

  useEffect(() => {
    const savedColumns = props.islocalStorageGrid === false
      ? []
      : getFromLocalStorage(storageKey) || [];

    const newColumns = props.columns || [];
    const dimensionsColumns = props.dimensionsColumns || [];
    const editsColumns = props.editsColumns || [];

    const mergedColumns = mergeColumns(
      savedColumns,
      newColumns,
      dimensionsColumns,
      editsColumns,
      protectedKeys
    );

    const finalColumns =
      mergedColumns;

  
    const all = finalColumns;
    const fixed = all.filter((col) => col?.fixed && !col?.hiddenShow);
    const defaultCols = all.filter((col) => !col?.fixed && !col?.hidden);
    const defaultMobile = all.filter((col) => !col?.fixed && !col?.hiddenMobile);

    setColumnState({
      all,
      default: defaultCols,
      defaultMobile,
      fixed,
    });

    const localStoragColumns = all.filter((col) => col.isDimension !== true);
    updateLocalStorage(storageKey, localStoragColumns);

  }, [
    props.columns,
    props.GridKey,
    props.dimensionsColumns,
    props.editsColumns,
    props.islocalStorageGrid,
    storageKey,
    protectedKeys,
    getFromLocalStorage,
    updateLocalStorage,
  ]);

  useEffect(() => {
    if (props.isTree !== true) return;

    const newState = {};
    const openAllChildren = (rows) => {
      rows?.forEach((row) => {
        newState[row.recId] = true;
        if (row.children) {
          openAllChildren(row.children);
        }
      });
    };

    openAllChildren(getData);
    setOpenRows(newState);
    setIsOpenAll(true);
  }, [getData, props.isTree]);

  const handleColumnSettingsChange = useCallback((updatedColumns) => {
    const fixed = updatedColumns.filter((col) => col?.fixed);
    const defaultCols = updatedColumns.filter((col) => !col?.fixed && !col?.hidden);
    const defaultMobile = updatedColumns.filter((col) => !col?.fixed && !col?.hiddenMobile);

    setColumnState({
      all: updatedColumns,
      default: defaultCols,
      defaultMobile,
      fixed,
    });
  }, []);

  const resizeTimeoutRef = useRef(null);

  const handleResize = useCallback((key, newWidth) => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    setColumnState((prevState) => {
      const updateColumnWidth = (cols) =>
        cols.map((col) => col.key === key ? { ...col, width: newWidth } : col);

      const updatedState = {
        all: updateColumnWidth(prevState.all),
        default: updateColumnWidth(prevState.default),
        defaultMobile: updateColumnWidth(prevState.defaultMobile),
        fixed: updateColumnWidth(prevState.fixed),
      };

      resizeTimeoutRef.current = setTimeout(() => {
        updateLocalStorage(storageKey, updatedState.all);
      }, 500);

      return updatedState;
    });
  }, [storageKey, updateLocalStorage]);

  const allRows = useMemo(() => {
    const result = [];
    const collectRows = (rows) => {
      rows?.forEach((row) => {
        result.push(row);
        if (row.children?.length > 0) {
          collectRows(row.children);
        }
      });
    };
    collectRows(getData);
    return result;
  }, [getData]);

  const handleRowSelect = useCallback((row) => {
    setSelectedRows((prev) => {
      const isSelected = prev.includes(row);
      return isSelected
        ? prev.filter((selectedRow) => selectedRow !== row)
        : [...prev, row];
    });

    if (props.setselectesRowInsert) {
      props.setselectesRowInsert((prev) => {
        const isSelected = prev.includes(row);
        return isSelected
          ? prev.filter((selectedRow) => selectedRow !== row)
          : [...prev, row];
      });
    }
  }, [props.setselectesRowInsert]);
  const handleSelectAll = useCallback((maxSelected) => {
    const selectRows = (rows, limit) => {
      const result = [];
      const process = (items) => {
        for (const row of items) {
          if (result.length >= limit) break;
          result.push(row);
          if (row.children?.length > 0) {
            process(row.children);
          }
        }
      };
      process(rows);
      return result;
    };

    setSelectedRows((prev) => {
      const isAllSelected = prev.length === allRows.length;
      setIsSelectedAll(!isAllSelected);

      const newSelection = isAllSelected ? [] : selectRows(getData, maxSelected);


      if (props.setselectesRowInsert) {
        props.setselectesRowInsert(newSelection);
      }

      return newSelection;
    });
  }, [getData, allRows.length, props.setselectesRowInsert]);


  const searchTimeoutRef = useRef(null);

  const handleSearch = useCallback((searchText) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const lowerSearchText = searchText.toLowerCase();

      const searchData = (rows) => {
        return rows.reduce((acc, item) => {
          const matchesSearch = Object.values(item).some((value) =>
            String(value).toLowerCase().includes(lowerSearchText)
          );

          if (matchesSearch) {
            acc.push({
              ...item,
              children: item.children ? searchData(item.children) : [],
            });
          } else if (item.children?.length > 0) {
            const matchingChildren = searchData(item.children);
            if (matchingChildren.length > 0) {
              acc.push({ ...item, children: matchingChildren });
            }
          }

          return acc;
        }, []);
      };

      setGetData(searchData(props.data));
    }, 300);
  }, [props.data]);

  const handleSort = useCallback((columnKey) => {
    setSortConfig((prevConfig) => {
      const newConfig = [...prevConfig];
      const existingIndex = newConfig.findIndex((item) => item.key === columnKey);

      if (existingIndex !== -1) {
        const currentClickCount = (newConfig[existingIndex].clickCount || 1) % 3 + 1;

        if (currentClickCount === 3) {
          newConfig.splice(existingIndex, 1);
        } else {
          newConfig[existingIndex] = {
            ...newConfig[existingIndex],
            direction: currentClickCount === 1 ? "asc" : "desc",
            clickCount: currentClickCount,
          };
          const selectedConfig = newConfig.splice(existingIndex, 1)[0];
          newConfig.unshift(selectedConfig);
        }
      } else {
        newConfig.unshift({
          key: columnKey,
          direction: "asc",
          clickCount: 1,
          priority: 1,
        });
        newConfig.forEach((item, i) => {
          if (i > 0) item.priority = i + 1;
        });
      }

      if (newConfig.length === 0) {
        setGetData(props.data);
        return newConfig;
      }

      const sortedData = [...props.data].sort((a, b) => {
        for (const { key, direction } of newConfig) {
          const aValue = a[key];
          const bValue = b[key];

          if (aValue == null) return direction === "asc" ? -1 : 1;
          if (bValue == null) return direction === "asc" ? 1 : -1;

          let comparison = 0;

          if (key === "createdOn" || key.includes("Date") || key.includes("date")) {
            comparison = new Date(aValue) - new Date(bValue);
          } else if (typeof aValue === "number" && typeof bValue === "number") {
            comparison = aValue - bValue;
          } else {
            comparison = String(aValue).localeCompare(String(bValue), undefined, {
              numeric: true,
              sensitivity: "base",
            });
          }

          if (comparison !== 0) {
            return direction === "asc" ? comparison : -comparison;
          }
        }
        return 0;
      });

      setGetData(sortedData);
      return newConfig;
    });
  }, [props.data]);

  const handleClearAllGrid = useCallback(() => {
    setGetData(props.data);
    setRowsEdited([]);
  }, [props.data]);

  const toggleDropdown = useCallback((e) => {
    e?.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const toggleRow = useCallback((rowId, children = []) => {
    setOpenRows((prev) => {
      if (!prev) return {};

      const isOpen = !!prev[rowId];
      const newState = { ...prev };

      if (isOpen) {
        delete newState[rowId];

        const closeChildren = (childrenList) => {
          childrenList?.forEach((child) => {
            if (child?.recId) {
              delete newState[child.recId];
            }
            if (child?.children) {
              closeChildren(child.children);
            }
          });
        };
        closeChildren(children);
      } else {
        newState[rowId] = true;
      }

      return newState;
    });
  }, []);

  const toggleAllRows = useCallback(() => {
    setOpenRows((prev) => {
      const allRowIds = getData.map((row) => row.recId);
      const allOpen = allRowIds.every((rowId) => !!prev[rowId]);

      if (allOpen) {
        setIsOpenAll(false);
        return {};
      }

      const newState = {};
      const openAllChildren = (rows) => {
        rows?.forEach((row) => {
          newState[row.recId] = true;
          if (row.children) {
            openAllChildren(row.children);
          }
        });
      };

      openAllChildren(getData);
      setIsOpenAll(true);
      return newState;
    });
  }, [getData]);

  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const contextValue = useMemo(() => ({
    ...props,
    currentLanguage,
     theme,
    columnState,
    selectedRows,
    isSelectedAll,
    getData,
    handleColumnSettingsChange,
    handleResize,
    handleRowSelect,
    handleSelectAll,
    handleSearch,
    setGetData,
    handleSort,
    isDropdownOpen,
    setIsDropdownOpen,
    sortConfig,
    dropdownRef,
    buttonRef,
    menuRef,
    toggleDropdown,
    toggleRow,
    toggleAllRows,
    openRows,
    isOpenAll,
    setOpenedChildGrid,
    openedChildGrid,
    setIsViewerGrid,
    isViewerGrid,
    setRowsEdited,
    rowsEdited,
    handleClearAllGrid,
  }), [
    props,
    currentLanguage,
     theme,
    columnState,
    selectedRows,
    isSelectedAll,
    getData,
    handleColumnSettingsChange,
    handleResize,
    handleRowSelect,
    handleSelectAll,
    handleSearch,
    handleSort,
    isDropdownOpen,
    sortConfig,
    toggleDropdown,
    toggleRow,
    toggleAllRows,
    openRows,
    isOpenAll,
    openedChildGrid,
    isViewerGrid,
    rowsEdited,
    handleClearAllGrid,
  ]);

  return (
    <TendersGridContext.Provider value={contextValue}>
      {children}
    </TendersGridContext.Provider>
  );
};