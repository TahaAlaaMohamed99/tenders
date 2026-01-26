import { configureStore } from "@reduxjs/toolkit";
import breadcrumbsReducer from "./Reducers/Layout/breadcrumbsSlice";
import themeReducer from "./Reducers/Layout/themeSlice";
import menuSettingsReducer from "./Reducers/Layout/menuSettingsSlice";
const store = configureStore({
  reducer: {
    breadcrumbsSlice: breadcrumbsReducer,
    themeSlice: themeReducer,
    menuSettingsSlice: menuSettingsReducer,
  },
});

export default store;
