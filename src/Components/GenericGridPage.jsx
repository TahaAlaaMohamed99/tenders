import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TendersGrid from './TendersGrid';
import useLayout from '../Hooks/useLayout';
import Loading from './loader';
import ConfirmationModal from './ConfirmationModal';
import { IconTrash } from '../assets/Icons';
import useGenericGridController from '../Hooks/useGenericGridController';

/**
 * GenericGridPage
 * 
 * "Smart Container" for top-level grid pages (e.g. Dashboard, Vendors).
 * Handles URL routing, layout titles, and modal deletions.
 * 
 * @param {Object} props
 * @param {Object} props.DataPage
 * @param {string} props.ResourcePage
 * @param {boolean} [props.isGetAll=true]
 * @param {*} [props.refreshKey]
 * @param {boolean} [props.isReadOnly=false]
 */
const GenericGridPage = ({
    DataPage,
    ResourcePage,
    // apiOverride, onClickRow: These were for line-item support, now removed/deprecated in favor of GenericGridPageLine
    isGetAll = true,
    refreshKey,
    isReadOnly = false,
    ...props
}) => {
    // Set Page Title (Top-level feature)
    useLayout(ResourcePage);

    const navigate = useNavigate();
    const location = useLocation();

    // Controller Hook
    const {
        isLoading,
        dataGrid,
        totalRow,
        PageNumber,
        pageSize,
        selectedRows,
        showModalDelete,
        handlePageChange,
        handlePageSize,
        handleDelete,
        confirmDelete,
        cancelDelete, // Use if exposed
        setShowModalDelete // For manual modal control if needed
    } = useGenericGridController({
        api: DataPage.Api,
        DataPage,
        ResourcePage,
        isGetAll,
        refreshKey
    });

    // -- Routing Handlers --
    const handleNavigate = useCallback((row) => {
        const idKey = DataPage.keyId || 'id';
        const id = row[idKey];
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
                handleDelete={handleDelete}
                // Top-level grids usually control selection state here or passed down? 
                // TendersGrid expects setselectesRowInsert sometimes.
                setselectesRowInsert={props.setselectesRowInsert} 
            />
            
            <ConfirmationModal
                isVisible={showModalDelete}
                ResourcePage={ResourcePage}
                type={"delete"}
                title={"messageRemove"}
                description="confirmRemove"
                icon={<IconTrash />}
                confirmButtonLabel="delete"
                onConfirm={confirmDelete}
                onCancel={() => setShowModalDelete(false)}
            />
        </>
    );
};

export default GenericGridPage;
