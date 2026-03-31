import { useState } from 'react';
import TendersGrid from './TendersGrid';
import Loading from './loader';
import useGenericGridController from '../Hooks/useGenericGridController';
import Config from '../utils/Config';
import TranslationText from './TranslationText';

/**
 * GenericGridPageLine
 * 
 * specialized grid component for line items / detail views.
 * Usage: <GenericGridPageLine apiOverride="some/api" ... />
 * 
 * @param {Object} props
 * @param {Object} props.DataPage
 * @param {string} props.ResourcePage
 * @param {string} props.apiOverride - Required for line mode
 * @param {Function} props.onClickRow - Handler for row clicks
 * @param {boolean} [props.isGetAll=true]
 * @param {*} [props.refreshKey]
 * @param {boolean} [props.isReadOnly=false]
 * @param {Object} [props.ConfigPage] - Config for permission checks (Add/Delete)
 * @param {string} [props.titleGrid] - Optional localized title for the grid section
 * @param {Object} [props.parentData] - Optional context about the parent entity { parentId, parentName }
 */
const GenericGridPageLine = ({
    DataPage,
    ResourcePage,
    apiOverride,
    onClickRow,
    isGetAll = true,
    refreshKey: externalRefreshKey,
    isReadOnly = false,
    ConfigPage,
    titleGrid,
    parentData,
    permissions,
    ...props
}) => {
    const activeConfig = ConfigPage || DataPage;
    
    // Permission checks with fallback to Config.isAllow
    const isAllowedModify = permissions?.isAllowedModify ?? Config.isAllow('Modify', activeConfig);
    const isAllowedDelete = permissions?.isAllowedDelete ?? Config.isAllow('Delete', activeConfig);

    // Internal state for modal management (SOLID optimization)
    const [showModal, setShowModal] = useState(false);
    const [recId, setRecId] = useState(0);
    const [internalRefreshKey, setInternalRefreshKey] = useState(0);

    const refreshKey = [externalRefreshKey, internalRefreshKey].filter(k => k !== undefined).join('_');
    
    // Controller Hook
    const {
        isLoading,
        dataGrid,
        totalRow,
        PageNumber,
        pageSize,
        handlePageChange,
        handlePageSize,
        setSelectedRows,
    } = useGenericGridController({
        api: apiOverride,
        DataPage,
        ResourcePage,
        isGetAll,
        refreshKey
    });

    // -- Render --
    if (isLoading && dataGrid.length === 0) {
        return <Loading />;
    }

    // internal handlers to bridge to props
    const handleNavigate = (row) => {
        if (onClickRow === null) return;
        
        if (onClickRow) {
            onClickRow(row);
        } else if (DataPage.AddEditComponent) {
            const idKey = DataPage.keyId || 'id';
            setRecId(row ? row[idKey] : 0);
            setShowModal(true);
        }
    };

    const handleAdd = () => {
        if (onClickRow) {
            onClickRow(null);
        } else if (DataPage.AddEditComponent) {
            setRecId(0);
            setShowModal(true);
        }
    };

    const AddEditComponent = DataPage.AddEditComponent;

    // Support both titleGrid and isTitleGrid for backward compatibility if needed, 
    // but titleGrid is the semantic name.
    const displayTitle = titleGrid || props.isTitleGrid;

    return (
        <div className="generic-grid-line-container my-4">
            {displayTitle && (
                <div className="flex items-center gap-2 mb-4 px-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        <TranslationText title={displayTitle === true ? ResourcePage : displayTitle} page={ResourcePage} />
                    </h3>
                    {parentData?.parentName && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                            ({parentData.parentName})
                        </span>
                    )}
                </div>
            )}
            <TendersGrid
                GridKey={ResourcePage}
                ResourcePage={ResourcePage}
                {...DataPage}
                data={dataGrid}
                totalRow={totalRow}
                PageNumber={PageNumber}
                pageSize={pageSize}
                isLoading={isLoading}
                handlePageChange={handlePageChange}
                handlePageSize={handlePageSize}
                onClickRow={onClickRow === undefined ? handleNavigate : onClickRow}
                AddBtn={!isReadOnly && isAllowedModify ? { onClick: handleAdd } : null}
                isSelected={!isReadOnly}
                {...props}
                handleDelete={!isReadOnly && isAllowedDelete ? props.handleDelete : null}
                setSelectedRows={props.setSelectedRows || setSelectedRows}
            />

            {/* SOLID: Automatically render AddEditComponent if defined in metadata */}
            {AddEditComponent && (
                <AddEditComponent
                    isVisible={showModal}
                    toggleClick={() => {
                        setShowModal(false);
                        setRecId(0);
                    }}
                    parentData={parentData}
                    recId={recId}
                    ResourcePage={ResourcePage}
                    fetchGridData={() => {
                        setInternalRefreshKey(prev => prev + 1);
                        if (props.fetchGridData) props.fetchGridData();
                    }}
                    title={(recId > 0 ? "edit" : "add") + (DataPage.ResourcePage || ResourcePage)}
                    titleSubmitBtn="save"
                    isAllowedModify={isAllowedModify}
                />
            )}
        </div>
    );
};


export default GenericGridPageLine;
