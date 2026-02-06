# Hooks Analysis

## Overview

This document analyzes all 17 custom hooks in the codebase. Each hook is evaluated for:
- Purpose and responsibilities
- Internal vs derived state
- External dependencies
- Reusability score
- Violations (business logic leakage, UI coupling)
- Recommendation

---

## 1. useConfig

**Location**: `src/Hooks/useConfig.jsx` (38 lines)

**Purpose**: Fetches `Ip_config.json` at runtime, stores in localStorage, updates API service base URL.

**State**: Internal (`config`)

**Dependencies**:
- axios (HTTP client)
- `setLocalStorageBtoa` (localStorage utility)
- `updateApiBaseUrl` (Api service)

**Reusability**: Low (app-specific initialization)

**Called By**: `App.jsx` (once on mount)

**Recommendation**: Keep as-is

**Notes**:
- Uses cache-busting (`?_=${Date.now()}`)
- Runs once per app load
- Critical for API URL configuration

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

**Location**: `src/Hooks/useFullRouteChain.jsx` (25 lines)

**Purpose**: Splits current pathname into route segments.

**State**: Derived only (no useState)

**Dependencies**: `useLocation` (react-router-dom)

**Reusability**: Medium

**Returns**: Array of `{ path, label, isLast }`

**Called By**: `HeaderPageAddEdit.jsx`

**Recommendation**: **Fix runtime bug**

**Critical Bug**: `HeaderPageAddEdit` destructures `{ goBackInChain, openInNewTabErrorLog }` from this hook, but these methods do not exist on the returned value. The hook only returns an array of path segments.

**Evidence**:
```javascript
// HeaderPageAddEdit.jsx:48
const { goBackInChain, openInNewTabErrorLog } = useFullRouteChain();

// useFullRouteChain.jsx:15-25 (actual return)
return pathSegments.map((segment, index) => ({
  path: "/" + pathSegments.slice(0, index + 1).join("/"),
  label: segment,
  isLast: index === pathSegments.length - 1
}));
```

**Fix Required**: Either add the missing methods to the hook or update consumers.

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
- `useformatDataGrid.jsx`

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

**Purpose**: Fetches dropdown options from API endpoints.

**State**: None (uses setter parameters)

**Dependencies**: `Api.get`

**Reusability**: Medium

**Exports**: `{ getLookup }`

**Called By**:
- `FilterGrid.jsx` (calls `getLookupFilterGrid`)
- `ResizableColumn.jsx` (calls `getLookupFilterGrid`)

**Recommendation**: **Fix runtime bug**

**Critical Bug**: Consumers call `getLookupFilterGrid()` but hook only exports `getLookup()`.

**Evidence**:
```javascript
// FilterGrid.jsx:26
const { getLookupFilterGrid } = useGetLookup();

// useGetLookup.jsx:59
return { getLookup };  // ← Missing getLookupFilterGrid
```

**Fix Required**: Either rename export or update consumers.

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

**Location**: `src/Hooks/useHandleSubmit.jsx` (121 lines)

**Purpose**: POST/PUT API call with toast notifications.

**State**: None

**Dependencies**:
- `Api.post`, `Api.put`
- `toast`
- `useNavigate`

**Reusability**: Medium

**Exports**: `{ handleSubmitFormik }`

**Called By**:
- `GenericAddEditPage.jsx`
- `SubmissionDocumentAddEdit.jsx`
- `SubmissionDocumentLineAddEdit.jsx`
- `HeaderPageAddEdit.jsx` (calls `handleSubmitFormPost`)

**Recommendation**: **Fix runtime bug**

**Critical Bug**: `HeaderPageAddEdit` destructures `{ handleSubmitFormPost }` but hook only exports `{ handleSubmitFormik }`.

**Evidence**:
```javascript
// HeaderPageAddEdit.jsx:50
const { handleSubmitFormPost } = useHandleSubmit();

// useHandleSubmit.jsx:119
return { handleSubmitFormik };  // ← Missing handleSubmitFormPost
```

**Fix Required**: Either add the missing export or update consumer.

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

| # | Hook | Issue | Impact | Consumers Affected |
|---|------|-------|--------|-------------------|
| 1 | `useFullRouteChain` | Missing methods: `goBackInChain()`, `openInNewTabErrorLog()` | High | `HeaderPageAddEdit.jsx` |
| 2 | `useHandleSubmit` | Missing export: `handleSubmitFormPost` | High | `HeaderPageAddEdit.jsx` |
| 3 | `useGetLookup` | Missing export: `getLookupFilterGrid` | Medium | `FilterGrid.jsx`, `ResizableColumn.jsx` |

---

## Naming Convention Violations

The following files in `src/utils/` are named with `use` prefix but are **NOT React hooks**:

| File | Actual Type | Should Be Named |
|------|-------------|-----------------|
| `useFormatDate.jsx` | Pure function | `formatDate.js` |
| `useFormatNumber.jsx` | Pure function | `formatNumber.js` |
| `useFormatTime.jsx` | Pure function | `formatTime.js` |
| `useFormateDataPrint.jsx` | Pure function | `formatDataPrint.js` |
| `useformatDataGrid.jsx` | Pure function | `formatDataGrid.js` |
| `useFromLocalStorage.jsx` | Utility exports | `storage.js` |

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
      return useFormatDate(value, currentLanguage);  // ← Looks like hook violation
  }
}
```

This is actually fine because `useFormatDate` is a pure function, but the naming suggests it's a hook.

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

| Hook | Action | Priority |
|------|--------|----------|
| `useFullRouteChain` | Fix missing methods or update consumers | P0 (runtime bug) |
| `useHandleSubmit` | Add missing export or update consumers | P0 (runtime bug) |
| `useGetLookup` | Add missing export or update consumers | P0 (runtime bug) |
| `useCurrencyOptions` | Remove (unused) | P3 |
| `useProcessMenu` | Remove `restructureModules` export | P3 |
| `useRouteMemory` | Remove `getPrevRouteStatic` export | P3 |
| `useGridData` | Remove `dummyData.json` import | P3 |
| `useGetGenerallist` | Accept `currentLanguage` as parameter (DIP) | P4 |
| All `use`-prefixed utils | Rename to remove `use` prefix | P3 |

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

## Best Practices Violated

1. ❌ **Direct store import** in `useGetGenerallist`
2. ❌ **DOM mutations in hooks** (`useTheme` modifies `document.documentElement`)
3. ❌ **Non-hook functions named with `use` prefix** (utils/)
4. ❌ **Missing exports** causing runtime bugs (3 hooks)
