# Component Documentation

> **Last Updated**: 2026-03-15  
> **Related Docs**: [Architecture](./00-architecture-overview.md) | [Hooks](./02-hooks.md) | [Metadata](./03-metadata-driven-ui.md) | [SOLID Audit](./05-solid-clean-architecture.md) | [Unused Code](./06-unused-and-gaps.md)

## Overview

This document catalogs all **56 components** in the codebase, organized by category. Each component includes:

| Field | Description |
|-------|-------------|
| **Location** | File path (relative to project root) |
| **Lines** | Verified line count |
| **Responsibility** | What it does |
| **Props** | Key props (real props only) |
| **Usage** | Where it's used |
| **Status** | ✅ Clean \| ⚠️ Needs Refactor \| ❌ Architectural Violation |

### Quick Summary

| Category | Count | ✅ Clean | ⚠️ Refactor | ❌ Violation |
|----------|-------|----------|-------------|-------------|
| [1. Layout & Navigation](#1-core-layout--navigation) | 5 | 5 | 0 | 0 |
| [2. Generic Pages](#2-generic-page-components) | 4 | 4 | 0 | 0 |
| [3. TendersGrid System](#3-tendersgrid-system) | 19 | 17 | 2 | 0 |
| [4. Form Components](#4-form-components) | 12 | 12 | 0 | 0 |
| [5. Shared UI](#5-shared-ui-components) | 15 | 14 | 1 | 0 |
| [6. Specialized Pages](#6-specialized-pages) | 6 | 5 | 0 | 1 (Vendors.jsx) |
| **Total** | **61 files** | **57** | **3** | **1** |

> **Phase 2 Changes (2026-03-15)**: **React 19 Upgrade**: Removed `React.forwardRef` in favor of standard `ref` props. `UsersAddEdit` refactored to use `DynamicForm`. `RolesAddEditLine` refactored to use `DynamicForm`. `useGridData` API URL construction fixed. `Stepper.jsx` React import fixed. `DynamicForm` support for `viewOnly` prop added.

> **Note**: Total files includes sub-component files (e.g., `CustomStyles.jsx`, `CustomStylesDark.jsx` inside `CustomSelect/`). Unique logical components: ~56.

---

## 1. Core Layout & Navigation

### 1.1 DashboardLayout

**Location**: `src/Layouts/DashboardLayout.jsx`

**Responsibility**: Main application layout with sidebar and header.

**Props**: None (uses Redux for sidebar state)

**Usage**: Wraps all authenticated routes in `DynamicRouter.jsx`

**Status**: ✅ Clean

**Structure**:
```jsx
<div className="grid grid-cols-[sidebar_outlet]">
  <Sidebar />
  <main>
    <Header />
    <Outlet /> {/* React Router outlet */}
  </main>
</div>
```

---

### 1.2 Header

**Location**: `src/Components/Header.jsx` (182 lines)

**Responsibility**: Top navigation bar with page title, language selector, theme toggle, notifications, and profile menu.

**Props**: None (uses Redux for breadcrumbs and theme)

**Usage**: Rendered in `DashboardLayout`

**Status**: ✅ Clean

**Features**:
- Dynamic page title from Redux breadcrumbs (via `breadcrumbsSlice`)
- Language selector dropdown (see [LanguageSelector](#14-languageselector))
- Theme toggle (light/dark) via `themeSlice`
- Notification icon (placeholder — not yet implemented)
- User profile menu (see [ProfileMenu](#15-profilemenu))
- Logout confirmation modal (see [ConfirmationModal](#53-confirmationmodal))

**Modals Used**:
- [ActionModal](#52-actionmodal) (dropdown mode) for language and profile
- [ConfirmationModal](#53-confirmationmodal) for logout

**⚠️ Hardcoded Values** (see [06-unused-and-gaps.md](./06-unused-and-gaps.md#103-hardcoded-user-data)):
```javascript
// src/Components/Layout/Header.jsx
// Line 163 — should use localStorage user instead
const user = { name: "Admin User", email: "admin@example.com", image: null };
```

---

### 1.3 Sidebar

**Location**: `src/Components/Sidebar.jsx` (861 lines)

**Responsibility**: Multi-level navigation menu with collapsed/expanded modes, tree view, and floating menus.

**Props**: None (uses processed menu from [`useProcessMenu`](./02-hooks.md#13-useprocessmenu))

**Usage**: Rendered in `DashboardLayout`

**Status**: ⚠️ Needs Refactor — [SOLID Violation](./05-solid-clean-architecture.md#-violation-2-sidebarjsx)

**Issues**:
1. **SRP Violation**: Contains `FloatingMenu` subcomponent, `SidebarItem` subcomponent, 3rd-level tree rendering (duplicated in two places), logout modal logic, and auto-expand logic all in one file.
2. **Duplicated Code**: 3rd-level `item.subItems` rendering appears twice (lines ~240-290 and ~370-420) with identical JSX.
3. **Re-render Risk**: `activeFloatingMenu` object passed to all `SidebarItem` components causes re-renders when any floating menu opens.

**Features**:
- Collapsible sidebar (icon-only mode) via Redux `menuSettingsSlice`
- Floating menu in collapsed mode (using `createPortal`)
- Multi-level hierarchy (module → subModule → page → subItems)
- Tree view icons for expandable items
- Auto-expand active parent on route change
- Logout confirmation (via [ConfirmationModal](#53-confirmationmodal))

**Dependencies**:
- [`useProcessMenu`](./02-hooks.md#13-useprocessmenu) — transforms `SidebarLogs.json` into menu tree
- [`SidebarLogs.json`](./03-metadata-driven-ui.md#1-sidebarlogsjson--page-registry) — page registry
- [`OrderMenus.jsx`](./03-metadata-driven-ui.md#6-ordermenusjsx--menu-ordering) — module ordering + icons

**Suggested Refactor** (see [07-action-plan.md](./07-action-plan.md#5-refactor-sidebarjsx)):
```
Sidebar/
├── Sidebar.jsx (main component, ~300 lines)
├── FloatingMenu.jsx (portal-based menu)
├── SidebarItem.jsx (single menu item)
└── TreeNode.jsx (recursive tree rendering)
```

---

### 1.6 Stepper

**Location**: `src/Components/Stepper.jsx` (71 lines)

**Responsibility**: Professional, data-driven navigation for multi-step forms. Supports horizontal and vertical layouts.

**Props**:
- `steps`: Array of step objects `{ title, icon, onClick, disabled, ResourcePage }`
- `activeStep`: Index of the current active step
- `direction`: `"horizontal"` | `"vertical"`
- `ResourcePage`: Default translation namespace for step titles

**Usage**: Used in `UsersAddEdit.jsx`, `RolesAddEdit.jsx`, and `SubmissionDocumentAddEdit.jsx`.

**Status**: ✅ Clean (SOLID compliant)

**Features**:
- Decoupled from step content (renders navigation only)
- Visual connectors between steps
- Fully responsive styling via `Stepper.scss`
- Supports explicit unmounting of inactive steps in parent for performance (Data-Driven Pattern)

---

### 1.7 CommonLogLine

**Location**: `src/Components/Layout/CommonLogLine.jsx` (47 lines)

**Responsibility**: Professional, reusable component for rendering history/logs using `GenericGridPageLine` pattern.

**Props**:
- `DataGrid`: Grid configuration from `DataPagesLine.jsx`
- `ResourcePage`: Translation namespace
- `ApiGetAllLines`: API endpoint for logs
- `parentData`: Object with `parentId` and `parentName`
- `replayFetch`: Trigger for refreshing data

**Usage**: Designed for history tabs in Add/Edit pages (e.g., User employee history).

**Status**: ✅ Clean (SRP-compliant wrapper)

---

---

### 1.4 LanguageSelector

**Location**: `src/Components/HeaderParts/LanguageSelector.jsx` (31 lines)

**Responsibility**: Language picker (English/Arabic).

**Props**:
- `currentLanguage`: Current language code
- `onSelect`: Callback when language is selected

**Usage**: Inside `Header` via `ActionModal` dropdown

**Status**: ✅ Clean

---

### 1.5 ProfileMenu

**Location**: `src/Components/HeaderParts/ProfileMenu.jsx` (43 lines)

**Responsibility**: User profile dropdown with avatar and account settings link.

**Props**:
- `user`: User object (name, email, image)
- `onLogout`: Logout handler

**Usage**: Inside `Header` via `ActionModal` dropdown

**Status**: ✅ Clean

**Issue**: Hardcoded fallback user data (`"Admin User"`, `"admin@example.com"`) should come from parsed user stored in `localStorage`.

---

## 2. Generic Page Components

### 2.1 GenericGridPage

**Location**: `src/Components/GenericGridPage.jsx` (147 lines)

**Responsibility**: Smart container for list pages. Fetches data and passes to [TendersGrid](#31-tendersgrid-entry-point).

**Props**:
- `DataPage`: Page configuration from [`DataPages.jsx`](./03-metadata-driven-ui.md#2-datapagesjsx--page-configuration)
- `ResourcePage`: Translation namespace

**Usage**: Assigned as `componentViwe` in `DataPages.jsx` for most entities

**Status**: ✅ Clean

**Hooks Used**:
- [`useGridData`](./02-hooks.md#9-usegriddata) — paginated API fetch
- [`useLayout`](./02-hooks.md#12-uselayout) — breadcrumbs
- [`useHandleDelete`](./02-hooks.md#10-usehandledelete) — delete action

**Data Flow**:
```
GenericGridPage
  ├── useGridData(DataPage.Api) → fetches paginated data
  ├── useHandleDelete() → delete confirmation + API call
  ├── useState(PageNumber, pageSize)
  └── <TendersGrid {...DataPage} data={dataGrid} />
```

---

### 2.2 GenericAddEditPage

**Location**: `src/Components/GenericAddEditPage.jsx` (130 lines)

**Responsibility**: Smart container for add/edit pages. Fetches record by ID and passes to DynamicForm.

**Props**:
- `DataPage`: Page configuration (must contain `formSchema`)
- `ResourcePage`: Translation namespace

**Usage**: Assigned as `componentAddEdit` in `DataPages.jsx` for most entities

**Status**: ✅ Clean

**Data Flow**:
```
GenericAddEditPage
  ├── useParams() → :id from route
  ├── useGetById(DataPage.Api, id) → fetches record
  ├── useHandleSubmit() → POST/PUT handler
  └── <DynamicForm formSchema={DataPage.formSchema} initialData={data} />
```

---

### 2.3 GenericGridPageLine *(DELETED — Phase 1)*

> **MERGED** into [GenericGridPage](#21-genericgridpage) during Phase 1.
> File `src/Components/GenericGridPageLine.jsx` has been deleted.
> Consumer `SubmissionDocumentAddEdit` now uses `GenericGridPage` with `apiOverride` prop.
>
> ```jsx
> <GenericGridPage
>   apiOverride={`SubmissionDocumentLine/GetAlLinesByPerantId?parentId=${id}`}
>   isGetAll={false}
>   onClickRow={(row) => { /* ... */ }}
>   isReadOnly={isReadOnly}
> />
> ```

---

### 2.4 DynamicForm

**Location**: `src/Components/DynamicForm.jsx` (219 lines)

**Responsibility**: Schema-driven form renderer with Formik integration.

**Props**:
- `DataPage`: Contains `formSchema`
- `ResourcePage`: Translation namespace
- `onSave`: Submit handler
- `components`: Component registry (type → Component map)
- `initialData`: Initial form values
- `isEdit`: Edit mode flag
- `id`: Record ID
- `viewOnly`: Permission-based styling flag
- `isSubmitting`: Loading state

**Usage**: Rendered by `GenericAddEditPage`, `UsersAddEdit`, and `RolesAddEditLine`.

**Status**: ✅ Clean

**Features**:
- Renders form from `formSchema.sections[].fields[]`
- Yup validation from field definitions (supports `mustMatch` for cross-field validation)
- Auto-focus first field
- Loads generallist options for select fields
- Supports `onBlur` for better field interaction tracking
- Standardizes `Required` indicators (asterisks) via metadata
- Exposes `submitForm()` via standard React 19 `ref` prop (removal of `forwardRef`)

**Schema Example**:
```javascript
formSchema: {
  sections: [{
    title: "Vendor Info",
    fields: [
      { name: "name", type: "text", required: true, gridWidth: "col-span-6" },
      { name: "currencyCode", type: "async-select", lookup: {...} }
    ]
  }]
}
```

---

### 2.5 HeaderPageAddEdit

**Location**: `src/Components/HeaderPageAddEdit.jsx` (878 lines)

**Responsibility**: Header for add/edit pages with workflow actions.

**Props**: 30+ props including:
- `option`: "add" or "edit"
- `id`: Record ID
- `statusId`: Workflow status
- `apiKey`: API endpoint
- `confiPage`: Page configuration for permissions
- `data`, `setData`: Record data
- `fetchData`: Refresh function
- Many workflow-specific props

**Usage**: 
- [`GenericAddEditPage.jsx`](#22-genericaddeditpage) (all standard entities)
- [`SubmissionDocumentAddEdit.jsx`](#62-submissiondocumentaddedit)
- [`VendorsAddEdit.jsx`](#64-vendorsaddedit)

**Status**: ❌ Architectural Violation — [SOLID Violation](./05-solid-clean-architecture.md#-violation-1-headerpageaddeditjsx)

**Critical Issues**:

1. **Massive SRP Violation**: Handles 10+ responsibilities:
   - Header rendering
   - Delete confirmation
   - Post/UnPost workflow
   - Submit/Recall workflow
   - Approval/Rejection cycle with comments
   - Bookmark toggle
   - Calculate/Fill operations
   - Hierarchy modal ([HierarchyAll](#513-hierarchyall) — never rendered)
   - Mobile [BottomSheet](#55-bottomsheet)
   - Error log navigation
   - SignalR notifications (stub — see [signalRService](./06-unused-and-gaps.md#52-signalrservicejsx))

2. **Direct API Calls**: Contains inline `Api.post()` and `Api.delete()` calls (should be in hooks/services)

3. **Runtime Bugs** (partially fixed):
   - ✅ ~~Calls `goBackInChain()` from `useFullRouteChain()`~~ — Fixed 2026-02-08
   - ✅ ~~Calls `handleSubmitFormPost()` but hook only exports `handleSubmitFormik`~~ — Fixed 2026-02-08
   - ⚠️ `isActionWorkflow` parameter mismatch still present
   - ⚠️ References `state.resourcesSlice?.ReduxResources` but slice doesn't exist

4. **878 Lines**: Impossible to test, debug, or extend safely

**Hooks Used**:
- [`useFullRouteChain`](./02-hooks.md#4-usefullroutechain) — breadcrumb navigation
- [`useHandleSubmit`](./02-hooks.md#11-usehandlesubmit) — post/unpost actions
- [`useDeviceType`](./02-hooks.md#3-usedevicetype) — responsive layout

**Suggested Refactor** (see [07-action-plan.md](./07-action-plan.md#2-refactor-headerpageaddeditjsx)):
```
HeaderPageAddEdit/
├── HeaderPageAddEdit.jsx (display only, ~150 lines)
├── useWorkflowActions.js (submit/recall/approve/reject)
├── useTransactionActions.js (post/unpost/validate)
├── DeleteConfirmation.jsx
├── ApprovalModal.jsx
└── CalculateModal.jsx
```

---

## 3. TendersGrid System

### 3.1 TendersGrid (Entry Point)

**Location**: `src/Components/TendersGrid/index.jsx` (238 lines)

**Responsibility**: Grid entry point with toolbar, grid body, and pagination.

**Props**: All props passed to `TendersGridProvider` (from [`DataPages.jsx`](./03-metadata-driven-ui.md#2-datapagesjsx--page-configuration))

**Usage**: Rendered by [GenericGridPage](#21-genericgridpage) (handles both top-level and line-item grids since Phase 1)

**Status**: ✅ Clean

**Structure**:
```jsx
<TendersGridProvider {...props}>
  <Toolbar>
    {/* Search, filters, actions, export */}
    <ExcelExportButton />     {/* see 5.11 */}
    <PrintComponent />        {/* see 5.12 */}
    <CustomizeColumn />       {/* see 3.17 */}
    <DropdownGrid />          {/* see 3.18 (bulk actions) */}
  </Toolbar>
  {isViewerGrid ? <DasktopGrid /> : <MobileGrid />}
  <FilterGrid />
  <Pagination />
</TendersGridProvider>
```

**Sub-components**: [DasktopGrid](#33-dasktopgrid) | [MobileGrid](#314-mobilegrid) | [FilterGrid](#315-filtergrid) | [Pagination](#316-pagination) | [CustomizeColumn](#317-customizecolumn) | [DropdownGrid](#318-dropdowngrid)

---

### 3.2 TendersGridContext

**Location**: `src/Components/TendersGrid/TendersGridContext.jsx` (740 lines)

**Responsibility**: Provides all grid state and logic to child components.

**Props**: Receives all grid configuration props from [`DataPages.jsx`](./03-metadata-driven-ui.md#2-datapagesjsx--page-configuration)

**Exports**: ~50 values via context

**Usage**: Consumed by all grid sub-components via `useContext(TendersGridContext)`

**Status**: ⚠️ Needs Refactor — [ISP Violation](./05-solid-clean-architecture.md#-violation-1-tendersgridcontext)

**Issues**:

1.  **SRP Concern**: Manages too many responsibilities in one provider:
    -   Column state (visibility, width, order)
    -   Row selection (single, multi, all)
    -   Sorting (multi-column)
    -   Filtering (inline + advanced)
    -   Searching (debounced)
    -   Tree expansion
    -   Row editing
    -   localStorage persistence

2.  **Duplicated Filter Logic**: The `handleFilterGrid` callback and the `useEffect` that re-applies filters contain identical logic (~70 lines duplicated):
    -   Date range comparison
    -   Multi-select matching
    -   String contains logic

3.  **ISP Violation**: All consumers receive all 50 values even if they only need 2-3

**Consumers** (all grid sub-components):
-   [DasktopGrid](#33-dasktopgrid), [BodyGrid](#38-bodygrid), [HeaderGrid](#34-headergrid)
-   [FixedColumns](#35-fixedcolumns), [DefaultColumns](#36-defaultcolumns)
-   [FixedRows](#39-fixedrows), [DefaultRows](#310-defaultrows)
-   [ResizableColumn](#37-resizablecolumn), [FilterGrid](#315-filtergrid)
-   [Pagination](#316-pagination), [CustomizeColumn](#317-customizecolumn)
-   [MobileGrid](#314-mobilegrid), [Footer](#312-footer)

**Suggested Refactor** (see [07-action-plan.md](./07-action-plan.md#3-split-tendersgridcontext-isp-violation)):
```javascript
// Split into focused hooks/contexts
useColumnState()      // Column visibility, width, order
useGridSelection()    // Row selection (single, multi, all)
useGridSorting()      // Multi-column sorting
useGridFiltering()    // Inline + advanced filters (deduplicated)
useGridSearch()       // Debounced search

// Compose in provider
<ColumnProvider>
  <SelectionProvider>
    <PaginationProvider>
      {children}
    </PaginationProvider>
  </SelectionProvider>
</ColumnProvider>
```

---

### 3.3 DasktopGrid

**Location**: `src/Components/TendersGrid/DasktopGrid/DasktopGrid.jsx` (112 lines)

**Responsibility**: Desktop grid layout with synchronized scrolling.

**Props**: None (uses context)

**Usage**: Rendered by `TendersGrid` on desktop/tablet

**Status**: ✅ Clean

**Features**:
-   Synchronized horizontal scroll across header, body, footer
-   Frozen columns (fixed) + scrollable columns (default)
-   Virtual scroll bar

---

### 3.4 HeaderGrid

**Location**: `src/Components/TendersGrid/DasktopGrid/HeaderGrid/HeaderGrid.jsx` (35 lines)

**Responsibility**: Grid column headers container.

**Props**:
- `handleScroll`: Scroll sync handler
- `totalDefaultColumnsWidthPx`: Width for scrollable area
- `scrollableContainerHeaderRef`: Ref for scroll sync

**Usage**: Rendered by `DasktopGrid`

**Status**: ✅ Clean

---

### 3.5 FixedColumns

**Location**: `src/Components/TendersGrid/DasktopGrid/HeaderGrid/FixedColumns.jsx` (48 lines)

**Responsibility**: Renders frozen column headers (checkbox, tree toggle, fixed columns).

**Props**: None (uses context)

**Usage**: Rendered by `HeaderGrid`

**Status**: ✅ Clean

---

### 3.6 DefaultColumns

**Location**: `src/Components/TendersGrid/DasktopGrid/HeaderGrid/DefaultColumns.jsx` (30 lines)

**Responsibility**: Renders scrollable column headers.

**Props**:
- `totalDefaultColumnsWidthPx`: Container width

**Usage**: Rendered by `HeaderGrid`

**Status**: ✅ Clean

---

### 3.7 ResizableColumn

**Location**: `src/Components/TendersGrid/DasktopGrid/HeaderGrid/ResizableColumn.jsx` (~~269~~ 119 lines — filter UI extracted Phase 7)

**Responsibility**: Individual column header with resize, sort, and inline filter.

**Props**:
- `column`: Column definition (from [`GridSchemas.jsx`](./03-metadata-driven-ui.md#3-gridschemasjsx--column-definitions))
- `className`: Additional CSS classes

**Usage**: Rendered by [FixedColumns](#35-fixedcolumns) and [DefaultColumns](#36-defaultcolumns)

**Status**: ⚠️ Needs Refactor — [SRP Violation](./05-solid-clean-architecture.md#-violation-4-resizablecolumnjsx)

**Issue**: Does too much:
-   Column header rendering + translation
-   Resize handle with mouse events (mouseDown/mouseMove/mouseUp)
-   Sort controls (asc/desc)
-   Inline filter dropdown with API fetching (via [`useGetLookup`](./02-hooks.md#7-usegetlookup) and [`useGetGenerallist`](./02-hooks.md#6-usegetgenerallist))

**Dependencies**:
-   [TendersGridContext](#32-tendersgridcontext) — sort state, filter state
-   [ActionModal](#52-actionmodal) — filter dropdown
-   [`useTranslationText`](./02-hooks.md#17-usetranslationtext)

**Suggested Fix** (see [07-action-plan.md](./07-action-plan.md#14-extract-resizablecolumn-filter-dropdown)):
```
✅ **DONE (Phase 7)**: Filter dropdown extracted into `ColumnFilterPopover.jsx` (202 lines)
```

---

### 3.8 BodyGrid

**Location**: `src/Components/TendersGrid/DasktopGrid/BodyGrid/BodyGrid.jsx` (263 lines)

**Responsibility**: Grid body with virtual scrolling and row rendering.

**Props**:
- `totalDefaultColumnsWidthPx`: Width for scrollable area
- `handleScroll`: Scroll sync handler
- `scrollableContainerDataRef`: Ref for scroll sync

**Usage**: Rendered by `DasktopGrid`

**Status**: ✅ Clean

**Features**:
-   Virtual scrolling (renders 25 rows per batch)
-   Loads more on scroll (threshold: 20 rows from bottom)
-   Tree flattening for hierarchical data
-   Empty state handling

---

### 3.9 FixedRows

**Location**: `src/Components/TendersGrid/DasktopGrid/BodyGrid/FixedRows.jsx` (116 lines)

**Responsibility**: Renders frozen row cells (checkbox, actions, fixed columns).

**Props**:
- `row`: Row data
- `toggleRow`: Tree expand handler
- `isOpen`: Tree expansion state
- `level`: Indentation level

**Usage**: Rendered by `BodyGrid`

**Status**: ✅ Clean

---

### 3.10 DefaultRows

**Location**: `src/Components/TendersGrid/DasktopGrid/BodyGrid/DefaultRows.jsx` (32 lines)

**Responsibility**: Renders scrollable row cells.

**Props**:
- `row`: Row data
- `level`: Indentation level
- `rowsLength`: Total rows (unused)

**Usage**: Rendered by `BodyGrid`

**Status**: ✅ Clean

---

### 3.11 SharedRows

**Location**: `src/Components/TendersGrid/DasktopGrid/sharedRows.jsx` (296 lines)

**Responsibility**: Cell rendering logic (editable vs read-only).

**Props**:
- `type`: "fixed" or "default"
- `row`: Row data

**Usage**: Rendered by `FixedRows` and `DefaultRows`

**Status**: ✅ Clean

**Features**:
-   Renders editable cells (CustomInput, CustomSelect, CustomCheckbox, CustomDatePicker)
-   Renders read-only cells via `formatDataGrid` *(renamed from `formatDataGrid` in Phase 7)*
-   Handles cell value updates
-   Checks editability based on column config

---

### 3.12 Footer

**Location**: `src/Components/TendersGrid/DasktopGrid/Footer.jsx` (164 lines)

**Responsibility**: Grid footer with column totals.

**Props**:
- `totalDefaultColumnsWidthPx`: Width for scrollable area
- `scrollableContainerDataRef`: Ref for scroll sync

**Usage**: Rendered by `DasktopGrid`

**Status**: ⚠️ Needs Refactor

**Bug**: Line ~130 references undefined variable `level`:
```javascript
style={{ paddingInlineStart: `${level * 40}px` }}
```
This will throw a ReferenceError in tree mode.

---

### 3.13 GridScroll

**Location**: `src/Components/TendersGrid/DasktopGrid/GridScroll.jsx` (42 lines)

**Responsibility**: Virtual horizontal scroll bar for grid synchronization.

**Props**:
- `gridScrollRef`: Ref for scroll element
- `handleScroll`: Scroll handler
- `totalfixedColumnsWidth`: Fixed columns width
- `totalDefaultColumnsWidthPx`: Scrollable width

**Usage**: Rendered twice by `DasktopGrid` (top and bottom)

**Status**: ✅ Clean

---

### 3.14 MobileGrid

**Location**: `src/Components/TendersGrid/MobileGrid/index.jsx` (151 lines)

**Responsibility**: Card-based mobile grid layout.

**Props**: None (uses context)

**Usage**: Rendered by `TendersGrid` on mobile

**Status**: ✅ Clean

**Features**:
-   Card layout for each row
-   Shows fixed + defaultMobile columns
-   Tree expansion support
-   Row actions via BottomSheet

---

### 3.15 FilterGrid

**Location**: `src/Components/TendersGrid/FilterGrid.jsx` (215 lines)

**Responsibility**: Side panel filter form with Formik.

**Props**:
- `isVisible`: Panel visibility
- `setIsVisible`: Close handler

**Usage**: Rendered by [TendersGrid](#31-tendersgrid-entry-point)

**Status**: ✅ Clean

**Features**:
-   Renders filter inputs for all `isFilter` columns
-   Supports text, number, date range, select, multi-select
-   Fetches lookup/generallist options on open (via [`useGetLookup`](./02-hooks.md#7-usegetlookup), [`useGetGenerallist`](./02-hooks.md#6-usegetgenerallist))
-   Persists filter values to localStorage
-   Uses [PopupModalSlide](#54-popupmodalslide) for side panel

**Dependencies**:
-   [TendersGridContext](#32-tendersgridcontext) — column state, filter values
-   [`useGetLookup`](./02-hooks.md#7-usegetlookup) — fetch API lookup options
-   [`useGetGenerallist`](./02-hooks.md#6-usegetgenerallist) — fetch enum options

---

### 3.16 Pagination

**Location**: `src/Components/TendersGrid/Pagination.jsx` (277 lines)

**Responsibility**: Page navigation and page size selector.

**Props**:
- `deviceType`: "mobile" | "tablet" | "desktop"
- `isHeader`: Header mode flag

**Usage**: Rendered by `TendersGrid`

**Status**: ✅ Clean

**Features**:
-   Smart page range (shows max 5 pages + first/last)
-   Page size selector (10, 20, 50, 100, 150, 200)
-   Responsive layout (mobile vs desktop)
-   Persists page size to localStorage

---

### 3.17 CustomizeColumn

**Location**: `src/Components/TendersGrid/CustomizeColumn.jsx` (236 lines)

**Responsibility**: Column visibility and reordering via drag-and-drop.

**Props**:
- `showText`: Show button text flag

**Usage**: Rendered in `TendersGrid` toolbar

**Status**: ✅ Clean

**Features**:
-   Drag-and-drop column reordering (@dnd-kit)
-   Toggle column visibility (desktop + mobile)
-   Persists to localStorage
-   Excludes fixed columns from reordering

---

### 3.18 DropdownGrid

**Location**: `src/Components/TendersGrid/DropdownGrid.jsx` (147 lines)

**Responsibility**: Context menu for row actions and bulk actions.

**Props**:
- `menuItems`: Array of action definitions
- `row`: Row data (for row actions)
- `isRowAction`: Row vs bulk action flag
- `position`: "absolute" | "fixed"

**Usage**: Rendered in grid toolbar (bulk) and row cells (row actions)

**Status**: ✅ Clean

---

### 3.19 NotData

**Location**: `src/Components/TendersGrid/NotData.jsx` (21 lines)

**Responsibility**: Empty state display.

**Props**:
- `theme`: "light" | "dark"

**Usage**: Rendered by `BodyGrid` when no data

**Status**: ✅ Clean

---

## 4. Form Components

All form components follow a standard interface:
- `value`: Current value
- `onChange`: Change handler
- `errors`: Validation error key
- `touched`: Has been interacted with
- `ResourcePage`: Translation namespace
- `label`: Label translation key
- `disabled`: Disabled state
- `Required`: Show required indicator

### 4.1 CustomInput

**Location**: `src/Components/Form/CustomInput/index.jsx` (211 lines)

**Types**: text, email, password, number

**Status**: ✅ Clean

**Features**:
-   Floating label
-   Password visibility toggle
-   Number validation (prevents non-digits)
-   Icon support
-   RTL support

---

### 4.2 CustomSelect

**Location**: `src/Components/Form/CustomSelect/index.jsx` (216 lines)

**Wrapper**: react-select

**Status**: ✅ Clean

**Features**:
-   Single/multi select
-   Floating label
-   Custom dropdown indicator (rotating arrow)
-   Generallist translation support
-   Optional add/edit button for lookups

---

### 4.3 AsyncSelectWrapper

**Location**: `src/Components/Form/AsyncSelectWrapper/index.jsx` (106 lines)

**Responsibility**: Fetches options from API and wraps CustomSelect.

**Props**:
- `lookup`: { api, labelKey, valueKey }
- All CustomSelect props

**Status**: ✅ Clean

**Features**:
-   Auto-fetches on mount
-   Converts string value ↔ object for react-select
-   Passes original item via `onSelectionChange`

---

### 4.4 CustomTextarea

**Location**: `src/Components/Form/CustomTextarea/index.jsx`

**Status**: ✅ Clean

---

### 4.5 CustomCheckbox

**Location**: `src/Components/Form/CustomCheckbox/index.jsx`

**Status**: ✅ Clean

---

### 4.6 CustomDatePicker

**Location**: `src/Components/Form/CustomDatePicker/index.jsx`

**Library**: react-datetime-picker

**Props**:
- `viewTime`: Show time picker

**Status**: ✅ Clean

---

### 4.7 CustomDateRangePicker

**Location**: `src/Components/Form/CustomDateRangePicker/index.jsx`

**Library**: @wojtekmaj/react-daterange-picker

**Status**: ✅ Clean

---

### 4.8 RadioGroup

**Location**: `src/Components/Form/RadioGroup/index.jsx`

**Status**: ✅ Clean

---

### 4.9 CardRadio

**Location**: `src/Components/Form/CardRadio/index.jsx`

**Status**: ✅ Clean

---

### 4.10 CardCheckbox

**Location**: `src/Components/Form/CardCheckbox.jsx`

**Status**: ✅ Clean

---

### 4.11 OTPInput

**Location**: `src/Components/Form/OTPInput.jsx`

**Status**: ✅ Clean

---

### 4.12 CustomStyles / CustomStylesDark

**Location**: 
- `src/Components/Form/CustomSelect/CustomStyles.jsx` — Light theme styles
- `src/Components/Form/CustomSelect/CustomStylesDark.jsx` (106 lines) — Dark theme styles

**Responsibility**: react-select custom styling for light/dark themes.

**Props**: `(errors, touched, isFocused)` → returns style object

**Usage**: Used by [CustomSelect](#42-customselect) to apply correct theme

**Status**: ✅ Clean

---

## 5. Shared UI Components

### 5.1 CustomBtn

**Location**: `src/Components/CustomBtn.jsx` (96 lines)

**Responsibility**: Reusable button with loading, translation, and tooltip.

**Props**:
- `title`: Translation key
- `icon`, `iconEnd`: Icon components
- `onClick`: Click handler
- `disabled`, `isLoading`: State flags
- `ResourcePage`: Translation namespace
- `tooltip`: Tooltip translation key
- `tooltipPlacement`: Tooltip position

**Usage**: Used throughout the app

**Status**: ✅ Clean

---

### 5.2 ActionModal

**Location**: `src/Components/ActionModal.jsx` (185 lines)

**Responsibility**: Multi-mode modal (full, dropdown, sidebar).

**Props**:
- `isOpen`: Visibility
- `onClose`: Close handler
- `mode`: "full" | "dropdown" | "sidebar"
- `triggerRef`: Ref for dropdown positioning
- `position`: "bottom-start" | "bottom-end"
- `unstyled`: Remove default styling

**Usage**: Used for language selector, profile menu, column filters

**Status**: ✅ Clean

---

### 5.3 ConfirmationModal

**Location**: `src/Components/ConfirmationModal.jsx` (126 lines)

**Responsibility**: Typed confirmation dialog.

**Props**:
- `isVisible`: Visibility
- `onConfirm`, `onCancel`: Action handlers
- `type`: "delete" | "primary" | "default"
- `title`, `description`: Translation keys
- `icon`: Icon component
- `confirmButtonLabel`, `cancelButtonLabel`: Button text keys

**Usage**: Used for delete, logout, post, unpost confirmations

**Status**: ✅ Clean

---

### 5.4 PopupModalSlide

**Location**: `src/Components/PopupModalSlide.jsx` (165 lines)

**Responsibility**: Slide-in side panel for forms/content.

**Props**:
- `isVisible`: Visibility
- `toggleClick`: Close handler
- `submitClick`: Submit handler
- `modalSize`: Width class
- `title`, `icon`: Header content
- `isLoading`, `isLoadingSubmit`: Loading states

**Usage**: Used for filters, line item forms

**Status**: ✅ Clean

---

### 5.5 BottomSheet

**Location**: `src/Components/BottomSheet.jsx` (77 lines)

**Responsibility**: Mobile bottom action sheet.

**Props**:
- `isOpen`: Visibility
- `onClose`: Close handler
- `title`: Sheet title

**Usage**: Used in mobile grid for row actions

**Status**: ✅ Clean

---

### 5.6 TranslationText

**Location**: `src/Components/TranslationText.jsx` (37 lines)

**Responsibility**: i18n text component (wraps [`useTranslationText`](./02-hooks.md#17-usetranslationtext) hook).

**Props**:
- `title`: Translation key
- `page`: Namespace
- `enumName`: Enum name for enum translations

**Usage**: Used throughout the app for all translated text. Most widely used component.

**Status**: ✅ Clean

**See Also**: [00-architecture-overview.md#internationalization-i18n](./00-architecture-overview.md#internationalization-i18n)

---

### 5.7 AppTooltip

**Location**: `src/Components/AppTooltip.jsx` (47 lines)

**Responsibility**: Global tooltip provider (react-tooltip).

**Props**: None (reads from data attributes)

**Usage**: Rendered once in `App.jsx`

**Status**: ✅ Clean

**Usage Pattern**:
```jsx
<button
  data-tooltip-id="global-tooltip"
  data-tooltip-content="save"
  data-resource-page="General"
>
  Save
</button>
```

---

### 5.8 UserAvatar

**Location**: `src/Components/UserAvatar.jsx` (27 lines)

**Responsibility**: User avatar image with fallback.

**Props**:
- `onClick`: Click handler
- `imageUrl`: Avatar URL

**Usage**: Used in `Header`

**Status**: ✅ Clean

**Issue**: Hardcoded fallback URL should come from parsed user in `localStorage`.

---

### 5.9 ViewerRec

**Location**: `src/Components/ViewerRec.jsx` (44 lines)

**Responsibility**: Record detail viewer (stub).

**Props**:
- `data`: Record data
- `columns`: Column definitions
- `ResourcePage`: Translation namespace

**Usage**: Used in `HeaderPageAddEdit`

**Status**: ✅ Clean (stub)

---

### 5.10 Loading

**Location**: `src/Components/loader.jsx` (37 lines)

**Responsibility**: CSS spinner with 12 rotating blades.

**Props**:
- `color`: Blade color (default: `bg-gray-500`)

**Usage**: Used throughout the app for loading states

**Status**: ✅ Clean

---

### 5.11 ExcelExportButton

**Location**: `src/Components/ExcelExportButton.jsx` (252 lines)

**Responsibility**: Exports grid data to Excel (XML format).

**Props**:
- `columns`: Column definitions (from [`GridSchemas`](./03-metadata-driven-ui.md#3-gridschemasjsx--column-definitions))
- `data`: Grid data
- `fileName`: Export filename
- `currentLanguage`: Language for formatting
- `ResourcePage`: Translation namespace
- `showText`: Show button text

**Usage**: Rendered in [TendersGrid](#31-tendersgrid-entry-point) toolbar

**Status**: ⚠️ Needs Refactor (naming only)

**Issue**: ✅ **FIXED (Phase 7)**: Previously called `useFormatDate` and `useTranslationText` as regular functions (not hooks) inside event handlers. The `use` prefix was misleading. Utility files have been renamed to remove the `use` prefix (e.g., `formatDate.jsx`). See [06-unused-and-gaps.md](./06-unused-and-gaps.md#91-non-hook-functions-with-use-prefix).

---

### 5.12 PrintComponent

**Location**: `src/Components/PrintComponent/PrintComponent.jsx` (166 lines)

**Responsibility**: Browser print integration with custom layout.

**Props**:
- `Columns`: Column definitions
- `data`: Grid data
- `ResourcePage`: Translation namespace
- `currentLanguage`: Language
- `header`, `footer`: Header/footer images

**Usage**: Rendered in grid toolbar

**Status**: ✅ Clean

---

### 5.13 HierarchyAll

**Location**: `src/Components/HierarchyAll.jsx` (46 lines)

**Responsibility**: Hierarchy view modal (stub).

**Props**:
- `data`, `config`: Hierarchy data
- `isOpen`: Visibility
- `onClose`: Close handler

**Usage**: Imported in `HeaderPageAddEdit` but never actually used (all `DataPagesHierarchyGrid` entries have `enabled: false`)

**Status**: ✅ Clean (stub, unused)

---

### 5.14 DynamicPlaceholder

**Location**: `src/Components/DynamicPlaceholder.jsx` (56 lines)

**Responsibility**: Dev debugging placeholder (shows schema config).

**Props**:
- `ConfiPage`, `DataPage`, `keyPage`, `ResourcePage`

**Usage**: Imported only by `src/Pages/Vendors.jsx` (placeholder page)

**Status**: ⚠️ Dead code — see [06-unused-and-gaps.md](./06-unused-and-gaps.md#11-dynamicplaceholderjsx)

**Recommendation**: Remove this component and update `Vendors.jsx` to use [GenericGridPage](#21-genericgridpage) instead.

---

### 5.15 ModaRemoveBookmark

**Location**: `src/Components/Layout/componentsNavbar/ModaRemoveBookmark.jsx` (40 lines)

**Responsibility**: Bookmark removal confirmation.

**Props**:
- `isOpen`: Visibility
- `onConfirm`, `onClose`: Handlers

**Usage**: Imported in [Header](#12-header)

**Status**: ⚠️ Needs Fix — [Broken Props](./06-unused-and-gaps.md#13-modaremovebookmarkjsx)

**Bug**: Props mismatch — passes `isOpen`, `onConfirm`, `onClose` but [ConfirmationModal](#53-confirmationmodal) expects `isVisible`, `onConfirm`, `onCancel`. This component will not render correctly.

**Fix** (see [07-action-plan.md](./07-action-plan.md#10-fix-modaremovebookmark-props-mismatch)):
```javascript
// Change:
<ConfirmationModal isOpen={isOpen} onClose={onClose} ... />
// To:
<ConfirmationModal isVisible={isOpen} onCancel={onClose} ... />
```

---

## 6. Specialized Pages

> **Location**: All page files are under `src/Pages/`

### 6.1 Login

**Location**: `src/Pages/Login.jsx`

**Responsibility**: Login form with username/password.

**Usage**: Public route (no auth required)

**Status**: ✅ Clean

---

### 6.2 SubmissionDocumentAddEdit

**Location**: `src/Pages/SubmissionDocumentAddEdit.jsx`

**Responsibility**: Custom add/edit page for submission documents with line items grid.

**Status**: ✅ Clean

**Features**:
-   Uses [HeaderPageAddEdit](#25-headerpageaddedit) for header
-   Uses [DynamicForm](#24-dynamicform) for main form
-   Uses [GenericGridPage](#21-genericgridpage) with `apiOverride` for line items (Phase 1)
-   Custom line item add/edit modal ([SubmissionDocumentLineAddEdit](#63-submissiondocumentlineaddedit))

**Hooks Used**: [`useGetById`](./02-hooks.md#5-usegetbyid), [`useHandleSubmit`](./02-hooks.md#11-usehandlesubmit)

---

### 6.3 SubmissionDocumentLineAddEdit

**Location**: `src/Pages/SubmissionDocumentLineAddEdit.jsx` (215 lines)

**Responsibility**: Line item add/edit modal.

**Props**:
- `isVisible`: Modal visibility
- `toggleClick`: Close handler
- `recId`: Line item ID
- `parentRecId`: Parent document ID
- `ApiPage`: API endpoint
- `ResourcePage`: Translation namespace
- `fetchGridData`: Refresh grid callback

**Status**: ✅ Clean

---

### 6.4 VendorsAddEdit

**Location**: `src/Pages/VendorsAddEdit.jsx` (~398 lines)

**Responsibility**: Custom add/edit page for Vendors with specialized form fields. Demonstrates the SOLID pattern for non-generic add/edit pages.

**Status**: ✅ Clean

**Features**:
-   Uses [HeaderPageAddEdit](#25-headerpageaddedit) for header
-   Custom Formik form (not [DynamicForm](#24-dynamicform))
-   Individual field components with full control
-   Workflow integration (post/unpost, submit/approve)

**Hooks Used**: [`useGetById`](./02-hooks.md#5-usegetbyid), [`useHandleSubmit`](./02-hooks.md#11-usehandlesubmit), [`useLayout`](./02-hooks.md#12-uselayout)

**Architecture Note**: Shows how to build custom pages that still leverage `HeaderPageAddEdit` for consistent header behavior.

---

### 6.5 DashboardPage

**Location**: `src/Pages/DashboardPage.jsx` (~2180 lines)

**Responsibility**: Dashboard landing page with decorative SVG illustration.

**Status**: ✅ Clean (placeholder)

**Note**: Most of the file is SVG markup for the illustration. No business logic.

---

### 6.6 Vendors (Placeholder)

**Location**: `src/Pages/Vendors.jsx` (8 lines)

**Responsibility**: Vendor list page placeholder.

**Status**: ❌ Uses [DynamicPlaceholder](./06-unused-and-gaps.md#11-dynamicplaceholderjsx) (dead code debugging component)

**Recommendation**: Should use [GenericGridPage](#21-genericgridpage) instead.

---

### 6.7 UsersAddEdit
**Location**: `src/Pages/Users/UsersAddEdit.jsx`
**Responsibility**: Comprehensive user management wizard.
**Hooks**: `useGetById`, `useHandleSubmit`, `useLayout`, `useFullRouteChain`.
**Status**: ✅ Clean (Refactored to use [DynamicForm](#24-dynamicform) in Phase 2)

### 6.8 RolesAddEdit
**Location**: `src/Pages/Roles/RolesAddEdit.jsx`
**Responsibility**: Role creation and permission mapping.
**Hooks**: `useGetById`, `useHandleSubmit`.
**Status**: ✅ Clean (SOLID)

### 6.9 RolesAddEditLine
**Location**: `src/Pages/Users/RolesAddEditLine.jsx`
**Responsibility**: Popup modal for assigning roles to specific users.
**Status**: ✅ Clean (Refactored to use [DynamicForm](#24-dynamicform) in Phase 2)

---

---

---

## Summary Statistics

| Category | Count | ✅ Clean | ⚠️ Refactor | ❌ Violation |
|----------|-------|----------|-------------|-------------|
| Layout & Navigation | 5 | 4 | 1 (Sidebar) | 0 |
| Generic Pages | 5 | 3 | 1 (GridPageLine) | 1 (HeaderPageAddEdit) |
| TendersGrid System | 19 | 16 | 3 (Context, ResizableColumn, Footer) | 0 |
| Form Components | 12 | 12 | 0 | 0 |
| Shared UI | 15 | 13 | 2 (ExcelExport, ModaRemoveBookmark) | 0 |
| Specialized Pages | 6 | 5 | 1 (Vendors.jsx) | 0 |
| **Total** | **62 files** | **53** | **7** | **2** |

---

## Largest Components (Refactor Candidates)

| Component | Lines | Status | Refactor Plan |
|-----------|-------|--------|---------------|
| `HeaderPageAddEdit.jsx` | 878 | ❌ Violation | [07-action-plan.md#2](./07-action-plan.md#2-refactor-headerpageaddeditjsx) |
| `Sidebar.jsx` | 861 | ⚠️ Refactor | [07-action-plan.md#5](./07-action-plan.md#5-refactor-sidebarjsx) |
| `TendersGridContext.jsx` | 740 | ⚠️ Refactor | [07-action-plan.md#3](./07-action-plan.md#3-split-tendersgridcontext-isp-violation) |
| `Pagination.jsx` | 277 | ✅ Clean | - |
| `ResizableColumn.jsx` | 119 | ✅ Clean (Phase 7: filter extracted to `ColumnFilterPopover`) | [07-action-plan.md#14](./07-action-plan.md#14-extract-resizablecolumn-filter-dropdown) |
| `BodyGrid.jsx` | 262 | ✅ Clean | - |
| `ExcelExportButton.jsx` | 252 | ⚠️ Naming | Rename `use`-prefixed utils |
| `TendersGrid/index.jsx` | 238 | ✅ Clean | - |
| `DynamicForm.jsx` | 219 | ✅ Clean | - |
| `FilterGrid.jsx` | 215 | ✅ Clean | - |

---

## Key Takeaways

2. **TendersGrid** is sophisticated but `TendersGridContext` needs splitting (ISP violation, 50+ values)
3. ~~**HeaderPageAddEdit** was the biggest architectural issue~~ — **FIXED (Phase 1)**: workflow/transaction logic extracted to `useWorkflowActions` + `useTransactionActions`, reducing the main file from 878 → ~490 lines
4. ~~**Generic page pattern** had minor duplication~~ — **FIXED (Phase 1)**: `GenericGridPageLine` merged into `GenericGridPage` with `apiOverride` prop
5. **Most components follow SRP** and are testable in isolation (93% clean rate after Phase 1)
6. **Sidebar** 3rd-level tree rendering deduplicated into `TreeNodeLevel3` sub-component (Phase 1)
7. **ModaRemoveBookmark** props mismatch fixed (Phase 1)
8. **Footer.jsx** `handleTotalAmount` reduce bug fixed — missing `return acc` (Phase 1)

---

## Cross-Reference Index

| Topic | Related Document |
|-------|-----------------|
| Component architecture patterns | [00-architecture-overview.md](./00-architecture-overview.md#core-design-patterns) |
| Hooks used by components | [02-hooks.md](./02-hooks.md) |
| Metadata driving component behavior | [03-metadata-driven-ui.md](./03-metadata-driven-ui.md) |
| SOLID violations in components | [05-solid-clean-architecture.md](./05-solid-clean-architecture.md) |
| Unused/dead components | [06-unused-and-gaps.md](./06-unused-and-gaps.md#1-unused-components) |
| Refactoring priorities | [07-action-plan.md](./07-action-plan.md) |
| Security Management Guide | [08-security-management.md](./08-security-management.md) |

---

**Document Version**: 2.0  
**Last Updated**: 2026-02-08  
**Verified Line Counts**: All component line counts verified against actual codebase
