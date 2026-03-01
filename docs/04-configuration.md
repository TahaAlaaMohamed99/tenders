# Configuration & Environment Review

> **Last Updated**: 2026-02-08  
> **Related Docs**: [Architecture](./00-architecture-overview.md#why-runtime-config-ip_configjson) | [Hooks](./02-hooks.md#1-useconfig) | [Unused Code](./06-unused-and-gaps.md#35-utilsconfigjsx)

## Overview

This document analyzes the dual configuration system in the codebase:
1. **Runtime Configuration**: `public/Ip_config.json` — ✅ Active, production-ready
2. **Build-time Configuration**: `src/utils/Config.jsx` — ✅ Active (permission wrapper + env vars)

> **Phase 0 Correction**: `Config.jsx` was previously documented as dead code, but it is actively imported by `HeaderPageAddEdit.jsx` and `SubmissionDocumentLineAddEdit.jsx` for `Config.isAllow()` permission checking. It checks permissions natively directly from localStorage `getLocalStorageAtob`.

---

## Configuration Files

### 1. Ip_config.json

**Location**: `public/Ip_config.json`

**Purpose**: Runtime API base URL configuration.

**Content**:
```json
{
  "urlApi": "https://bxp9flnk-5050.uks1.devtunnels.ms/api/"
}
```

**Loaded By**: `useConfig` hook in `App.jsx`

**Loading Flow**:
```javascript
useConfig() → axios.get('/Ip_config.json?_=${Date.now()}')
           → setLocalStorageBtoa('Ip_config', config)
           → updateApiBaseUrl(config.urlApi)
```

**Storage**: Base64-encoded in localStorage as `Ip_config`

**Used By**: `Api.jsx` (Axios instance base URL)

---

### 2. utils/Config.jsx

**Location**: `src/utils/Config.jsx` (27 lines)

**Purpose**: Vite environment variable wrapper.

**Content**:
```javascript
const Config = {
  urlApi: import.meta.env.VITE_API_URL || "",
  urlSignalR: import.meta.env.VITE_SIGNALR_URL || "",
  environment: import.meta.env.MODE || "development",
};

export default Config;
```

**Environment Variables** (from `.env` or `.env.production`):
- `VITE_API_URL`: API base URL
- `VITE_SIGNALR_URL`: SignalR hub URL
- `MODE`: "development" | "production" (auto-set by Vite)

**Used By**: **NONE** (dead code)

---

## Usage Analysis

### Where Ip_config.json is Used

| File | Usage | Line |
|------|-------|------|
| `useConfig.jsx` | Fetches on app load | 16 |
| `useConfig.jsx` | Stores in localStorage | 22 |
| `useConfig.jsx` | Calls `updateApiBaseUrl()` | 23 |
| `Api.jsx` | Reads from localStorage on init | 11-12 |

**Flow**:
```
App.jsx (mount)
  └──▶ useConfig()
        └──▶ fetch('/Ip_config.json')
              └──▶ updateApiBaseUrl(config.urlApi)
                    └──▶ Api.defaults.baseURL = urlApi
```

---

### Where utils/Config is Used

> **Phase 0 Correction**: Previous docs stated 0 matches. Re-verified below.

| File | Usage | Line |
|------|-------|------|
| `HeaderPageAddEdit.jsx` | `Config.isAllow("Delete", confiPage)` | 108 |
| `HeaderPageAddEdit.jsx` | `Config.isAllow("Post", confiPage)` | 109 |
| `HeaderPageAddEdit.jsx` | `Config.isAllow("UnPost", confiPage)` | 110 |
| `HeaderPageAddEdit.jsx` | `Config.isAllow("Modify", confiPage)` | 111 |
| `SubmissionDocumentLineAddEdit.jsx` | `Config.isAllow("Modify", ConfiMainPage)` | 58 |

**Evidence**: `src/utils/Config.jsx` IS imported by 2 files. It provides native dynamic string permission calculations matching local storage configurations via `isAllow()`.

---

## Comparison

| Aspect | Ip_config.json | utils/Config.jsx |
|--------|----------------|------------------|
| **Type** | Runtime | Build-time + Permission wrapper |
| **Format** | JSON | JavaScript |
| **Location** | `public/` | `src/utils/` |
| **Loaded When** | On app mount | At build time (static imports) |
| **Can Change Without Rebuild** | ✅ Yes | ❌ No |
| **Used By** | `useConfig`, `Api` | `HeaderPageAddEdit`, `SubmissionDocumentLineAddEdit` |
| **Storage** | localStorage | N/A |
| **Purpose** | API URL configuration | Permission checking + environment detection |
| **Status** | ✅ Active | ✅ Active (Phase 0 corrected) |

---

## Does One Bypass the Other?

**No.** They are independent:

- `Ip_config.json` is actively used to configure the API base URL at runtime
- `utils/Config.jsx` is never imported, so it cannot bypass anything

**If `utils/Config` were used**, it would bypass `Ip_config.json` because Vite environment variables are baked into the bundle at build time and cannot be changed without rebuilding.

---

## Duplication Analysis

### Is This Duplication?

**No**, because:
1. `utils/Config.jsx` is dead code (never used)
2. They serve different purposes (runtime vs build-time)

**However**, the *intent* was likely duplication:
- Developer may have started with `utils/Config` (standard Vite pattern)
- Later switched to `Ip_config.json` (runtime config for deployment flexibility)
- Forgot to remove `utils/Config`

---

## Architectural Purpose

### Why Ip_config.json Exists

**Problem**: Different deployment environments (dev, staging, production) need different API URLs.

**Traditional Solution**: Build-time environment variables (`.env.production`, `.env.staging`)

**Limitation**: Requires separate builds for each environment.

**Ip_config.json Solution**: Single build, multiple deployments.

**Deployment Flow**:
```
1. Build once: npm run build
2. Deploy to staging: Replace public/Ip_config.json with staging URL
3. Deploy to production: Replace public/Ip_config.json with production URL
```

**Benefit**: No rebuild needed for different environments.

---

### Why utils/Config Might Have Existed

**Standard Vite Pattern**: Centralize environment variable access.

**Benefits**:
- Type-safe access (if using TypeScript)
- Default values
- Single import point

**Example Use Case**:
```javascript
// Instead of:
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Use:
import Config from './utils/Config';
const apiUrl = Config.urlApi;
```

**Why It Was Abandoned**: Runtime configuration (`Ip_config.json`) is more flexible for deployment.

---

## SOLID Principle Violations

### DRY (Don't Repeat Yourself)

**Violation**: ❌ No (because `utils/Config` is unused)

**If both were used**: Yes, would violate DRY by defining API URL in two places.

---

### Single Source of Truth (SSOT)

**Current State**: ✅ Yes (only `Ip_config.json` is used)

**If both were used**: ❌ No, would have two sources of truth.

---

### Dependency Inversion Principle (DIP)

**Violation**: ⚠️ Partial

**Issue**: `useConfig` directly calls `updateApiBaseUrl()` from `Api.jsx`:
```javascript
// useConfig.jsx:23
updateApiBaseUrl(config.urlApi);
```

**Problem**: Hook is tightly coupled to `Api` service implementation.

**Impact**: Cannot test `useConfig` without mocking `Api` service.

**Suggested Fix**: Use dependency injection:
```javascript
const useConfig = (onConfigLoaded) => {
  // ...
  onConfigLoaded(config.urlApi);
};

// App.jsx
useConfig((apiUrl) => updateApiBaseUrl(apiUrl));
```

---

## Recommendations

### 1. Remove utils/Config.jsx

**Priority**: P3 (low impact, code cleanup)

**Reason**: Dead code, never used, confusing to developers.

**Action**:
```bash
rm src/utils/Config.jsx
```

---

### 2. Keep Ip_config.json

**Priority**: P0 (critical, do not remove)

**Reason**: Enables deployment flexibility without rebuilds.

**Justification**: This is a **best practice** for metadata-driven applications that need to support multiple environments.

---

### 3. Document Ip_config.json

**Priority**: P2 (important for DevOps)

**Action**: Add `README.md` in `public/`:
```markdown
# Ip_config.json

Runtime configuration for API base URL.

## Usage

This file is fetched on app load and stored in localStorage.

## Deployment

Replace this file with environment-specific values:

**Development**:
```json
{ "urlApi": "http://localhost:5000/api/" }
```

**Staging**:
```json
{ "urlApi": "https://staging-api.example.com/api/" }
```

**Production**:
```json
{ "urlApi": "https://api.example.com/api/" }
```

## Cache Busting

The app appends `?_=${timestamp}` to prevent browser caching.
```

---

### 4. Add Fallback for Missing Ip_config.json

**Priority**: P2 (prevents app crash in dev)

**Current Issue**: If `Ip_config.json` is missing, `useConfig` silently fails and API calls use empty base URL.

**Suggested Fix** (`useConfig.jsx`):
```javascript
const useConfig = () => {
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(`/Ip_config.json?_=${Date.now()}`);
        const config = response.data;
        setLocalStorageBtoa("Ip_config", config);
        updateApiBaseUrl(config.urlApi);
      } catch (error) {
        console.error("Failed to load Ip_config.json, using fallback");
        const fallbackUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/";
        updateApiBaseUrl(fallbackUrl);
      }
    };
    fetchConfig();
  }, []);
};
```

**Benefit**: Graceful degradation, uses Vite env var as fallback.

---

### 5. Decouple useConfig from Api Service

**Priority**: P4 (testability improvement)

**Current Coupling**:
```javascript
import { updateApiBaseUrl } from "../services/Api";

const useConfig = () => {
  updateApiBaseUrl(config.urlApi);  // ← Direct coupling
};
```

**Suggested Fix**:
```javascript
const useConfig = (onConfigLoaded) => {
  // ...
  onConfigLoaded(config);
};

// App.jsx
useConfig((config) => {
  updateApiBaseUrl(config.urlApi);
});
```

---

## Alternative Patterns

### Pattern 1: Hybrid (Current + Fallback)

**Use Case**: Support both runtime config and build-time env vars.

**Implementation**:
```javascript
// 1. Try Ip_config.json (runtime)
// 2. Fallback to VITE_API_URL (build-time)
// 3. Fallback to localhost (dev default)

const fetchConfig = async () => {
  try {
    const response = await axios.get('/Ip_config.json');
    return response.data.urlApi;
  } catch {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api/';
  }
};
```

**Benefit**: Best of both worlds (deployment flexibility + dev convenience).

---

### Pattern 2: Environment Detection

**Use Case**: Different configs for dev vs production.

**Implementation**:
```javascript
const getApiUrl = async () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5000/api/';
  } else {
    const response = await axios.get('/Ip_config.json');
    return response.data.urlApi;
  }
};
```

**Benefit**: Skip network request in dev.

---

### Pattern 3: Server-Side Injection

**Use Case**: Docker/Kubernetes deployments.

**Implementation**:
```dockerfile
# Dockerfile
COPY public/Ip_config.json.template public/Ip_config.json
RUN envsubst < public/Ip_config.json.template > public/Ip_config.json
```

**Benefit**: Single Docker image, environment-specific config injected at runtime.

---

## Security Considerations

### Current State

**Ip_config.json is public**: Exposed at `https://example.com/Ip_config.json`

**Risk**: Low (API URL is not sensitive)

**Best Practice**: ✅ Correct (API URLs are not secrets)

---

### What Should NOT Be in Ip_config.json

- ❌ API keys
- ❌ OAuth client secrets
- ❌ Database credentials
- ❌ JWT signing keys

**Why**: Public files are accessible to anyone.

**Where to Store Secrets**: Backend environment variables only.

---

## Build & Deployment

### Current Build Process

```bash
npm run build
  └──▶ Vite bundles src/ → dist/
        └──▶ Copies public/ → dist/
              └──▶ dist/Ip_config.json (copied as-is)
```

**Result**: `dist/Ip_config.json` is included in build output.

---

### Deployment Checklist

1. ✅ Build once: `npm run build`
2. ✅ Copy `dist/` to server
3. ✅ Replace `dist/Ip_config.json` with environment-specific file
4. ✅ Serve `dist/` via web server (Nginx, Apache, IIS)

---

### IIS Deployment (web.config)

**File**: `public/web.config` (included in build)

**Purpose**: Configure IIS to serve SPA correctly.

**Key Rules**:
- Rewrite all routes to `index.html` (client-side routing)
- Allow `Ip_config.json` to be fetched directly

**Current Config**: ✅ Correct

---

### Apache Deployment (.htaccess)

**File**: `public/.htaccess` (included in build)

**Purpose**: Same as `web.config` but for Apache.

**Current Config**: ✅ Correct

---

## Comparison with Industry Standards

### Next.js Pattern

**Runtime Config**:
```javascript
// next.config.js
module.exports = {
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL
  }
};
```

**Access**:
```javascript
import getConfig from 'next/config';
const { apiUrl } = getConfig().publicRuntimeConfig;
```

**Difference**: Next.js injects server-side env vars at request time. This codebase uses client-side fetch.

---

### Create React App Pattern

**Build-time Only**:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

**Limitation**: Requires rebuild for each environment.

**This Codebase**: More flexible (runtime config).

---

### Vite Pattern (Standard)

**Build-time**:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

**This Codebase**: Extends Vite pattern with runtime config for deployment flexibility.

---

## Summary

| Question | Answer |
|----------|--------|
| **Where is Ip_config.json used?** | `useConfig` hook, `Api` service |
| **Where is utils/Config used?** | Nowhere (dead code) |
| **Does one bypass the other?** | No (Config is unused) |
| **Is there duplication?** | No (only one is active) |
| **Why does utils/Config exist?** | Leftover from initial setup, never removed |
| **Violates DRY?** | No (only one source of truth) |
| **Violates SSOT?** | No (only Ip_config.json is used) |
| **Recommendation** | Remove `utils/Config.jsx`, keep `Ip_config.json`, add fallback, document |

---

## Correct Pattern for Metadata-Driven UI

### ✅ Current Pattern (Ip_config.json)

**Strengths**:
1. **Deployment Flexibility**: Single build, multiple environments
2. **No Rebuild Required**: Change config without recompiling
3. **Separation of Concerns**: Config separate from code
4. **Standard Practice**: Common in enterprise SPAs

**Weaknesses**:
1. **Extra Network Request**: Fetches config on every app load
2. **No Type Safety**: JSON file has no schema validation
3. **No Fallback**: Fails silently if file is missing

---

### Recommended Enhancements

1. **Add Fallback**:
```javascript
const apiUrl = config?.urlApi || import.meta.env.VITE_API_URL || 'http://localhost:5000/api/';
```

2. **Add Validation**:
```javascript
if (!config?.urlApi || !config.urlApi.startsWith('http')) {
  throw new Error('Invalid Ip_config.json: urlApi must be a valid URL');
}
```

3. **Add Loading State**:
```javascript
// App.jsx
const [configLoaded, setConfigLoaded] = useState(false);

useConfig(() => setConfigLoaded(true));

if (!configLoaded) return <Loading />;
```

4. **Cache Config**:
```javascript
// Only fetch if not in localStorage or if expired
const cachedConfig = getLocalStorageAtob('Ip_config');
if (cachedConfig && !isExpired(cachedConfig)) {
  updateApiBaseUrl(cachedConfig.urlApi);
} else {
  fetchConfig();
}
```

---

## Final Verdict

**Current Implementation**: ✅ **Architecturally Sound**

**Justification**:
- Runtime configuration is the correct choice for metadata-driven applications
- Enables deployment flexibility without rebuilds
- Follows industry best practices for SPAs

**Action Items**:

| # | Action | Priority | Status | Reference |
|---|--------|----------|--------|-----------|
| 1 | Keep `Ip_config.json` | P0 | ✅ Done | - |
| 2 | Remove `utils/Config.jsx` | P3 | ⏳ Pending | [06-unused-and-gaps.md](./06-unused-and-gaps.md#35-utilsconfigjsx) |
| 3 | Add fallback for missing config | P2 | ⏳ Pending | [07-action-plan.md](./07-action-plan.md#4-add-fallback-to-useconfig) |
| 4 | Add validation for config schema | P3 | ⏳ Pending | [07-action-plan.md](./07-action-plan.md#18-add-metadata-schema-validation) |
| 5 | Document deployment process | P3 | ⏳ Pending | [07-action-plan.md](./07-action-plan.md#17-document-ip_configjson) |

---

## Cross-Reference Index

| Topic | Related Document |
|-------|-----------------|
| Architecture decision rationale | [00-architecture-overview.md](./00-architecture-overview.md#why-runtime-config-ip_configjson) |
| `useConfig` hook implementation | [02-hooks.md](./02-hooks.md#1-useconfig) |
| Dead `Config.jsx` file | [06-unused-and-gaps.md](./06-unused-and-gaps.md#35-utilsconfigjsx) |
| DIP violation in useConfig | [05-solid-clean-architecture.md](./05-solid-clean-architecture.md#-violation-2-useconfig-direct-api-service-coupling) |
| Fallback implementation plan | [07-action-plan.md](./07-action-plan.md#4-add-fallback-to-useconfig) |

---

**Document Version**: 2.0  
**Last Updated**: 2026-02-08
