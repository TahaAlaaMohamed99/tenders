import { useEffect, useRef, useState } from "react";

import useLayout from "../../Hooks/useLayout";
import useGetById from "../../Hooks/useGetById";
import HeaderPageAddEdit from "../../Components/HeaderPageAddEdit";
import useHandleSubmit from "../../Hooks/useHandleSubmit";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/loader";
import PermissionsLog from "../../Components/PermissionsLog";
import Config from "../../utils/Config";
import {
  IconData,
  IconRoles,
  IconUsers,
  IconTrash,
} from "../../assets/Icons";
import Stepper, { Step } from "../../Components/Stepper";
import GenericGridPageLine from "../../Components/GenericGridPageLine";
import { DataPagesLine } from "../../ConfigData/DataPagesLine";
import { Api } from "../../services/Api";
import useFullRouteChain from "../../Hooks/useFullRouteChain";
import { toast } from "react-toastify";
import TranslationText from "../../Components/TranslationText";
import DynamicForm from "../../Components/DynamicForm";
import componentRegistry from "../../ConfigData/componentRegistry";
import ConfirmationModal from "../../Components/ConfirmationModal";

const UsersAddEdit = ({ ConfiMainPage, DataPage, ApiPage, ResourcePage }) => {
  const formikRef = useRef();
  const isAllowedModify = Config.isAllow("Modify", DataPage);
  const isAllowedUserSetDefaultPermissions = Config.isAllow(
    "UserSetDefaultPermissions",
    DataPage
  );
  
  const RoleConfig = {
    keyPage: "Roles",
    routePage: "Roles",
    KeyPermission: "Role",
    keyModule: null,
    setupModule: "SystemSetup",
    ResourceModule: "Setups",
    canBookmark: false,
    isTranslations: true,
    routeAddEdit: true,
    Stepper: false,
    showMenu: "menuReportSetup",
  };
  const isAllowedAssignPermissions = Config.isAllow(
    "AssignPermissions",
    RoleConfig
  );
  const isAllowedAssignToUser = Config.isAllow("AssignToUser", RoleConfig);
  const isAllowedRemoveUser = Config.isAllow("RemoveUserRoles", RoleConfig);

  // Navigation and routing
  const navigate = useNavigate();
  const { option, id, prevRoute, step, navigateStep } = useFullRouteChain();
  
  // State 
  const [apiGetLines, setApiGetLines] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [replayFetch, setReplayFetch] = useState(false);
  const [data, setData] = useState({});
  const [userPermission, setUserPermission] = useState([]);
  const [version, setVersion] = useState(0);

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showModalDeleteRoles, setShowModalDeleteRoles] = useState(false);
  const [refreshKeyRoles, setRefreshKeyRoles] = useState(0);

  const steps = [
    {
      step: 0,
      title: "data",
      ResourcePage: "Users",
      icon: <IconData />,
      onClick: () => navigateStep(0),
    },
    {
      step: 1,
      title: "title",
      ResourcePage: "Roles",
      disabled: id == 0,
      icon: <IconRoles />,
      onClick: () => navigateStep(1),
    },
    {
      step: 2,
      title: "permissionsTitle",
      ResourcePage: ResourcePage,
      disabled: id == 0,
      icon: <IconUsers />,
      onClick: () => navigateStep(2),
    },
  ];

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

  useEffect(() => {
    if (step == 1) {
      setApiGetLines(`${ApiPage}/GetRolesByUserId?userId=${id}`);
    }
  }, [step]);

  const GetAllUserPermissionByUserId = async (setIsLoadingPermission) => {
    if (setIsLoadingPermission) setIsLoadingPermission(true);

    try {
      const res = await Api.get(
        `User/GetAllUserPermissionByUserId/${id}`
      );
      const resData = res.map((item) => ({
        ...item,
        recId: item.permissionRecId,
      }));
      setUserPermission(resData);
    } catch (error) {
      toast.error(<TranslationText title={error?.details || "Error"} />);
    } finally {
      if (setIsLoadingPermission) setIsLoadingPermission(false);
    }
  };

  useEffect(() => {
    if (step == 2) {
      GetAllUserPermissionByUserId();
    }
  }, [step]);

  // Form submission handler
  const { handleSubmitFormik } = useHandleSubmit();
  const handleSubmit = (values) => {
    setIsLoadingSubmit(true);
    
    // Filter out empty password fields in edit mode to avoid backend validation errors
    const processedValues = { ...values };
    if (id > 0) {
      if (!processedValues.password) delete processedValues.password;
      if (!processedValues.confirmedPassword) delete processedValues.confirmedPassword;
    }

    handleSubmitFormik({
      apiPage: ApiPage,
      values: processedValues,
      recId: id,
      ResourcePage: ResourcePage,
      confiPage: DataPage,
      setIsLoadingSubmit: setIsLoadingSubmit,
      setData: setData,
      navigateTo: prevRoute,
    });
  };

  const handleDeleteRoles = () => {
    setShowModalDeleteRoles(true);
  };

  const confirmDeleteRoles = async () => {
    if (selectedRoles.length === 0) return;
    try {
      setIsLoadingSubmit(true);
      const roleIds = selectedRoles.map(role => role.roleId);
      
      await Api.delete("User/RemoveUserRoles", {
        data: {
          userId: id,
          roleIds: roleIds
        }
      });
      
      toast.success(<TranslationText title="deleteSuccessfully" />);
      setSelectedRoles([]);
      setRefreshKeyRoles(prev => prev + 1);
      setShowModalDeleteRoles(false);
    } catch (error) {
      toast.error(<TranslationText title={error?.details || "Error"} />);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <HeaderPageAddEdit
        onSubmit={() => formikRef.current?.submitForm()}
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
      {id == 0 ? (
        <div className="px-4 py-6">
          <DynamicForm
             ref={formikRef}
             DataPage={DataPage}
             ResourcePage="Users"
             initialData={{
               ...(data?.data?.[0] || data || {}),
               confirmedPassword: (data?.data?.[0] || data)?.confirmedPassword ?? "",
             }}
             onSave={(values) => handleSubmit(values)}
             components={componentRegistry}
             isEdit={id > 0}
             id={id}
             viewOnly={!isAllowedModify}
             isSubmitting={isLoadingSubmit}
          />
        </div>
      ) : (
        <Stepper
          direction="horizontal"
          option={option}
          id={id}
          steps={steps}
          activeStep={step}
          ResourcePage={ResourcePage}
        >
          <Step step="0">
            <DynamicForm
               ref={formikRef}
               DataPage={DataPage}
               ResourcePage="Users"
               initialData={{
                 ...(data?.data?.[0] || data || {}),
                 confirmedPassword: (data?.data?.[0] || data)?.confirmedPassword ?? "",
               }}
               onSave={(values) => handleSubmit(values)}
               components={componentRegistry}
               isEdit={id > 0}
               id={id}
               viewOnly={!isAllowedModify}
               isSubmitting={isLoadingSubmit}
            />
          </Step>
          <Step step="1">
            {apiGetLines != null && (
              <GenericGridPageLine
                DataPage={DataPagesLine.RolesAddEditLine}
                ResourcePage="Roles"
                apiOverride={apiGetLines}
                stateNavigate={false}
                gridLine={false}
                isTitleGrid={false}
                parentData={{
                  parentId: id,
                  parentName: (data?.data?.[0] || data)?.userName,
                }}
                permissions={{
                  isAllowedModify: isAllowedAssignToUser,
                  isAllowedDelete: isAllowedRemoveUser,
                }}
                ConfigPage={RoleConfig}
                onClickRow={null}
                handleDelete={handleDeleteRoles}
                setSelectedRows={setSelectedRoles}
                refreshKey={refreshKeyRoles}
              />
            )}
          </Step>
          <Step step="2">
            <PermissionsLog
              selectedPermissions={userPermission}
              apiPage="User"
              recId={id}
              ResourcePage={ResourcePage}
              confiPage={ConfiMainPage}
              apiSaveAll="SaveUserPermissions"
              keyRecId="userRecId"
              usedNoYes={true}
              getAllUserPermissionByUserId={(setIsLoadingPermission) =>
                GetAllUserPermissionByUserId(setIsLoadingPermission)
              }
              isUser={true}
              key={version}
              onResetDefault={() => setVersion((prev) => prev + 1)}
              isAllowedAssignPermissions={isAllowedAssignPermissions}
              isAllowedUserSetDefaultPermissions={
                isAllowedUserSetDefaultPermissions
              }
            />
          </Step>
        </Stepper>
      )}

      <ConfirmationModal
        isVisible={showModalDeleteRoles}
        ResourcePage="Roles"
        type="delete"
        title="messageRemove"
        description="confirmRemove"
        icon={<IconTrash />}
        confirmButtonLabel="delete"
        onConfirm={confirmDeleteRoles}
        onCancel={() => setShowModalDeleteRoles(false)}
        isLoadingBtn={isLoadingSubmit}
      />
    </>
  );
};

export default UsersAddEdit;

