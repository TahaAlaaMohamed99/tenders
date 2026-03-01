/**
 * Documentation Coverage Checker
 * 
 * Scans src/Components, src/Hooks, src/Pages, and src/utils
 * and checks if each file is referenced in the corresponding docs.
 * 
 * Usage: node check_docs.cjs
 */
const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, fileList);
    } else if (file.match(/\.(jsx|js)$/)) {
      fileList.push(file.replace(/\.(jsx|js)$/, ''));
    }
  }
  return fileList;
}

// Gather all source files (by name, without extension)
const componentFiles = getFiles('./src/Components');
const hookFiles = getFiles('./src/Hooks');
const pageFiles = getFiles('./src/Pages');
const utilFiles = getFiles('./src/utils');

// Read relevant docs
const compDoc = fs.readFileSync('./docs/01-components.md', 'utf8');
const hooksDoc = fs.readFileSync('./docs/02-hooks.md', 'utf8');
const archDoc = fs.readFileSync('./docs/00-architecture-overview.md', 'utf8');
const allDocs = compDoc + hooksDoc + archDoc;

// Check coverage
const missingComps = componentFiles.filter(f => !compDoc.includes(f));
const missingHooks = hookFiles.filter(f => !hooksDoc.includes(f));
const missingPages = pageFiles.filter(f => !allDocs.includes(f));
const missingUtils = utilFiles.filter(f => !allDocs.includes(f));

// Report
const hasIssues = missingComps.length || missingHooks.length || missingPages.length || missingUtils.length;

if (hasIssues) {
  if (missingComps.length) console.log('⚠️  Missing Components in docs:', missingComps);
  if (missingHooks.length) console.log('⚠️  Missing Hooks in docs:', missingHooks);
  if (missingPages.length) console.log('⚠️  Missing Pages in docs:', missingPages);
  if (missingUtils.length) console.log('⚠️  Missing Utils in docs:', missingUtils);
} else {
  console.log('✅ All source files are documented.');
}

// Summary
console.log(`\n📊 Summary: ${componentFiles.length} components, ${hookFiles.length} hooks, ${pageFiles.length} pages, ${utilFiles.length} utils`);
