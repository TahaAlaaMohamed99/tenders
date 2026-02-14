/**
 * validateMetadata.js — Runtime Metadata Schema Validation (Phase 7, P3 #18)
 * ============================================================================
 * Validates the three core metadata structures at startup to catch
 * configuration errors early with helpful, developer-friendly messages.
 *
 * Call `validateAllMetadata()` once during app initialization (e.g. in App.jsx
 * or main.jsx) in development mode. Validation is skipped in production builds.
 *
 * @see docs/03-metadata-driven-ui.md
 * @see docs/05-solid-clean-architecture.md — P3 #18
 */

const PREFIX = "[MetadataValidation]";

// ─────────── helpers ───────────

/**
 * Log a validation warning (non-fatal — the app still works but config is likely wrong).
 */
const warn = (source, key, message) => {
  console.warn(`${PREFIX} ${source} → "${key}": ${message}`);
};

/**
 * Log a validation error (likely will cause a runtime failure).
 */
const error = (source, key, message) => {
  console.error(`${PREFIX} ${source} → "${key}": ${message}`);
};

// ─────────── SidebarLogs validation ───────────

const REQUIRED_SIDEBAR_FIELDS = ["keyPage", "routePage", "showMenu"];
const VALID_SHOW_MENU = ["mainMenu", "menuReportSetup", "menuSetup", "settings"];

/**
 * Validate SidebarLogs.json entries.
 *
 * @param {Array} sidebarLogs – Parsed SidebarLogs.json
 * @returns {{ errors: number, warnings: number }}
 */
export const validateSidebarLogs = (sidebarLogs) => {
  let errors = 0;
  let warnings = 0;

  if (!Array.isArray(sidebarLogs)) {
    console.error(`${PREFIX} SidebarLogs must be an array, got ${typeof sidebarLogs}`);
    return { errors: 1, warnings: 0 };
  }

  const seenPages = new Set();

  sidebarLogs.forEach((entry, index) => {
    const label = entry.keyPage || `[index ${index}]`;

    // Required fields
    REQUIRED_SIDEBAR_FIELDS.forEach((field) => {
      if (!entry[field]) {
        error("SidebarLogs", label, `missing required field "${field}"`);
        errors++;
      }
    });

    // Duplicate keyPage
    if (entry.keyPage) {
      if (seenPages.has(entry.keyPage)) {
        warn("SidebarLogs", label, `duplicate keyPage "${entry.keyPage}"`);
        warnings++;
      }
      seenPages.add(entry.keyPage);
    }

    // showMenu validation
    if (entry.showMenu && !VALID_SHOW_MENU.includes(entry.showMenu)) {
      warn("SidebarLogs", label, `unknown showMenu value "${entry.showMenu}" (expected: ${VALID_SHOW_MENU.join(", ")})`);
      warnings++;
    }
  });

  return { errors, warnings };
};

// ─────────── DataPages validation ───────────

const REQUIRED_DATAPAGE_FIELDS = ["Api", "componentViwe", "keyId"];

/**
 * Validate DataPages configuration object.
 *
 * @param {Object} dataPages – The DataPages export
 * @param {Array}  sidebarLogs – SidebarLogs entries (for cross-reference)
 * @returns {{ errors: number, warnings: number }}
 */
