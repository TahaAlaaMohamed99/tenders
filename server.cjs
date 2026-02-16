const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
// Set custom ID field to 'recId' to match db.json structure
router.db._.id = "recId";
const middlewares = jsonServer.defaults();

// Set default port
const PORT = 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// =========================================================================
// 1. CUSTOM API ROUTES
// =========================================================================

// Login Mock
server.post('/api/Authentication/Login', (req, res) => {
  const { userName, password } = req.body;
  console.log(`[MockServer] Login attempt: ${userName}`);

  // Validate Credentials
  if (userName !== "Admin" || password !== "Admin@123") {
    console.log(`[MockServer] Login failed: Invalid credentials`);
    return res.status(401).json({ 
      title: "Unauthorized", 
      message: "Invalid username or password." 
    });
  }

  try {
    // Create a mock token
    // Current time + 1 day
    const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    // Minimal JWT structure expected by frontend parser
    // Header: {"alg":"HS256","typ":"JWT"}
    // Payload needs: UserId, http://.../name, Permissions, exp
    const headerStr = JSON.stringify({ alg: "HS256", typ: "JWT" });
    const header = Buffer.from(headerStr).toString('base64').replace(/=/g, '');
    
    // Generate full permissions for Admin (View, Add, Edit, Delete, etc. for all pages)
    // Based on PAGE_PERMISSION_BASE in permissions.js:
    // Dashboard(49), Journal(56), ... Settings(119)
    // We cover a wide range to ensure all features are accessible.
    const permissions = Array.from({ length: 200 }, (_, i) => i + 1).join(',');

    const payloadObj = {
      UserId: 1,
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": userName,
      Permissions: permissions,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      jti: "mock-jti-" + Date.now()
    };
    const payloadStr = JSON.stringify(payloadObj);
    const payload = Buffer.from(payloadStr).toString('base64').replace(/=/g, '');
    
    const signature = "mock-signature";
    const token = `${header}.${payload}.${signature}`;

    res.json({
      token,
      expiration,
      user: {
        id: 1,
        name: userName,
        email: "admin@example.com"
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Mock Error" });
  }
});

// =========================================================================
// 2. MIDDLEWARE & REWRITES (RPC -> REST)
// =========================================================================

server.use((req, res, next) => {
  const originalUrl = req.originalUrl;
  const method = req.method;

  // -----------------------------------------------------------------------
  // Handle Singular/Plural Mismatches
  // App uses 'Department', db.json uses 'Departments'
  // -----------------------------------------------------------------------
  if (originalUrl.includes('/api/Department/') && !originalUrl.includes('GetLookup')) {
    // We don't want to break Department_GetLookup which relies on "Department" prefix in db.json key
    // But we DO want to map Department/GetAll -> Departments
    // Department/GetById -> Departments/1
    // Department/Add -> Departments
    req.url = req.url.replace('/Department', '/Departments');
    console.log(`[MockServer] Pluralize: ${originalUrl} -> ${req.url}`);
    
    // Note: The subsequent rules will process the NEW req.url (which now has /Departments)
    // So /api/Departments/GetAll will be handled by the Standard GetAll rule below.
    // However, req.originalUrl remains unchanged in Express, so subsequent checks using originalUrl might fail
    // or need adjustment. 
    // ACTUALLY: The middleware below uses `originalUrl`. 
    // So modifying `req.url` here won't trigger the `originalUrl` checks below if they rely solely on `originalUrl`.
    
    // BETTER STRATEGY: Handle the rewriting in the specific blocks or allow the "Global Rewrite" to happen 
    // and then fix the path.
    // But since my logic below depends on `originalUrl`, I should probably just add specific handlers for Department
    // OR just change the Logic to check `req.url` OR satisfy the condition.
  }
  
  // WAIT: The logic below uses `originalUrl`.
  // If I change `req.url` here, the downstream handlers will still look at `originalUrl`.
  // Example: 
  // GET /api/Department/GetAll
  // Rule 1 (below): if (originalUrl.includes('/GetAll'))
  //   It matches.
  //   It extracts 'Department'.
  //   It sets req.url = '/Department'
  //   Result: 404.
  
  // So I need to intercept `Department` specifically inside the other rules OR add a specific fix.

  // Let's modify the GetAll rule to handle pluralization mapping if needed.
  // Or just add a specific block for Department/GetAll, Department/GetById etc. BEFORE the generic ones.
  
  // simpler: 
  if (originalUrl.includes('/api/Department/GetAll')) {
     req.url = '/Departments' + (originalUrl.split('?')[1] ? '?' + originalUrl.split('?')[1] : '');
     console.log(`[MockServer] Rewrite Department: ${originalUrl} -> ${req.url}`);
     return next(); // Skip generic rules
  }
  if (originalUrl.includes('/api/Department/GetById')) {
     const id = new URL(originalUrl, `http://localhost:${PORT}`).searchParams.get('id');
     req.url = `/Departments/${id}`;
     console.log(`[MockServer] Rewrite Department: ${originalUrl} -> ${req.url}`);
     return next();
  }
  if (method === 'POST' && originalUrl.includes('/api/Department/Add')) {
     req.url = '/Departments';
     console.log(`[MockServer] Rewrite Department: ${originalUrl} -> ${req.url}`);
     return next();
  }
  if (method === 'PUT' && originalUrl.includes('/api/Department/Update')) {
     const id = req.body.recId || req.body.id;
     req.url = `/Departments/${id}`;
     console.log(`[MockServer] Rewrite Department: ${originalUrl} -> ${req.url}`);
     return next();
  }
  if (method === 'DELETE' && originalUrl.includes('/api/Department/DeleteById')) {
     const id = new URL(originalUrl, `http://localhost:${PORT}`).searchParams.get('id');
     req.url = `/Departments/${id}`;
     console.log(`[MockServer] Rewrite Department: ${originalUrl} -> ${req.url}`);
     return next();
  }

  // -----------------------------------------------------------------------
  // GET /api/:resource/GetAll -> GET /:resource
  // -----------------------------------------------------------------------
  if (method === 'GET' && originalUrl.includes('/GetAll')) {
    // Remove '/api' prefix and '/GetAll' suffix
    // e.g. /api/Vendors/GetAll -> /Vendors
    // e.g. /api/Vendors/GetAll?pageNumber=1 -> /Vendors?pageNumber=1
    const parts = originalUrl.split('?');
    const path = parts[0];
    const query = parts[1] ? `?${parts[1]}` : '';
    
    // Extract resource name: /api/Vendors/GetAll -> Vendors
    const match = path.match(/\/api\/(.+)\/GetAll/);
    if (match && match[1]) {
      req.url = `/${match[1]}${query}`;
      console.log(`[MockServer] Rewrite: ${originalUrl} -> ${req.url}`);
    }
  }

  // -----------------------------------------------------------------------
  // GET /api/:resource/GetById?id=X -> GET /:resource/X
  // -----------------------------------------------------------------------
  else if (method === 'GET' && originalUrl.includes('/GetById')) {
    const urlObj = new URL(originalUrl, `http://localhost:${PORT}`);
    const id = urlObj.searchParams.get('id');
    
    // Extract resource name: /api/Vendors/GetById -> Vendors
    const match = urlObj.pathname.match(/\/api\/(.+)\/GetById/);
    if (match && match[1] && id) {
      req.url = `/${match[1]}/${id}`;
      console.log(`[MockServer] Rewrite: ${originalUrl} -> ${req.url}`);
    }
  }

  // -----------------------------------------------------------------------
  // DELETE /api/:resource/DeleteById?id=X -> DELETE /:resource/X
  // -----------------------------------------------------------------------
  else if (method === 'DELETE' && originalUrl.includes('/DeleteById?')) {
    const urlObj = new URL(originalUrl, `http://localhost:${PORT}`);
    const id = urlObj.searchParams.get('id');
    
    // Extract resource from path (e.g. /api/Vendors/DeleteById -> Vendors)
    // We can't rely solely on pathname match because of potential query params in originalUrl if any
    const match = urlObj.pathname.match(/\/api\/(.+)\/DeleteById/);
    if (match && match[1] && id) {
      req.url = `/${match[1]}/${id}`;
      console.log(`[MockServer] Rewrite: ${originalUrl} -> ${req.url}`);
    }
  }

  // -----------------------------------------------------------------------
  // DELETE /api/:resource/DeleteByIds (Body: [id1, id2, ...])
  // -----------------------------------------------------------------------
  else if (method === 'DELETE' && originalUrl.endsWith('/DeleteByIds')) {
     const match = originalUrl.match(/\/api\/(.+)\/DeleteByIds/);
     if (match && match[1]) {
        const resource = match[1];
        const ids = req.body; // Array of IDs
        
        console.log(`[MockServer] Batch Delete on ${resource}:`, ids);

        if (Array.isArray(ids)) {
          // Use lowdb instance to remove items
          // Note: json-server uses lowdb v1 syntax usually
          // resource corresponds to the key in db.json
          try {
             const db = router.db; // Access lowdb instance
             // Check if resource exists
             if (db.has(resource).value()) {
                // Remove items where recId is in ids array
                db.get(resource)
                  .remove(item => ids.includes(item.recId))
                  .write();
                
                return res.json({ message: "Deleted successfully", isError: false });
             } else {
               return res.status(404).json({ message: "Resource not found", isError: true });
             }
          } catch (e) {
             console.error("Batch delete error", e);
             return res.status(500).json({ message: "Internal Server Error", isError: true });
          }
        }
     }
  }

  // -----------------------------------------------------------------------
  // POST /api/:resource/Add -> POST /:resource
  // -----------------------------------------------------------------------
  else if (method === 'POST' && originalUrl.endsWith('/Add')) {
    const match = originalUrl.match(/\/api\/(.+)\/Add/);
    if (match && match[1]) {
      req.url = `/${match[1]}`;
      console.log(`[MockServer] Rewrite: ${originalUrl} -> ${req.url}`);
    }
  }

  // -----------------------------------------------------------------------
  // PUT /api/:resource/Update -> PUT /:resource/:recId
  // -----------------------------------------------------------------------
  else if (method === 'PUT' && originalUrl.endsWith('/Update')) {
    const match = originalUrl.match(/\/api\/(.+)\/Update/);
    if (match && match[1]) {
      // JSON Server requires ID in URL for PUT
      // Our app sends ID in body as `recId`
      const id = req.body.recId || req.body.id;
      if (id) {
        req.url = `/${match[1]}/${id}`;
        console.log(`[MockServer] Rewrite: ${originalUrl} -> ${req.url}`);
      }
    }
  }

  // -----------------------------------------------------------------------
  // Handle Renamed Resources (db.json keys cannot contain /)
  // GET /api/Vendors/GetdataArea -> GET /Vendors_GetdataArea
  // GET /api/VendorGroups/GetLookup -> GET /VendorGroups_GetLookup
  // GET /api/Currencies/GetLookup -> GET /Currencies_GetLookup
  // GET /api/Item/GetLookup -> GET /Item_GetLookup
  // GET /api/Department/GetLookup -> GET /Department_GetLookup
  // -----------------------------------------------------------------------
  else if (method === 'GET' && (
    originalUrl.includes('/GetdataArea') || 
    originalUrl.includes('/GetLookup')
  )) {
    // /api/Vendors/GetdataArea -> /Vendors_GetdataArea
    // Remove /api/ prefix, replace first / with _ (after resource name)
    const path = originalUrl.replace('/api/', '');
    const parts = path.split('/');
    if (parts.length >= 2) {
       req.url = `/${parts[0]}_${parts[1].split('?')[0]}`; // Handle query params if any
       console.log(`[MockServer] Rewrite Lookup: ${originalUrl} -> ${req.url}`);
    }
  }

  // -----------------------------------------------------------------------
  // Handle Action Endpoints (Post, UnPost, Validate)
  // e.g. POST /api/SubmissionDocument/Post?RecId=1
  // These modify state in complex ways on backend. For mock, we just return Success.
  // -----------------------------------------------------------------------
  else if (method === 'POST' && (
      originalUrl.includes('/Post') || 
      originalUrl.includes('/UnPost') || 
      originalUrl.includes('/Validate')
    )) {
      console.log(`[MockServer] Action intercepted: ${originalUrl}`);
      // Return "1" which app interprets as Success/Status 1
      return res.status(200).json(1);
  }

  next();
});

// Mount the standard router
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
  console.log('Mock Login Endpoint: http://localhost:3001/api/Authentication/Login');
});
