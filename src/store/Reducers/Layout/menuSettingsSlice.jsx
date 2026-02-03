import { createSlice } from "@reduxjs/toolkit";

const menuSettingsSlice = createSlice({
  name: "menuSettings",
  initialState: {
    showSidebar: false,
    openSidebar: false,
    isSidebarExpanded: true,
  },
  reducers: {
    setShowSidebar: (state, actions) => {
      state.showSidebar = actions.payload;
    },

    toggleSidebarExpanded: (state) => {
      state.isSidebarExpanded = !state.isSidebarExpanded;
    },
    toggleSidebar: (state) => {
      state.openSidebar = !state.openSidebar;
    },
  },
});

export const { setShowSidebar, toggleSidebarExpanded, toggleSidebar, setModeAddEdit } = menuSettingsSlice.actions;

export default menuSettingsSlice.reducer;
