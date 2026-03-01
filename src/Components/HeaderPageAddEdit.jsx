/**
 * @fileoverview HeaderPageAddEdit Component
 *
 * Phase 1 refactor: Extracted workflow logic into useWorkflowActions,
 * transaction logic into useTransactionActions.
 *
 * @see docs/07-action-plan.md#2-refactor-headerpageaddeditjsx
 * @see docs/05-solid-clean-architecture.md (SRP Violation 1)
 * @module Components/HeaderPageAddEdit
 */

import { useState, useMemo } from "react";
import TranslationText from "./TranslationText";
import {
  Approved,
  IconActiveBookmark,
  IconAddDoc,
  IconBookmark,
  IconCalculate,
  IconBack,
  IconDocumentView,
  IconEdit,
  IconNewTab,
  IconPost,
  IconReCall,
  IconRowActions,
  IconSave,
  IconSubmitted,
  IconTrash,
  IconTreeView,
  IconUnPost,
  Rejected,
  SearchDocumentIcon,
} from "../assets/Icons";
import CustomBtn from "./CustomBtn";
import { useDispatch, useSelector } from "react-redux";
import { addBookmark } from "../store/Reducers/bookmarkSlice";
import Generallist from "../ConfigData/Generallist.json";
import StatusList from "../ConfigData/StatusList.json";
import ViewerRec from "./ViewerRec";
import "../Styles/Components/HeaderPageAddEdit/HeaderPageAddEdit.css";
import parentEntityRoutes from "../ConfigData/ParentEntityRoutes.json";
import ConfirmationModal from "./ConfirmationModal";
import ModaRemoveBookmark from "./Layout/componentsNavbar/ModaRemoveBookmark";
import useDeviceType from "../Hooks/useDeviceType";
import HierarchyAll from "./HierarchyAll";
import { DataPagesHierarchyGrid } from "../ConfigData/DataPagesHierarchyGrid";
import ColumnsHeaderPage from "../ConfigData/ColumnsHeaderPage.json";
import useFullRouteChain from "../Hooks/useFullRouteChain";
import Config from "../utils/Config";
import { isActionWorkflow } from "../utils/isActionWorkflow";
import CustomTextarea from "./Form/CustomTextarea";
import ConfettiExplosion from "react-confetti-explosion";
import BottomSheet from "./BottomSheet";

// Phase 1 — extracted hooks
import useWorkflowActions from "../Hooks/useWorkflowActions";
import useTransactionActions from "../Hooks/useTransactionActions";

/**
 * HeaderPageAddEdit — Page header with contextual action buttons.
 *
 * Responsibilities (after Phase 1 refactor):
 *  1. Header rendering (title, breadcrumbs, status badge)
 *  2. Actions toolbar (built from `renderActionsList`)
 *  3. Mobile BottomSheet fallback
 *  4. Delegates workflow / transaction / delete logic to hooks (SRP)
 *
 * @param {string} option - Specifies whether the mode is "add" or "edit".
 * @param {number} id - The identifier for the item, used to determine if it's an existing item (for editing).
 * @param {string} ResourcePage - The name of the page for translation via the TranslationText component.
 * @param {number} statusId - The current status of the item, used to determine the status text and styling.
 * @param {string} titleAdd - The page title for add mode.
 * @param {string} titleEdit - The page title for edit mode.
 * @param {string} apiKey - API entity prefix (e.g. "PurchaseOrder").
 * @param {object} dataHeader - Employee data, displayed if not null.
 * @param {string} columnsKey - Key to lookup column definitions for `ViewerRec`.
 * @param {Function} goBackPrev - Custom go-back function (overrides default route chain back).
 * @param {Function} onSubmit - Callback function triggered when the "Save" or "Submit" button is clicked.
 * @param {boolean} viewOnly - If true, hides save/edit actions.
 * @param {boolean} isLoadingSubmit - Loading state for the save button.
 * @param {object} hierarchyAll - Config for hierarchy view modal (Api, key).
 * @param {boolean} showEditButton - Controls visibility of the edit icon/button.
 * @param {string} parentEntityKey - Key for parent entity routing logic.
 * @param {object} parentEntityValues - Values needed for parent entity route construction.
 * @param {boolean} isEdited - Disables actions if form is edited but not saved.
 * @param {Array} btnHeaderPage - Custom extra buttons configuration array.
 * @param {object} confiPage - Page configuration object (used for permissions like `subModule`).
 * @param {object} ErrorsKeys - Mapped keys for error logging navigation.
 * @param {boolean} errorListPage - If true, adjusts UI for error list context.
 * @param {object} data - Current record data (needed for status updates).
 * @param {Function} setData - Setter for local record data.
 * @param {Function} fetchData - Refetch function to update data after actions.
 * @param {boolean} isDelete - Controls visibility of the delete button.
 * @param {object} LevelsWorkFlow - Workflow levels data for approval logic.
 * @param {Function} setWorkFlowTransaction - Updates workflow state in parent.
 * @param {boolean} isCalculate - Controls visibility of the calculate button.
 * @param {Function} setReplayFetchLine - Trigger to refresh line items.
 * @param {boolean} isviewContract - Controls visibility of contract view button.
 * @param {Function} setViewContract - Setter for contract view toggle.
 * @param {boolean} viewContract - Current state of contract view toggle.
 * @param {string} fillApi - API endpoint for Fill action.
 * @param {boolean} isFill - If true, uses Fill logic instead of Calculate.
 */
