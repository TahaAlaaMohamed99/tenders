import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TendersGrid from './TendersGrid';
import useLayout from '../Hooks/useLayout';
import Loading from './loader';
import ConfirmationModal from './ConfirmationModal';
import { IconTrash } from '../assets/Icons';
import useGenericGridController from '../Hooks/useGenericGridController';
import Config from '../utils/Config';

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
 * @param {Object} [props.ConfigPage] - Used exclusively for permissions override
 */
const GenericGridPage = ({
    DataPage,
    ResourcePage,
    // apiOverride, onClickRow: These were for line-item support, now removed/deprecated in favor of GenericGridPageLine
    isGetAll = true,
    refreshKey,
    isReadOnly = false,
    ConfigPage,
    ...props
}) => {
    const activeConfig = ConfigPage || DataPage;

    // Set Page Title (Top-level feature)
    useLayout(ResourcePage, activeConfig); // Passing activeConfig as the configPage argument

    const navigate = useNavigate();
    const location = useLocation();

    // Controller Hook
    const {
        isLoading,
        dataGrid,
        totalRow,
        PageNumber,
        pageSize,
        showModalDelete,
        handlePageChange,
        handlePageSize,
        handleFilterChange,
        handleDelete,
        confirmDelete,
        setShowModalDelete, // For manual modal control if needed
        setSelectedRows // Required for TendersGrid selection sync
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
                onFilterChange={handleFilterChange} // Added for backend filtering
                onClickRow={handleNavigate}
                AddBtn={!isReadOnly && Config.isAllow("Modify", activeConfig) ? { onClick: handleAdd } : null}
                isSelected={!isReadOnly && DataPage.isSelected !== false && Config.isAllow("Delete", activeConfig)}
                {...props}
                handleDelete={Config.isAllow("Delete", activeConfig) ? handleDelete : null}
                // Top-level grids usually control selection state here or passed down? 
                // TendersGrid expects setselectesRowInsert sometimes.
                // Connect TendersGrid selection to Controller
                setselectesRowInsert={setSelectedRows} 
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
