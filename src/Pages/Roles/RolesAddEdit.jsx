import { useEffect, useRef, useState } from "react";

import useLayout from "../../Hooks/useLayout";
import { NameSchema } from "../../utils/validation";
import useGetById from "../../Hooks/useGetById";
import HeaderPageAddEdit from "../../Components/HeaderPageAddEdit";
import CustomInput from "../../Components/Form/CustomInput";
import { Form, Formik } from "formik";
import useHandleSubmit from "../../Hooks/useHandleSubmit";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/loader";
import PermissionsLog from "../../Components/PermissionsLog";
import Config from "../../utils/Config";
import useFullRouteChain from "../../Hooks/useFullRouteChain";

const RolesAddEdit = ({ DataPage, ApiPage, ResourcePage }) => {
  const formikRef = useRef();
  const isAllowedModify = Config.isAllow("Modify", DataPage);

  const isAllowedAssignPermissions = Config.isAllow(
    "AssignPermissions",
    DataPage
  );
 
  // Navigation and routing
  const navigate = useNavigate();
  const { option, id, prevRoute } = useFullRouteChain();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [data, setData] = useState({});

  // Fetch data and layout setup
  const fetchData = useGetById(
    ApiPage,
    id,
    setIsLoading,
    setData,
    prevRoute,
    ResourcePage
  );
  useLayout(ResourcePage, DataPage);

  // Fetch data when the component mounts and the id is greater than 0
  useEffect(() => {
    if (id > 0) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  // Form submission handler
  const { handleSubmitFormik } = useHandleSubmit();
  const handleSubmit = (values) => {
    setIsLoadingSubmit(true);

    handleSubmitFormik({
      apiPage: ApiPage,
      values: values,
      recId: id,
      ResourcePage: ResourcePage,
      confiPage: DataPage,
      setIsLoadingSubmit: setIsLoadingSubmit,
      setData: setData,
      navigateTo: prevRoute,
    });
  };

  // Form setup and rendering
  const roleData = data?.data?.[0] || data || {};

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {/* Header for Add/Edit Page */}
      <HeaderPageAddEdit
        onSubmit={() => formikRef.current?.handleSubmit()}
        titleAdd="add"
        option={option}
        id={id}
        showBookmark={false}
        titleEdit="edit"
        isLoadingSubmit={isLoadingSubmit}
        viewOnly={!isAllowedModify}
        apiKey={ApiPage}
        ResourcePage={ResourcePage}
        confiPage={DataPage}
        goBack={() => navigate(prevRoute)}
      />

      <div className="role-edit-content px-4 py-6">
        <Formik
          innerRef={formikRef}
          validationSchema={NameSchema}
          initialValues={{
            name: roleData?.name || "",
          }}
          enableReinitialize={true}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <Form
              autoComplete="off"
              noValidate="noValidate"
              onSubmit={handleSubmit}
              className={`role-form mb-8 ${!isAllowedModify ? "view_only" : ""}`}
            >
              <div className="form_container max-w-2xl">
                <div className="form_editor">
                  <CustomInput
                    label="name"
                    name="name"
                    type="text"
                    Required={true}
                    className="cw_p"
                    placeholder="pleaseEnterName"
                    ResourcePage="GeneralField"
                    value={values.name}
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                    errors={errors.name}
                    touched={touched.name}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {id > 0 && (
          <div className="role-permissions-section mt-8">
            <PermissionsLog
              selectedPermissions={roleData?.permissions || []}
              apiPage={ApiPage}
              ResourcePage={ResourcePage}
              recId={id}
              apiSaveAll="AssignOrRemovePermissionsToRole"
              keyRecId="roleRecId"
              className="grid_line"
              isAllowedAssignPermissions={isAllowedAssignPermissions}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default RolesAddEdit;
