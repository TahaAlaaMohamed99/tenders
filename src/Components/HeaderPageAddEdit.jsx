<<<<<<< refactor
/**
 * @fileoverview HeaderPageAddEdit Component
 *
 * Phase 1 refactor: Extracted workflow logic into useWorkflowActions,
 * transaction logic into useTransactionActions.
 * Modals remain inline but logic is fully delegated to hooks.
 *
 * @see docs/07-action-plan.md#2-refactor-headerpageaddeditjsx
 * @see docs/05-solid-clean-architecture.md (SRP Violation 1)
 * @module Components/HeaderPageAddEdit
 */

import React, { useState } from "react";
=======
import React, { useEffect, useState, useMemo } from "react";
>>>>>>> main
import TranslationText from "./TranslationText";
import {
  Approved,
  IconActiveBookmark,
  IconAddDoc,
  IconBookmark,
  IconCalculate,
<<<<<<< refactor
=======
  IconColsed,
>>>>>>> main
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
<<<<<<< refactor
=======
  IconValidatePost,
  IconValidateUnpost,
>>>>>>> main
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
<<<<<<< refactor
=======
import { toast } from "react-toastify";
import { Api } from "../services/Api";
>>>>>>> main
import ModaRemoveBookmark from "./Layout/componentsNavbar/ModaRemoveBookmark";
import useDeviceType from "../Hooks/useDeviceType";
import HierarchyAll from "./HierarchyAll";
import { DataPagesHierarchyGrid } from "../ConfigData/DataPagesHierarchyGrid";
import ColumnsHeaderPage from "../ConfigData/ColumnsHeaderPage.json";
<<<<<<< refactor
import useFullRouteChain from "../Hooks/useFullRouteChain";
import Config from "../utils/Config";
=======
import useTranslationText from "../Hooks/useTranslationText";
import useFullRouteChain from "../Hooks/useFullRouteChain";
import Config from "../utils/Config";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import useHandleDelete from "../Hooks/useHandleDelete";
>>>>>>> main
import { isActionWorkflow } from "../utils/isActionWorkflow";
import CustomTextarea from "./Form/CustomTextarea";
import ConfettiExplosion from "react-confetti-explosion";
import BottomSheet from "./BottomSheet";
<<<<<<< refactor

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
 *  4. Delegates workflow / transaction / delete logic to hooks
 *
 * @param {string}  option           - "add" | "edit"
 * @param {number}  id               - Record id
 * @param {string}  ResourcePage     - Translation namespace
 * @param {number}  statusId         - Workflow status id
 * @param {Object}  dataHeader       - ViewerRec data
 * @param {Function} onSubmit        - Save callback
 * …see previous JSDoc for full prop list
=======
import signalRService from "../services/signalRService";

/**
 * HeaderPageAddEdit Component:
 * This component renders the page header with action buttons based on the current mode (add or edit).
 *
 * @param {string} option - Specifies whether the mode is "add" or "edit".
 * @param {number} id - The identifier for the item, used to determine if it's an existing item (for editing).
 * @param {string} ResourcePage - The name of the page for translation via the TranslationText component.
 * @param {number} statusId - The current status of the item, used to determine the status text and styling.
 * @param {string} titleAdd - The page title for add mode.
 * @param {string} titleEdit - The page title for edit mode.
 * @param {object} dataHeader - Employee data, displayed if not null.
 * @param {Function} onSubmit - Callback function triggered when the "Save" or "Submit" button is clicked.
>>>>>>> main
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
<<<<<<< refactor
  ErrorsKeys = { key1: "name", key2: "code" },
=======
  ErrorsKeys = {
    key1: "name",
    key2: "code",
  },
>>>>>>> main
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
<<<<<<< refactor
  // -- Permissions -------------------------------------------------------
=======
>>>>>>> main
  const isAllowedDelete = Config.isAllow("Delete", confiPage);
  const isAllowedPost = Config.isAllow("Post", confiPage);
  const isAllowedUnPost = Config.isAllow("UnPost", confiPage);
  const isAllowedModify = Config.isAllow("Modify", confiPage);
<<<<<<< refactor

  // -- Selectors / dispatch ----------------------------------------------
  const deviceType = useDeviceType();
  const { isBookmarkedEdit, bookmarkDataEdit } = useSelector(
    (state) => state.bookmarkSlice
  );
  const dispatch = useDispatch();

  // -- Derived data ------------------------------------------------------
  const statusName = Generallist?.WorkflowStatus?.find(
    (status) => status.value == statusId
  );
=======
  const deviceType = useDeviceType();
  // Extract specific properties from the Redux store using useSelector.
  const { isBookmarkedEdit, bookmarkDataEdit } = useSelector(
    (state) => state.bookmarkSlice
  );
  // Current language logic
  const currentLanguage = useSelector(
    (state) => state.themeSlice.currentLanguage
  );
  const resourcesFromRedux = useSelector(
    (state) => state.resourcesSlice?.ReduxResources
  );
  const ReduxResources = useMemo(() => resourcesFromRedux || {}, [resourcesFromRedux]);
  const { handleSubmitFormPost } = useHandleSubmit();
  const { handleDelete } = useHandleDelete();

  // Initialize the useDispatch hook to dispatch Redux actions.
  const dispatch = useDispatch();
  // Filters the status name based on the statusId (safe access)
  const statusName = Generallist?.WorkflowStatus?.find(
    (status) => status.value == statusId
  );

  //
  const { goBackInChain, openInNewTabErrorLog } = useFullRouteChain();

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModaPost, setShowModalPost] = useState(false);
  const [showModaSubmitted, setShowModaSubmitted] = useState(false);
  const [showModaCalculate, setShowModaCalculate] = useState(false);

  const [showModaReCall, setShowModaReCall] = useState(false);
  const [showModalHierarchyAll, setShowModalHierarchyAll] = useState(false);
  const [showModalUnPost, setShowModalUnPost] = useState(false);
  const [isVisibleRemoveBookmark, setIsVisibleRemoveBookmark] = useState(false);
  const [deleteBookmark, setDeleteBookmark] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  const [isLoadingValidate, setIsLoadingValidate] = useState(false);
  const [isLoadingApprovalsCycle, setIsLoadingApprovalsCycle] = useState(false);
  const [isFullyApproved, setIsFullyApproved] = useState(false);
  const [approvalsCycleModal, setApprovalsCycleModal] = useState({
    show: false,
    type: "",
  });
  const [comment, setComment] = useState("");

>>>>>>> main
  const transactionName = Generallist.TransactionName?.find(
    (page) => page.label == confiPage?.keyPage
  );
  const canTakeAction = isActionWorkflow(
    LevelsWorkFlow?.data,
    isAllowedModify,
    statusId
  );
<<<<<<< refactor

=======
>>>>>>> main
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
<<<<<<< refactor

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
  const [deleteBookmark, setDeleteBookmark] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);

  // -- Bookmark handler --------------------------------------------------
  const handleBookmarkToggle = () => {
    if (isBookmarkedEdit) {
      setDeleteBookmark(bookmarkDataEdit);
      setIsVisibleRemoveBookmark(true);
    } else {
      dispatch(addBookmark(bookmarkDataEdit));
    }
  };

  // -- Bottom-sheet handlers ---------------------------------------------
=======
  const onCalculate = () => {
    const url = isFill ? `${fillApi}/${id}` : `${apiKey}/Calculate?id=${id}`;

    Api.post(url)
      .then((res) => {
        if (res?.data?.success) {
          toast.success(
            <TranslationText
              page={ResourcePage}
              title={res?.data?.message || "calculateSuccess"}
            />
          );
          setReplayFetchLine(true);
          setShowModaCalculate(false);
        }
      })
      .catch(() => {
        toast.error(
          <TranslationText page={ResourcePage} title="calculateError" />
        );
        setShowModaCalculate(false);
      });
  };

  const onToggleWorkflow = ({ action }) => {
    Api.post(`${apiKey}/${action}`, {
      transactionName: transactionName?.value,
      transcationRecId: Number(id),
    })
      .then((res) => {
        toast.success(
          <TranslationText
            title={
              action == "ReCall"
                ? "reCalledSuccessfully"
                : "submittedSuccessfully"
            }
            page={ResourcePage}
          />
        );
        if (action == "ReCall") {
          setData({ ...data, status: 1 });
        } else {
          setData({ ...data, status: res.data, isSendNotification: true });
          if (fetchData) {
            fetchData();
          }
        }
      })
      .catch((err) => {
        if (err?.details?.errorMessage) {
          openInNewTabErrorLog("/ErrorList", {
            errors: err.details.errorMessage,
            prevRoute: window.location.pathname,
            ResourcePage,
            ErrorsKeys: matchedKeys,
          });
        }
        toast.error(
          <TranslationText
            title={action == "ReCall" ? "reCalledFailed" : "submittedFailed"}
            page={ResourcePage}
          />
        );
      });
  };

  const onCancelApproval = () => {
    setApprovalsCycleModal({
      show: false,
      type: "",
    });
    setComment();
  };

  const onApprovalsCycle = (type) => {
    const dataLevel = canTakeAction?.level;
    setIsLoadingApprovalsCycle(true);
    const sendData = {
      recId: dataLevel?.recId,
      transactionName: transactionName?.value,
      comment: comment || null,
      name: "",
      status: type == "approval" ? 2 : 3,
    };
    Api.put("WorkFlowTransactionLog/UpdateStatusLevel", sendData)
      .then((res) => {
        const resData = res.data;
        if (resData.message == 200) {
          if (
            type == "approval" &&
            dataLevel?.levelNumber == LevelsWorkFlow.total
          ) {
            Api.post(
              `${apiKey}/ChangeStatusToFullyApproved?TransactionRecId=${id}&TransactionName=${transactionName?.value}`
            )
              .then((Response) => {
                onCancelApproval();
                setIsLoadingApprovalsCycle(false);
                toast.success(
                  <TranslationText
                    page="General"
                    title="successfullyApproval"
                  />
                );
                setIsFullyApproved(true);
                setData({ ...data, status: 3 });
              })
              .catch((err) => {
                toast.error(
                  <TranslationText page="General" title="failedApproval" />
                );
              });
          } else if (type == "rejecte") {
            Api.post(
              `${apiKey}/ChangeStatusToRejected?TransactionRecId=${id}&TransactionName=${transactionName?.value}`
            )
              .then((Response) => {
                setData({ ...data, status: 4 });
                onCancelApproval();
                setIsLoadingApprovalsCycle(false);
                toast.success(
                  <TranslationText
                    page="General"
                    title="successfullyRejected"
                  />
                );
              })
              .catch((err) => {
                toast.error(
                  <TranslationText page="General" title="failedRejected" />
                );
              });
          } else {
            const upDataWorkFlowTransaction = {
              data: LevelsWorkFlow?.data.map((item) =>
                item.recId === dataLevel.recId ? { ...item, status: 2 } : item
              ),
              total: LevelsWorkFlow?.total,
            };
            const sendNotificationData = upDataWorkFlowTransaction?.data?.find(
              (item) => item.status === 1
            );
            signalRService.sendNotification(
              sendNotificationData?.userRecId,
              sendNotificationData?.tranasctionRecId,
              sendNotificationData?.transactionName,
              data?.code,
              1
            );
            setWorkFlowTransaction(upDataWorkFlowTransaction);
            onCancelApproval();
            toast.success(
              <TranslationText page="General" title="successfullyApproval" />
            );
            setIsLoadingApprovalsCycle(false);
          }
        } else {
          toast.error(resData.messageText);
          onCancelApproval();
          setIsLoadingApprovalsCycle(false);
          window.location.reload();
        }
      })
      .catch((error) => {
        setIsLoadingApprovalsCycle(false);
        onCancelApproval();
        window.location.reload();
        toast.error(
          <TranslationText
            page="General"
            title={type == "approval" ? "failedApproval" : "failedRejected"}
          />
        );
      });
  };
  const ConfirmDelete = async () => {
    await handleDelete({
      apiPage: apiKey,
      recId: id,
      resourcePage: ResourcePage,
      onSuccess: () => {
        goBackInChain();
      },
    });
    setShowModalDelete(false);
  };
  const handleTransactionAction = ({ action, setData }) => {
    handleSubmitFormPost(
      apiKey,
      action,
      id,
      ResourcePage,
      action == "ValidatePost" || action == "ValidateUnPost"
        ? setIsLoadingValidate
        : null,
      data,
      (ErrorsKeys = matchedKeys),
      setData ? setData : null,
      action == "Post" || action == "UnPost" ? fetchData : null
    );
  };
>>>>>>> main
  const handleOpenSheet = (item) => {
    setSelectedItem(item);
    setIsOpenBottomSheet(true);
  };
  const closeSheet = () => {
    setIsOpenBottomSheet(false);
    setSelectedItem(null);
  };

<<<<<<< refactor
  // =====================================================================
  // Build the actions list
  // =====================================================================
  const renderActionsList = [];

  // Save
=======
  // Toggles the bookmark state (add or remove)
  const handleBookmarkToggle = () => {
    if (isBookmarkedEdit) {
      setDeleteBookmark(bookmarkDataEdit);
      setIsVisibleRemoveBookmark(true);
    } else {
      dispatch(addBookmark(bookmarkDataEdit));
    }
  };
  const renderActionsList = [];
>>>>>>> main
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
<<<<<<< refactor

  // Submit
=======
>>>>>>> main
  if (id > 0 && !viewOnly && isAllowedModify && statusId == "1") {
    renderActionsList.push({
      tooltip: "submit",
      onClick: () => setShowModaSubmitted(true),
      className: "",
      disabled: isEdited,
<<<<<<< refactor
      icon: <IconSubmitted />,
    });
  }

  // ReCall
=======

      icon: <IconSubmitted />,
    });
  }
>>>>>>> main
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
<<<<<<< refactor

  // Approval
=======
>>>>>>> main
  if (id > 0 && canTakeAction?.show && statusId == "2") {
    renderActionsList.push({
      tooltip: "approval",
      onClick: () =>
<<<<<<< refactor
        workflow.setApprovalsCycleModal({ show: true, type: "approval" }),
=======
        setApprovalsCycleModal({
          show: true,
          type: "approval",
        }),
>>>>>>> main
      className: "",
      icon: <Approved />,
    });
  }
<<<<<<< refactor

  // Rejection
=======
>>>>>>> main
  if (id > 0 && canTakeAction?.show && statusId == "2") {
    renderActionsList.push({
      tooltip: "rejecte",
      onClick: () =>
<<<<<<< refactor
        workflow.setApprovalsCycleModal({ show: true, type: "rejecte" }),
=======
        setApprovalsCycleModal({
          show: true,
          type: "rejecte",
        }),
>>>>>>> main
      className: "",
      icon: <Rejected />,
    });
  }
<<<<<<< refactor

  // Calculate / Fill
  if (id > 0 && !viewOnly && isAllowedModify && isCalculate === true) {
=======
  if (id > 0 && !viewOnly && isAllowedModify && isCalculate == true) {
>>>>>>> main
    renderActionsList.push({
      tooltip: isFill ? "fill" : "calculate",
      onClick: () => setShowModaCalculate(true),
      className: "",
      disabled: isEdited,
      icon: <IconCalculate />,
    });
  }
<<<<<<< refactor

  // Custom header buttons
  if (btnHeaderPage) {
    btnHeaderPage.forEach((btn) => {
=======
  if (btnHeaderPage) {
    btnHeaderPage.map((btn) => {
>>>>>>> main
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
<<<<<<< refactor

  // Post
=======
>>>>>>> main
  if (id > 0 && statusId == "3" && isAllowedPost) {
    renderActionsList.push({
      tooltip: "Post",
      onClick: () => setShowModalPost(true),
      className: "btn-secondary",
      disabled: isEdited,
      icon: <IconPost className="w-full h-full" />,
    });
  }
<<<<<<< refactor

  // UnPost
=======
>>>>>>> main
  if (id > 0 && statusId == "999" && isAllowedUnPost) {
    renderActionsList.push({
      tooltip: "UnPost",
      onClick: () => setShowModalUnPost(true),
      className: "btn-secondary",
      icon: <IconUnPost className="w-full h-full" />,
    });
  }
<<<<<<< refactor

  // Bookmark
=======
  // if (id > 0 && statusId != "999" && statusId > 0) {
  //   renderActionsList.push({
  //     tooltip: "validatePost",
  //     onClick: () =>
  //       !isLoadingValidate &&
  //       !isEdited &&
  //       handleTransactionAction({ action: "ValidatePost" }),
  //     className: "",
  //     disabled: isEdited,
  //     isLoading: isLoadingValidate,
  //     icon: <IconValidatePost className="w-full h-full" />,
  //   });
  // }
  // if (id > 0 && statusId == "999" && statusId > 0) {
  //   renderActionsList.push({
  //     tooltip: "validateUnPost",
  //     onClick: () =>
  //       !isLoadingValidate &&
  //       handleTransactionAction({ action: "ValidateUnPost" }),
  //     className: "btn-secondary",
  //     disabled: isEdited,
  //     isLoading: isLoadingValidate,
  //     icon: <IconValidateUnpost className="w-full h-full" />,
  //   });
  // }
>>>>>>> main
  if (option === "edit" && id > 0 && showBookmark) {
    renderActionsList.push({
      tooltip: isBookmarkedEdit ? "removeBookmark" : "addBookmark",
      onClick: () => handleBookmarkToggle(),
<<<<<<< refactor
      className: `btn_Header_End btn-default`,
=======
      className: `btn_Header_End   btn-default`,
>>>>>>> main
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

<<<<<<< refactor
  // Hierarchy
=======
>>>>>>> main
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

<<<<<<< refactor
  // Parent entity link
=======
>>>>>>> main
  if (parentEntityKey != null) {
    renderActionsList.push({
      tooltip: "parentEntityRoutes",
      onClick: () => {
        const routeTemplate =
<<<<<<< refactor
          parentEntityRoutes[parentEntityKey][
            parentEntityValues?.parentEntity
          ];
=======
          parentEntityRoutes[parentEntityKey][parentEntityValues?.parentEntity];
>>>>>>> main
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
<<<<<<< refactor

  // Delete
  if (
    id > 0 &&
    (confiPage?.subModule === "Transaction" ? statusId == "1" : true) &&
=======
  if (
    id > 0 &&
    (confiPage?.subModule == "Transaction" ? statusId == "1" : true) &&
>>>>>>> main
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

<<<<<<< refactor
  // Contract toggle
=======
>>>>>>> main
  if (isviewContract) {
    renderActionsList.push({
      tooltip: viewContract ? "Contract" : "Contract Document",
      onClick: () => setViewContract((prev) => !prev),
      className: "",
      icon: viewContract ? <IconDocumentView /> : <SearchDocumentIcon />,
    });
  }
<<<<<<< refactor

  // Sort: Delete first, Save second, others after
=======
  // Sort actions: Delete first, Save second, others after
>>>>>>> main
  const getSortOrder = (tooltip) => {
    if (tooltip === "delete") return 1;
    if (tooltip === "save") return 2;
    return 3;
  };
<<<<<<< refactor
  const sortedActionsList = [...renderActionsList].sort(
    (a, b) => getSortOrder(a.tooltip) - getSortOrder(b.tooltip)
  );

  // =====================================================================
  // Render helpers
  // =====================================================================
=======
  
  const sortedActionsList = [...renderActionsList].sort((a, b) => 
    getSortOrder(a.tooltip) - getSortOrder(b.tooltip)
  );

>>>>>>> main
  const renderActions = () => (
    <>
      {sortedActionsList.map((btn, index) => (
        <CustomBtn
          key={index}
          type="button"
          disabled={btn.disabled}
          isLoading={btn.isLoading}
          onClick={btn.onClick}
<<<<<<< refactor
          className={`btn_text_icon ${btn.className || ""} ${
            btn?.activeClassName || ""
          }`}
=======
          className={`btn_text_icon ${btn.className || ''} ${btn?.activeClassName || ''}`}
>>>>>>> main
          icon={btn.icon}
          title={btn.tooltip}
          ResourcePage={btn?.Resource || "General"}
        />
      ))}
    </>
  );
<<<<<<< refactor

  // =====================================================================
  // JSX
  // =====================================================================
=======
>>>>>>> main
  return (
    <>
      <div className="Header_Page">
        <div className="Header_container">
<<<<<<< refactor
          {workflow.isFullyApproved ||
            (statusId == 3 && (
              <div className="absolute top-1/2 start-1/2">
=======
          {isFullyApproved ||
            (statusId == 3 && (
              <div className=" absolute top-1/2 start-1/2">
>>>>>>> main
                <ConfettiExplosion
                  height="100vh"
                  particleCount="250"
                  duration="3000"
                  width="1600"
                />
              </div>
            ))}

<<<<<<< refactor
          {/* Header start: icon, title, status badge */}
          <div className="Header_Start">
            {deviceType !== "mobile" && (
=======
          {/* Header start section with icon, title, and status */}
          <div className="Header_Start">
            {deviceType != "mobile" && (
>>>>>>> main
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
<<<<<<< refactor
                className={`state_rec ${
                  StatusList?.WorkflowStatus?.[statusId] || ""
                }`}
=======
                className={`state_rec ${StatusList?.WorkflowStatus?.[statusId] || ''}`}
>>>>>>> main
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

<<<<<<< refactor
          {/* Header end: actions */}
          <div className="Header_End">
            {renderActionsList.length > 0 && deviceType === "mobile" && (
=======
          <div className="Header_End">
            {renderActionsList.length > 0 && deviceType == "mobile" && (
>>>>>>> main
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
<<<<<<< refactor
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
=======
            {renderActionsList.length > 0 && deviceType == "mobile" ? (
              <>
                <BottomSheet isOpen={isOpenBottomSheet} closeSheet={closeSheet}>
                  <div className="max-h-[70vh] overflow-y-auto  Container_BottomSheet">
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
                            page={action.Resource ? action.Resource : "General"}
                            title={action.tooltip}
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                </BottomSheet>
              </>
>>>>>>> main
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
<<<<<<< refactor

        {/* Viewer Record */}
=======
        {/* Viewer Record Component */}
>>>>>>> main
        {dataHeader != null && columnsKey && (
          <ViewerRec
            columns={ColumnsHeaderPage[columnsKey]}
            ResourcePage={columnsKey}
            dataHeader={dataHeader}
          />
        )}
      </div>
<<<<<<< refactor

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
=======
      <ConfirmationModal
        isVisible={showModalDelete}
        ResourcePage={ResourcePage}
        type={"delete"}
        title={"messageOneRemove"}
        description="confirmOneDelete"
        icon={<IconTrash />}
        confirmButtonLabel="delete"
        onConfirm={() => ConfirmDelete()}
        onCancel={() => {
          setShowModalDelete(false);
        }}
      />
      <ConfirmationModal
        isVisible={showModaPost || showModaSubmitted || showModaCalculate}
        ResourcePage={ResourcePage}
        type={"primary"}
>>>>>>> main
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
<<<<<<< refactor
            workflow.onToggleWorkflow({ action: "Submit" });
            setShowModaSubmitted(false);
          } else if (showModaCalculate) {
            transaction.onCalculate({
              onClose: () => setShowModaCalculate(false),
            });
          } else {
            transaction.handleTransactionAction({ action: "Post", setData });
=======
            onToggleWorkflow({ action: "Submit" });
            setShowModaSubmitted(false);
          } else if (showModaCalculate) {
            onCalculate();
          } else {
            handleTransactionAction({ action: "Post", setData });
>>>>>>> main
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
<<<<<<< refactor

      {/* UnPost / ReCall */}
      <ConfirmationModal
        isVisible={showModalUnPost || showModaReCall}
        ResourcePage={ResourcePage}
        type="default"
=======
      <ConfirmationModal
        isVisible={showModalUnPost || showModaReCall}
        ResourcePage={ResourcePage}
        type={"default"}
>>>>>>> main
        title={showModaReCall ? "manageReCall" : "messageOneUnPost"}
        description={showModaReCall ? "confirmReCall" : "confirmOneUnPost"}
        icon={showModaReCall ? <IconReCall /> : <IconUnPost />}
        confirmButtonLabel={showModaReCall ? "reCall" : "unPosted"}
        onConfirm={() => {
          if (showModaReCall) {
<<<<<<< refactor
            workflow.onToggleWorkflow({ action: "ReCall" });
            setShowModaReCall(false);
          } else {
            transaction.handleTransactionAction({
              action: "UnPost",
              setData,
            });
=======
            onToggleWorkflow({ action: "ReCall" });
            setShowModaReCall(false);
          } else {
            handleTransactionAction({ action: "UnPost", setData });
>>>>>>> main
            setShowModalUnPost(false);
          }
        }}
        onCancel={() => {
          setShowModalUnPost(false);
          setShowModaReCall(false);
        }}
      />
<<<<<<< refactor

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
=======
      <ConfirmationModal
        isVisible={approvalsCycleModal?.show}
        onCancel={() => onCancelApproval()}
        icon={
          approvalsCycleModal?.type == "approval" ? <Approved /> : <Rejected />
        }
        type={approvalsCycleModal?.type == "approval" ? "primary" : "delete"}
        description={
          approvalsCycleModal?.type == "approval"
>>>>>>> main
            ? "descriptionApproved"
            : "descriptionRejected"
        }
        subTitle={`${ResourcePage}?.title`}
        ResourcePage="General"
<<<<<<< refactor
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
=======
        isLoadingBtn={isLoadingApprovalsCycle}
        title={approvalsCycleModal?.type == "approval" ? "approval" : "rejecte"}
        confirmButtonLabel={
          approvalsCycleModal?.type == "approval" ? "approval" : "rejecte"
        }
        onConfirm={() => onApprovalsCycle(approvalsCycleModal?.type)}
>>>>>>> main
      >
        <div className="mt-4 ConfirmationModal_approved">
          <CustomTextarea
            label="comment"
            ResourcePage="GeneralField"
            placeholder="pleaseEnterComment"
<<<<<<< refactor
            value={workflow.comment}
            onChange={(e) => workflow.setComment(e.target.value)}
          />
        </div>
      </ConfirmationModal>

      {/* Remove bookmark */}
      <ModaRemoveBookmark
        isOpen={isVisibleRemoveBookmark}
        onConfirm={() => {
          // Bookmark removal handled via Redux dispatch
          setIsVisibleRemoveBookmark(false);
        }}
        onClose={() => setIsVisibleRemoveBookmark(false)}
      />

      {/* Hierarchy */}
=======
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </ConfirmationModal>
      <ModaRemoveBookmark
        isVisibleRemoveBookmark={isVisibleRemoveBookmark}
        deleteBookmark={deleteBookmark}
        onCancel={() => setIsVisibleRemoveBookmark(false)}
      />
>>>>>>> main
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
