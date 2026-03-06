"use client";

import { createContext, useState, useCallback, useEffect, useRef, useMemo } from "react";
import { setLocalStorageBtoa, getLocalStorageAtob } from "../../utils/localStorage";
import { useSelector } from "react-redux";
// Phase 5: Extracted shared filter logic to eliminate duplication
import { applyGridFilters } from "../../utils/gridFilters";
 
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
  const [valuesFilter, setValuesFilter] = useState(() => {
    // Load saved filters from localStorage on initialization
    const filterKey = `TendersGrid_Filters_${props.GridKey}`;
    return getLocalStorageAtob(filterKey, {});
  });

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
      const parsed = getLocalStorageAtob(key, null);
      if (parsed) {
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

    // Schema mismatch detection: if new columns differ from saved columns
    const savedKeys = new Set(savedColumns.map(c => c.key));
    const newKeys = new Set(newColumns.map(c => c.key));
    const hasNewColumnsNotInSaved = newColumns.some(c => !savedKeys.has(c.key));
    const hasSavedColumnsNotInNew = savedColumns.some(c => !newKeys.has(c.key));
    const schemaMismatch = newColumns.length > 0 && (hasNewColumnsNotInSaved || hasSavedColumnsNotInNew);
    const effectiveSavedColumns = schemaMismatch ? [] : savedColumns;

    // if (schemaMismatch && savedColumns.length > 0) {
    //   console.log(`[TendersGrid] Schema mismatch detected for ${storageKey}, resetting cached columns`);
    // }

    const mergedColumns = mergeColumns(
      effectiveSavedColumns,
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

  useEffect(() => {
    // If there are active filters, reapply them; otherwise reset to original data
    const hasActiveFilters = valuesFilter && Object.keys(valuesFilter).length > 0 && 
      Object.values(valuesFilter).some(v => {
        if (v === "" || v == null) return false;
        // Check for date range objects
        if (typeof v === 'object' && !Array.isArray(v)) {
          return !(v.start && v.end); // Consider empty if both start and end are falsy
        }
        return true;
      });
    
    if (hasActiveFilters && !props.onFilterChange) {
      // Phase 5: Deduplicated — uses shared applyGridFilters utility
      // ONLY apply IF client-side filtering is active (i.e., onFilterChange is not passed down)
      setGetData(applyGridFilters(props.data, valuesFilter));
    } else {
      setGetData(props.data || []);
    }
  }, [props.data, valuesFilter, props.onFilterChange]);

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

    // Count only selectable rows for "all selected" check
    const selectableRows = allRows;
    const isAllSelected = selectedRows.length === selectableRows.length && selectableRows.length > 0;
    const newSelection = isAllSelected ? [] : selectRows(getData, maxSelected);

    setSelectedRows(newSelection);
    setIsSelectedAll(!isAllSelected);

    if (props.setselectesRowInsert) {
      props.setselectesRowInsert(newSelection);
    }
  }, [getData, allRows, selectedRows.length, props.setselectesRowInsert]);


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

  const handleSortDirection = useCallback((columnKey, direction) => {
    setSortConfig((prevConfig) => {
      let newConfig = [...prevConfig];
      const existingIndex = newConfig.findIndex((item) => item.key === columnKey);

      if (existingIndex !== -1) {
        newConfig[existingIndex] = {
          ...newConfig[existingIndex],
          direction: direction,
          clickCount: direction === "asc" ? 1 : 2,
        };
        // Move to top priority
        const selectedConfig = newConfig.splice(existingIndex, 1)[0];
        newConfig.unshift(selectedConfig);
      } else {
        newConfig.unshift({
          key: columnKey,
          direction: direction,
          clickCount: direction === "asc" ? 1 : 2,
          priority: 1,
        });
        // Adjust priorities
        newConfig.forEach((item, i) => {
          if (i > 0) item.priority = i + 1;
        });
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

  // Phase 5: Deduplicated — uses shared applyGridFilters utility
  // @see docs/07-action-plan.md#6-deduplicate-filter-logic
  const handleFilterGrid = useCallback((values, fields) => {
    setValuesFilter(values);
    if (props.onFilterChange) {
      // Backend Filtering: Let the parent controller handle filtering
      props.onFilterChange(values);
    } else {
      // Fallback: Client-side Filtering if no backend handler is provided
      setGetData(applyGridFilters(props.data, values, fields));
    }
  }, [props.data, props.onFilterChange]);

  const handleClearFilter = useCallback(() => {
    const filterKey = `TendersGrid_Filters_${props.GridKey}`;
    localStorage.removeItem(filterKey);
    setValuesFilter({});
    if (props.onFilterChange) {
      // Backend Filtering: Clear filters by passing empty object or null
      props.onFilterChange(null);
    } else {
      // Fallback: Client-side Filtering
      setGetData(props.data);
    }
  }, [props.data, props.GridKey, props.onFilterChange]);

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
    handleSortDirection,
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
    valuesFilter,
    handleFilterGrid,
    handleClearFilter,
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
    handleSortDirection,
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
    valuesFilter,
    handleFilterGrid,
    handleClearFilter,
  ]);


  return (
    <TendersGridContext.Provider value={contextValue}>
      {children}
    </TendersGridContext.Provider>
  );
};