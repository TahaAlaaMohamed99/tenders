import { useEffect, useRef, useState } from "react";
import PopupModalSlide from "../../Components/PopupModalSlide";
import useHandleSubmit from "../../Hooks/useHandleSubmit";
import useGetSelected from "../../Hooks/useGetSelected";
import DynamicForm from "../../Components/DynamicForm";
import componentRegistry from "../../ConfigData/componentRegistry";
import { RolesLineForm } from "../../ConfigData/FormSchemas";
import useGetLookup from "../../Hooks/useGetLookup";

/**
 * RolesAddEditLine Component
 * 
 * A popup modal for assigning roles to a specific user.
 */
export default function RolesAddEditLine({
  parentData,
  recId = 0,
  isVisible,
  toggleClick,
  titleSubmitBtn,
  title,
  iconModal,
  fetchGridData,
  ResourcePage,
  isAllowedModify,
}) {
  const formikRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const { handleSubmitFormik } = useHandleSubmit();
  const [RolesList, setRolesList] = useState(null);
  const { getLookup } = useGetLookup();

  useEffect(() => {
    if (isVisible) {
      getLookup(
        "Role/GetAll",
        "name",
        null,
        "id",
        setIsLoading,
        setRolesList,
        null,
        null,
        true,
      );
    }
  }, [isVisible]);

  const handleSubmit = (values) => {
    const sendData = [
      {
        userRecId: parseInt(parentData?.parentId),
        roleRecId: typeof values.roles === 'object' ? values.roles?.value : values.roles,
      }
    ]
    setIsLoadingSubmit(true);
    handleSubmitFormik({
      apiPage: "User/AssignRolestoUser",
      values: sendData,
      ResourcePage: ResourcePage,
      recId: recId,
      setIsLoadingSubmit: setIsLoadingSubmit,
      onSuccess: () => {
        toggleClick();
        fetchGridData?.();
      },
      useCustomUrl: true,
    });
  };

  const selectedRoles = useGetSelected(RolesList, recId);

  return (
    <PopupModalSlide
      modalSize="w-96"
      isVisible={isVisible}
      toggleClick={() => {
        toggleClick();
      }}
      isLoading={isLoading}
      submitClick={() => formikRef.current?.submitForm()}
      isLoadingSubmit={isLoadingSubmit}
      icon={iconModal}
      titleSubmitBtn={titleSubmitBtn}
      title={title}
      ResourcePage={ResourcePage}
      titleCancel="cancel"
      viewOnly={!isAllowedModify}
    >
      <DynamicForm
        ref={formikRef}
        DataPage={{ formSchema: RolesLineForm }}
        ResourcePage="Roles"
        initialData={{
          roles: selectedRoles || "",
          parentName: parentData?.parentName || "",
        }}
        onSave={(values) => handleSubmit(values)}
        components={componentRegistry}
        isEdit={recId > 0}
        id={recId}
        viewOnly={!isAllowedModify}
      />
    </PopupModalSlide>
  );
}
