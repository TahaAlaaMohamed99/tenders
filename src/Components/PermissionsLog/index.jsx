import { useEffect, useState, useMemo } from "react";
import useGridData from "../../Hooks/useGridData";
import {
  ModuleOrderSidbar,
} from "../../ConfigData/OrderMenus"; 

import { DataPages } from "../../ConfigData/DataPages";
import { useProcessMenu } from "../../Hooks/useProcessMenu";
import SidebarLogs from "../../ConfigData/SidebarLogs.json";
import CustomAccordion from "../CustomAccordion";
import CustomCheckbox from "../Form/CustomCheckbox";
import "../../Styles/components/PermissionsLog/PermissionsLog.scss";
import TranslationText from "../TranslationText";
import Loader from "../loader";
import {
  IconSettings,
  IconArrowDown as RotatedArrowIcon,
} from "../../assets/Icons";
import useTranslationText from "../../Hooks/useTranslationText";
import { useSelector } from "react-redux";
import { Api } from "../../services/Api";
import { toast } from "react-toastify";
import SaveAndCancelChanges from "../SaveAndCancelChanges";
import { usePermissionSelection } from "../../Hooks/usePermissionSelection";

/**
 * PermissionsLog Component
 * 
 * Manages permission assignments for users or roles.
 * Unified with "New" reference implementation while keeping 4-level hierarchy.
 */
