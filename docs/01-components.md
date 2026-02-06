# Component Documentation

## Overview

This document catalogs all 55 components in the codebase, organized by category. Each component includes:
- **Location**: File path
- **Responsibility**: What it does
- **Props**: Key props (real props only)
- **Usage**: Where it's used
- **Status**: ✅ Clean | ⚠️ Needs Refactor | ❌ Architectural Violation

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
- Dynamic page title from Redux breadcrumbs
- Language selector dropdown
- Theme toggle (light/dark)
- Notification icon (placeholder)
- User profile menu
- Logout confirmation modal

**Modals Used**:
- `ActionModal` (dropdown mode) for language and profile
- `ConfirmationModal` for logout

---

### 1.3 Sidebar

**Location**: `src/Components/Sidebar.jsx` (861 lines)

**Responsibility**: Multi-level navigation menu with collapsed/expanded modes, tree view, and floating menus.

**Props**: None (uses processed menu from `useProcessMenu`)

**Usage**: Rendered in `DashboardLayout`

**Status**: ⚠️ Needs Refactor

**Issues**:
1. **SRP Violation**: Contains `FloatingMenu` subcomponent, `SidebarItem` subcomponent, 3rd-level tree rendering (duplicated in two places), logout modal logic, and auto-expand logic all in one file.
2. **Duplicated Code**: 3rd-level `item.subItems` rendering appears twice (lines ~240-290 and ~370-420) with identical JSX.
3. **Re-render Risk**: `activeFloatingMenu` object passed to all `SidebarItem` components causes re-renders when any floating menu opens.

**Features**:
- Collapsible sidebar (icon-only mode)
- Floating menu in collapsed mode
- Multi-level hierarchy (module → subModule → page → subItems)
- Tree view icons for expandable items
- Auto-expand active parent on route change
- Logout confirmation

**Suggested Refactor**:
```
Sidebar.jsx (main component)
├── FloatingMenu.jsx (portal-based menu)
├── SidebarItem.jsx (single menu item)
└── TreeNode.jsx (recursive tree rendering)
```

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

**Issue**: Hardcoded fallback user data (`"Admin User"`, `"admin@example.com"`) should come from AuthContext.

---

## 2. Generic Page Components

### 2.1 GenericGridPage

**Location**: `src/Components/GenericGridPage.jsx` (107 lines)

**Responsibility**: Smart container for list pages. Fetches data and passes to TendersGrid.

**Props**:
- `DataPage`: Page configuration from `DataPages.jsx`
- `ResourcePage`: Translation namespace

**Usage**: Assigned as `componentViwe` in `DataPages.jsx` for most entities

**Status**: ✅ Clean

**Data Flow**:
```
GenericGridPage
  ├── useGridData(DataPage.Api) → fetches paginated data
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

### 2.3 GenericGridPageLine

**Location**: `src/Components/GenericGridPageLine.jsx` (102 lines)

**Responsibility**: Smart container for child grid pages (line items).

**Props**:
- `DataPage`: Page configuration
- `ApiGetAllLines`: Custom API endpoint for lines
- `ResourcePage`: Translation namespace
- `onCilckRow`: Row click callback

**Usage**: Used in `SubmissionDocumentAddEdit` for document lines

**Status**: ⚠️ Needs Refactor

**Issue**: 90% duplicate of `GenericGridPage` with minor differences:
- Uses `ApiGetAllLines` instead of `DataPage.Api`
- Passes `onCilckRow` callback instead of navigation
- Sets `isGetAll: false` in `useGridData`

**Suggested Fix**: Merge into `GenericGridPage` with optional props:
```javascript
<GenericGridPage 
  apiOverride={ApiGetAllLines}
  onRowClick={onCilckRow}
  isGetAll={false}
/>
```

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
- `isSubmitting`: Loading state

**Usage**: Rendered by `GenericAddEditPage`

**Status**: ✅ Clean

**Features**:
- Renders form from `formSchema.sections[].fields[]`
- Yup validation from field definitions
- Auto-focus first field
- Loads generallist options for select fields
- Exposes `submitForm()` via ref

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

**Location**: `src/Components/HeaderPageAddEdit.jsx` (888 lines)

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

**Usage**: Used in specialized pages like `SubmissionDocumentAddEdit`

**Status**: ❌ Architectural Violation

**Critical Issues**:

1. **Massive SRP Violation**: Handles 10+ responsibilities:
   - Header rendering
   - Delete confirmation
   - Post/UnPost workflow
   - Submit/Recall workflow
   - Approval/Rejection cycle with comments
   - Bookmark toggle
   - Calculate/Fill operations
   - Hierarchy modal
   - Mobile BottomSheet
   - Error log navigation
   - SignalR notifications

2. **Direct API Calls**: Contains inline `Api.post()` and `Api.delete()` calls (should be in hooks/services)

3. **Runtime Bugs**:
   - References `state.resourcesSlice?.ReduxResources` but slice doesn't exist
   - Calls `goBackInChain()` from `useFullRouteChain()` but method doesn't exist
   - Calls `handleSubmitFormPost()` but hook only exports `handleSubmitFormik`
   - References undefined variable `level` in Footer rendering

4. **888 Lines**: Impossible to test, debug, or extend safely

**Suggested Refactor**:
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

**Location**: `src/Components/TendersGrid/index.jsx` (242 lines)

**Responsibility**: Grid entry point with toolbar, grid body, and pagination.

**Props**: All props passed to `TendersGridProvider`

**Usage**: Rendered by `GenericGridPage`

**Status**: ✅ Clean

**Structure**:
```jsx
<TendersGridProvider {...props}>
  <Toolbar /> {/* Search, filters, actions, export */}
  {isViewerGrid ? <DasktopGrid /> : <MobileGrid />}
  <FilterGrid />
  <Pagination />
