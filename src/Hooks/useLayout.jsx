import React, { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs, clearBreadcrumbs } from "../store/Reducers/Layout/breadcrumbsSlice";
export default function useLayout(title = '') {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(
      setBreadcrumbs({
        pageTitle: title,
      })
    );
    return () => {
      dispatch(clearBreadcrumbs());
    };
  }, [dispatch, title]);
}