export default function HeaderPageAddEdit({
  option,
  id,
  showBookmark = true,
  ResourcePage,
  statusId,
  titleAdd = "add",
  titleEdit = "edit",
  apiKey,
  dataHeader,
  columnsKey = "informationEmployee",
  goBackPrev,
  onSubmit,
  viewOnly,
  isLoadingSubmit,
  hierarchyAll = null,
  showEditButton = true,
  parentEntityKey = null,
  parentEntityValues,
  isEdited,
  btnHeaderPage = null,
  confiPage = "",
  ErrorsKeys = {
    key1: "name",
    key2: "code",
  },
  errorListPage = false,
  data,
  setData,
  fetchData = null,
  isDelete = true,
  LevelsWorkFlow,
  setWorkFlowTransaction,
  isCalculate = false,
  setReplayFetchLine,
  isviewContract,
  setViewContract,
  viewContract,
  fillApi = null,
  isFill = false,
}) {
  // -- Permissions -------------------------------------------------------
  const isAllowedDelete = Config.isAllow("Delete", confiPage);
  const isAllowedPost = Config.isAllow("Post", confiPage);
  const isAllowedUnPost = Config.isAllow("UnPost", confiPage);
  const isAllowedModify = Config.isAllow("Modify", confiPage);

  // -- Selectors / dispatch ----------------------------------------------
  const deviceType = useDeviceType();
  const { isBookmarkedEdit, bookmarkDataEdit } = useSelector(
    (state) => state.bookmarkSlice
  );

  // Current language logic (from main)
  const currentLanguage = useSelector(
    (state) => state.themeSlice.currentLanguage
  );
  const resourcesFromRedux = useSelector(
    (state) => state.resourcesSlice?.ReduxResources
  );
  const ReduxResources = useMemo(() => resourcesFromRedux || {}, [resourcesFromRedux]);

  const dispatch = useDispatch();

  // -- Derived data ------------------------------------------------------
  const statusName = Generallist?.WorkflowStatus?.find(
    (status) => status.value == statusId
  );
  const transactionName = Generallist.TransactionName?.find(
    (page) => page.label == confiPage?.keyPage
  );
  const canTakeAction = isActionWorkflow(
    LevelsWorkFlow?.data,
    isAllowedModify,
    statusId
  );

  let matchedKeys = {};
  if (data) {
    Object.entries(data).forEach(([dataKey, value]) => {
      Object.keys(ErrorsKeys).forEach((key) => {
        if (ErrorsKeys[key] === dataKey) {
          matchedKeys[key] = value;
        }
      });
    });
  }

  const { goBackInChain, openInNewTabErrorLog } = useFullRouteChain();

  // -- Extracted hooks ---------------------------------------------------
  const workflow = useWorkflowActions({
    apiKey,
    id,
    ResourcePage,
    transactionName,
    data,
    setData,
    fetchData,
    LevelsWorkFlow,
    setWorkFlowTransaction,
    canTakeAction,
    matchedKeys,
    openInNewTabErrorLog,
  });

  const transaction = useTransactionActions({
    apiKey,
    id,
    ResourcePage,
    data,
    setData,
    fetchData,
    matchedKeys,
    isFill,
    fillApi,
    setReplayFetchLine,
    goBackInChain,
  });

  // -- Local UI state (modals, bottom-sheet) -----------------------------
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModaPost, setShowModalPost] = useState(false);
  const [showModaSubmitted, setShowModaSubmitted] = useState(false);
  const [showModaCalculate, setShowModaCalculate] = useState(false);
  const [showModaReCall, setShowModaReCall] = useState(false);
  const [showModalHierarchyAll, setShowModalHierarchyAll] = useState(false);
  const [showModalUnPost, setShowModalUnPost] = useState(false);
  const [isVisibleRemoveBookmark, setIsVisibleRemoveBookmark] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);

  // -- Bookmark handler --------------------------------------------------
  const handleBookmarkToggle = () => {
    if (isBookmarkedEdit) {
      setIsVisibleRemoveBookmark(true);
    } else {
      dispatch(addBookmark(bookmarkDataEdit));
    }
  };

  // -- Bottom-sheet handlers ---------------------------------------------
  const handleOpenSheet = (item) => {
    setSelectedItem(item);
    setIsOpenBottomSheet(true);
  };
  const closeSheet = () => {
    setIsOpenBottomSheet(false);
    setSelectedItem(null);
  };

  // =====================================================================
  // Build the actions list
  // =====================================================================
  const renderActionsList = [];

  // Save
  if (
    onSubmit &&
    !viewOnly &&
    isAllowedModify &&
    (option !== "edit" || showEditButton)
  ) {
    renderActionsList.push({
      tooltip: "save",
      onClick: () => onSubmit(),
      className: "",
      isLoading: isLoadingSubmit,
      icon: <IconSave />,
    });
  }

  // Submit
  if (id > 0 && !viewOnly && isAllowedModify && statusId == "1") {
    renderActionsList.push({
      tooltip: "submit",
      onClick: () => setShowModaSubmitted(true),
      className: "",
      disabled: isEdited,
      icon: <IconSubmitted />,
    });
  }

  // ReCall
  if (
    id > 0 &&
    isAllowedModify &&
    statusId != "1" &&
    statusId != "999" &&
    statusId > 0
  ) {
    renderActionsList.push({
      tooltip: "reCall",
      ResourcePage: "General",
      onClick: () => setShowModaReCall(true),
      className: "",
      icon: <IconReCall />,
    });
  }

  // Approval
  if (id > 0 && canTakeAction?.show && statusId == "2") {
    renderActionsList.push({
      tooltip: "approval",
      onClick: () =>
        workflow.setApprovalsCycleModal({ show: true, type: "approval" }),
      className: "",
      icon: <Approved />,
    });
  }

  // Rejection
  if (id > 0 && canTakeAction?.show && statusId == "2") {
    renderActionsList.push({
      tooltip: "rejecte",
      onClick: () =>
        workflow.setApprovalsCycleModal({ show: true, type: "rejecte" }),
      className: "",
      icon: <Rejected />,
    });
  }

  // Calculate / Fill
  if (id > 0 && !viewOnly && isAllowedModify && isCalculate === true) {
    renderActionsList.push({
      tooltip: isFill ? "fill" : "calculate",
      onClick: () => setShowModaCalculate(true),
      className: "",
      disabled: isEdited,
      icon: <IconCalculate />,
    });
  }

  // Custom header buttons
  if (btnHeaderPage) {
    btnHeaderPage.forEach((btn) => {
      renderActionsList.push({
        tooltip: btn.tooltip,
        onClick: () => btn.onclick(),
        Resource: btn.ResourcePage,
        disabled: btn.isDisabled,
        className: "",
        icon: btn.icon,
      });
    });
  }

  // Post
  if (id > 0 && statusId == "3" && isAllowedPost) {
    renderActionsList.push({
      tooltip: "Post",
      onClick: () => setShowModalPost(true),
      className: "btn-secondary",
      disabled: isEdited,
      icon: <IconPost className="w-full h-full" />,
    });
  }

  // UnPost
  if (id > 0 && statusId == "999" && isAllowedUnPost) {
    renderActionsList.push({
      tooltip: "UnPost",
      onClick: () => setShowModalUnPost(true),
      className: "btn-secondary",
      icon: <IconUnPost className="w-full h-full" />,
    });
  }

  // Bookmark
  if (option === "edit" && id > 0 && showBookmark) {
    renderActionsList.push({
      tooltip: isBookmarkedEdit ? "removeBookmark" : "addBookmark",
      onClick: () => handleBookmarkToggle(),
      className: `btn_Header_End btn-default`,
      activeClassName: isBookmarkedEdit ? " Active" : "",
      disabled: false,
      isLoading: false,
      icon: isBookmarkedEdit ? (
        <IconActiveBookmark className="w-full h-full text-primary dark:text-primaryDark" />
      ) : (
        <IconBookmark className="w-full h-full" />
      ),
      Resource: "HeaderSystem",
      bookMarkBtn: true,
    });
  }

  // Hierarchy
  if (id > 0 && hierarchyAll != null) {
    renderActionsList.push({
      tooltip: "hierarchyAll",
      onClick: () => setShowModalHierarchyAll(true),
      className: "btn-primary",
      disabled: false,
      isLoading: false,
      icon: <IconTreeView className="w-full h-full" />,
    });
  }

  // Parent entity link
  if (parentEntityKey != null) {
    renderActionsList.push({
      tooltip: "parentEntityRoutes",
      onClick: () => {
        const routeTemplate =
          parentEntityRoutes[parentEntityKey][
            parentEntityValues?.parentEntity
          ];
        const route = routeTemplate.replace(
          "0",
          parentEntityValues?.parentEntityRecId
        );
        window.open(route, "_blank");
      },
      className: "btn-default",
      disabled: false,
      isLoading: false,
      icon: <IconNewTab className="w-full h-full" />,
    });
  }

  // Delete
  if (
    id > 0 &&
    (confiPage?.subModule == "Transaction" ? statusId == "1" : true) &&
    isAllowedDelete &&
    isDelete
  ) {
    renderActionsList.push({
      tooltip: "delete",
      onClick: () => setShowModalDelete(true),
      className: "delete_icon",
      disabled: false,
      isLoading: false,
      icon: <IconTrash className="w-full h-full" />,
    });
  }

  // Contract toggle
  if (isviewContract) {
    renderActionsList.push({
      tooltip: viewContract ? "Contract" : "Contract Document",
      onClick: () => setViewContract((prev) => !prev),
      className: "",
      icon: viewContract ? <IconDocumentView /> : <SearchDocumentIcon />,
    });
  }

  // Sort: Delete first, Save second, others after
  const getSortOrder = (tooltip) => {
    if (tooltip === "delete") return 1;
    if (tooltip === "save") return 2;
    return 3;
  };
  const sortedActionsList = [...renderActionsList].sort(
    (a, b) => getSortOrder(a.tooltip) - getSortOrder(b.tooltip)
  );

  // =====================================================================
  // Render helpers
  // =====================================================================
  const renderActions = () => (
    <>
      {sortedActionsList.map((btn, index) => (
        <CustomBtn
          key={index}
          type="button"
          disabled={btn.disabled}
          isLoading={btn.isLoading}
          onClick={btn.onClick}
          className={`btn_text_icon ${btn.className || ""} ${
            btn?.activeClassName || ""
          }`}
          icon={btn.icon}
          title={btn.tooltip}
          ResourcePage={btn?.Resource || "General"}
        />
      ))}
    </>
  );

  // =====================================================================
  // JSX
  // =====================================================================
  return (
    <>
      <div className="Header_Page">
        <div className="Header_container">
          {workflow.isFullyApproved ||
            (statusId == 3 && (
              <div className="absolute top-1/2 start-1/2">
                <ConfettiExplosion
                  height="100vh"
                  particleCount="250"
                  duration="3000"
                  width="1600"
                />
              </div>
            ))}

          {/* Header start: icon, title, status badge */}
          <div className="Header_Start">
            {deviceType !== "mobile" && (
              <div className="icon">
                {option === "edit" && id > 0 ? (
                  <IconEdit />
                ) : errorListPage ? (
                  ""
                ) : (
                  <IconAddDoc />
                )}
              </div>
            )}
            <h3 className="title text_ellipsis">
              <TranslationText
                page={ResourcePage}
                title={option === "edit" && id > 0 ? titleEdit : titleAdd}
              />
            </h3>
            {statusId && statusName && (
              <div
                className={`state_rec ${
                  StatusList?.WorkflowStatus?.[statusId] || ""
                }`}
              >
                <p className="status_text text_ellipsis">
                  <TranslationText
                    titleGenerallist={true}
                    enumName="WorkflowStatus"
                    title={statusName?.label}
                  />
                </p>
              </div>
            )}
          </div>

          {/* Header end: actions */}
          <div className="Header_End">
            {renderActionsList.length > 0 && deviceType === "mobile" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenSheet();
                }}
                className="btn_Header_End btn-primary"
                type="button"
              >
                <span className="icon_action">
                  <IconRowActions />
                </span>
              </button>
            )}
            {renderActionsList.length > 0 && deviceType === "mobile" ? (
              <BottomSheet isOpen={isOpenBottomSheet} closeSheet={closeSheet}>
                <div className="max-h-[70vh] overflow-y-auto Container_BottomSheet">
                  {renderActionsList.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.onClick(selectedItem);
                        closeSheet();
                      }}
                      className={`btn_action ${
                        action?.activeClassName || ""
                      }`}
                    >
                      <span className="icon_action">{action.icon}</span>
                      <span className="title_action">
                        <TranslationText
                          page={
                            action.Resource ? action.Resource : "General"
                          }
                          title={action.tooltip}
                        />
                      </span>
                    </button>
                  ))}
                </div>
              </BottomSheet>
            ) : (
              renderActions()
            )}

            <CustomBtn
              type="button"
              className="btn_text_icon"
              onClick={() =>
                goBackPrev != null ? goBackPrev() : goBackInChain()
              }
              icon={<IconBack />}
              title="back"
              ResourcePage="General"
            />
          </div>
        </div>

        {/* Viewer Record */}
        {dataHeader != null && columnsKey && (
          <ViewerRec
            columns={ColumnsHeaderPage[columnsKey]}
            ResourcePage={columnsKey}
            dataHeader={dataHeader}
          />
        )}
      </div>

      {/* ======================== Modals ======================== */}

      {/* Delete */}
      <ConfirmationModal
        isVisible={showModalDelete}
        ResourcePage={ResourcePage}
        type="delete"
        title="messageOneRemove"
        description="confirmOneDelete"
        icon={<IconTrash />}
        confirmButtonLabel="delete"
        onConfirm={() =>
          transaction.confirmDelete({
            onClose: () => setShowModalDelete(false),
          })
        }
        onCancel={() => setShowModalDelete(false)}
      />

      {/* Post / Submit / Calculate */}
      <ConfirmationModal
        isVisible={showModaPost || showModaSubmitted || showModaCalculate}
        ResourcePage={ResourcePage}
        type="primary"
        title={
          showModaSubmitted
            ? "messageSubmitted"
            : showModaCalculate
            ? "messageCalculate"
            : "messageOnePost"
        }
        description={
          showModaSubmitted
            ? "confirmSubmitted"
            : showModaCalculate
            ? "confirmCalculate"
            : "confirmOnePost"
        }
        ResourceBtns="General"
        icon={
          showModaSubmitted ? (
            <IconSubmitted />
          ) : showModaCalculate ? (
            <IconCalculate />
          ) : (
            <IconPost />
          )
        }
        confirmButtonLabel={
          showModaSubmitted
            ? "submitted"
            : showModaCalculate
            ? "calculate"
            : "Post"
        }
        onConfirm={() => {
          if (showModaSubmitted) {
            workflow.onToggleWorkflow({ action: "Submit" });
            setShowModaSubmitted(false);
          } else if (showModaCalculate) {
            transaction.onCalculate({
              onClose: () => setShowModaCalculate(false),
            });
          } else {
            transaction.handleTransactionAction({ action: "Post", setData });
            setShowModalPost(false);
          }
        }}
        onCancel={() => {
          setShowModaSubmitted(false);
          setShowModalPost(false);
          setShowModaCalculate(false);
          if (setReplayFetchLine) {
            setReplayFetchLine(false);
          }
        }}
      />

      {/* UnPost / ReCall */}
      <ConfirmationModal
        isVisible={showModalUnPost || showModaReCall}
        ResourcePage={ResourcePage}
        type="default"
        title={showModaReCall ? "manageReCall" : "messageOneUnPost"}
        description={showModaReCall ? "confirmReCall" : "confirmOneUnPost"}
        icon={showModaReCall ? <IconReCall /> : <IconUnPost />}
        confirmButtonLabel={showModaReCall ? "reCall" : "unPosted"}
        onConfirm={() => {
          if (showModaReCall) {
            workflow.onToggleWorkflow({ action: "ReCall" });
            setShowModaReCall(false);
          } else {
            transaction.handleTransactionAction({
              action: "UnPost",
              setData,
            });
            setShowModalUnPost(false);
          }
        }}
        onCancel={() => {
          setShowModalUnPost(false);
          setShowModaReCall(false);
        }}
      />

      {/* Approval / Rejection cycle */}
      <ConfirmationModal
        isVisible={workflow.approvalsCycleModal?.show}
        onCancel={() => workflow.onCancelApproval()}
        icon={
          workflow.approvalsCycleModal?.type === "approval" ? (
            <Approved />
          ) : (
            <Rejected />
          )
        }
        type={
          workflow.approvalsCycleModal?.type === "approval"
            ? "primary"
            : "delete"
        }
        description={
          workflow.approvalsCycleModal?.type === "approval"
            ? "descriptionApproved"
            : "descriptionRejected"
        }
        subTitle={`${ResourcePage}?.title`}
        ResourcePage="General"
        isLoadingBtn={workflow.isLoadingApprovalsCycle}
        title={
          workflow.approvalsCycleModal?.type === "approval"
            ? "approval"
            : "rejecte"
        }
        confirmButtonLabel={
          workflow.approvalsCycleModal?.type === "approval"
            ? "approval"
            : "rejecte"
        }
        onConfirm={() =>
          workflow.onApprovalsCycle(workflow.approvalsCycleModal?.type)
        }
      >
        <div className="mt-4 ConfirmationModal_approved">
          <CustomTextarea
            label="comment"
            ResourcePage="GeneralField"
            placeholder="pleaseEnterComment"
            value={workflow.comment}
            onChange={(e) => workflow.setComment(e.target.value)}
          />
        </div>
      </ConfirmationModal>

      {/* Remove bookmark */}
      {/* Remove bookmark */}
      <ModaRemoveBookmark
        isOpen={isVisibleRemoveBookmark}
        onConfirm={() => {
            dispatch(addBookmark(bookmarkDataEdit));
            setIsVisibleRemoveBookmark(false);
        }}
        onClose={() => setIsVisibleRemoveBookmark(false)}
      />

      {/* Hierarchy */}
      {hierarchyAll != null && (
        <HierarchyAll
          isVisible={showModalHierarchyAll}
          toggleClick={() => setShowModalHierarchyAll(false)}
          ResourcePage={ResourcePage}
          HierarchyApi={hierarchyAll?.ApiHierarchyAll}
          DataPage={DataPagesHierarchyGrid[hierarchyAll?.key]}
        />
      )}
    </>
  );
}