export const validateDataPages = (dataPages, sidebarLogs = []) => {
  let errors = 0;
  let warnings = 0;

  if (!dataPages || typeof dataPages !== "object") {
    console.error(`${PREFIX} DataPages must be an object`);
    return { errors: 1, warnings: 0 };
  }

  const sidebarKeys = new Set(sidebarLogs.map((e) => e.keyPage));

  Object.entries(dataPages).forEach(([key, config]) => {
    // Required fields
    REQUIRED_DATAPAGE_FIELDS.forEach((field) => {
      if (!config[field]) {
        error("DataPages", key, `missing required field "${field}"`);
        errors++;
      }
    });

    // columns must be array if present
    if (config.columns && !Array.isArray(config.columns)) {
      error("DataPages", key, `"columns" must be an array`);
      errors++;
    }

    // Validate each column
    if (Array.isArray(config.columns)) {
      config.columns.forEach((col, i) => {
        if (!col.key) {
          error("DataPages", key, `column[${i}] missing "key"`);
          errors++;
        }
        if (!col.title) {
          warn("DataPages", key, `column[${i}] (key="${col.key}") missing "title"`);
          warnings++;
        }
        if (col.width && typeof col.width !== "number") {
          warn("DataPages", key, `column[${i}] (key="${col.key}") "width" should be a number`);
          warnings++;
        }
      });
    }

    // formSchema validation
    if (config.formSchema) {
      if (!config.formSchema.sections || !Array.isArray(config.formSchema.sections)) {
        warn("DataPages", key, `formSchema.sections should be an array`);
        warnings++;
      } else {
        config.formSchema.sections.forEach((section, si) => {
          if (!section.title) {
            warn("DataPages", key, `formSchema.sections[${si}] missing "title"`);
            warnings++;
          }
          if (!Array.isArray(section.fields)) {
            warn("DataPages", key, `formSchema.sections[${si}] "fields" should be an array`);
            warnings++;
          }
        });
      }
    }

    // Cross-reference: every DataPages key should have a corresponding SidebarLogs entry
    if (sidebarKeys.size > 0 && !sidebarKeys.has(key)) {
      warn("DataPages", key, `no matching entry in SidebarLogs.json — page will not appear in sidebar/routes`);
      warnings++;
    }

    // componentViwe should be a function (React component)
    if (config.componentViwe && typeof config.componentViwe !== "function") {
      warn("DataPages", key, `"componentViwe" should be a React component (function), got ${typeof config.componentViwe}`);
      warnings++;
    }
  });

  // Cross-reference: SidebarLogs entries without DataPages config
  sidebarKeys.forEach((pageKey) => {
    if (!dataPages[pageKey]) {
      warn("SidebarLogs↔DataPages", pageKey, `SidebarLogs entry has no matching DataPages config`);
      warnings++;
    }
  });

  return { errors, warnings };
};

// ─────────── CommonGridSchemas validation ───────────

/**
 * Validate a single grid schema (columns array).
 *
 * @param {string} name – Schema name (for log messages)
 * @param {Object} schema – Grid schema object (must have `columns` array)
 * @returns {{ errors: number, warnings: number }}
 */
export const validateGridSchema = (name, schema) => {
  let errors = 0;
  let warnings = 0;

  if (!schema || !Array.isArray(schema.columns)) {
    error("GridSchema", name, `must have a "columns" array`);
    return { errors: 1, warnings: 0 };
  }

  const seenKeys = new Set();

  schema.columns.forEach((col, i) => {
    if (!col.key) {
      error("GridSchema", name, `column[${i}] missing "key"`);
      errors++;
    }

    if (col.key && seenKeys.has(col.key)) {
      warn("GridSchema", name, `duplicate column key "${col.key}"`);
      warnings++;
    }
    if (col.key) seenKeys.add(col.key);

    if (!col.width && col.width !== 0) {
      warn("GridSchema", name, `column "${col.key || i}" missing "width" — may cause layout issues`);
      warnings++;
    }

    if (col.minWidth && col.maxWidth && col.minWidth > col.maxWidth) {
      warn("GridSchema", name, `column "${col.key}" has minWidth (${col.minWidth}) > maxWidth (${col.maxWidth})`);
      warnings++;
    }
  });

  return { errors, warnings };
};

// ─────────── FormSchemas validation ───────────

const VALID_FIELD_TYPES = [
  "text", "number", "select", "async-select", "date", "dateTime",
  "textarea", "checkbox", "radio", "email", "tel", "password",
  "file", "switch", "hidden",
];

/**
 * Validate a single form schema.
 *
 * @param {string} name – Schema name
 * @param {Object} schema – Form schema object (must have `sections` array)
 * @returns {{ errors: number, warnings: number }}
 */
