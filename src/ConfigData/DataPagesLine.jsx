import { SubmissionDocumentLinesGrid } from "./GridSchemas";
import { SubmissionDocumentsForm } from "./FormSchemas";

// Default/Fallback Schemas for pages that don't have specific ones yet
const DefaultGrid = { columns: [{ key: "id", title: "ID", width: 100 }] };
const DefaultForm = { sections: [{ title: "Info", fields: [] }] };

export const DataPagesLine = {

    SubmissionDocumentLine: {
        Api: "SubmissionDocumentLine",
 
        keyId: "recId",
        ExcelExport: true,
        isSearch: true,
        isFilterGrid: false,
        ...SubmissionDocumentLinesGrid,
        formSchema: SubmissionDocumentsForm
    },

};