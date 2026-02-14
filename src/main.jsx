import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./Styles/main.scss";
import store from "./store/index.jsx";
import { Provider } from "react-redux";

// Phase 7 (P3 #18): Runtime metadata validation — dev-only, zero cost in production
if (import.meta.env.DEV) {
  import("./utils/validateMetadata.js").then(({ validateAllMetadata }) => {
    // Dynamic imports to avoid bundling validation deps in production
    Promise.all([
      import("./ConfigData/SidebarLogs.json"),
      import("./ConfigData/DataPages.jsx"),
      import("./ConfigData/FormSchemas.jsx"),
    ]).then(([sidebarModule, dataPagesModule, formModule]) => {
      validateAllMetadata({
        sidebarLogs: sidebarModule.default,
        dataPages: dataPagesModule.DataPages,
        formSchemas: {
          Vendors: formModule.VendorsForm,
          VendorGroups: formModule.VendorGroupsForm,
          Currencies: formModule.CurrenciesForm,
          Departments: formModule.DepartmentsForm,
          Items: formModule.ItemsForm,
          SubmissionDocuments: formModule.SubmissionDocumentsForm,
        },
      });
    });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