</TendersGridProvider>
```

---

### 3.2 TendersGridContext

**Location**: `src/Components/TendersGrid/TendersGridContext.jsx` (740 lines)

**Responsibility**: Provides all grid state and logic to child components.

**Props**: Receives all grid configuration props

**Exports**: ~50 values via context

**Usage**: Consumed by all grid sub-components

**Status**: ⚠️ Needs Refactor

**Issues**:

1. **SRP Concern**: Manages too many responsibilities in one provider:
   - Column state (visibility, width, order)
   - Row selection (single, multi, all)
   - Sorting (multi-column)
   - Filtering (inline + advanced)
   - Searching (debounced)
   - Tree expansion
   - Row editing
   - localStorage persistence

2. **Duplicated Filter Logic**: The `handleFilterGrid` callback and the `useEffect` that re-applies filters contain identical logic (~70 lines duplicated):
   - Date range comparison
   - Multi-select matching
   - String contains logic

3. **ISP Violation**: All consumers receive all 50 values even if they only need 2-3

**Suggested Refactor**:
```javascript
// Split into focused hooks
useColumnState()
useGridSelection()
useGridSorting()
useGridFiltering()  // Deduplicate filter logic here
useGridSearch()

// Compose in provider
<TendersGridProvider>
  {children}
</TendersGridProvider>
```

---

### 3.3 DasktopGrid

**Location**: `src/Components/TendersGrid/DasktopGrid/DasktopGrid.jsx` (112 lines)

**Responsibility**: Desktop grid layout with synchronized scrolling.

**Props**: None (uses context)

**Usage**: Rendered by `TendersGrid` on desktop/tablet

**Status**: ✅ Clean

**Features**:
- Synchronized horizontal scroll across header, body, footer
- Frozen columns (fixed) + scrollable columns (default)
- Virtual scroll bar

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

**Location**: `src/Components/TendersGrid/DasktopGrid/HeaderGrid/ResizableColumn.jsx` (266 lines)

**Responsibility**: Individual column header with resize, sort, and inline filter.

**Props**:
- `column`: Column definition
- `className`: Additional CSS classes

**Usage**: Rendered by `FixedColumns` and `DefaultColumns`

**Status**: ⚠️ Needs Refactor

**Issue**: Does too much:
- Column header rendering
- Resize handle with mouse events
- Sort controls (asc/desc)
- Inline filter dropdown with API fetching

**Suggested Fix**: Extract filter dropdown into `ColumnFilterPopover.jsx`

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
- Virtual scrolling (renders 25 rows per batch)
- Loads more on scroll (threshold: 20 rows from bottom)
- Tree flattening for hierarchical data
- Empty state handling

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
- Renders editable cells (CustomInput, CustomSelect, CustomCheckbox, CustomDatePicker)
- Renders read-only cells via `useformatDataGrid`
- Handles cell value updates
- Checks editability based on column config

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
- Card layout for each row
- Shows fixed + defaultMobile columns
- Tree expansion support
- Row actions via BottomSheet

---

### 3.15 FilterGrid

**Location**: `src/Components/TendersGrid/FilterGrid.jsx` (212 lines)

**Responsibility**: Side panel filter form with Formik.

**Props**:
- `isVisible`: Panel visibility
- `setIsVisible`: Close handler

**Usage**: Rendered by `TendersGrid`

**Status**: ✅ Clean

**Features**:
- Renders filter inputs for all `isFilter` columns
- Supports text, number, date range, select, multi-select
- Fetches lookup/generallist options on open
- Persists filter values to localStorage

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
- Smart page range (shows max 5 pages + first/last)
- Page size selector (10, 20, 50, 100, 150, 200)
- Responsive layout (mobile vs desktop)
- Persists page size to localStorage

---

### 3.17 CustomizeColumn

**Location**: `src/Components/TendersGrid/CustomizeColumn.jsx` (236 lines)

**Responsibility**: Column visibility and reordering via drag-and-drop.

**Props**:
- `showText`: Show button text flag

**Usage**: Rendered in `TendersGrid` toolbar

**Status**: ✅ Clean

**Features**:
- Drag-and-drop column reordering (@dnd-kit)
- Toggle column visibility (desktop + mobile)
- Persists to localStorage
- Excludes fixed columns from reordering

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
- Floating label
- Password visibility toggle
- Number validation (prevents non-digits)
- Icon support
- RTL support

---

### 4.2 CustomSelect

**Location**: `src/Components/Form/CustomSelect/index.jsx` (216 lines)

**Wrapper**: react-select

**Status**: ✅ Clean

**Features**:
- Single/multi select
- Floating label
- Custom dropdown indicator (rotating arrow)
- Generallist translation support
- Optional add/edit button for lookups

---

### 4.3 AsyncSelectWrapper

**Location**: `src/Components/Form/AsyncSelectWrapper/index.jsx` (106 lines)

**Responsibility**: Fetches options from API and wraps CustomSelect.

**Props**:
- `lookup`: { api, labelKey, valueKey }
- All CustomSelect props

**Status**: ✅ Clean

**Features**:
- Auto-fetches on mount
- Converts string value ↔ object for react-select
- Passes original item via `onSelectionChange`

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

**Location**: `src/Components/Form/CardCheckbox/index.jsx`

**Status**: ✅ Clean

---

### 4.11 OTPInput

**Location**: `src/Components/Form/OTPInput/index.jsx`

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

**Responsibility**: i18n text component (wraps `useTranslationText` hook).

**Props**:
- `title`: Translation key
- `page`: Namespace
- `enumName`: Enum name for enum translations

**Usage**: Used throughout the app for all translated text

**Status**: ✅ Clean

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

**Issue**: Hardcoded fallback URL should come from AuthContext.

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

**Location**: `src/Components/ExcelExportButton.jsx` (255 lines)

**Responsibility**: Exports grid data to Excel (XML format).

**Props**:
- `columns`: Column definitions
- `data`: Grid data
- `fileName`: Export filename
- `currentLanguage`: Language for formatting
- `ResourcePage`: Translation namespace
- `showText`: Show button text

**Usage**: Rendered in `TendersGrid` toolbar

**Status**: ⚠️ Needs Refactor

**Issue**: Calls `useFormatDate` and `useTranslationText` as regular functions (not hooks) inside event handlers. The `use` prefix is misleading but they are actually pure functions. Works correctly but naming violates convention.

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

**Usage**: Not imported anywhere

**Status**: Dead code (see `06-unused-and-gaps.md`)

---

### 5.15 ModaRemoveBookmark

**Location**: `src/Components/Layout/componentsNavbar/ModaRemoveBookmark.jsx` (40 lines)

**Responsibility**: Bookmark removal confirmation.

**Props**:
- `isOpen`: Visibility
- `onConfirm`, `onClose`: Handlers

**Usage**: Imported in `Header`

**Status**: ⚠️ Needs Refactor

**Bug**: Props mismatch — passes `isOpen`, `onConfirm`, `onClose` but `ConfirmationModal` expects `isVisible`, `onConfirm`, `onCancel`. This component will not render correctly.

---

## 6. Specialized Pages

### 6.1 Login

**Location**: `src/Pages/Login.jsx`

**Responsibility**: Login form with username/password.

**Status**: ✅ Clean

---

### 6.2 SubmissionDocumentAddEdit

**Location**: `src/Pages/SubmissionDocumentAddEdit.jsx`

**Responsibility**: Custom add/edit page for submission documents with line items grid.

**Status**: ✅ Clean

**Features**:
- Uses `HeaderPageAddEdit` for header
- Uses `DynamicForm` for main form
- Uses `GenericGridPageLine` for line items
- Custom line item add/edit modal

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

## Summary Statistics

| Category | Count | Clean | Needs Refactor | Violation |
|----------|-------|-------|----------------|-----------|
| Layout & Navigation | 5 | 4 | 1 | 0 |
| Generic Pages | 5 | 3 | 2 | 0 |
| TendersGrid System | 19 | 16 | 3 | 0 |
| Form Components | 11 | 11 | 0 | 0 |
| Shared UI | 15 | 13 | 2 | 0 |
| Specialized Pages | 3 | 3 | 0 | 0 |
| **Total** | **58** | **50** | **8** | **0** |

**Note**: HeaderPageAddEdit is counted as "Needs Refactor" but should be "Violation" — adjusted in action plan.

## Key Takeaways

1. **Form components** are well-designed and consistent
2. **TendersGrid** is sophisticated but `TendersGridContext` needs splitting
3. **HeaderPageAddEdit** is the biggest architectural issue (888 lines, 10+ responsibilities)
4. **Generic page pattern** works well but has minor duplication
5. **Most components follow SRP** and are testable in isolation
