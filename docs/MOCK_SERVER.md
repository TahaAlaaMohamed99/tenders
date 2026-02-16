# Mock Server Documentation

This project includes a custom Mock Server to enable full development capabilities (Login, CRUD) without a running backend.

## Quick Start

### 1. Installation

If not already installed, `json-server` and `concurrently` are required (included in `package.json`):

```bash
npm install
```

### 2. Running in Mock Mode

#### Option 1: Run Mock Server + App Together (Recommended)
This command runs both the JSON Server and the Vite Dev Server concurrently.
```bash
npm run dev:mock
```
- **JSON Server**: `http://localhost:3001`
- **Vite Dev Server**: `http://localhost:5173`

#### Option 2: Run Mock Server Only
```bash
npm run mock-server
```
Then run the frontend in a separate terminal: `npm run dev`

### 3. Enable Mock Mode in Frontend

Open your browser DevTools (F12) -> Console and type:
```javascript
toggleMockServer(true)
```
Then reload the page. The app will now communicate with `http://localhost:3001`.

- **Check Status**: `getMockServerStatus()` (Returns true if enabled)
- **Disable**: `toggleMockServer(false)` (Switch back to real API)

## Features & Implementation Details

### Mock Login
The default `json-server` cannot handle the specific `POST` request structure required by the app's login. We use a custom `server.cjs` script to intercept `POST /api/Authentication/Login` and return a valid **JWT Token**.

**Required Credentials:**
-   **Username**: `Admin`
-   **Password**: `Admin@123`
*(Any other credentials will return a 401 Unauthorized error)*

**Token Details:**
-   User ID: 1
-   Permissions: [1..200] (Full Access)
-   Expiration: 24h

### RPC-to-REST Translation
The application uses **RPC-style** API endpoints (e.g., `/GetById`, `/Add`), while `json-server` expects standard **REST** (e.g., `GET /Resource/1`, `POST /Resource`). The `server.cjs` middleware automatically translates these requests:

| App Request (RPC) | Transformed Request (REST) | Note |
| :--- | :--- | :--- |
| `GET /api/:res/GetAll` | `GET /:res` | Lists all items |
| `GET /api/:res/GetById?id=1` | `GET /:res/1` | Gets single item |
| `POST /api/:res/Add` | `POST /:res` | Creates item |
| `PUT /api/:res/Update` | `PUT /:res/:id` | Updates item (ID from body) |
| `DELETE /api/:res/DeleteById?id=1` | `DELETE /:res/1` | Deletes item |

### Action Handling
Specific actions like `Post`, `UnPost`, or `Validate` (e.g., `POST /api/SubmissionDocument/Post`) are intercepted and return a `Success (1)` status to keep the application flow working.

## Mock Data Management

All mock data is stored in `db.json` at the project root.

### Available Entities
- **Vendors** - Sample vendor records with cascading dependencies
- **VendorGroups** - Vendor groups filtered by dataAreaId
- **Currencies** - Currency lookup data
- **Departments** - Department records
- **Item** - Item/Product records
- **SubmissionDocument** - Submission document records
- **SubmissionDocumentLine** - Document line items

### Lookup Endpoints
Pre-built lookup responses mapped via rewrites:
- `Vendors/GetdataArea` -> `Vendors_GetdataArea`
- `VendorGroups/GetLookup` -> `VendorGroups_GetLookup`

### Adding Data
Edit `db.json` to add more sample records. JSON Server automatically watches the file and reloads.

## Troubleshooting

- **Port 3001 Already in Use?**
  Edit `package.json`: `"mock-server": "node server.cjs"` (Modify port in `server.cjs` or pass as arg)
- **Changes Not Reflecting?**
  Reload the app after toggling `toggleMockServer()`.
- **Form Submissions Not Working?**
  Check the Network tab. Ensure the request is being rewritten correctly by `server.cjs` (logs are visible in the terminal running the mock server).

## File Structure
-   **`server.cjs`**: The custom Node.js script powering the mock server.
-   **`db.json`**: The database file. You can edit this file to change test data.
-   **`docs/MOCK_SERVER.md`**: This documentation.
