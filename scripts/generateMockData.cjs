const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');
let db;

try {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (error) {
    console.error("Error reading db.json:", error);
    process.exit(1);
}

// Helpers
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const vendorNames = ['Acme Corp', 'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp', 'Stark Ind', 'Wayne Ent', 'Cyberdyne', 'Massive Dynamic', 'Hooli', 'Pied Piper', 'E Corp', 'Tyrell Corp', 'Weyland-Yutani', 'Oceanic Airlines'];
const vendorSuffixes = ['Ltd', 'Inc', 'GmbH', 'LLC', 'Sarl', 'Co'];

// 1. Generate Vendors
// We don't want to duplicate existing ones too much, but for mock data simplicity we just append.
// Ideally should check uniqueness but recId handles identity.
const existingVendorCount = db.Vendors ? db.Vendors.length : 0;
if (!db.Vendors) db.Vendors = [];

for (let i = 0; i < 50; i++) {
  const name = `${randomItem(vendorNames)} ${randomItem(vendorSuffixes)} ${i + 1}`;
  db.Vendors.push({
    recId: existingVendorCount + i + 1,
    code: `V${(existingVendorCount + i + 1).toString().padStart(3, '0')}`,
    name: name,
    vendorAccountNumber: `ACC${randomInt(1000, 9999)}`,
    vendorGroupId: `VG00${randomInt(1, 3)}`,
    currencyCode: randomItem(['USD', 'EUR', 'GBP', 'SAR']),
    dataAreaId: randomItem(['company1', 'company2']),
    vendorPartyType: randomItem(['Organization', 'Individual']),
    createdOn: new Date().toISOString()
  });
}

// 2. Generate Departments
const deptNames = ['HR', 'IT', 'Sales', 'Marketing', 'Legal', 'R&D', 'Production', 'Logistics', 'Support', 'Quality'];
const existingDeptCount = db.Departments ? db.Departments.length : 0;
if (!db.Departments) db.Departments = [];

for (let i = 0; i < 20; i++) {
   const name = `${randomItem(deptNames)} ${i + 1}`;
   db.Departments.push({
     recId: existingDeptCount + i + 1,
     code: `DEPT${(existingDeptCount + i + 1).toString().padStart(3, '0')}`,
     name: name,
     operatingUnitNumber: `OU${randomInt(100, 999)}`,
     operatingUnitType: randomItem(['Department', 'Division', 'Unit']),
     createdOn: new Date().toISOString()
   });
}
// Update Lookup also
db.Department_GetLookup = db.Departments.map(d => ({ code: d.code, name: d.name }));


// 3. Generate Items
const itemTypes = ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Desk', 'Chair', 'Paper', 'Pen', 'Printer', 'Toner'];
const existingItemCount = db.Item ? db.Item.length : 0;
if (!db.Item) db.Item = [];

for (let i = 0; i < 50; i++) {
   const name = `${randomItem(itemTypes)} Model ${randomInt(1, 100)}`;
   db.Item.push({
     recId: existingItemCount + i + 1,
     code: `IT${(existingItemCount + i + 1).toString().padStart(3, '0')}`,
     itemNumber: `ITEM-${(existingItemCount + i + 1).toString().padStart(3, '0')}`,
     searchName: name,
     dataAreaId: randomItem(['company1', 'company2']),
     inventoryUnitSymbol: randomItem(['PCS', 'BOX', 'KG']),
     productType: randomItem(['Product', 'Service']),
     createdOn: new Date().toISOString()
   });
}
// Update Lookup
db.Item_GetLookup = db.Item.map(i => ({ itemNumber: i.itemNumber, searchName: i.searchName }));


// 4. Generate Submission Documents
const existingSubDocs = db.SubmissionDocument ? db.SubmissionDocument.length : 0;
if (!db.SubmissionDocument) db.SubmissionDocument = [];
if (!db.SubmissionDocumentLine) db.SubmissionDocumentLine = [];

for (let i = 0; i < 20; i++) {
    const id = existingSubDocs + i + 1;
    // status options
    const status = randomItem(['Draft', 'Published', 'Approved', 'Closed']);
    
    db.SubmissionDocument.push({
        recId: id,
        code: `SD${id.toString().padStart(3, '0')}`,
        name: `Project ${randomItem(['Alpha', 'Beta', 'Gamma', 'Delta'])} - ${id}`,
        description: `Description for project ${id}`,
        biddingType: randomItem(['OpenBidding', 'ClosedBidding']),
        status: status,
        transDate: new Date().toISOString(),
        executionDate: new Date(Date.now() + 1000000000).toISOString(),
        createdOn: new Date().toISOString()
    });

    // Generate Lines
    const lineCount = randomInt(1, 5);
    for (let j = 0; j < lineCount; j++) {
        const item = randomItem(db.Item);
        const dept = randomItem(db.Departments);
        
        if (item && dept) {
             db.SubmissionDocumentLine.push({
                recId: db.SubmissionDocumentLine.length + 1, // Simple incremental ID for lines
                submissionDocId: id,
                itemNumber: item.itemNumber,
                itemName: item.searchName,
                purchaseQuantity: randomInt(1, 100),
                departmentName: dept.name,
                createdOn: new Date().toISOString()
            });
        }
    }
}

// Write back
try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log('Mock data generated successfully!');
} catch (err) {
    console.error("Error writing db.json:", err);
}
