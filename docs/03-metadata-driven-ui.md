# Metadata-Driven UI Architecture

## Overview

This application uses a **metadata-driven architecture** where UI structure is defined declaratively in JSON/config files rather than hardcoded in components. This enables adding new CRUD pages without writing new components.

---

## Metadata Structures

### 1. SidebarLogs.json — Page Registry

**Location**: `src/ConfigData/SidebarLogs.json` (68 lines)

**Purpose**: Defines all pages, routes, modules, and menu structure.

**Structure**:
```json
{
  "keyPage": "Vendors",           // Unique page identifier
  "keyModule": "Setup",           // Parent module (optional)
  "routePage": "Vendors",         // URL segment
  "showMenu": "mainMenu",         // "mainMenu" | "settings"
  "subModule": "Vendors & Partners" // Sub-grouping (optional)
}
```

**Consumed By**:
- `DynamicRouter.jsx` (route generation)
- `Sidebar.jsx` via `useProcessMenu` (menu tree)

**Current Pages**:
1. Dashboard (standalone)
2. Journal (standalone)
3. SubmissionDocuments (under Journal module)
4. Reports (standalone)
5. Setup (standalone)
6. Vendors (under Setup module)
7. VendorGroups (under Setup module)
8. Currencies (under Setup module)
9. Items (under Setup module)
10. Departments (under Setup module)
11. Settings (standalone, in settings menu)

---

### 2. DataPages.jsx — Page Configuration

**Location**: `src/ConfigData/DataPages.jsx` (154 lines)

**Purpose**: Maps page keys to API endpoints, components, and schemas.

**Structure**:
```javascript
{
  Vendors: {
    Api: "Vendors",                    // API endpoint
    componentViwe: GenericGridPage,    // List component
    componentAddEdit: GenericAddEditPage, // Form component
    keyId: "recId",                    // Primary key field
    ExcelExport: true,                 // Enable Excel export
    isSearch: true,                    // Enable search bar
    isFilterGrid: true,                // Enable advanced filters
    columns: [...],                    // From GridSchemas
    formSchema: {...},                 // From FormSchemas
    filters: [...],                    // From FilterSchemas
    rowActions: [...],                 // From ActionSchemas
    titleAdd: "addVendor",            // Translation key
    titleEdit: "editVendor"           // Translation key
  }
}
```

**Consumed By**:
- `DynamicRouter.jsx` (component selection)
- `GenericGridPage.jsx` (grid config)
- `GenericAddEditPage.jsx` (form config)
- `useProcessMenu` (menu filtering)

**Current Configurations**: 11 pages (Dashboard, Journal, SubmissionDocuments, Reports, Setup, VendorGroups, Currencies, Items, Departments, Settings, Vendors)

---

### 3. GridSchemas.jsx — Column Definitions

**Location**: `src/ConfigData/GridSchemas.jsx` (354 lines)

**Purpose**: Defines grid columns for each entity.

**Structure**:
```javascript
export const VendorsGrid = {
  columns: [
    {
      key: "code",              // Field name in API response
      title: "code",            // Translation key
      fixed: true,              // Freeze column
      width: 150,               // Column width (px)
      maxWidth: 180,            // Max resize width
      minWidth: 100,            // Min resize width
      isFilter: true,           // Enable inline filter
      type: "text",             // Data type (text, date, status, etc.)
      className: "state_Primary" // CSS class for status type
    }
  ]
}
```

**Column Types**:
- `text`: Plain text
- `date`: Formatted date
- `dateTime`: Date + time
- `status`: Badge with color
- `email`: Mailto link
- `tel`: Tel link
- `salary`: Formatted number
- `color`: Color swatch
- `Merge`: Concatenate two fields
- `time`: Formatted time
- `openPage`: Link to another page

**Consumed By**: Spread into `DataPages.jsx` → passed to `TendersGrid`

**Current Schemas**: VendorsGrid, VendorGroupsGrid, CurrenciesGrid, DepartmentsGrid, ItemsGrid, SubmissionDocumentsGrid, SubmissionDocumentLinesGrid

---

### 4. FormSchemas.jsx — Form Field Definitions

**Location**: `src/ConfigData/FormSchemas.jsx` (323 lines)

**Purpose**: Defines form fields for add/edit pages.

**Structure**:
```javascript
export const VendorsForm = {
  sections: [
    {
      title: "Vendor Info",
      fields: [
        {
          name: "name",                // API field key
          label: "name",               // Translation key
          type: "text",                // Field type (maps to componentRegistry)
          required: true,              // Validation
          gridWidth: "col-span-6",     // Tailwind grid class
          placeholder: "enterName",    // Placeholder key
          autoComplete: "off"          // HTML attribute
        },
        {
          name: "vendorGroupId",
          type: "async-select",        // Fetches from API
          lookup: {
            api: "VendorGroups/GetLookup",
            labelKey: "vendorGroupId",
            valueKey: "vendorGroupId"
          }
        }
      ]
    }
  ]
}
```

