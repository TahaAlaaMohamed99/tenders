import { CommonColumns } from "./CommonGridSchemas";
import { SubmissionDocumentsForm, TermsandSpecificationsBookletLineForm } from "./FormSchemas";
import RolesAddEditLine from "../Pages/Users/RolesAddEditLine";

export const DataPagesLine = {
    SubmissionDocumentLine: {
        Api: "SubmissionDocumentLine",
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: false,
        columns: [
            CommonColumns.ItemNumber,
            {
                key: "itemName",
                title: "itemName",
                width: 200,
                maxWidth: 280,
                isFilter: true
            },
            {
                key: "purchaseQuantity",
                title: "purchaseQuantity",
                width: 150,
                maxWidth: 200,
                isFilter: true
            },
            {
                key: "departmentName",
                title: "departmentName",
                width: 150,
                maxWidth: 200,
                isFilter: true
            },
            CommonColumns.CreatedOn
        ],
        formSchema: SubmissionDocumentsForm,
        keyPage: "SubmissionDocuments",
        keyModule: "Journal",
        showMenu: "mainMenu"
    },
    RolesAddEditLine: {
        Api: "User/GetRolesByUserId",
        keyId: "roleId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: false,
        columns: [
            {
                key: "roleName",
                title: "roleName",
                width: 150,
                maxWidth: 200,
                fixed: true,
                isFilter: true
            },
            CommonColumns.CreatedOn
        ],
        AddEditComponent: RolesAddEditLine,
        keyPage: "Roles",
        ResourcePage: "Roles",
        KeyPermission: "Role",
    },
    TermsandSpecificationsBookletLine: {
        Api: "TermsandSpecificationsBookletLine",
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: false,
        columns: [
            CommonColumns.Code,
            { ...CommonColumns.Name, fixed: true, width: 250, maxWidth: 350 },
            {
                key: "amount",
                title: "amount",
                width: 120,
                maxWidth: 150,
                isFilter: true
            },
            {
                key: "price",
                title: "price",
                width: 120,
                maxWidth: 150,
                isFilter: true
            },
            CommonColumns.CreatedOn
        ],
        formSchema: TermsandSpecificationsBookletLineForm,
        keyPage: "TermsandSpecificationsBooklet",
        keyModule: "Setup",
        showMenu: "mainMenu"
    }
};