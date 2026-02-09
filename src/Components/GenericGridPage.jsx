import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TendersGrid from './TendersGrid';
import useGridData from '../Hooks/useGridData';
import useLayout from '../Hooks/useLayout';
import Loading from './loader';
import ConfirmationModal from './ConfirmationModal';
import { IconTrash } from '../assets/Icons';
import useHandleDelete from '../Hooks/useHandleDelete';

/**
 * GenericGridPage
 * 
 * A reusable "Smart Container" for grid (list) pages.
 * Handles both top-level pages and child/line-item grids.
 * 
 * Phase 1 refactor: Merged GenericGridPageLine into this component.
 * When `apiOverride` is provided, data is fetched from that endpoint
 * and row-click / add-click are delegated to the `onClickRow` callback
 * instead of navigating via react-router.
 * 
 * @see docs/07-action-plan.md#8-merge-genericgridpage-and-genericgridpageline
 * 
 * @param {Object}   props
 * @param {Object}   props.DataPage       - Page config from DataPages / DataPagesLine
 * @param {string}   props.ResourcePage   - Resource key for localisation/API
 * @param {string}   [props.apiOverride]  - If given, used instead of DataPage.Api
 * @param {Function} [props.onClickRow]   - Custom row-click handler (line-item mode)
 * @param {boolean}  [props.isGetAll=true] - Passed to useGridData
 * @param {*}        [props.refreshKey]   - Changes trigger a data re-fetch
 * @param {boolean}  [props.isReadOnly=false] - Hides Add button when true
 */
const GenericGridPage = ({
    DataPage,
    ResourcePage,
    apiOverride = null,
    onClickRow: onClickRowProp = null,
    isGetAll = true,
    refreshKey,
    isReadOnly = false,
    ...props
}) => {
    // Determine which API to fetch from
    const api = apiOverride || DataPage.Api;
    const isLineMode = apiOverride != null;

    // Set Page Title
    useLayout(ResourcePage);

    const navigate = useNavigate();
    const location = useLocation();

    // -- State --
    const [isLoading, setIsLoading] = useState(true);
    const [dataGrid, setDataGrid] = useState([]);
    const [PageNumber, setPageNumber] = useState(1);
    // Phase 3: pageSize now reads from metadata config, with 20 as fallback
    // @see docs/03-metadata-driven-ui.md#hardcoding-that-should-be-metadata
    const [pageSize, setPageSize] = useState(DataPage.defaultPageSize || 20);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showModalDelete, setShowModalDelete] = useState(false);

    // -- Data Fetching --
    const { totalRow, fetchGridData } = useGridData(api, setDataGrid, setIsLoading, isGetAll);
    const { handleDeleteBatch } = useHandleDelete();

    // Track whether the API/page has changed to avoid double-fetching on mount
    const prevApiRef = React.useRef(api);

    // Reset state when API/page changes (but don't fetch — let the main effect handle it)
    useEffect(() => {
        if (prevApiRef.current !== api) {
            prevApiRef.current = api;
            setDataGrid([]);
            setPageNumber(1);
            setIsLoading(true);
        }
    }, [api]);

    // Single fetch effect — fires on mount and whenever page/size/refreshKey change
    useEffect(() => {
        fetchGridData(PageNumber, pageSize);
    }, [PageNumber, pageSize, refreshKey, api]);

    // -- Handlers --
    const handlePageChange = useCallback((newPage) => {
        setPageNumber(newPage);
    }, []);

    const handlePageSize = useCallback((_, newSize) => {
        setPageSize(newSize);
        setPageNumber(1);
    }, []);

    const handleNavigate = useCallback((row) => {
        if (onClickRowProp) {
            onClickRowProp(row);
            return;
        }
        const idKey = DataPage.keyId || 'id';
        const id = row[idKey];
        const basePath = location.pathname.replace(/\/$/, "");
        navigate(`${basePath}/edit/${id}`);
    }, [DataPage.keyId, location.pathname, navigate, onClickRowProp]);

    const handleAdd = useCallback(() => {
        if (onClickRowProp) {
            onClickRowProp(null);
            return;
        }
        const basePath = location.pathname.replace(/\/$/, "");
        navigate(`${basePath}/add/0`);
    }, [location.pathname, navigate, onClickRowProp]);

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

    // -- Render --
    if (isLoading && dataGrid.length === 0) {
        return <Loading />;
    }

    return (
        <>
            <TendersGrid
                GridKey={ResourcePage}
                ResourcePage={ResourcePage}
                {...DataPage}
                columns={DataPage.columns}
                data={dataGrid}
                totalRow={totalRow}
                PageNumber={PageNumber}
                pageSize={pageSize}
                isLoading={isLoading}
                handlePageChange={handlePageChange}
                handlePageSize={handlePageSize}
                onClickRow={handleNavigate}
                AddBtn={!isReadOnly ? { onClick: handleAdd } : null}
                isSelected={!isReadOnly}
                {...props}
                handleDelete={!isLineMode ? handleDelete : props.handleDelete}
                setselectesRowInsert={!isLineMode ? setSelectedRows : props.setselectesRowInsert}
            />
            {!isLineMode && (
                <ConfirmationModal
                    isVisible={showModalDelete}
                    ResourcePage={ResourcePage}
                    type={"delete"}
                    title={"messageRemove"}
                    description="confirmRemove"
                    icon={<IconTrash />}
                    confirmButtonLabel="delete"
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowModalDelete(false);
                    }}
                />
            )}
        </>
    );
};

export default GenericGridPage;