**Field Types** (from componentRegistry):
- `text`, `email`, `password`, `number`
- `textarea`
- `select`, `async-select`
- `checkbox`, `cardCheckbox`
- `radioGroup`, `cardRadio`
- `date`, `dateRange`, `datetime`
- `otp`

**Consumed By**: Spread into `DataPages.jsx` → passed to `DynamicForm`

**Current Schemas**: VendorsForm, VendorGroupsForm, CurrenciesForm, DepartmentsForm, ItemsForm, SubmissionDocumentsForm, SubmissionDocumentLinesForm

---

### 5. componentRegistry.jsx — Component Mapping

**Location**: `src/ConfigData/componentRegistry.jsx` (328 lines)

**Purpose**: Maps field type strings to React components (Open/Closed Principle).

**Structure**:
```javascript
export const componentRegistry = {
  text: CustomInput,
  select: CustomeSelect,
  'async-select': AsyncSelectWrapper,
  date: CustomDatePicker,
  // ... extensible without modifying DynamicForm
};
```

**Consumed By**: `DynamicForm.jsx`

**Usage in DynamicForm**:
```javascript
const Component = componentRegistry[field.type];
return <Component {...fieldProps} />;
```

**Registered Types**: 15 types (text, email, password, number, textarea, otp, select, async-select, radioGroup, cardRadio, checkbox, cardCheckbox, date, dateRange, datetime)

**Planned Types** (commented out): gridSelect, fieldGroup, repeater

---

### 6. OrderMenus.jsx — Menu Ordering

**Location**: `src/ConfigData/OrderMenus.jsx` (26 lines)

**Purpose**: Defines sidebar module order and assigns icons.

**Structure**:
```javascript
export const ModuleOrderSidbar = [
  { keyModule: "Dashboard", icon: <IconDashboard /> },
  { keyModule: "Journal", icon: <IconJournal /> },
  // ...
];
```

**Consumed By**: `Sidebar.jsx` via `useProcessMenu`

---

### 7. resources.json — Translations

**Location**: `src/ConfigData/resources.json`

**Purpose**: Key-based i18n for English and Arabic.

**Structure**:
```json
{
  "General": {
    "save": { "en": "Save", "ar": "حفظ" },
    "cancel": { "en": "Cancel", "ar": "إلغاء" }
  },
  "Vendors": {
    "name": { "en": "Name", "ar": "الاسم" }
  },
  "BiddingType": {
    "values": {
      "tender": { "en": "Tender", "ar": "مناقصة" }
    }
  }
}
```

**Consumed By**: `useTranslationText`, `TranslationText`

**Namespaces**:
- `General`: Common UI strings
- `Grid`: Grid-specific strings
- `Sidebar`: Menu items
- Page-specific: `Vendors`, `Currencies`, etc.
- Enums: `BiddingType`, `WorkflowStatus`, etc.

---

### 8. Generallist.json — Enum Options

**Location**: `src/ConfigData/Generallist.json`

**Purpose**: Dropdown options for enums/statuses.

**Structure**:
```json
{
  "WorkflowStatus": [
    { "label": "draft", "value": 0 },
    { "label": "submitted", "value": 1 }
  ],
  "BiddingType": [
    { "label": "tender", "value": 1 },
    { "label": "quotation", "value": 2 }
  ]
}
```

**Consumed By**: `useGetGenerallist`, grid status rendering

**Usage**:
1. `useGetGenerallist` reads this file
2. Looks up translation in `resources.json[generallistName].values[label][lang]`
3. Returns `{ label: "Tender", value: 1 }`

---

### 9. StatusList.json — Workflow Status Styles

**Location**: `src/ConfigData/StatusList.json` (44 lines)

**Purpose**: Maps status values to CSS classes.

**Structure**:
```json
{
  "WorkflowStatus": {
    "0": "Draft",
    "1": "Submitted",
    "2": "FullyApproved",
    "3": "Rejected",
    "4": "Posted"
  }
}
```

**Consumed By**: `HeaderPageAddEdit.jsx` for status badge styling

---

### 10. ColumnsHeaderPage.json — Record Viewer Columns

**Location**: `src/ConfigData/ColumnsHeaderPage.json` (12 lines)

**Purpose**: Defines columns for record detail viewer.

