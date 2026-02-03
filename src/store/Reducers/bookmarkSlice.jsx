/**
 * @fileoverview Bookmark Redux Slice
 * 
 * Manages user bookmarks for quick access to frequently used records.
 * 
 * ## Features
 * - Add/remove bookmarks
 * - Persist to localStorage
 * - Unique bookmarks per entity type
 * 
 * @module store/Reducers/bookmarkSlice
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 * Load bookmarks from localStorage
 * @returns {Array} Array of bookmark objects
 */
const loadBookmarksFromStorage = () => {
  try {
    const saved = localStorage.getItem("userBookmarks");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("[bookmarkSlice] Error loading bookmarks:", error);
    return [];
  }
};

/**
 * Save bookmarks to localStorage
 * @param {Array} bookmarks - Array of bookmark objects
 */
const saveBookmarksToStorage = (bookmarks) => {
  try {
    localStorage.setItem("userBookmarks", JSON.stringify(bookmarks));
  } catch (error) {
    console.error("[bookmarkSlice] Error saving bookmarks:", error);
  }
};

/**
 * Initial state shape
 * @typedef {Object} BookmarkState
 * @property {Array} bookmarks - Array of bookmark objects
 */
const initialState = {
  bookmarks: loadBookmarksFromStorage(),
};

/**
 * Bookmark Redux Slice
 * 
 * @example
 * // Add a bookmark
 * dispatch(addBookmark({
 *   id: 123,
 *   entityType: "Vendors",
 *   title: "Vendor ABC",
 *   path: "/vendors/123"
 * }));
 * 
 * // Remove a bookmark
 * dispatch(removeBookmark({ id: 123, entityType: "Vendors" }));
 * 
 * // Get bookmarks in component
 * const bookmarks = useSelector(state => state.bookmarkSlice.bookmarks);
 */
const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    /**
     * Add a new bookmark
     * @param {BookmarkState} state - Current state
     * @param {Object} action - Action with payload
     * @param {Object} action.payload - Bookmark data
     * @param {number} action.payload.id - Record ID
     * @param {string} action.payload.entityType - Entity type (e.g., "Vendors")
     * @param {string} action.payload.title - Display title
     * @param {string} action.payload.path - Route path
     */
    addBookmark: (state, action) => {
      const { id, entityType } = action.payload;
      
      // Check if already bookmarked
      const exists = state.bookmarks.some(
        (b) => b.id === id && b.entityType === entityType
      );
      
      if (!exists) {
        state.bookmarks.push({
          ...action.payload,
          createdAt: new Date().toISOString(),
        });
        saveBookmarksToStorage(state.bookmarks);
      }
    },

    /**
     * Remove a bookmark
     * @param {BookmarkState} state - Current state
     * @param {Object} action - Action with payload
     * @param {number} action.payload.id - Record ID
     * @param {string} action.payload.entityType - Entity type
     */
    removeBookmark: (state, action) => {
      const { id, entityType } = action.payload;
      state.bookmarks = state.bookmarks.filter(
        (b) => !(b.id === id && b.entityType === entityType)
      );
      saveBookmarksToStorage(state.bookmarks);
    },

    /**
     * Clear all bookmarks
     * @param {BookmarkState} state - Current state
     */
    clearAllBookmarks: (state) => {
      state.bookmarks = [];
      saveBookmarksToStorage([]);
    },
  },
});

// Export actions
export const { addBookmark, removeBookmark, clearAllBookmarks } = bookmarkSlice.actions;

// Export reducer
export default bookmarkSlice.reducer;
