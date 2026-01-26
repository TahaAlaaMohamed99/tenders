import { createSlice } from "@reduxjs/toolkit";
import { setLocalStorageBtoa } from "../../../utils/useFromLocalStorage";
const initialPinedSidebar = JSON.parse(atob(localStorage.getItem("isPinedSidebar") || btoa(false)));
const menuSettingsSlice = createSlice({
  name: "menuSettings",
  initialState: {
    showSidebar: false,
    openSidebar:false,
    isPinedSidebar: initialPinedSidebar,
   },
  reducers: {
    setShowSidebar: (state, actions) => {
      state.showSidebar = actions.payload;
    },
 
    togglePinedSidebar: (state) => {
      setLocalStorageBtoa(`isPinedSidebar`, !state.isPinedSidebar);
      state.isPinedSidebar = !state.isPinedSidebar;
    },
    toggleSidebar: (state) => {
      state.openSidebar = !state.openSidebar;
    },
 
  },
});

export const { setShowSidebar, togglePinedSidebar,toggleSidebar, setModeAddEdit } = menuSettingsSlice.actions;

export default menuSettingsSlice.reducer;