**Structure**:
```json
{
  "Vendors": [
    { "key": "name", "label": "name" },
    { "key": "vendorGroupId", "label": "vendorGroupId" }
  ]
}
```

**Consumed By**: `HeaderPageAddEdit.jsx` → `ViewerRec.jsx`

---

### 11. ParentEntityRoutes.json — Parent Navigation

**Location**: `src/ConfigData/ParentEntityRoutes.json` (11 lines)

**Purpose**: Defines navigation to parent entities.

**Structure**:
```json
{
  "Vendors": {
    "parent": null,
    "route": "/vendors"
  }
}
```

**Consumed By**: `HeaderPageAddEdit.jsx` (parent entity button)

---

### 12. FilterSchemas.jsx — Advanced Filters (Placeholder)

**Location**: `src/ConfigData/FilterSchemas.jsx` (14 lines)

**Purpose**: Advanced side-panel filter configuration.

**Structure**:
```javascript
export const VendorsFilter = {
  filters: []  // ← Empty, never used
};
```

**Status**: Placeholder / Dead Code

**Consumed By**: Spread into `DataPages.jsx` but never read

---

### 13. ActionSchemas.jsx — Row/Bulk Actions (Placeholder)

**Location**: `src/ConfigData/ActionSchemas.jsx` (17 lines)

**Purpose**: Row and bulk action configuration.

**Structure**:
```javascript
export const VendorsActions = {
  rowActions: [],   // ← Empty
  bulkActions: []   // ← Empty
};
```

**Status**: Placeholder / Dead Code

**Consumed By**: Spread into `DataPages.jsx` but never read

---

### 14. DataPagesLine.jsx — Child Grid Configurations

**Location**: `src/ConfigData/DataPagesLine.jsx` (20 lines)

**Purpose**: Configuration for line-level pages (child grids).

**Structure**:
```javascript
export const DataPagesLine = {
  SubmissionDocumentLine: {
    Api: "SubmissionDocumentLine",
    keyId: "recId",
    ExcelExport: true,
    isSearch: true,
    ...SubmissionDocumentLinesGrid,
    formSchema: SubmissionDocumentsForm
  }
};
```

**Consumed By**: `SubmissionDocumentAddEdit.jsx`

---

### 15. DataPagesHierarchyGrid.jsx — Hierarchy Config (Unused)

**Location**: `src/ConfigData/DataPagesHierarchyGrid.jsx` (22 lines)

**Purpose**: Configuration for hierarchical grid views.

**Structure**:
```javascript
export const DataPagesHierarchyGrid = {
  Vendors: {
    enabled: false,  // ← All disabled
    parentKey: null,
    gridConfig: null
  }
};
```

**Status**: Placeholder / Unused

**Consumed By**: `HeaderPageAddEdit.jsx` but all entries have `enabled: false`

---

## Metadata Consumption Flow

### Route Generation

```
SidebarLogs.json
    │
    └──▶ DynamicRouter.RouteFactory(SidebarLogs, DataPages)
            │
            └──▶ For each page in SidebarLogs:
                    │
                    ├── path = `${keyModule}/${routePage}`
                    ├── Component = DataPages[keyPage].componentViwe
                    ├── AddEdit = DataPages[keyPage].componentAddEdit
                    │
                    └── Generate:
                        <Route path={path} element={<Component />} />
                        <Route path={`${path}/:option/:id`} element={<AddEdit />} />
```

**File**: `src/Routes/DynamicRouter.jsx`

**Result**: 11 pages × 2 routes = 22 routes generated automatically

---

### Menu Generation

```
SidebarLogs.json
    │
    └──▶ useProcessMenu(SidebarLogs, ModuleOrderSidbar, DataPages)
            │
            ├── Group by keyModule
            ├── Group by subModule (if present)
            ├── Apply icon from ModuleOrderSidbar
            ├── Filter out pages not in DataPages
            │
            └──▶ Hierarchical structure:
                    Module
                      ├── Direct Items (no subModule)
                      └── SubModule Groups
                            └── Items
```

**File**: `src/Hooks/useProcessMenu.jsx`

**Result**: Multi-level menu tree with icons, grouping, and ordering

---

### Grid Rendering

```
DataPages[keyPage]
    │
    ├── columns (from GridSchemas)
    ├── isSearch, ExcelExport, isFilterGrid (flags)
    │
    └──▶ GenericGridPage
            │
            └──▶ TendersGrid
                    │
                    ├── Renders columns from schema
                    ├── Enables features based on flags
                    └── Formats cells based on column.type
```

**Files**:
- `src/Components/GenericGridPage.jsx`
- `src/Components/TendersGrid/index.jsx`
- `src/utils/useformatDataGrid.jsx` (cell formatting)

