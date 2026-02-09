/**
 * @fileoverview useTransactionActions Hook
 *
 * Extracted from HeaderPageAddEdit.jsx (Phase 1 – SRP refactor).
 * Encapsulates Post, UnPost, Calculate/Fill, and Delete logic.
 *
 * @see docs/07-action-plan.md#2-refactor-headerpageaddeditjsx
 * @see docs/05-solid-clean-architecture.md (SRP Violation 1)
 * @module Hooks/useTransactionActions
 */

import { useState } from "react";
import { Api } from "../services/Api";
import { toast } from "react-toastify";
import TranslationText from "../Components/TranslationText";
import useHandleSubmit from "./useHandleSubmit";
import useHandleDelete from "./useHandleDelete";

/**
 * @param {Object}   params
 * @param {string}   params.apiKey         - API entity prefix
 * @param {string|number} params.id        - Record id
 * @param {string}   params.ResourcePage   - Translation namespace
 * @param {Object}   params.data           - Current record data
 * @param {Function} params.setData        - Setter for local state
 * @param {Function} params.fetchData      - Refetch record
 * @param {Object}   params.matchedKeys    - Mapped ErrorsKeys
 * @param {boolean}  params.isFill         - Use fill API instead of calculate
 * @param {string}   params.fillApi        - Fill endpoint override
 * @param {Function} params.setReplayFetchLine - Trigger line refresh
 * @param {Function} params.goBackInChain  - Navigate back after delete
 */
export default function useTransactionActions({
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
}) {
  const { handleSubmitFormPost } = useHandleSubmit();
  const { handleDelete } = useHandleDelete();

  const [isLoadingValidate, setIsLoadingValidate] = useState(false);

  // -- Calculate / Fill --------------------------------------------------
  const onCalculate = ({ onClose }) => {
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
          if (setReplayFetchLine) setReplayFetchLine(true);
          if (onClose) onClose();
        }
      })
      .catch(() => {
        toast.error(
          <TranslationText page={ResourcePage} title="calculateError" />
        );
        if (onClose) onClose();
      });
  };

  // -- Post / UnPost / Validate ------------------------------------------
  const handleTransactionAction = ({ action }) => {
    handleSubmitFormPost(
      apiKey,
      action,
      id,
      ResourcePage,
      action === "ValidatePost" || action === "ValidateUnPost"
        ? setIsLoadingValidate
        : null,
      data,
      matchedKeys,
      action === "Post" || action === "UnPost" ? setData : null,
      action === "Post" || action === "UnPost" ? fetchData : null
    );
  };

  // -- Delete ------------------------------------------------------------
  const confirmDelete = async ({ onClose }) => {
    await handleDelete({
      apiPage: apiKey,
      recId: id,
      resourcePage: ResourcePage,
      onSuccess: () => {
        goBackInChain();
      },
    });
    if (onClose) onClose();
  };

  return {
    isLoadingValidate,
    onCalculate,
    handleTransactionAction,
    confirmDelete,
  };
}
