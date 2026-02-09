# Public Assets — Deployment Guide

## `Ip_config.json` — Runtime API Configuration

This file controls the **runtime** API base URL for the application.
It is fetched on every page load (with cache-busting) by the `useConfig` hook,
so it can be changed **without rebuilding** the application.

### Format

```json
{
  "urlApi": "https://your-api-server.example.com/api/"
}
```

| Property | Type   | Required | Description                                          |
|----------|--------|----------|------------------------------------------------------|
| `urlApi` | string | **Yes**  | Full base URL for the backend API, must end with `/` |

### How It Works

1. On app startup, `src/Hooks/useConfig.jsx` fetches `/Ip_config.json?_=<timestamp>`.
2. The response is parsed and stored in **localStorage** (Base64-encoded key `Configuration`).
3. `src/services/Api.jsx` reads `urlApi` from localStorage and sets it as the Axios base URL.
4. If `Ip_config.json` fails to load (e.g., network error, 404), the app falls back to:
   - `VITE_API_URL` environment variable (build-time), or
   - `http://localhost:5000/api/` (hardcoded default)

### Environment-Specific Examples

**Development (local backend)**
```json
{
  "urlApi": "http://localhost:5050/api/"
}
```

**Staging**
```json
{
  "urlApi": "https://staging-api.example.com/api/"
}
```

**Production**
```json
{
  "urlApi": "https://api.example.com/api/"
}
```

**Dev Tunnel (VS Code / Codespaces)**
```json
{
  "urlApi": "https://mldj6kmf-5050.uks1.devtunnels.ms/api/"
}
```

### Deployment Notes

- This file is served as a **static asset** from the `public/` directory.
- After building (`npm run build`), it lands in `dist/Ip_config.json`.
- You can **replace** `dist/Ip_config.json` at deploy time to point to any environment's API
  without rebuilding the frontend — this is the recommended approach.
- Ensure the API URL ends with a trailing `/`.
- The fetch uses a timestamp query parameter (`?_=<ms>`) to bypass browser and CDN caches.

### Related Files

| File | Role |
|------|------|
| `src/Hooks/useConfig.jsx` | Fetches and stores config at startup |
| `src/services/Api.jsx` | Reads `urlApi` from localStorage, sets Axios `baseURL` |
| `src/utils/localStorage.jsx` | Base64 encode/decode wrappers for localStorage |
| `docs/04-configuration.md` | Full configuration architecture documentation |
