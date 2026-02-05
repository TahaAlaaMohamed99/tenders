import GenericGridPage from "../Components/GenericGridPage";
import GenericAddEditPage from "../Components/GenericAddEditPage";
import { VendorsGrid, VendorGroupsGrid, CurrenciesGrid, DepartmentsGrid, ItemsGrid, SubmissionDocumentsGrid } from "./GridSchemas";
import { VendorsFilter } from "./FilterSchemas";
import { VendorsActions } from "./ActionSchemas";
import { VendorsForm, VendorGroupsForm, CurrenciesForm, DepartmentsForm, ItemsForm, SubmissionDocumentsForm } from "./FormSchemas";
import SubmissionDocumentAddEdit from "../Pages/SubmissionDocumentAddEdit";

// Default/Fallback Schemas for pages that don't have specific ones yet
const DefaultGrid = { columns: [{ key: "id", title: "ID", width: 100 }] };
const DefaultForm = { sections: [{ title: "Info", fields: [] }] };

export const DataPagesLine = {

    SubmissionDocumentLine: {
        Api: "SubmissionDocument",
 
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: false,
        ...SubmissionDocumentsGrid,
        formSchema: SubmissionDocumentsForm
    },

};