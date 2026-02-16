# Hooks Analysis

> **Last Updated**: 2026-02-08  
> **Related Docs**: [Architecture](./00-architecture-overview.md) | [Components](./01-components.md) | [SOLID Audit](./05-solid-clean-architecture.md) | [Unused Code](./06-unused-and-gaps.md)

## Overview

This document analyzes all **16 custom hooks** + **1 safe utility** in the codebase. Each hook is evaluated for:
- Purpose and responsibilities
- Internal vs derived state
- External dependencies
- Reusability score
- Violations (business logic leakage, UI coupling)
- Recommendation

### Quick Summary

| Hook | Lines | Status | Category | Key Consumers |
|------|-------|--------|----------|---------------|
| [useConfig](#1-useconfig) | 46 | ✅ | Initialization | `App.jsx` |
| [useCurrencyOptions](#2-usecurrencyoptions) | 32 | ❌ Dead | API fetch | None |
| [useDeviceType](#3-usedevicetype) | 45 | ✅ | Responsive | Header, Pagination |
| [useFullRouteChain](#4-usefullroutechain) | 38 | ✅ Fixed | Navigation | HeaderPageAddEdit |
| [useGetById](#5-usegetbyid) | 44 | ✅ | API fetch | GenericAddEditPage |
| [useGetGenerallist](#6-usegetgenerallist) | 82 | ⚠️ DIP | Data lookup | DynamicForm, FilterGrid |
| [useGetLookup](#7-usegetlookup) | 61 | ✅ Fixed | API fetch | FilterGrid, ColumnFilterPopover |
| [useGetSelected](#8-usegetselected) | 31 | ✅ | Pure computation | (Vendor pages) |
| [useGridData](#9-usegriddata) | 64 | ⚠️ | API fetch | GenericGridPage |
| [useHandleDelete](#10-usehandledelete) | 68 | ✅ | API action | GenericGridPage |
| [useHandleSubmit](#11-usehandlesubmit) | 198 | ✅ Fixed | API action | GenericAddEditPage, HeaderPageAddEdit |
| [useLayout](#12-uselayout) | 17 | ✅ | Redux | Generic pages |
| [useProcessMenu](#13-useprocessmenu) | 151 | ⚠️ | Computation | Sidebar |
| [useRouteMemory](#14-useroutememory) | 110 | ✅ | Navigation | (Vendor pages) |
| [useSafeSelector](#15-usesafeselector) | 15 | ✅ | Redux | Form components |
| [useTheme](#16-usetheme) | 53 | ✅ | Initialization | `App.jsx` |
| [useTranslationText](#17-usetranslationtext) | 46 | ✅ | i18n | Throughout app |

**Runtime Bugs**: 3 fixed (2026-02-08), 0 remaining in hooks  
**Dead Hooks**: 1 (`useCurrencyOptions`) — **commented out (Phase 6)**  
**DIP Violations**: ~~1 (`useGetGenerallist`)~~ — **FIXED (Phase 2)**: replaced `store.getState()` with `useSelector`  
**New Hooks (Phase 1)**: `useWorkflowActions.js`, `useTransactionActions.js` (extracted from HeaderPageAddEdit)

---

## 1. useConfig

**Location**: `src/Hooks/useConfig.jsx` (46 lines)

**Purpose**: Fetches `Ip_config.json` at runtime, stores in localStorage, updates API service base URL.

**State**: Internal (`config`)

**Dependencies**:
- `axios` (HTTP client)
- `setLocalStorageBtoa` (localStorage utility — see [06-unused-and-gaps.md](./06-unused-and-gaps.md#91-non-hook-functions-with-use-prefix))
- `updateApiBaseUrl` (Api service)

**Reusability**: Low (app-specific initialization)

**Called By**: `App.jsx` (once on mount)

**Recommendation**: Keep, add fallback for missing config

**Notes**:
- Uses cache-busting (`?_=${Date.now()}`)
- Runs once per app load
- Critical for API URL configuration
- Handles string-type JSON response (parses if needed)
- ⚠️ No fallback if `Ip_config.json` is missing (see [04-configuration.md](./04-configuration.md#4-add-fallback-for-missing-ip_configjson))
- ⚠️ DIP violation: directly calls `updateApiBaseUrl()` (see [05-solid-clean-architecture.md](./05-solid-clean-architecture.md#-violation-2-useconfig-direct-api-service-coupling))

---

## 2. useCurrencyOptions

**Location**: `src/Hooks/useCurrencyOptions.jsx` (32 lines)

**Purpose**: Fetches currency list from `restcountries.com/v3.1/all`.

**State**: Internal (`options`)

**Dependencies**: External API (restcountries.com)

**Reusability**: Medium

**Called By**: **NONE** (unused)

**Recommendation**: **Remove** (dead code)

**Evidence**: Not imported by any component. See `06-unused-and-gaps.md`.

---

## 3. useDeviceType

**Location**: `src/Hooks/useDeviceType.jsx` (45 lines)

**Purpose**: Tracks viewport width and returns device type.

**State**: Internal (`deviceType`)

**Dependencies**: `window.resize` event

**Reusability**: High

**Returns**: `"mobile"` | `"tablet"` | `"desktop"`

**Breakpoints**:
- Mobile: < 641px
- Tablet: 641px - 1023px
- Desktop: ≥ 1024px

**Called By**:
- `Header.jsx`
- `HeaderPageAddEdit.jsx`
- `ExcelExportButton.jsx`
- `PrintComponent.jsx`
- `Pagination.jsx`

**Recommendation**: Keep as-is

---

## 4. useFullRouteChain

**Location**: `src/Hooks/useFullRouteChain.jsx` (38 lines)

**Purpose**: Splits current pathname into route segments, provides navigation helpers.

**State**: Derived only (no useState)

**Dependencies**: `useLocation`, `useNavigate` (react-router-dom)

**Reusability**: Medium

**Returns**: `{ routeChain, goBackInChain, openInNewTabErrorLog }`
- `routeChain`: Array of `{ path, label, isLast }`
- `goBackInChain()`: Calls `navigate(-1)`
- `openInNewTabErrorLog(route, state)`: Navigates to error log page with state

**Called By**: [`HeaderPageAddEdit.jsx`](./01-components.md#25-headerpageaddedit)

**Status**: ✅ **FIXED** (2026-02-08)

~~**Critical Bug**: `HeaderPageAddEdit` destructures `{ goBackInChain, openInNewTabErrorLog }` from this hook, but these methods did not exist on the returned value.~~

**Current Implementation** (verified):
```javascript
// src/Hooks/useFullRouteChain.jsx:37
return { routeChain, goBackInChain, openInNewTabErrorLog };
```

**Recommendation**: Keep as-is

---

## 5. useGetById

**Location**: `src/Hooks/useGetById.jsx` (44 lines)

**Purpose**: Fetches single record by ID from API.

**State**: None (uses setter parameters)

**Dependencies**:
- `Api.get` (HTTP client)
- `toast` (notifications)
- `useNavigate` (routing)

**Reusability**: Medium

**Pattern**: Callback factory (not standard hook pattern)

**Called By**:
- `GenericAddEditPage.jsx`
- `SubmissionDocumentAddEdit.jsx`
- `SubmissionDocumentLineAddEdit.jsx`

**Recommendation**: Keep as-is

**Notes**:
- Accepts `setIsLoading` and `setData` as parameters
- Navigates back on error (if `prevRoute` provided)
- Shows toast on error

---

## 6. useGetGenerallist

**Location**: `src/Hooks/useGetGenerallist.jsx` (82 lines)

**Purpose**: Reads enum/lookup options from `Generallist.json` with i18n.

**State**: None (uses setter parameters)

**Dependencies**:
- `Generallist.json` (static import)
- `resources.json` (static import)
- `store` (direct Redux store import)

**Reusability**: Medium

**Called By**:
- `DynamicForm.jsx`
- `FilterGrid.jsx`
- `ResizableColumn.jsx`
- `formatDataGrid.jsx` *(renamed Phase 7)*

**Recommendation**: Keep, but note DIP violation

**DIP Violation**: Directly imports Redux `store` to read `currentLanguage`:
```javascript
const currentLanguage = store.getState().themeSlice.currentLanguage;
```

This bypasses React's context/hook system and makes the hook untestable without Redux.

**Suggested Fix**: Accept `currentLanguage` as a parameter.

---

## 7. useGetLookup

**Location**: `src/Hooks/useGetLookup.jsx` (61 lines)

**Purpose**: Fetches dropdown options from API endpoints with dynamic key mapping.

**State**: None (uses setter parameters)

**Dependencies**: `Api.get`

**Reusability**: Medium

**Exports**: `{ getLookup }`

**Signature**:
```javascript
getLookup(api, labelKey, extraLabelKey, valueKey, setIsLoading, setList, extraKeys, disabledList, isLookupValue)
```

**Called By**:
- [`FilterGrid.jsx`](./01-components.md#315-filtergrid) — fetches lookup options for filter dropdowns
- [`ColumnFilterPopover.jsx`](./01-components.md#37-resizablecolumn) — fetches inline column filter options *(extracted from ResizableColumn Phase 7)*

**Status**: ✅ **FIXED** (2026-02-08)

~~**Critical Bug**: Consumers called `getLookupFilterGrid()` but hook only exports `getLookup()`.~~

**Current Implementation** (verified):
```javascript
// src/Components/TendersGrid/FilterGrid.jsx:43
const { getLookup } = useGetLookup();  // ✅ Correct
```

**Recommendation**: Keep as-is

---

## 8. useGetSelected

**Location**: `src/Hooks/useGetSelected.jsx` (31 lines)

**Purpose**: Finds selected item in a list by value/label.

**State**: Derived (useMemo)

**Dependencies**: None

**Reusability**: High

**Called By**: Not found in current codebase (may be used in ignored Vendor pages)

**Recommendation**: Keep (utility hook)

---

## 9. useGridData

**Location**: `src/Hooks/useGridData.jsx` (64 lines)

**Purpose**: Fetches paginated grid data from API.

**State**: Internal (`totalRow`)

**Dependencies**: `Api.get`, `dummyData.json` (imported but unused)

**Reusability**: Medium

**Pattern**: Callback factory (accepts setters as parameters)

**Called By**:
- `GenericGridPage.jsx`
- `GenericGridPageLine.jsx`

**Recommendation**: Keep, remove dead import

**Dead Import**: `dummyData.json` is imported but never used (fallback was removed).

---

## 10. useHandleDelete

**Location**: `src/Hooks/useHandleDelete.jsx` (68 lines)

**Purpose**: DELETE API call with toast notifications.

**State**: None

**Dependencies**:
- `Api.delete`
- `toast`
- `useNavigate`

**Reusability**: Medium

**Called By**: Not found in current codebase (may be used in ignored Vendor pages)

**Recommendation**: Keep

---

## 11. useHandleSubmit

**Location**: `src/Hooks/useHandleSubmit.jsx` (198 lines)

**Purpose**: POST/PUT API call with toast notifications. Handles both form submission and transaction actions.

**State**: None

**Dependencies**:
- `Api.post`, `Api.put`
- `toast` (react-toastify)
- `useNavigate`
- [`TranslationText`](./01-components.md#56-translationtext) (for toast messages)

**Reusability**: Medium

**Exports**: `{ handleSubmitFormik, handleSubmitFormPost }`

**Methods**:
1. **`handleSubmitFormik`** — Standard form submission (add/edit)
   - Detects add vs edit based on `recId`
   - Supports multipart/form-data
   - Shows success/error toasts with translations
   - Calls `onSuccess` callback, optional `navigateTo`
2. **`handleSubmitFormPost`** — Transaction actions (Post/UnPost/Validate)
   - Calls `Api.post(${ApiPage}/${key}?RecId=${id})`
   - Handles Post, UnPost, ValidatePost, ValidateUnPost
   - Opens error log page on validation errors

**Called By**:
- [`GenericAddEditPage.jsx`](./01-components.md#22-genericaddeditpage) — `handleSubmitFormik`
- [`SubmissionDocumentAddEdit.jsx`](./01-components.md#62-submissiondocumentaddedit) — `handleSubmitFormik`
- [`SubmissionDocumentLineAddEdit.jsx`](./01-components.md#63-submissiondocumentlineaddedit) — `handleSubmitFormik`
- [`HeaderPageAddEdit.jsx`](./01-components.md#25-headerpageaddedit) — `handleSubmitFormPost`

**Status**: ✅ **FIXED** (2026-02-08)

~~**Critical Bug**: `HeaderPageAddEdit` destructures `{ handleSubmitFormPost }` but hook only exported `{ handleSubmitFormik }`.~~

**Current Implementation** (verified):
```javascript
// src/Hooks/useHandleSubmit.jsx:197
return { handleSubmitFormik, handleSubmitFormPost };  // ✅ Both exported
```

**Business Logic Note**: `handleSubmitFormik` adds `status: 1` if `transaction` flag is true — this is a business rule embedded in the hook. Consider moving to service layer in future refactor. See [02-hooks.md#business-logic-leakage](./02-hooks.md#business-logic-leakage).

**Recommendation**: Keep as-is

---

## 12. useLayout

**Location**: `src/Hooks/useLayout.jsx` (17 lines)

**Purpose**: Sets page title in Redux breadcrumbs on mount.

**State**: None

**Dependencies**: Redux `dispatch`, `setBreadcrumbs` action

**Reusability**: Medium

**Called By**:
- `GenericGridPage.jsx`
- `GenericAddEditPage.jsx`
- `GenericGridPageLine.jsx`
- `DynamicPlaceholder.jsx`

**Recommendation**: Keep as-is

---

## 13. useProcessMenu

**Location**: `src/Hooks/useProcessMenu.jsx` (151 lines)

**Purpose**: Transforms `SidebarLogs.json` into hierarchical menu structure.

**State**: Derived (useMemo)

**Dependencies**: None

**Reusability**: Low (app-specific)

**Returns**: Processed menu array

**Exports**: `useProcessMenu`, `restructureModules` (unused)

**Called By**: `Sidebar.jsx`

**Recommendation**: Keep, remove `restructureModules`

**Dead Export**: `restructureModules()` is exported but never imported anywhere.

---

## 14. useRouteMemory

**Location**: `src/Hooks/useRouteMemory.jsx` (110 lines)

**Purpose**: Persists route history for "Go Back" navigation.

**State**: localStorage

**Dependencies**:
- `useLocation`, `useNavigate`
- `setLocalStorageBtoa`, `getLocalStorageAtob`

**Reusability**: Medium

**Returns**: `{ currentPath, savePrevRoute, getPrevRoute, goBack, clearRouteMemory }`

**Exports**: Hook + `getPrevRouteStatic` (unused)

**Called By**: Not found in current codebase (may be used in ignored Vendor pages)

**Recommendation**: Keep, remove `getPrevRouteStatic`

**Dead Export**: `getPrevRouteStatic()` is exported but never imported anywhere.

---

## 15. useSafeSelector

**Location**: `src/Hooks/useSafeSelector.js` (15 lines)

**Purpose**: try/catch wrapper for `useSelector` to prevent crashes outside Redux context.

**State**: None

**Dependencies**: `useSelector` (react-redux)

**Reusability**: High

**Called By**:
- `CustomInput.jsx`
- `CustomSelect.jsx`
- `SubmissionDocumentLineAddEdit.jsx`

**Recommendation**: Keep as-is

---

## 16. useTheme

**Location**: `src/Hooks/useTheme.jsx` (53 lines)

**Purpose**: Initializes theme and language from localStorage or system preferences.

**State**: None (dispatches to Redux)

**Dependencies**:
- Redux `dispatch`
- `toggleTheme`, `setCurrentLanguage` actions
- localStorage
- `window.matchMedia` (prefers-color-scheme)

**Reusability**: Low (app-specific initialization)

**Called By**: `App.jsx` (once on mount)

**Recommendation**: Keep as-is

---

## 17. useTranslationText

**Location**: `src/Hooks/useTranslationText.jsx` (46 lines)

**Purpose**: Looks up translation key in `resources.json`.

**State**: None (pure lookup)

**Dependencies**: `resources.json` (static import)

**Reusability**: High

**Lookup Order**:
1. `Enums.[enumName].values.[title].[lang]` (if enumName provided)
2. `[page].[title].[lang]` (if page provided)
3. `General.[title].[lang]`
4. `[title].[lang]` (root level)
5. Fallback to `title`

**Called By**:
- `TranslationText.jsx` (wrapper component)
- `ExcelExportButton.jsx`
- `PrintComponent.jsx`
- `ResizableColumn.jsx`
- `SubmissionDocumentLineAddEdit.jsx`

**Recommendation**: Keep as-is

---

## Runtime Bugs Summary

| # | Hook | Issue | Impact | Status |
|---|------|-------|--------|--------|
| 1 | `useFullRouteChain` | Missing methods: `goBackInChain()`, `openInNewTabErrorLog()` | High | ✅ Fixed 2026-02-08 |
| 2 | `useHandleSubmit` | Missing export: `handleSubmitFormPost` | High | ✅ Fixed 2026-02-08 |
| 3 | `useGetLookup` | Missing export: `getLookupFilterGrid` | Medium | ✅ Fixed 2026-02-08 |

**All hook-level runtime bugs are resolved.** Remaining runtime bugs are in components:
- `Footer.jsx` undefined `level` variable — see [07-action-plan.md](./07-action-plan.md#14-footerjsx-undefined-variable)
- `HeaderPageAddEdit.jsx` `isActionWorkflow` parameter mismatch — see [07-action-plan.md](./07-action-plan.md#15-isactionworkflow-parameter-mismatch)

---

## Naming Convention Violations

The following files in `src/utils/` are named with `use` prefix but are **NOT React hooks**:

| File | Actual Type | Should Be Named |
|------|-------------|-----------------|
| ~~`useFormatDate.jsx`~~ | Pure function | ✅ `formatDate.jsx` (Phase 7) |
| ~~`useFormatNumber.jsx`~~ | Pure function | ✅ `formatNumber.jsx` (Phase 7) |
| ~~`useFormatTime.jsx`~~ | Pure function | ✅ `formatTime.jsx` (Phase 7) |
| ~~`useFormateDataPrint.jsx`~~ | Pure function | ✅ `formatDataPrint.jsx` (Phase 7) |
| ~~`formatDataGrid.jsx`~~ | Pure function | ✅ `formatDataGrid.jsx` (Phase 7) |
| ~~`useFromLocalStorage.jsx`~~ | Utility exports | ✅ `localStorage.jsx` (Phase 7) |

**Why This Matters**:
- Violates React Hook naming convention
- Triggers ESLint warnings with `eslint-plugin-react-hooks`
- Confuses developers (functions called inside event handlers look like hook violations)

**Example of Confusion**:
```javascript
// ExcelExportButton.jsx:42
const formatCellData = (value, column, row) => {
  switch (column.type) {
    case "date":
      return useFormatDate(value, currentLanguage);  // ← Was "use" prefix violation (now renamed)
  }
}
```

✅ **FIXED (Phase 7)**: The file has been renamed from `useFormatDate.jsx` → `formatDate.jsx`. The function is a pure utility, and the `use` prefix no longer misleads.

---

## Dependency Inversion Principle (DIP) Violations

| Hook | Violation | Impact |
|------|-----------|--------|
| `useGetGenerallist` | Directly imports Redux `store` and calls `store.getState()` | Cannot be tested without Redux store |
| `useConfig` | Tightly coupled to `Api.updateApiBaseUrl()` | Cannot use hook without Api service |

**Suggested Fix for useGetGenerallist**:
```javascript
// Before
const currentLanguage = store.getState().themeSlice.currentLanguage;

// After
const useGetGenerallist = (currentLanguage) => {
  // Accept language as parameter
}
```

---

## Hook Pattern Analysis

### Standard Hook Pattern (Manages Own State)

These hooks follow React's standard pattern:

| Hook | State Managed |
|------|---------------|
| `useConfig` | `config` |
| `useCurrencyOptions` | `options` |
| `useDeviceType` | `deviceType` |
| `useGridData` | `totalRow` |

### Callback Factory Pattern (Accepts Setters)

These hooks return functions that accept state setters as parameters:

| Hook | Returns |
|------|---------|
| `useGetById` | `fetchData(id, setIsLoading, setData)` |
| `useGetGenerallist` | `{ getGenerallist(..., setList) }` |
| `useGetLookup` | `{ getLookup(..., setList) }` |
| `useHandleDelete` | `{ handleDelete({ ..., setIsLoading }) }` |
| `useHandleSubmit` | `{ handleSubmitFormik({ ..., setIsLoadingSubmit }) }` |

**Why This Pattern?**:
- Allows reusing the same logic with different state variables
- Useful when multiple components need the same API call but manage state differently

**Trade-off**:
- Less idiomatic than standard hooks
- Requires more boilerplate at call site

---

## Pure Computation Hooks

These hooks perform pure calculations with no side effects:

| Hook | Input | Output |
|------|-------|--------|
| `useGetSelected` | `(list, value, label)` | Selected item object |
| `useTranslationText` | `({ title, page, lang })` | Translated string |
| `useFullRouteChain` | Current location | Route segments array |

---

## Side Effect Hooks

These hooks perform side effects (API calls, localStorage, DOM manipulation):

| Hook | Side Effects |
|------|-------------|
| `useConfig` | HTTP fetch, localStorage write, API service update |
| `useCurrencyOptions` | HTTP fetch (external API) |
| `useLayout` | Redux dispatch (breadcrumbs) |
| `useTheme` | Redux dispatch, localStorage, DOM manipulation (`document.documentElement`) |
| `useRouteMemory` | localStorage read/write, auto-save on route change |

---

## Business Logic Leakage

| Hook | Business Logic | Should Be |
|------|----------------|-----------|
| `useGetById` | Navigates back on error | Navigation should be caller's decision |
| `useHandleSubmit` | Adds `status: 1` if `transaction` flag is true | Business rule should be in service layer |

**Recommendation**: Keep for now (low priority) but consider extracting to service layer in future refactor.

---

## Reusability Scores

| Score | Hooks | Notes |
|-------|-------|-------|
| **High** | `useDeviceType`, `useSafeSelector`, `useGetSelected`, `useTranslationText` | Pure, no app-specific logic |
| **Medium** | `useGetById`, `useGetLookup`, `useGetGenerallist`, `useGridData`, `useHandleDelete`, `useHandleSubmit`, `useLayout`, `useRouteMemory`, `useFullRouteChain` | App-specific but reusable across pages |
| **Low** | `useConfig`, `useTheme`, `useProcessMenu` | App initialization, single use |

---

## Recommendations Summary

| Hook | Action | Priority | Status |
|------|--------|----------|--------|
| `useFullRouteChain` | ~~Fix missing methods~~ | ~~P0~~ | ✅ Fixed |
| `useHandleSubmit` | ~~Add missing export~~ | ~~P0~~ | ✅ Fixed |
| `useGetLookup` | ~~Update consumers~~ | ~~P0~~ | ✅ Fixed |
| `useCurrencyOptions` | Remove (unused) | P3 | ⏳ Pending |
| `useProcessMenu` | Remove `restructureModules` export | P3 | ⏳ Pending |
| `useRouteMemory` | Remove `getPrevRouteStatic` export | P3 | ⏳ Pending |
| `useGridData` | Remove `dummyData.json` import | P3 | ⏳ Pending |
| `useGetGenerallist` | Accept `currentLanguage` as parameter (DIP) | P4 | ⏳ Pending |
| All `use`-prefixed utils | Rename to remove `use` prefix | P3 | ⏳ Pending |

**See**: [07-action-plan.md](./07-action-plan.md) for full timeline and effort estimates

---

## Testing Considerations

### Testable Hooks (No External Dependencies)

- `useGetSelected`
- `useTranslationText`
- `useFullRouteChain` (after fix)

### Requires Mocking

- All API-calling hooks: `useGetById`, `useGetLookup`, `useGridData`, `useHandleDelete`, `useHandleSubmit`
- Redux-dependent: `useLayout`, `useTheme`, `useSafeSelector`
- localStorage-dependent: `useRouteMemory`, `useConfig`

### Untestable Without Refactor

- `useGetGenerallist` (direct store import)
- `useConfig` (side effect on Api service)

---

## Hook Dependency Graph

```
useConfig
  └──▶ Api.updateApiBaseUrl() (side effect)

useTheme
  ├──▶ Redux dispatch
  └──▶ document.documentElement (DOM mutation)

useLayout
  └──▶ Redux dispatch

useGetGenerallist
  ├──▶ store.getState() (direct store access)
  └──▶ resources.json (static import)

useTranslationText
  └──▶ resources.json (static import)

useProcessMenu
  └──▶ Pure computation (useMemo)

useGetById, useGetLookup, useGridData, useHandleDelete, useHandleSubmit
  └──▶ Api service (axios)

useRouteMemory
  └──▶ localStorage

useDeviceType
  └──▶ window.resize event

useSafeSelector
  └──▶ Redux useSelector (with try/catch)

useGetSelected
  └──▶ Pure computation (useMemo)

useFullRouteChain
  └──▶ useLocation (react-router-dom)
```

---

## Best Practices Followed

1. ✅ **Custom hooks start with `use`** (except utils with wrong naming)
2. ✅ **Hooks use other hooks** (composition)
3. ✅ **useMemo/useCallback** for performance
4. ✅ **Cleanup functions** in useEffect (event listeners)
5. ✅ **JSDoc comments** on most hooks (added 2026-02-08)

## Best Practices Violated

1. ❌ **Direct store import** in `useGetGenerallist` — see [05-solid-clean-architecture.md](./05-solid-clean-architecture.md#-violation-1-usegetgenerallist-direct-store-import)
2. ❌ **DOM mutations in hooks** (`useTheme` modifies `document.documentElement`)
3. ❌ **Non-hook functions named with `use` prefix** (utils/) — see [06-unused-and-gaps.md](./06-unused-and-gaps.md#91-non-hook-functions-with-use-prefix)
4. ~~❌ **Missing exports** causing runtime bugs (3 hooks)~~ ✅ All fixed 2026-02-08

---

## Cross-Reference Index

| Topic | Related Document |
|-------|-----------------|
| Components consuming these hooks | [01-components.md](./01-components.md) |
| SOLID violations in hooks | [05-solid-clean-architecture.md](./05-solid-clean-architecture.md#dependency-inversion-principle-dip) |
| Unused hooks to remove | [06-unused-and-gaps.md](./06-unused-and-gaps.md#2-unused-hooks) |
| Refactoring plan for hooks | [07-action-plan.md](./07-action-plan.md#1-fix-runtime-bugs-in-hooks) |
| Metadata consumed by hooks | [03-metadata-driven-ui.md](./03-metadata-driven-ui.md) |
| Non-hook utils with `use` prefix | [06-unused-and-gaps.md](./06-unused-and-gaps.md#9-naming-convention-violations) |

---

**Document Version**: 2.0  
**Last Updated**: 2026-02-08  
**Hook Count**: 16 hooks + 1 safe utility (`useSafeSelector.js`)
