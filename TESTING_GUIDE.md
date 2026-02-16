# JSON Server Setup - Testing Guide

## ✅ FILES CREATED/MODIFIED

### 1. **db.json** (New)
   - Mock database with all entities
   - Includes: Vendors, VendorGroups, Currencies, Departments, Items, SubmissionDocuments
   - Pre-built lookup endpoints for cascading selects

### 2. **package.json** (Modified)
   - Added `json-server` and `concurrently` dependencies
   - Added scripts:
     - `npm run dev:mock` - Run mock server + Vite together
     - `npm run mock-server` - Run just the mock server

### 3. **src/config/apiConfig.js** (New)
   - Configuration manager for API base URL
   - `toggleMockServer(true/false)` - Switch between mock and production
   - `getMockServerStatus()` - Check current mode

### 4. **src/services/Api.jsx** (Modified)
   - Now uses `getApiBaseUrl()` from config
   - Automatically switches between mock server (port 3001) and production

### 5. **src/utils/mockServerInit.js** (New)
   - Visual indicator when mock mode is enabled
   - Shows blue "🔵 MOCK SERVER MODE" badge in top-right
   - Console logs for debugging

### 6. **src/main.jsx** (Modified)
   - Imports mock server initialization

### 7. **MOCK_SERVER_README.md** (New)
   - Complete documentation with instructions

---

## 🚀 QUICK START

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run with Mock Server
```bash
npm run dev:mock
```

This starts:
- **JSON Server** on http://localhost:3001
- **Vite Dev Server** on http://localhost:5173 (check console for actual port)

### Step 3: Test Your Pages

All pages now work with mock data:
1. **Vendors** - Test cascading select (Data Area → Vendor Group)
2. **Vendor Groups** - Filtered by data area
3. **Currencies** - Full CRUD operations
4. **Items** - Product/Item management
5. **Departments** - Department hierarchy
6. **Submission Documents** - Document workflow

### Step 4: Switch Modes (if needed)

**Enable Mock Mode:**
```javascript
// In browser console (F12 → Console tab)
toggleMockServer(true)
// Reload page
```

**Disable Mock Mode (back to production):**
```javascript
toggleMockServer(false)
// Reload page
```

---

## 🧪 TESTING CHECKLIST

### Form Validation & Cascading
- [ ] Open Vendors Add/Edit page
- [ ] Try to select vendor group WITHOUT selecting data area
  - Should be disabled (gray out)
  - Should show "selectDataAreaFirst" placeholder
- [ ] Select Data Area
  - Vendor Group options should filter and appear
  - Placeholder changes to "selectVendorGroup"
- [ ] Change Data Area
  - Vendor Group should reset and re-filter
  - Options should match new data area

### Create/Edit Operations
- [ ] **Create**: Click Add, fill form, click Save
  - Should successfully submit to JSON Server
  - Should redirect to list and show new record
- [ ] **Edit**: Click Edit on existing record
  - Should load data in form
  - Modify and save
  - Record should update in list
- [ ] **Delete**: Click Delete on record
  - Should ask for confirmation
  - Should remove from list

### Translations
- [ ] Check that all placeholders are translated
  - "selectDataArea", "selectVendorGroup", "selectCurrency", etc.
- [ ] Change app language (if multi-language supported)
  - Placeholders should translate in real-time
  - No hardcoded strings visible

### API Integration
- [ ] Open Developer Tools (F12)
- [ ] Go to Network tab
- [ ] Perform CRUD operations
- [ ] Verify requests go to:
  - `http://localhost:3001/Vendors` (in mock mode)
  - Or production API (after disabling mock mode)

---

## 📝 EXAMPLE TEST FLOW

### Test: Creating a Vendor with Cascading Select

1. **Start Mock Server:**
   ```bash
   npm run dev:mock
   ```

2. **Open App & Navigate to Vendors:**
   - URL: http://localhost:5173/vendors
   - Refresh and verify blue "🔵 MOCK SERVER MODE" badge appears (top-right)

3. **Click Add Vendor Button:**
   - Name field should be empty
   - Data Area dropdown should show options
   - Vendor Group should be DISABLED (gray)
   - Placeholder shows: "selectDataAreaFirst"

4. **Select a Data Area:**
   - E.g., "Company A"
   - Vendor Group should become ENABLED
   - Options should filter to only Company A's groups
   - Placeholder changes to: "selectVendorGroup"

5. **Select Vendor Group:**
   - E.g., "Local Suppliers"

6. **Fill Other Fields:**
   - Currency: Choose "USD"
   - Name: "Test Vendor XYZ"

7. **Click Save:**
   - Should see success toast/message
   - Should navigate back to vendor list
   - New vendor should appear in table

8. **Verify in Network Tab:**
   - POST request to: `http://localhost:3001/Vendors`
   - Status: 201 or 200
   - Response contains your new vendor data

---

## 🔄 REVERTING TO PRODUCTION

When main server is back online:

1. **Open Browser Console:**
   ```javascript
   toggleMockServer(false)
   ```

2. **Reload Page:**
   - Blue badge disappears
   - App now uses production API
   - No code changes needed!

---

## 💡 TIPS

- **Edit db.json anytime** - JSON Server auto-reloads
- **Need different data?** - Modify db.json according to your API response format
- **Port conflicts?** - Change port in `package.json` scripts (3001 → any free port)
- **Check console** - Always check browser console for errors/logs
- **Cache issues?** - Use Ctrl+Shift+R (or Cmd+Shift+R) for hard refresh

---

## 📞 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Cannot GET /some-path" | Make sure `npm run dev:mock` is running both servers |
| Port 3001 in use | Change port in `package.json` (e.g., 3002) |
| Data not showing | Check Network tab → verify URL and response |
| Cascading select not working | Ensure `filterOptionsBy` is in FormSchemas.jsx |
| Translation not showing | Verify keys exist in `resources.json` under "Vendors" page |
| Mock mode not toggling | Hard refresh page (Ctrl+Shift+R), then try again |

---

## 🎉 SUCCESS INDICATORS

✅ You'll know it's working when:
1. Blue "🔵 MOCK SERVER MODE" badge appears
2. Console shows: "🔵 MOCK SERVER MODE ENABLED"
3. Form cascading selects work (disable/filter on dependency change)
4. POST/PUT/DELETE operations succeed
5. Data persists after page reload (because JSON Server saves to db.json)
6. Switching modes works without code changes

---

Happy testing! 🚀