export default function PermissionsLog({
  selectedPermissions,
  apiPage,
  recId,
  apiSaveAll,
  keyRecId,
  ResourcePage,
  usedNoYes = false,
  className = "",
  getAllUserPermissionByUserId,
  isAllowedAssignPermissions,
  isAllowedUserSetDefaultPermissions,
}) {
  const { currentLanguage } = useSelector((state) => state.themeSlice || {});

  const [dataGrid, setDataGrid] = useState();
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [openAccordionSub, setOpenAccordionSub] = useState(null);

  const selection = usePermissionSelection(selectedPermissions, dataGrid);

  const { fetchGridData } = useGridData(
    "Permission/GetAllPermissions",
    setDataGrid,
    setIsLoading,
    false
  );

  // Helper from reference to handle submodule nesting
  const restructureModules = (modulesList) => {
    return modulesList.map((module) => {
      if (!module.subItems) return module;
      const groupedBySubModule = {};
      const withoutSubModule = [];
      module.subItems.forEach((subItem) => {
        if (subItem.subModule) {
          if (!groupedBySubModule[subItem.subModule]) {
            groupedBySubModule[subItem.subModule] = {
              title: subItem.subModule,
              ResourcePage: subItem.subModule,
              keyModule: subItem.subModule,
              subMenu: true,
              subItems: [],
              icon: <IconSettings /> // Default icon for submodules
            };
          }
          groupedBySubModule[subItem.subModule].subItems.push(subItem);
        } else {
          withoutSubModule.push(subItem);
        }
      });
      return { ...module, subItems: [...withoutSubModule, ...Object.values(groupedBySubModule)] };
    });
  };

  // Dynamically build hierarchy from DataPages
  useEffect(() => {
    const areaMap = {};
    
    Object.keys(DataPages).forEach(key => {
      const page = DataPages[key];
      if (page.checkPermission === false) return;

      const areaKey = page.showMenu || "mainMenu";
      const moduleKey = page.keyModule || "Other";

      if (!areaMap[areaKey]) {
        areaMap[areaKey] = {
          title: areaKey,
          keyArea: areaKey,
          subMenu: true,
          modules: {}
        };
      }

      const area = areaMap[areaKey];
      if (!area.modules[moduleKey]) {
        area.modules[moduleKey] = {
          title: moduleKey,
          keyModule: moduleKey,
          subMenu: true,
          subItems: [],
          icon: ModuleOrderSidbar.find(m => m.keyModule === moduleKey)?.icon || <IconSettings />
        };
      }

      area.modules[moduleKey].subItems.push({
        keyPage: key,
        ResourcePage: page.keyPage || key,
        KeyPermission: page.KeyPermission || key,
        routePage: page.Api === "Dashboard" ? "Dashboard" : (page.Api || key),
        subModule: page.subModule || null
      });
    });

    // Flatten Area -> Module into just Modules for more direct access
    const sortedModules = Object.values(areaMap).reduce((acc, area) => {
      const rawModules = Object.values(area.modules);
      return [...acc, ...restructureModules(rawModules)];
    }, []);
    
    setModules(sortedModules);
  }, []);

  useEffect(() => {
    fetchGridData();
  }, []);

  // Calculate delta for saving
  const assignOrRemovePermissions = useMemo(() => {
    const originalIds = new Set(selection.originalPermissions?.map((p) => p?.recId));
    const selectedIds = new Set(selection.selectPermissions?.map((p) => p?.recId));

    const assigned = selection.selectPermissions
      .filter((p) => !originalIds.has(p?.recId))
      .map((p) => ({ ...p, granted: usedNoYes ? 2 : true }));

    const removed = selection.originalPermissions
      .filter((p) => !selectedIds.has(p?.recId))
      .map((p) => ({ ...p, granted: usedNoYes ? 1 : false }));

    return [...assigned, ...removed];
  }, [selection.selectPermissions, selection.originalPermissions, usedNoYes]);

  const handleSaveChanges = () => {
    const permissionsEdited = assignOrRemovePermissions.map((perm) => ({
      [keyRecId]: recId,
      permissionRecId: perm.recId,
      granted: perm.granted,
    }));
    Api.post(`${apiPage}/${apiSaveAll}`, permissionsEdited)
      .then((res) => {
        if (res.status === 200) {
          selection.setOriginalPermissions(selection.selectPermissions);
          toast.success(<TranslationText page="userPermissions" title="successfullyEdit" />);
        }
      })
      .catch((error) => {
        toast.error(<TranslationText title={error?.details || "genericError"} page="General" />);
      });
  };

  const handleSetDefaultPermissions = async () => {
    try {
      setIsLoading(true);
      const res = await Api.post(`/User/SetDefaultPermissions?userId=${recId}`);
      if (res.status === 200) {
        toast.success(<TranslationText page="userPermissions" title="successfullyDefaulted" />);
        await getAllUserPermissionByUserId(setIsLoading);
      }
    } catch (error) {
      toast.error(<TranslationText title={error?.details || "genericError"} page="General" />);
    } finally {
      setIsLoading(false);
    }
  };

  const AllAreas = modules;

  const renderTable = (pages, actions) => (
    <div className="border border-borderColorDark dark:border-borderColor border-opacity-20 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table min-w-max w-full">
          <thead className="sticky top-0 bg-[#F8F9FD] dark:bg-bgWhiteDark z-10">
            <tr className="divide-x rtl:divide-x-reverse divide-borderColorDark dark:divide-borderColor divide-opacity-10 border-b border-borderColor dark:border-borderColorDark">
              <th className="p-2 text-center text-textColor dark:text-textColorDark font-bold text-[0.8rem]"><TranslationText page="userPermissions" title="page" /></th>
              <th className="p-2 text-center w-24 text-textColor dark:text-textColorDark font-bold text-[0.8rem]"><TranslationText page="userPermissions" title="selectAll" /></th>
              {actions.map((act, i) => (
                <th className="p-2 text-center min-w-[80px] text-textColor dark:text-textColorDark font-bold text-[0.8rem]" key={i}>
                  <TranslationText page="userPermissions" title={act} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pages?.map((page, indexPage) => {
              /**
               * SOLID Principle (Single Responsibility):
               * We determine the row's selection state once and reuse it.
               * This avoids redundant calculations and makes the code cleaner.
               */
              const isFullySelected = selection.isPageFullySelected(page, actions);
              
              return (
              <tr 
                key={indexPage} 
                className={`divide-x rtl:divide-x-reverse divide-borderColorDark dark:divide-borderColor divide-opacity-10 transition-colors duration-150 ${isFullySelected ? "selected" : ""}`}
              >
                {/* 
                  Documentation:
                  Each row represents a 'ResourcePage' (e.g., "Users", "Roles").
                  The first column is the translated page title.
                */}
                <td className="text-[0.8rem] p-2 text-titleColor dark:text-titleColorDark font-bold text-center">
                  <TranslationText page={page?.ResourcePage} title="title" />
                </td>

                {/* 
                  Select All Column:
                  Toggles all actions (View, Edit, Delete, etc.) for this specific page.
                */}
                <td className="p-2 w-24">
                  <div className="flex justify-center">
                    <CustomCheckbox
                      disabled={!isAllowedAssignPermissions}
                      value={isFullySelected}
                      checked={isFullySelected}
                      onChange={() => selection.toggleSelectAllForPage(page, actions)}
                    />
                  </div>
                </td>

                {/* 
                  Action Columns (View, Edit, etc.):
                  We map through the available 'actions' and match them with the user's current permissions.
                */}
                {actions.map((act, i) => {
                  const matchedItem = selection.getMatchedPermissions(page, [act])[0];
                  const isChecked = matchedItem ? selection.selectPermissions.some(p => p.recId === matchedItem.recId) : false;
                  return (
                    <td key={i} className="p-2">
                       <div className="flex justify-center">
                        {matchedItem && (
                          <CustomCheckbox
                            disabled={!isAllowedAssignPermissions}
                            value={isChecked}
                            checked={isChecked}
                            onChange={() => selection.togglePermission(matchedItem)}
                          />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isLoading) return <Loader />;

  return (
    <div className={"permissions-log-container " + className}>
      <div className="permissions-header flex justify-between items-center px-4 py-4 border-b border-borderColor dark:border-borderColorDark mb-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          {isAllowedAssignPermissions && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="select-all-wrapper-left"
              data-tooltip-id="global-tooltip"
              data-tooltip-content="selectAll"
              data-tooltip-place="bottom"
              data-resource-page="General"
            >
              <CustomCheckbox
                className="gap-0"
                checked={selection.isModuleFullySelected({ subItems: AllAreas })}
                onChange={() => selection.toggleAllModulesSelection(AllAreas)}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <h2 className="text-[1.rem] font-bold text-titleColor dark:text-titleColorDark flex items-center gap-2">
              <TranslationText page={ResourcePage} title="permissionsTitle" />
            </h2>
            {selection.selectPermissions.length > 0 && (
              <span className="bg-primary text-white w-6 h-6 flex justify-center items-center text-[10px] font-bold rounded-full shadow-sm">
                {selection.selectPermissions.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {assignOrRemovePermissions.length > 0 && isAllowedAssignPermissions && (
              <SaveAndCancelChanges
                handleSaveAllChanges={handleSaveChanges}
                handleClearAll={() => selection.setSelectPermissions([...selection.originalPermissions])}
                currentLanguage={currentLanguage}
              />
            )}
            {getAllUserPermissionByUserId && isAllowedUserSetDefaultPermissions && (
              <>
                <button
                  onClick={handleSetDefaultPermissions}
                  className="h-9 w-9 rounded-full flex justify-center items-center text-titleColor dark:text-titleColorDark bg-white dark:bg-bgColorDark hover:bg-gray-50 transition-all shadow-sm border border-borderColor dark:border-borderColorDark"
                  data-tooltip-id="global-tooltip"
                  data-tooltip-content="ResetDefault"
                  data-tooltip-place="bottom"
                  data-resource-page="General"
                  type="button"
                >
                  <RotatedArrowIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <span className="total-count-text text-[0.85rem] font-bold text-titleColor dark:text-titleColorDark">
            <TranslationText page="userPermissions" title="countPermissions" /> : {dataGrid?.length || 0}
          </span>
        </div>
      </div>
      
      {AllAreas?.map((module, indexModule) => (
        <CustomAccordion
          key={indexModule}
          isFooter={false}
          className="module-accordion bg-bgWhite dark:bg-bgWhiteDark rounded-lg mb-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
          toggleClick={() => setOpenAccordion(openAccordion === module.keyModule ? null : module.keyModule)}
          open={openAccordion === module.keyModule}
          icon={module.icon}
          title={module.title}
          ResourcePage="General"
          checkedAll={selection.isModuleFullySelected(module)}
          onClickSelectAll={isAllowedAssignPermissions ? () => selection.toggleSelectAllForModule(module) : null}
          countSelected={selection.getSelectedCountInModule(module)}
        >
          <div className="module-content p-4 bg-white dark:bg-bgWhiteDark rounded-b-lg">
            {module.subItems && module.subItems.length > 0 && (
              <>
                {/* Render pages that don't belong to any subModule */}
                {module.subItems.filter(item => !item.subItems).length > 0 && (
                  <div className="mb-4">
                    {renderTable(
                      module.subItems.filter(item => !item.subItems), 
                      selection.getActionsForPages(module.subItems.filter(item => !item.subItems))
                    )}
                  </div>
                )}
                
                {/* Render subModules */}
                {module.subItems.filter(item => item.subItems).map((sub, idx) => (
                  <CustomAccordion
                    key={idx}
                    isFooter={false}
                    className="submodule-accordion border border-borderColorDark border-opacity-10 mb-2"
                    title={sub.title}
                    ResourcePage="General"
                    checkedAll={selection.isSubModuleFullySelected(sub)}
                    onClickSelectAll={isAllowedAssignPermissions ? () => selection.toggleSelectAllForSubModule(sub) : null}
                    countSelected={selection.getSelectedCountInModule(sub)}
                    toggleClick={() => setOpenAccordionSub(openAccordionSub === sub.keyModule ? null : sub.keyModule)}
                    open={openAccordionSub === sub.keyModule}
                  >
                      <div className="p-2">
                        {renderTable(sub.subItems, selection.getActionsForPages(sub.subItems))}
                      </div>
                  </CustomAccordion>
                ))}
              </>
            )}
          </div>
        </CustomAccordion>
      ))}
    </div>
  );
}
