import React from 'react';
import TendersGrid from './TendersGrid';
import Loading from './loader';
import useGenericGridController from '../Hooks/useGenericGridController';

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
 */
const GenericGridPageLine = ({
    DataPage,
    ResourcePage,
    apiOverride,
    onClickRow,
    isGetAll = true,
    refreshKey,
    isReadOnly = false,
    ...props
}) => {
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
        // Delete logic currently handled by parent in line mode usually? 
        // Or if handled here, we need to expose handleDelete/confirmDelete but 
        // GenericGridPageLine often delegates actions differently.
        // Assuming minimal logic for now based on previous GenericGridPage mix.
    } = useGenericGridController({
        api: apiOverride, // Line mode always uses override
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
        if (onClickRow) onClickRow(row);
    };

    const handleAdd = () => {
        if (onClickRow) onClickRow(null);
    };

    return (
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
            // For line mode, delete is often passed down or handled via props.handleDelete
            handleDelete={props.handleDelete} 
            setselectesRowInsert={props.setselectesRowInsert || setSelectedRows}
        />
    );
};

export default GenericGridPageLine;
