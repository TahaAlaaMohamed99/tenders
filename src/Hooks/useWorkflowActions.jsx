/**
 * @fileoverview useWorkflowActions Hook
 *
 * Extracted from HeaderPageAddEdit.jsx (Phase 1 – SRP refactor).
 * Encapsulates Submit, ReCall, Approval-cycle, and Rejection logic.
 *
 * @see docs/07-action-plan.md#2-refactor-headerpageaddeditjsx
 * @see docs/05-solid-clean-architecture.md (SRP Violation 1)
 * @module Hooks/useWorkflowActions
 */

import { useState } from "react";
import { Api } from "../services/Api";
import { toast } from "react-toastify";
import TranslationText from "../Components/TranslationText";
import signalRService from "../services/signalRService";

/**
 * @param {Object}   params
 * @param {string}   params.apiKey             - API entity prefix (e.g. "PurchaseOrder")
 * @param {string|number} params.id            - Record id
 * @param {string}   params.ResourcePage       - Translation namespace
 * @param {Object}   params.transactionName    - { value: string } from Generallist
 * @param {Object}   params.data               - Current record data (needed for status patch)
 * @param {Function} params.setData            - Setter to patch local state
 * @param {Function} params.fetchData          - Refetch record after mutation
 * @param {Object}   params.LevelsWorkFlow     - { data: [], total: number }
 * @param {Function} params.setWorkFlowTransaction - Update workflow levels in parent
 * @param {Object}   params.canTakeAction      - { show: boolean, level: object|null }
 * @param {Object}   params.matchedKeys        - Mapped ErrorsKeys for error-log navigation
 * @param {Function} params.openInNewTabErrorLog - Route to error-log page
 */
export default function useWorkflowActions({
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
}) {
  const [isLoadingApprovalsCycle, setIsLoadingApprovalsCycle] = useState(false);
  const [isFullyApproved, setIsFullyApproved] = useState(false);
  const [approvalsCycleModal, setApprovalsCycleModal] = useState({
    show: false,
    type: "",
  });
  const [comment, setComment] = useState("");

  // -- Submit / ReCall ---------------------------------------------------
  const onToggleWorkflow = ({ action }) => {
    Api.post(`${apiKey}/${action}`, {
      transactionName: transactionName?.value,
      transcationRecId: Number(id),
    })
      .then((res) => {
        toast.success(
          <TranslationText
            title={
              action === "ReCall"
                ? "reCalledSuccessfully"
                : "submittedSuccessfully"
            }
            page={ResourcePage}
          />
        );
        if (action === "ReCall") {
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
            title={
              action === "ReCall" ? "reCalledFailed" : "submittedFailed"
            }
            page={ResourcePage}
          />
        );
      });
  };

  // -- Approval / Rejection cycle ----------------------------------------
  const onCancelApproval = () => {
    setApprovalsCycleModal({ show: false, type: "" });
    setComment("");
  };

  const onApprovalsCycle = (type) => {
    const dataLevel = canTakeAction?.level;
    setIsLoadingApprovalsCycle(true);

    const sendData = {
      recId: dataLevel?.recId,
      transactionName: transactionName?.value,
      comment: comment || null,
      name: "",
      status: type === "approval" ? 2 : 3,
    };

    Api.put("WorkFlowTransactionLog/UpdateStatusLevel", sendData)
      .then((res) => {
        const resData = res.data;
        if (resData.message == 200) {
          if (
            type === "approval" &&
            dataLevel?.levelNumber === LevelsWorkFlow?.total
          ) {
            Api.post(
              `${apiKey}/ChangeStatusToFullyApproved?TransactionRecId=${id}&TransactionName=${transactionName?.value}`
            )
              .then(() => {
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
              .catch(() => {
                toast.error(
                  <TranslationText page="General" title="failedApproval" />
                );
              });
          } else if (type === "rejecte") {
            Api.post(
              `${apiKey}/ChangeStatusToRejected?TransactionRecId=${id}&TransactionName=${transactionName?.value}`
            )
              .then(() => {
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
              .catch(() => {
                toast.error(
                  <TranslationText page="General" title="failedRejected" />
                );
              });
          } else {
            // Intermediate approval level
            const upDataWorkFlowTransaction = {
              data: LevelsWorkFlow?.data.map((item) =>
                item.recId === dataLevel.recId
                  ? { ...item, status: 2 }
                  : item
              ),
              total: LevelsWorkFlow?.total,
            };
            const sendNotificationData =
              upDataWorkFlowTransaction?.data?.find(
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
      .catch(() => {
        setIsLoadingApprovalsCycle(false);
        onCancelApproval();
        window.location.reload();
        toast.error(
          <TranslationText
            page="General"
            title={
              type === "approval" ? "failedApproval" : "failedRejected"
            }
          />
        );
      });
  };

  return {
    // State
    isLoadingApprovalsCycle,
    isFullyApproved,
    approvalsCycleModal,
    setApprovalsCycleModal,
    comment,
    setComment,
    // Actions
    onToggleWorkflow,
    onApprovalsCycle,
    onCancelApproval,
  };
}