---

### Form Rendering

```
DataPages[keyPage].formSchema
    │
    ├── sections[].fields[]
    │     ├── name, type, label, required
    │     ├── gridWidth (Tailwind class)
    │     └── lookup (for async-select)
    │
    └──▶ GenericAddEditPage
            │
            └──▶ DynamicForm
                    │
                    └──▶ For each field:
                            │
                            ├── Component = componentRegistry[field.type]
                            ├── Validation = Yup schema from field.validation
                            │
                            └── <Component {...field} value={...} onChange={...} />
```

**Files**:
- `src/Components/GenericAddEditPage.jsx`
- `src/Components/DynamicForm.jsx`
- `src/ConfigData/componentRegistry.jsx`

---

## Principles Validation

### ✅ Configuration Over Code

**Evidence**: Adding a new CRUD page requires:

1. Add to `SidebarLogs.json`:
```json
{
  "keyPage": "NewEntity",
  "keyModule": "Setup",
  "routePage": "NewEntity",
  "showMenu": "mainMenu"
}
```

2. Add grid schema to `GridSchemas.jsx`:
```javascript
export const NewEntityGrid = {
  columns: [...]
};
```

3. Add form schema to `FormSchemas.jsx`:
```javascript
export const NewEntityForm = {
  sections: [...]
};
```

4. Add to `DataPages.jsx`:
```javascript
NewEntity: {
  Api: "NewEntity",
  componentViwe: GenericGridPage,
  componentAddEdit: GenericAddEditPage,
  keyId: "recId",
  ...NewEntityGrid,
  formSchema: NewEntityForm
}
```

**Result**: New page with full CRUD, grid, form, search, export — no new components needed.

---

### ⚠️ Extensibility Without Modification (Partial)

**Followed**:
- Adding new field types: Only modify `componentRegistry.jsx` (OCP followed)
- Adding new pages: Only modify config files (OCP followed)

**Violated**:
- Adding new grid features (e.g., `isSelected`, `ExcelExport`): Must modify `GenericGridPage.jsx` and `TendersGrid/index.jsx` to read the new flag (OCP violated)

**Example**:
```javascript
// To add a new feature "isPrintable", must modify:
// 1. GenericGridPage.jsx (pass prop)
// 2. TendersGrid/index.jsx (read prop, render button)
```

**Suggested Fix**: Use a plugin/extension system:
```javascript
// DataPages.jsx
Vendors: {
  extensions: [
    { type: "toolbar-button", component: CustomExportButton },
    { type: "row-action", component: CustomRowAction }
  ]
}
```

---

## Metadata Interpretation Layer

### Where Interpretation Happens

| Metadata | Interpreter | Location |
|----------|-------------|----------|
| `SidebarLogs.json` | `useProcessMenu` | `src/Hooks/useProcessMenu.jsx` |
| `DataPages` | `DynamicRouter.RouteFactory` | `src/Routes/DynamicRouter.jsx` |
| `GridSchemas` | `TendersGrid` | `src/Components/TendersGrid/` |
| `FormSchemas` | `DynamicForm` | `src/Components/DynamicForm.jsx` |
| `column.type` | `useformatDataGrid` | `src/utils/useformatDataGrid.jsx` |
| `field.type` | `componentRegistry` | `src/ConfigData/componentRegistry.jsx` |

### ✅ No UI Logic Leakage Into Metadata

**Evidence**: Metadata files contain only:
- Data structure definitions (columns, fields)
- Feature flags (booleans)
- Translation keys (strings)
- API endpoints (strings)

**No JSX, no event handlers, no business logic in metadata.**

---

## Unused Metadata

| File | Status | Evidence |
|------|--------|----------|
| `FilterSchemas.jsx` | Placeholder | `VendorsFilter.filters = []`, never read |
| `ActionSchemas.jsx` | Placeholder | `VendorsActions.rowActions/bulkActions = []`, never read |
| `DataPagesHierarchyGrid.jsx` | Placeholder | All entries `enabled: false`, no UI renders |
| `dummyData.json` | Dead import | Imported in `useGridData` but never used |

**Recommendation**: Remove or document as "future implementation".

---

## Hardcoding That Should Be Metadata

| Hardcoded Value | Location | Should Be |
|----------------|----------|-----------|
| `pageSize: 20` default | `GenericGridPage.jsx:40` | In `DataPages` config as `defaultPageSize` |
| `"Dashboard"` fallback title | `Header.jsx:89` | Remove fallback or add to config |
| User avatar URL | `UserAvatar.jsx:22`, `ProfileMenu.jsx:19` | From `AuthContext.user.imageUrl` |
| `"Admin User"` / `"admin@example.com"` | `Header.jsx:163` | From `AuthContext.user` |