export const validateFormSchema = (name, schema) => {
  let errors = 0;
  let warnings = 0;

  if (!schema || !Array.isArray(schema.sections)) {
    error("FormSchema", name, `must have a "sections" array`);
    return { errors: 1, warnings: 0 };
  }

  const seenFields = new Set();

  schema.sections.forEach((section, si) => {
    if (!section.title) {
      warn("FormSchema", name, `sections[${si}] missing "title"`);
      warnings++;
    }

    if (!Array.isArray(section.fields)) {
      warn("FormSchema", name, `sections[${si}] "fields" should be an array`);
      warnings++;
      return;
    }

    section.fields.forEach((field, fi) => {
      if (!field.name) {
        error("FormSchema", name, `sections[${si}].fields[${fi}] missing "name"`);
        errors++;
      }

      if (field.name && seenFields.has(field.name)) {
        warn("FormSchema", name, `duplicate field name "${field.name}"`);
        warnings++;
      }
      if (field.name) seenFields.add(field.name);

      if (!field.type) {
        warn("FormSchema", name, `field "${field.name || fi}" missing "type"`);
        warnings++;
      } else if (!VALID_FIELD_TYPES.includes(field.type)) {
        warn("FormSchema", name, `field "${field.name}" has unknown type "${field.type}" — ensure componentRegistry has a mapping`);
        warnings++;
      }

      if (field.type === "async-select" && !field.lookup) {
        warn("FormSchema", name, `async-select field "${field.name}" missing "lookup" config`);
        warnings++;
      }

      if (field.lookup) {
        if (!field.lookup.api) {
          error("FormSchema", name, `field "${field.name}" lookup missing "api"`);
          errors++;
        }
        if (!field.lookup.labelKey) {
          warn("FormSchema", name, `field "${field.name}" lookup missing "labelKey"`);
          warnings++;
        }
        if (!field.lookup.valueKey) {
          warn("FormSchema", name, `field "${field.name}" lookup missing "valueKey"`);
          warnings++;
        }
      }
    });
  });

  return { errors, warnings };
};

// ─────────── orchestrator ───────────

/**
 * Run all metadata validations. Should be called once at app startup.
 * Only runs in development mode (import.meta.env.DEV).
 *
 * @param {Object} options
 * @param {Array}  options.sidebarLogs – SidebarLogs.json data
 * @param {Object} options.dataPages   – DataPages export
 * @param {Object} options.gridSchemas – Object of { name: gridSchema }
 * @param {Object} options.formSchemas – Object of { name: formSchema }
 * @returns {{ totalErrors: number, totalWarnings: number }}
 */
export const validateAllMetadata = ({
  sidebarLogs = [],
  dataPages = {},
  gridSchemas = {},
  formSchemas = {},
} = {}) => {
  // Skip in production for zero performance cost
  if (typeof import.meta !== "undefined" && import.meta.env && !import.meta.env.DEV) {
    return { totalErrors: 0, totalWarnings: 0 };
  }

  console.group(`${PREFIX} Running metadata validation...`);

  let totalErrors = 0;
  let totalWarnings = 0;

  // 1. SidebarLogs
  const sl = validateSidebarLogs(sidebarLogs);
  totalErrors += sl.errors;
  totalWarnings += sl.warnings;

  // 2. DataPages (with SidebarLogs cross-reference)
  const dp = validateDataPages(dataPages, sidebarLogs);
  totalErrors += dp.errors;
  totalWarnings += dp.warnings;

  // 3. GridSchemas (validated via DataPages columns)
  Object.entries(gridSchemas).forEach(([name, schema]) => {
    const gs = validateGridSchema(name, schema);
    totalErrors += gs.errors;
    totalWarnings += gs.warnings;
  });

  // 4. FormSchemas
  Object.entries(formSchemas).forEach(([name, schema]) => {
    const fs = validateFormSchema(name, schema);
    totalErrors += fs.errors;
    totalWarnings += fs.warnings;
  });

  // Summary
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log(`${PREFIX} ✅ All metadata valid`);
  } else {
    console.log(`${PREFIX} Result: ${totalErrors} error(s), ${totalWarnings} warning(s)`);
  }

  console.groupEnd();

  return { totalErrors, totalWarnings };
};

export default validateAllMetadata;
