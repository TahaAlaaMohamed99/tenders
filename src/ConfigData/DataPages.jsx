import GenericGridPage from "../Components/GenericGridPage";
import GenericAddEditPage from "../Components/GenericAddEditPage";
import { CommonColumns } from "./CommonGridSchemas";
import { VendorsFilter } from "./FilterSchemas";
import { VendorsActions } from "./ActionSchemas";
import { VendorsForm, VendorGroupsForm, CurrenciesForm, DepartmentsForm, ItemsForm, SubmissionDocumentsForm } from "./FormSchemas";
import SubmissionDocumentAddEdit from "../Pages/SubmissionDocumentAddEdit";
import DashboardPage from "../Pages/DashboardPage";

// Default/Fallback Schemas
const DefaultGrid = { columns: [{ key: "id", title: "ID", width: 100 }] };
const DefaultForm = { sections: [{ title: "Info", fields: [] }] };

export const DataPages = {
    Dashboard: {
        Api: "dashboard",
        componentViwe: DashboardPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        isSelected: false,
        ...DefaultGrid,
        formSchema: DefaultForm
    },
    Journal: {
        Api: "Journal",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        ...DefaultGrid,
        formSchema: DefaultForm,
        titleAdd: "addJournal",
        titleEdit: "editJournal"
    },
    SubmissionDocuments: {
        Api: "SubmissionDocument",
        componentViwe: GenericGridPage,
        componentAddEdit: SubmissionDocumentAddEdit,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        columns: [
            CommonColumns.Code,
            { ...CommonColumns.Name, fixed: true, width: 200, maxWidth: 280 },
            { ...CommonColumns.Description, width: 250, maxWidth: 350 },
            {
                key: "biddingType",
                title: "biddingType",
                width: 130,
                maxWidth: 160,
                type: "status",
                generallist: "BiddingType",
                className: "state_Primary"
            },
            CommonColumns.Status,
            {
                key: "transDate",
                title: "transDate",
                width: 150,
                maxWidth: 180,
                type: "date"
            },
            {
                key: "executionDate",
                title: "executionDate",
                width: 150,
                maxWidth: 180,
                type: "date"
            },
            CommonColumns.CreatedOn
        ],
        formSchema: SubmissionDocumentsForm,
        titleAdd: "addSubmissionDocument",
        titleEdit: "editSubmissionDocument",
        subModule: "Transaction",
        keyPage: "SubmissionDocuments",
    },
    Reports: {
        Api: "Reports",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        columns: [
            {
                key: "name",
                title: "description",
                width: 200,
                maxWidth: 220,
                minWidth:100,
                isFilter: true,
                fixed: true,
            }
        ],
        formSchema: DefaultForm,
        titleAdd: "addReport",
        titleEdit: "editReport"
    },
    Setup: {
        Api: "Setup",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        ...DefaultGrid,
        formSchema: DefaultForm,
        titleAdd: "addSetup",
        titleEdit: "editSetup"
    },
    VendorGroups: {
        Api: "VendorGroups",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        columns: [
            { ...CommonColumns.Code, width: 150, maxWidth: 180 },
            {
                key: "vendorGroupId",
                title: "vendorGroupId",
                width: 150,
                maxWidth: 180,
                minWidth: 100,
                isFilter: true
            },
            { ...CommonColumns.Name, fixed: true, width: 200, maxWidth: 280 },
            { ...CommonColumns.Description, title: "description" },
            CommonColumns.DataAreaId,
            CommonColumns.CreatedOn
        ],
        formSchema: VendorGroupsForm,
        titleAdd: "addVendorGroup",
        titleEdit: "editVendorGroup"
    },
    Currencies: {
        Api: "Currencies",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        columns: [
            CommonColumns.CurrencyCode,
            { ...CommonColumns.Name, width: 250, maxWidth: 350 },
            CommonColumns.CreatedOn
        ],
        formSchema: CurrenciesForm,
        titleAdd: "addCurrency",
        titleEdit: "editCurrency"
    },
    Items: {
        Api: "Item",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        columns: [
            { ...CommonColumns.Code, width: 120, minWidth: 80 },
            CommonColumns.ItemNumber,
            {
                key: "searchName",
                title: "searchName",
                width: 250,
                maxWidth: 350,
                isFilter: true
            },
            { ...CommonColumns.DataAreaId, width: 120, maxWidth: 150 },
            {
                key: "inventoryUnitSymbol",
                title: "inventoryUnitSymbol",
                width: 150,
                maxWidth: 180
            },
            {
                key: "productType",
                title: "productType",
                width: 130,
                maxWidth: 160,
                type: "status",
                generallist: "ProductType",
                className: "state_Primary"
            },
            CommonColumns.CreatedOn
        ],
        formSchema: ItemsForm,
        titleAdd: "addItem",
        titleEdit: "editItem"
    },
    Departments: {
        Api: "Department",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        columns: [
            { ...CommonColumns.Code, width: 120, minWidth: 80 },
            { ...CommonColumns.Name, fixed: true },
            {
                key: "operatingUnitNumber",
                title: "operatingUnitNumber",
                width: 150,
                maxWidth: 180,
                isFilter: true
            },
            {
                key: "operatingUnitType",
                title: "operatingUnitType",
                width: 150,
                maxWidth: 200,
                type: "status",
                className: "state_Primary"
            },
            CommonColumns.CreatedOn
        ],
        formSchema: DepartmentsForm,
        titleAdd: "addDepartment",
        titleEdit: "editDepartment"
    },
    Settings: {
        Api: "Settings",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        ...DefaultGrid,
        formSchema: DefaultForm,
        titleAdd: "addSetting",
        titleEdit: "editSetting"
    },
    Vendors: {
        Api: "Vendors",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "recId",
        isSelected: true,
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        columns: [
            { ...CommonColumns.Code, width: 150, maxWidth: 180 },
            { ...CommonColumns.Name, fixed: true, width: 200, maxWidth: 280 },
            {
                key: "vendorAccountNumber",
                title: "vendorAccountNumber",
                width: 180,
                maxWidth: 220,
                isFilter: true
            },
            {
                key: "vendorGroupId",
                title: "vendorGroupId",
                width: 150,
                maxWidth: 200,
                isFilter: true,
                type: "status",
                className: "state_Primary"
            },
            CommonColumns.CurrencyCode,
            CommonColumns.DataAreaId,
            {
                key: "vendorPartyType",
                title: "vendorPartyType",
                width: 150,
                maxWidth: 200,
                type: "status",
                className: "state_Primary"
            },
            CommonColumns.CreatedOn
        ],
        ...VendorsFilter,
        ...VendorsActions,
        formSchema: VendorsForm,
        titleAdd: "addVendor",
        titleEdit: "editVendor"
    }
};