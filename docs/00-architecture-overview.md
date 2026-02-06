# Architecture Overview

## Project Structure

```
tenders/
├── public/
│   ├── Ip_config.json          ← Runtime API configuration
│   ├── manifest.json
│   ├── web.config / .htaccess  ← Deployment configs (IIS/Apache)
│   └── TenderApp.png
├── src/
│   ├── main.jsx                ← Entry point (Redux Provider + App)
│   ├── App.jsx                 ← Router + AuthProvider + AppContent
│   ├── assets/
│   │   ├── fonts/              ← Cairo (Arabic), Roboto (Latin)
│   │   └── Icons/              ← SVG icon components
│   ├── Components/             ← 55 UI components
│   ├── ConfigData/             ← Metadata-driven configuration
│   │   ├── SidebarLogs.json    ← Page registry (routes, modules, menus)
│   │   ├── DataPages.jsx       ← Page config (API, schemas, components)
│   │   ├── DataPagesLine.jsx   ← Child grid configurations
│   │   ├── GridSchemas.jsx     ← Column definitions per entity
│   │   ├── FormSchemas.jsx     ← Form field definitions per entity
│   │   ├── componentRegistry.jsx ← Field type → Component mapping
│   │   ├── OrderMenus.jsx      ← Sidebar module ordering + icons
│   │   ├── resources.json      ← i18n translations (en/ar)
│   │   ├── Generallist.json    ← Enum/lookup options
│   │   └── StatusList.json     ← Workflow status definitions
│   ├── Context/
│   │   └── AuthContext.jsx     ← JWT authentication state
│   ├── Hooks/                  ← 17 custom hooks
│   ├── Layouts/
│   │   └── DashboardLayout.jsx ← Main layout (Sidebar + Header + Outlet)
│   ├── Pages/                  ← Specialized page components
│   ├── Routes/
│   │   ├── DynamicRouter.jsx   ← Metadata-driven route generation
│   │   └── PrivateRoute.jsx    ← Authentication guard
│   ├── services/
│   │   ├── Api.jsx             ← Axios instance with interceptors
│   │   └── signalRService.jsx  ← Real-time service (stub)
│   ├── store/                  ← Redux store (4 slices)
│   ├── Styles/                 ← CSS/SCSS stylesheets
│   └── utils/                  ← Utility functions
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Build Tool | Vite | 5.4 |
| UI Framework | React | 18.3 |
| Routing | react-router-dom | 7.0 |
| State Management (Global) | Redux Toolkit | 2.4 |
| State Management (Auth) | React Context | - |
| Forms | Formik + Yup | 2.4 + 1.4 |
| HTTP Client | Axios | 1.7 |
| Styling | Tailwind CSS + SCSS | 3.4 |
| i18n | Custom (resources.json) | - |
| Select Components | react-select | 5.8 |
| Drag & Drop | @dnd-kit | 6.1/8.0 |
| Date Handling | dayjs | 1.11 |
| Real-time (planned) | SignalR | stub |
| Tooltips | react-tooltip | 5.30 |

## Data Flow Architecture

### Configuration Loading Flow

```
Browser Load
    │
    ├──▶ useConfig() hook
    │       └──▶ HTTP GET /Ip_config.json?_=timestamp
    │               └──▶ localStorage["Configuration"] (base64)
    │                       └──▶ Api.updateApiBaseUrl()
    │
    └──▶ useTheme() hook
            └──▶ localStorage["theme"] + localStorage["language"]
                    └──▶ Redux themeSlice
```

### Metadata-Driven UI Flow

```
SidebarLogs.json (Page Registry)
    │
    ├──▶ useProcessMenu() ──▶ Sidebar Component
    │                         (Hierarchical menu tree)
    │
    └──▶ DynamicRouter.RouteFactory()
            │
            └──▶ For each page:
                    │
                    ├── DataPages[keyPage]
                    │     │
                    │     ├── componentViwe ──▶ GenericGridPage
                    │     │                      └── TendersGrid
                    │     │                          └── GridSchemas (columns)
                    │     │
                    │     └── componentAddEdit ──▶ GenericAddEditPage
                    │                              └── DynamicForm
                    │                                  └── FormSchemas (fields)
                    │                                      └── componentRegistry
                    │
                    └── Generates <Route path=... element=... />
