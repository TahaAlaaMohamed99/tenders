import GenericGridPage from "../Components/GenericGridPage";
import GenericAddEditPage from "../Components/GenericAddEditPage";
import { CommonColumns } from "./CommonGridSchemas";
import { VendorGroupsFilter, VendorsFilter } from "./FilterSchemas";
import { VendorsActions } from "./ActionSchemas";
import { VendorsForm, VendorGroupsForm, CurrenciesForm, DepartmentsForm, ItemsForm, SubmissionDocumentsForm, UsersForm, RolesForm, TermsandSpecificationsBookletForm } from "./FormSchemas";
import SubmissionDocumentAddEdit from "../Pages/SubmissionDocumentAddEdit";
import DashboardPage from "../Pages/DashboardPage";
import UsersAddEdit from "../Pages/Users/UsersAddEdit";
import RolesAddEdit from "../Pages/Roles/RolesAddEdit";
import TermsandSpecificationsBookletAddEdit from "../Pages/TermsandSpecificationsBookletAddEdit";

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
        formSchema: DefaultForm,
        keyPage: "Dashboard",
        keyModule: "Dashboard",
        showMenu: "mainMenu",
        checkPermission: false
    },
    Journal: {
        Api: "Journal",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        ...DefaultGrid,
        formSchema: DefaultForm,
        titleAdd: "addJournal",
        titleEdit: "editJournal",
        keyPage: "Journal",
        keyModule: "Journal",
        showMenu: "mainMenu",
        checkPermission: false
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
        KeyPermission: "SubmissionDocument",
        keyPage: "SubmissionDocuments",
        keyModule: "Journal",
        showMenu: "mainMenu"
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
        titleEdit: "editReport",
        keyPage: "Reports",
        keyModule: "Reports",
        showMenu: "mainMenu",
        checkPermission: false
    },
    Setup: {
        Api: "Setup",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        ...DefaultGrid,
        formSchema: DefaultForm,
        titleAdd: "addSetup",
        titleEdit: "editSetup",
        keyPage: "Setup",
        keyModule: "Setup",
        showMenu: "mainMenu",
        checkPermission: false
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
            { ...CommonColumns.Name, fixed: true, width: 200, maxWidth: 280 },
            { ...CommonColumns.Description, title: "description" },
            CommonColumns.DataAreaId, // Parent field — must appear before vendorGroupId
            {
                key: "vendorGroupId",
                title: "vendorGroupId",
                width: 150,
                maxWidth: 180,
                minWidth: 100,
                isFilter: true,
                // Column header filter → async-select (FilterGrid drawer overridden by VendorGroupsFilter.overrides)
                filterLookup: {
                    api: "VendorGroups/GetLookup",
                    labelKey: "vendorGroupId",
                    valueKey: "vendorGroupId"
                }
            },
            { ...CommonColumns.Description, title: "description" },
            CommonColumns.DataAreaId,
            CommonColumns.CreatedOn
        ],
        formSchema: VendorGroupsForm,
        titleAdd: "addVendorGroup",
        titleEdit: "editVendorGroup",
        KeyPermission: "VendorGroup",
        filterSchema: VendorGroupsFilter, // Link the new dependent filter schema
        keyPage: "VendorGroups",
        keyModule: "Setup",
        showMenu: "mainMenu"
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
        titleEdit: "editCurrency",
        KeyPermission: "Currinces",
        keyPage: "Currencies",
        keyModule: "Setup",
        showMenu: "mainMenu"
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
                isFilter: true,  // enable in column header filter so generallist renders
                generallist: "ProductType",
                className: "state_Primary"
            },
            CommonColumns.CreatedOn
        ],
        formSchema: ItemsForm,
        titleAdd: "addItem",
        titleEdit: "editItem",
        KeyPermission: "Item",
        keyPage: "Items",
        keyModule: "Setup",
        showMenu: "mainMenu"
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
                isFilter: true,
                generallist: "OperatingUnitType", // column header filter renders a select
                className: "state_Primary"
            },
            CommonColumns.CreatedOn
        ],
        formSchema: DepartmentsForm,
        titleAdd: "addDepartment",
        titleEdit: "editDepartment",
        KeyPermission: "Department",
        keyPage: "Departments",
        keyModule: "Setup",
        showMenu: "mainMenu"
    },
    Settings: {
        Api: "Settings",
        componentViwe: GenericGridPage,
        componentAddEdit: GenericAddEditPage,
        keyId: "id",
        ...DefaultGrid,
        formSchema: DefaultForm,
        titleAdd: "addSetting",
        titleEdit: "editSetting",
        keyPage: "Settings",
        keyModule: "Settings",
        showMenu: "settings",
        checkPermission: false
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
            CommonColumns.DataAreaId, // Parent field — must appear before vendorGroupId
            {
                key: "vendorGroupId",
                title: "vendorGroupId",
                width: 150,
                maxWidth: 200,
                isFilter: true,
                type: "status",
                className: "state_Primary",
                // Column header filter: async-select (overridden in FilterGrid drawer by VendorsFilter.overrides)
                filterLookup: {
                    api: "VendorGroups/GetLookup",
                    labelKey: "vendorGroupId",
                    valueKey: "vendorGroupId"
                }
            },
            CommonColumns.CurrencyCode,
            {
                key: "vendorPartyType",
                title: "vendorPartyType",
                width: 150,
                maxWidth: 200,
                type: "status",
                className: "state_Primary",
                generallist: "VendorPartyType" // Column header filter: generallist select
            },
            CommonColumns.CreatedOn
        ],
        ...VendorsActions,
        formSchema: VendorsForm,
        filterSchema: VendorsFilter, // async-select overrides for lookup fields
        titleAdd: "addVendor",
        titleEdit: "editVendor",
        KeyPermission: "Vendor",
        keyPage: "Vendors",
        keyModule: "Setup",
        showMenu: "mainMenu"
    },
    Roles: {
        Api: "Role",
        componentViwe: GenericGridPage,
        componentAddEdit: RolesAddEdit,
        keyId: "id",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        columns: [
            { ...CommonColumns.Name, key: "name", title: "name" }
        ],
        formSchema: RolesForm,
        titleAdd: "addRole",
        titleEdit: "editRole",
        KeyPermission: "Role",
        keyPage: "Roles",
        keyModule: null,
        showMenu: "settings"
    },
    Users: {
        Api: "User",
        componentViwe: GenericGridPage,
        componentAddEdit: UsersAddEdit,
        keyId: "id",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        columns: [
            { ...CommonColumns.Name, key: "firstName", title: "firstName" },
            { ...CommonColumns.Name, key: "lastName", title: "lastName" },
            { ...CommonColumns.Name, key: "userName", title: "userName" },
            { ...CommonColumns.Name, key: "email", title: "email" },
            { ...CommonColumns.Name, key: "address", title: "address" },
        ],
        formSchema: UsersForm,
        titleAdd: "addUser",
        titleEdit: "editUser",
        KeyPermission: "User",
        keyPage: "Users",
        keyModule: null,
        showMenu: "settings"
    },
    TermsandSpecificationsBooklet: {
        Api: "TermsandSpecificationsBooklet",
        componentViwe: GenericGridPage,
        componentAddEdit: TermsandSpecificationsBookletAddEdit,
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: true,
        columns: [
            CommonColumns.Code,
            { ...CommonColumns.Name, fixed: true, width: 300, maxWidth: 450 },
            CommonColumns.CreatedOn
        ],
        formSchema: TermsandSpecificationsBookletForm,
        titleAdd: "addTermsandSpecificationsBooklet",
        titleEdit: "editTermsandSpecificationsBooklet",
        KeyPermission: "TermsandSpecificationsBooklet",
        keyPage: "TermsandSpecificationsBooklet",
        keyModule: "Setup",
        showMenu: "mainMenu"
    }
};