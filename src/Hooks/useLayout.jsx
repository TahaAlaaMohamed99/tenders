import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs, clearBreadcrumbs } from "../store/Reducers/Layout/breadcrumbsSlice";
import Config from "../utils/Config";
import { toast } from "react-toastify";
import TranslationText from "../Components/TranslationText";

export default function useLayout(title = '', configPage = null) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const isAllowed =
      configPage?.checkPermission == false
        ? true
        : Config.isAllow("View", configPage);

    if (isAllowed) {
      dispatch(
        setBreadcrumbs({
          pageTitle: title,
        })
      );
    } else {
      // User does not have View permission, force redirect & show a warning message
      window.location.replace("/");
      toast.warning(
        <div style={{ display: "flex", gap: "8px" }}>
          <TranslationText
            page="General"
            title="YouDoNotHavePermissionToAccess"
          />
          <TranslationText page={configPage?.keyPage || "General"} title="title" />
        </div>
      );
    }

    return () => {
      dispatch(clearBreadcrumbs());
    };
  }, [dispatch, title, configPage]);
}