```

### Authentication Flow

```
Login Page
    │
    └──▶ AuthContext.login(username, password)
            │
            ├──▶ POST {baseURL}/Authentication/Login
            │       └──▶ Response: { token, expiration }
            │
            ├──▶ parseJwtToken(token)
            │       └──▶ Extract: { userId, userName, permissions[] }
            │
            ├──▶ setAuthStorage(token, user, expiration)
            │       └──▶ localStorage["AuthData"] (base64)
            │
            └──▶ Navigate to /dashboard
```

### API Request Flow

```
Component calls Api.get/post/put/delete()
    │
    ├──▶ Request Interceptor
    │       ├── Inject Authorization: Bearer {token}
    │       ├── Inject Accept-Language: {currentLanguage}
    │       └── Ensure baseURL is set
    │
    ├──▶ HTTP Request
    │
    └──▶ Response Interceptor
            ├── GET: return response.data
            ├── 401: clearAuthStorage() → redirect to /login
            ├── 403: reject with permission error
            └── Other: return response or error
```

## Core Design Patterns

### 1. Metadata-Driven Architecture

**Principle**: Configuration over code. New CRUD pages require only JSON/config changes.

**Implementation**:
- `SidebarLogs.json` defines routes and menu structure
- `DataPages.jsx` maps page keys to API endpoints, schemas, and components
- `GridSchemas.jsx` and `FormSchemas.jsx` define UI structure declaratively
- `componentRegistry.jsx` maps field types to React components

**Benefits**:
- Add new pages without writing components
- Consistent UI patterns across all entities
- Single source of truth for page configuration

### 2. Component Registry Pattern (Open/Closed Principle)

**File**: `src/ConfigData/componentRegistry.jsx`

Maps field type strings to React components:

```javascript
{
  text: CustomInput,
  select: CustomeSelect,
  'async-select': AsyncSelectWrapper,
  date: CustomDatePicker,
  // ... extensible without modifying DynamicForm
}
```

**Usage in DynamicForm**:
```javascript
const Component = componentRegistry[field.type];
return <Component {...fieldProps} />;
```

### 3. Smart/Dumb Component Pattern

**Smart Containers** (data fetching, state management):
- `GenericGridPage` → fetches data → passes to TendersGrid
- `GenericAddEditPage` → fetches by ID → passes to DynamicForm

**Dumb Components** (pure presentation):
- `TendersGrid` → renders grid from props
- `DynamicForm` → renders form from schema

### 4. Context + Hooks Composition

**TendersGridContext** provides:
- Column state management
- Row selection
- Sorting, filtering, searching
- Tree expansion
- localStorage persistence

**Consumed by**:
- All grid sub-components via `useContext(TendersGridContext)`

## State Management Architecture

### Redux Store Structure

```javascript
store/
├── breadcrumbsSlice    → Page title for header
├── themeSlice          → theme (light/dark) + currentLanguage (en/ar)
├── menuSettingsSlice   → Sidebar expanded/collapsed state
└── bookmarkSlice       → User bookmarks (persisted to localStorage)
```

### React Context

```javascript
AuthContext
├── user              → { userId, userName, permissions[] }
├── token             → JWT token string
├── isAuthenticated   → boolean
├── isLoading         → boolean
├── login()           → async function
├── logout()          → function
├── hasPermission()   → function
└── getPermissions()  → function
```

### Local State

- Form state: Managed by Formik
- Grid state: Managed by TendersGridContext
- Modal visibility: Component-level useState

## Routing Architecture

### Route Generation

**File**: `src/Routes/DynamicRouter.jsx`

```javascript
RouteFactory(SidebarLogs, DataPages) {
  return SidebarLogs.map(page => {
    const path = `${page.keyModule}/${page.routePage}`;
    const Component = DataPages[page.keyPage].componentViwe;
    const AddEdit = DataPages[page.keyPage].componentAddEdit;
    
    return (
      <Route path={path} element={<Component />} />
      <Route path={`${path}/:option/:id`} element={<AddEdit />} />
    );
  });
}
```

### Protected Routes

**File**: `src/Routes/PrivateRoute.jsx`

- Checks `isAuthenticated` from AuthContext
- Validates token expiration
- Auto-logout on expired token
- Redirects to `/login` with return path

## Internationalization (i18n)

### Translation System

**File**: `src/ConfigData/resources.json`

```json
{
  "General": {
    "save": { "en": "Save", "ar": "حفظ" },
    "cancel": { "en": "Cancel", "ar": "إلغاء" }
  },
  "Vendors": {
    "name": { "en": "Name", "ar": "الاسم" }
  }
}
```

### Usage

```javascript
<TranslationText page="General" title="save" />
// Renders: "Save" (en) or "حفظ" (ar)
```

### Language Switching

- Stored in `localStorage["language"]`
- Synced to Redux `themeSlice.currentLanguage`
- Updates `document.documentElement.dir` (ltr/rtl)
- Updates `document.documentElement.lang` (en/ar)

## Permission System

### Permission Calculation

**File**: `src/utils/permissions.js`

```javascript
Permission ID = PAGE_PERMISSION_BASE[pageKey] + PERMISSION_ACTIONS[action]

