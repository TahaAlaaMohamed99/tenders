import React, { useEffect, useState, useMemo } from "react";
import TranslationText from "./TranslationText";
import {
  Approved,
  IconActiveBookmark,
  IconAddDoc,
  IconBookmark,
  IconCalculate,
  IconColsed,
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
  IconValidatePost,
  IconValidateUnpost,
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
import { toast } from "react-toastify";
import { Api } from "../services/Api";
import ModaRemoveBookmark from "./Layout/componentsNavbar/ModaRemoveBookmark";
import useDeviceType from "../Hooks/useDeviceType";
import HierarchyAll from "./HierarchyAll";
import { DataPagesHierarchyGrid } from "../ConfigData/DataPagesHierarchyGrid";
import ColumnsHeaderPage from "../ConfigData/ColumnsHeaderPage.json";
import useTranslationText from "../Hooks/useTranslationText";
import useFullRouteChain from "../Hooks/useFullRouteChain";
import Config from "../utils/Config";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import useHandleDelete from "../Hooks/useHandleDelete";
import { isActionWorkflow } from "../utils/isActionWorkflow";
import CustomTextarea from "./Form/CustomTextarea";
import ConfettiExplosion from "react-confetti-explosion";
import BottomSheet from "./BottomSheet";
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
  const isAllowedDelete = Config.isAllow("Delete", confiPage);
  const isAllowedPost = Config.isAllow("Post", confiPage);
  const isAllowedUnPost = Config.isAllow("UnPost", confiPage);
  const isAllowedModify = Config.isAllow("Modify", confiPage);
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
      action == "Post" ? fetchData : null
    );
  };
  const handleOpenSheet = (item) => {
    setSelectedItem(item);
    setIsOpenBottomSheet(true);
  };
  const closeSheet = () => {
    setIsOpenBottomSheet(false);
    setSelectedItem(null);
  };

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
  if (id > 0 && !viewOnly && isAllowedModify && statusId == "1") {
    renderActionsList.push({
      tooltip: "submit",
      onClick: () => setShowModaSubmitted(true),
      className: "",
      disabled: isEdited,

      icon: <IconSubmitted />,
    });
  }
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
  if (id > 0 && canTakeAction?.show && statusId == "2") {
    renderActionsList.push({
      tooltip: "approval",
      onClick: () =>
        setApprovalsCycleModal({
          show: true,
          type: "approval",
        }),
      className: "",
      icon: <Approved />,
    });
  }
  if (id > 0 && canTakeAction?.show && statusId == "2") {
    renderActionsList.push({
      tooltip: "rejecte",
      onClick: () =>
        setApprovalsCycleModal({
          show: true,
          type: "rejecte",
        }),
      className: "",
      icon: <Rejected />,
    });
  }
  if (id > 0 && !viewOnly && isAllowedModify && isCalculate == true) {
    renderActionsList.push({
      tooltip: isFill ? "fill" : "calculate",
      onClick: () => setShowModaCalculate(true),
      className: "",
      disabled: isEdited,
      icon: <IconCalculate />,
    });
  }
  if (btnHeaderPage) {
    btnHeaderPage.map((btn) => {
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
  if (id > 0 && statusId == "3" && isAllowedPost) {
    renderActionsList.push({
      tooltip: "Post",
      onClick: () => setShowModalPost(true),
      className: "btn-secondary",
      disabled: isEdited,
      icon: <IconPost className="w-full h-full" />,
    });
  }
  if (id > 0 && statusId == "999" && isAllowedUnPost) {
    renderActionsList.push({
      tooltip: "UnPost",
      onClick: () => setShowModalUnPost(true),
      className: "btn-secondary",
      icon: <IconUnPost className="w-full h-full" />,
    });
  }
  if (id > 0 && statusId != "999" && statusId > 0) {
    renderActionsList.push({
      tooltip: "validatePost",
      onClick: () =>
        !isLoadingValidate &&
        !isEdited &&
        handleTransactionAction({ action: "ValidatePost" }),
      className: "",
      disabled: isEdited,
      isLoading: isLoadingValidate,
      icon: <IconValidatePost className="w-full h-full" />,
    });
  }
  if (id > 0 && statusId == "999" && statusId > 0) {
    renderActionsList.push({
      tooltip: "validateUnPost",
      onClick: () =>
        !isLoadingValidate &&
        handleTransactionAction({ action: "ValidateUnPost" }),
      className: "btn-secondary",
      disabled: isEdited,
      isLoading: isLoadingValidate,
      icon: <IconValidateUnpost className="w-full h-full" />,
    });
  }
  if (option === "edit" && id > 0 && showBookmark) {
    renderActionsList.push({
      tooltip: isBookmarkedEdit ? "removeBookmark" : "addBookmark",
      onClick: () => handleBookmarkToggle(),
      className: `btn_Header_End   btn-default`,
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

  if (parentEntityKey != null) {
    renderActionsList.push({
      tooltip: "parentEntityRoutes",
      onClick: () => {
        const routeTemplate =
          parentEntityRoutes[parentEntityKey][parentEntityValues?.parentEntity];
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

  if (isviewContract) {
    renderActionsList.push({
      tooltip: viewContract ? "Contract" : "Contract Document",
      onClick: () => setViewContract((prev) => !prev),
      className: "",
      icon: viewContract ? <IconDocumentView /> : <SearchDocumentIcon />,
    });
  }
  // Sort actions: Delete first, Save second, others after
  const getSortOrder = (tooltip) => {
    if (tooltip === "delete") return 1;
    if (tooltip === "save") return 2;
    return 3;
  };
  
  const sortedActionsList = [...renderActionsList].sort((a, b) => 
    getSortOrder(a.tooltip) - getSortOrder(b.tooltip)
  );

  const renderActions = () => (
    <>
      {sortedActionsList.map((btn, index) => (
        <CustomBtn
          key={index}
          type="button"
          disabled={btn.disabled}
          isLoading={btn.isLoading}
          onClick={btn.onClick}
          className={`btn_text_icon ${btn.className || ''} ${btn?.activeClassName || ''}`}
          icon={btn.icon}
          title={btn.tooltip}
          ResourcePage={btn?.Resource || "General"}
        />
      ))}
    </>
  );
  return (
    <>
      <div className="Header_Page">
        <div className="Header_container">
          {isFullyApproved ||
            (statusId == 3 && (
              <div className=" absolute top-1/2 start-1/2">
                <ConfettiExplosion
                  height="100vh"
                  particleCount="250"
                  duration="3000"
                  width="1600"
                />
              </div>
            ))}

          {/* Header start section with icon, title, and status */}
          <div className="Header_Start">
            {deviceType != "mobile" && (
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
                className={`state_rec ${StatusList?.WorkflowStatus?.[statusId] || ''}`}
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

          <div className="Header_End">
            {renderActionsList.length > 0 && deviceType == "mobile" && (
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
        {/* Viewer Record Component */}
        {dataHeader != null && columnsKey && (
          <ViewerRec
            columns={ColumnsHeaderPage[columnsKey]}
            ResourcePage={columnsKey}
            dataHeader={dataHeader}
          />
        )}
      </div>
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
            onToggleWorkflow({ action: "Submit" });
            setShowModaSubmitted(false);
          } else if (showModaCalculate) {
            onCalculate();
          } else {
            handleTransactionAction({ action: "Post", setData });
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
      <ConfirmationModal
        isVisible={showModalUnPost || showModaReCall}
        ResourcePage={ResourcePage}
        type={"default"}
        title={showModaReCall ? "manageReCall" : "messageOneUnPost"}
        description={showModaReCall ? "confirmReCall" : "confirmOneUnPost"}
        icon={showModaReCall ? <IconReCall /> : <IconUnPost />}
        confirmButtonLabel={showModaReCall ? "reCall" : "unPosted"}
        onConfirm={() => {
          if (showModaReCall) {
            onToggleWorkflow({ action: "ReCall" });
            setShowModaReCall(false);
          } else {
            handleTransactionAction({ action: "UnPost", setData });
            setShowModalUnPost(false);
          }
        }}
        onCancel={() => {
          setShowModalUnPost(false);
          setShowModaReCall(false);
        }}
      />
      <ConfirmationModal
        isVisible={approvalsCycleModal?.show}
        onCancel={() => onCancelApproval()}
        icon={
          approvalsCycleModal?.type == "approval" ? <Approved /> : <Rejected />
        }
        type={approvalsCycleModal?.type == "approval" ? "primary" : "delete"}
        description={
          approvalsCycleModal?.type == "approval"
            ? "descriptionApproved"
            : "descriptionRejected"
        }
        subTitle={`${ResourcePage}?.title`}
        ResourcePage="General"
        isLoadingBtn={isLoadingApprovalsCycle}
        title={approvalsCycleModal?.type == "approval" ? "approval" : "rejecte"}
        confirmButtonLabel={
          approvalsCycleModal?.type == "approval" ? "approval" : "rejecte"
        }
        onConfirm={() => onApprovalsCycle(approvalsCycleModal?.type)}
      >
        <div className="mt-4 ConfirmationModal_approved">
          <CustomTextarea
            label="comment"
            ResourcePage="GeneralField"
            placeholder="pleaseEnterComment"
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