---

## Metadata-Driven Best Practices Followed

1. ✅ **Single Source of Truth**: Each page defined once in `SidebarLogs.json`
2. ✅ **DRY**: Column/field definitions reused across grid and form
3. ✅ **Type Safety**: Field types validated by `componentRegistry.getComponent()`
4. ✅ **Separation of Concerns**: Metadata (data) separate from interpreters (logic)
5. ✅ **Extensibility**: New field types added without modifying form renderer

---

## Metadata-Driven Anti-Patterns Found

1. ❌ **Spread Operator Overuse**: `...VendorsGrid`, `...VendorsFilter`, `...VendorsActions` in `DataPages.jsx` makes it unclear which properties come from where
2. ❌ **Implicit Defaults**: Missing properties default to `undefined` rather than explicit defaults (e.g., `isSearch` defaults to falsy)
3. ⚠️ **Schema Mismatch Handling**: `TendersGridContext` detects schema mismatches and resets localStorage, but no user notification

---

## Adding a New Page — Step-by-Step

### Example: Adding "Contracts" Page

**Step 1**: Define grid schema (`GridSchemas.jsx`):
```javascript
export const ContractsGrid = {
  columns: [
    { key: "code", title: "code", fixed: true, width: 120, isFilter: true },
    { key: "name", title: "name", width: 200, isFilter: true },
    { key: "startDate", title: "startDate", type: "date", width: 150 }
  ]
};
```

**Step 2**: Define form schema (`FormSchemas.jsx`):
```javascript
export const ContractsForm = {
  sections: [{
    title: "Contract Info",
    fields: [
      { name: "name", type: "text", required: true, gridWidth: "col-span-6" },
      { name: "startDate", type: "date", required: true, gridWidth: "col-span-6" }
    ]
  }]
};
```

**Step 3**: Register page (`DataPages.jsx`):
```javascript
Contracts: {
  Api: "Contracts",
  componentViwe: GenericGridPage,
  componentAddEdit: GenericAddEditPage,
  keyId: "recId",
  ExcelExport: true,
  isSearch: true,
  ...ContractsGrid,
  formSchema: ContractsForm,
  titleAdd: "addContract",
  titleEdit: "editContract"
}
```

**Step 4**: Add to sidebar (`SidebarLogs.json`):
```json
{
  "keyPage": "Contracts",
  "keyModule": "Setup",
  "routePage": "Contracts",
  "showMenu": "mainMenu"
}
```

**Step 5**: Add translations (`resources.json`):
```json
"Contracts": {
  "code": { "en": "Code", "ar": "الرمز" },
  "name": { "en": "Name", "ar": "الاسم" },
  "addContract": { "en": "Add Contract", "ar": "إضافة عقد" }
}
```

**Result**: Full CRUD page with grid, search, export, add/edit forms — zero new components.

---

## Metadata Validation

### Current State

**No validation**: Metadata files are plain JSON/JS exports with no schema validation.

**Risks**:
- Typos in `keyPage` cause silent failures
- Missing required properties cause runtime errors
- Invalid field types cause "Missing component" errors

### Suggested Improvements

1. **JSON Schema validation** for `SidebarLogs.json`
2. **TypeScript interfaces** for `DataPages`, `GridSchemas`, `FormSchemas`
3. **Runtime validation** in `DynamicRouter` and `DynamicForm` with helpful error messages

---

## Performance Considerations

### Metadata Loading

- All metadata files are imported statically (bundled)
- No runtime fetching (except `Ip_config.json`)
- No lazy loading of schemas

**Impact**: Initial bundle includes all page configs even if user doesn't have permission to view them.

**Suggested Optimization**: Code-split `DataPages` by module:
```javascript
const SetupPages = lazy(() => import('./ConfigData/SetupPages'));
```

---

## Summary

| Aspect | Status |
|--------|--------|
| **Metadata Coverage** | 11 pages fully configured |
| **Extensibility** | High (new pages via config only) |
| **Consistency** | High (all pages use same pattern) |
| **Documentation** | Low (no schema docs or examples) |
| **Validation** | None (no schema validation) |
| **Dead Metadata** | 3 files (FilterSchemas, ActionSchemas, DataPagesHierarchyGrid) |

**Biggest Win**: The metadata-driven architecture is the strongest part of this codebase. It enables rapid development and ensures consistency.

**Biggest Gap**: No validation or documentation for metadata schemas. Developers must reverse-engineer the structure from existing examples.
