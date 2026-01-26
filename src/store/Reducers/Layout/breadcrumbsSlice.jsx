import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  breadcrumbs: {
    companyName: "",
    ResourceModule: "",
    moduleLink: "",
    pageTitle: "",
  },
};

const breadcrumbsSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = { ...initialState.breadcrumbs };
    },
  },
});

export const { setBreadcrumbs, clearBreadcrumbs } = breadcrumbsSlice.actions;

export default breadcrumbsSlice.reducer;