Example:
  Vendors (base: 84) + Delete (offset: 3) = Permission ID 87
```

### Permission Actions

| Action | Offset |
|--------|--------|
| View | 0 |
| Add | 1 |
| Edit | 2 |
| Delete | 3 |
| Post | 4 |
| UnPost | 5 |
| Modify | 6 |
| Submit | 7 |
| Approve | 8 |
| Reject | 9 |

### Usage

```javascript
Config.isAllow("Delete", pageConfig)
// Returns: boolean (checks user.permissions array)
```

## Build & Deployment

### Build Configuration

**Vite** (`vite.config.js`):
- React plugin with SWC
- SCSS with modern compiler API
- Tailwind CSS via PostCSS
- Output: `dist/`

### Environment Variables

| Variable | Usage | Default |
|----------|-------|---------|
| `VITE_API_URL` | API base URL (fallback) | `http://localhost:3000/api` |
| `MODE` | Environment mode | `development` |

### Deployment Targets

- **IIS**: `public/web.config` (URL rewrite rules)
- **Apache**: `public/.htaccess` (mod_rewrite rules)

## Key Architectural Decisions

### Why Metadata-Driven?

**Problem**: Repetitive CRUD pages with similar structure.

**Solution**: Define pages declaratively in JSON/config files. Generate UI from metadata.

**Trade-off**: Less flexibility for highly custom pages, but 90% of pages follow standard patterns.

### Why Two Config Systems?

**Runtime Config** (`Ip_config.json`):
- Allows changing API URL without rebuilding
- Useful for multi-environment deployments

**Build-time Config** (`VITE_API_URL`):
- Fallback for development
- Type-safe environment variables

**Issue**: Currently creates duplication and confusion (see Configuration section).

### Why Custom i18n Instead of i18next?

**Reason**: Simple key-based lookup sufficient for this app. No pluralization or complex interpolation needed.

**Trade-off**: Less feature-rich but zero dependencies and full control.

## Performance Considerations

### Grid Virtualization

**File**: `src/Components/TendersGrid/DasktopGrid/BodyGrid/BodyGrid.jsx`

- Renders rows in batches (25 rows per batch)
- Loads more on scroll (threshold: 20 rows from bottom)
- Prevents rendering all rows at once for large datasets

### Memoization

- `React.memo` on grid row components
- `useMemo` for expensive calculations (column filtering, sorting)
- `useCallback` for event handlers to prevent re-renders

### Lazy Loading

- Route-level code splitting via `lazy()` and `Suspense`
- Components loaded on-demand per route

### LocalStorage Caching

- Grid column state cached per page
- Reduces re-computation on page refresh
- Schema mismatch detection resets cache

## Known Limitations

1. **No Server-Side Rendering**: Client-side only (Vite SPA)
2. **No Offline Support**: Requires network connection
3. **SignalR Not Implemented**: Real-time features are stubs
4. **No Unit Tests**: No test files found in codebase
5. **No API Mocking**: Development relies on live backend

## Next Steps

See `07-action-plan.md` for prioritized improvements.
