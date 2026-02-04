import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TendersGrid from './TendersGrid';
import useGridData from '../Hooks/useGridData';
import useLayout from '../Hooks/useLayout';
import Loading from './loader';

/**
 * GenericGridPage
 * 
 * A reusable "Smart Container" for List Pages.
 * Connects configuration from DataPages to the TendersGrid component.
 * Handles:
 * - Data Fetching (useGridData)
 * - Pagination State
 * - Navigation (Add / Edit)
 * - Loading States
 * 
 * @param {Object} props
 * @param {Object} props.DataPage - The full configuration object for this page
 * @param {string} props.ResourcePage - The resource key for localization/API
 */
const GenericGridPage = ({ DataPage, ResourcePage, ...props }) => {
    // Set Page Title
    useLayout(ResourcePage);

    const navigate = useNavigate();
    const location = useLocation();

    // -- State --
    const [isLoading, setIsLoading] = useState(true);
    const [dataGrid, setDataGrid] = useState([]);
    const [PageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // -- Data Fetching --
    // useGridData returns { totalRow, fetchGridData }
    const { totalRow, fetchGridData } = useGridData(DataPage.Api, setDataGrid, setIsLoading);

    // Reset state when API/page changes
    useEffect(() => {
        setDataGrid([]);
        setPageNumber(1);
        setIsLoading(true);
    }, [DataPage.Api]);

    useEffect(() => {
        fetchGridData(PageNumber, pageSize);
    }, [PageNumber, pageSize, DataPage.Api]);

    // -- Handlers --
    const handlePageChange = useCallback((newPage) => {
        setPageNumber(newPage);
    }, []);

    const handlePageSize = useCallback((_, newSize) => {
        setPageSize(newSize);
        setPageNumber(1); // Reset to first page
    }, []);

    const handleNavigate = useCallback((row) => {
        // Default to "id" if keyId is not specified, but DataPage usually has it
        const idKey = DataPage.keyId || 'id';
        const id = row[idKey];
        
        // Remove trailing slash if present to avoid double slashes
        const basePath = location.pathname.replace(/\/$/, "");
        navigate(`${basePath}/edit/${id}`);
    }, [DataPage.keyId, location.pathname, navigate]);

    const handleAdd = useCallback(() => {
        const basePath = location.pathname.replace(/\/$/, "");
        navigate(`${basePath}/add/0`);
    }, [location.pathname, navigate]);

    // -- Render --
    if (isLoading && dataGrid.length === 0) {
        return <Loading />;
    }

    return (
        <TendersGrid
            GridKey={ResourcePage}
            ResourcePage={ResourcePage}
            // Configuration
            {...DataPage} // Spread DataPage config (isSearch, ExcelExport, etc.)
            columns={DataPage.columns}
            // Data & State
            data={dataGrid}
            totalRow={totalRow}
            PageNumber={PageNumber}
            pageSize={pageSize}
            isLoading={isLoading} // Pass loading state if Grid supports it, or it will just show data
            // Actions
            handlePageChange={handlePageChange}
            handlePageSize={handlePageSize}
            onClickRow={handleNavigate}
            AddBtn={{ onClick: handleAdd }}
            isSelected={true} // Enable checkboxes for all rows
            // Spread any other props (e.g. filters from DataPage)
            {...props}
        />
    );
};

export default GenericGridPage;
