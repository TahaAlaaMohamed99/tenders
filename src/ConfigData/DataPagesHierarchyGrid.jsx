/**
 * @fileoverview DataPagesHierarchyGrid Config — PLACEHOLDER (Phase 6)
 *
 * Configuration for hierarchy grid views. All entries have enabled: false.
 * Used by HierarchyAll component (which is also conditionally rendered).
 * Kept as-is since HeaderPageAddEdit imports it for conditional rendering.
 *
 * @see docs/06-unused-and-gaps.md#33-datapageshierarchygridjsx
 * @module ConfigData/DataPagesHierarchyGrid
 */

// Phase 6: All entries disabled. When implementing hierarchy feature,
// set enabled: true and provide parentKey + gridConfig for the entity.
export const DataPagesHierarchyGrid = {
  // Vendors: { enabled: true, parentKey: "vendorGroupRecId", gridConfig: VendorsHierarchyGrid },
  Vendors: { enabled: false, parentKey: null, gridConfig: null },
  VendorGroups: { enabled: false, parentKey: null, gridConfig: null },
};
