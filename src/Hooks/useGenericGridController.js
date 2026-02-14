import { useState, useCallback, useEffect, useRef } from 'react';
import useGridData from './useGridData';
import useHandleDelete from './useHandleDelete';

/**
 * useGenericGridController
 * 
 * Shared logic controller for GenericGridPage and GenericGridPageLine.
 * Handles state management, data fetching, and common grid actions.
 * 
 * @param {Object} config
 * @param {string} config.api - The API endpoint to fetch data from.
 * @param {Object} config.DataPage - The data page configuration object.
 * @param {string} config.ResourcePage - The resource page key.
 * @param {boolean} [config.isGetAll=true] - Whether to fetch all data or paginate (passed to useGridData, though currently useGridData seems to ignore it based on usage).
 * @param {*} [config.refreshKey] - External key to trigger refresh.
 */
const useGenericGridController = ({
    api,
    DataPage,
    ResourcePage,
    isGetAll = true,
    refreshKey
}) => {
    // -- State --
    const [isLoading, setIsLoading] = useState(true);
    const [dataGrid, setDataGrid] = useState([]);
    const [PageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(DataPage.defaultPageSize || 20);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showModalDelete, setShowModalDelete] = useState(false);

    // -- Data Fetching --
    const { totalRow, fetchGridData } = useGridData(api, setDataGrid, setIsLoading, isGetAll);
    const { handleDeleteBatch } = useHandleDelete();

    // Track whether the API/page has changed to avoid double-fetching on mount
    const prevApiRef = useRef(api);

    // Reset state when API/page changes
    useEffect(() => {
        if (prevApiRef.current !== api) {
            prevApiRef.current = api;
            setDataGrid([]);
            setPageNumber(1);
            setIsLoading(true);
        }
    }, [api]);

    // Fetch effect
    useEffect(() => {
        fetchGridData(PageNumber, pageSize);
    }, [PageNumber, pageSize, refreshKey, api, fetchGridData]);

    // -- Handlers --
    const handlePageChange = useCallback((newPage) => {
        setPageNumber(newPage);
    }, []);

    const handlePageSize = useCallback((_, newSize) => {
        setPageSize(newSize);
        setPageNumber(1);
    }, []);

    const handleDelete = useCallback(() => {
        setShowModalDelete(true);
    }, []);

    const confirmDelete = async () => {
        await handleDeleteBatch({
            apiPage: api,
            ids: selectedRows.map(row => row[DataPage.keyId || 'id']),
            resourcePage: ResourcePage,
            onSuccess: () => {
                fetchGridData(PageNumber, pageSize);
                setSelectedRows([]);
                setShowModalDelete(false);
            }
        });
    };

    const cancelDelete = useCallback(() => {
        setShowModalDelete(false);
    }, []);

    return {
        // State
        isLoading,
        dataGrid,
        totalRow,
        PageNumber,
        pageSize,
        selectedRows,
        showModalDelete,
        
        // State Setters
        setIsLoading,
        setDataGrid,
        setPageNumber,
        setPageSize,
        setSelectedRows,
        setShowModalDelete,

        // Actions
        handlePageChange,
        handlePageSize,
        handleDelete,
        confirmDelete,
        cancelDelete,
        fetchGridData, // Expose if manual refetch needed
    };
};

export default useGenericGridController;
