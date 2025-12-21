import React from 'react'
import { Api } from '../services/Api'
import TranslationText from '../Components/TranslationText'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';


/**
 * A custom hook to handle form submission logic.
 *
 * @returns {Object} An object containing the handleSubmitFormik function
 */
export default function useHandleSubmit() {
  const navigate = useNavigate();

  /**
   * Handles form submission using the Api.post/put method, manages state updates, and displays notifications.
   *
   * @param {Object} params
   * @param {string} params.apiPage - The base API endpoint for the resource (e.g., "Currencies").
   * @param {Object} params.values - Form values to submit.
   * @param {string|number} params.recId - Record ID; if not "0", treated as Edit, otherwise Add.
   * @param {string} [params.resourcePage] - The resource page identifier for translation messages.
   * @param {Function} [params.setIsLoadingSubmit] - Setter for loading state during submission.
   * @param {Function} [params.setData] - Setter to update local form data after submission.
   * @param {Function} [params.fetchData] - Optional function to refresh data after success.
   * @param {Function} [params.onSuccess] - Optional callback executed upon successful submission.
   * @param {boolean} [params.transaction=true] - If true, adds `status: 1` to updated data.
   * @param {boolean} [params.formData=false] - If true, sends data as `multipart/form-data`.
   * @param {boolean} [params.useCustomUrl=false] - If true, uses apiPage as the full URL.
   * @param {string} [params.navigateTo] - Optional route to navigate to on success.
   */
  const handleSubmitFormik = async ({
    apiPage,
    values,
    recId,
    resourcePage = "General",
    setIsLoadingSubmit,
    setData,
    fetchData,
    onSuccess,
    transaction = true,
    formData = false,
    useCustomUrl = false,
    navigateTo,
  }) => {
    try {
      setIsLoadingSubmit?.(true);

      const isEdit = recId !== "0" && Number(recId) > 0;

      // Construct URL based on whether custom URL is used
      const urlApi = useCustomUrl
        ? apiPage
        : isEdit
        ? `${apiPage}/Update`
        : `${apiPage}/Add`;

      const sendData = values;
      isEdit && (sendData.recId = recId);
      const method = isEdit ? "put" : "post";

      const response = await Api[method](
        urlApi,
        sendData,
        formData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
      );

      const data = response || {};
      const isError = data?.isError === true;
      if (!isError) {
        toast.success(
          data?.message || (
            <TranslationText
              title={isEdit ? "editSuccessfully" : "addedSuccessfully"}
              ResourcePage={resourcePage}
            />
          )
        );

        if (setData) {
          setData({
            ...values,
            ...(transaction ? { status: 1 } : {}),
          });
        }

        // fetchData?.();
        onSuccess?.();
        if (navigateTo) navigate(navigateTo);
        return;
      } 

        toast.error(
          <TranslationText
            title={
              Array.isArray(data?.message)
                ? data.message[0]
                : data?.message || (isEdit ? "editFailed" : "addFailed")
            }
            ResourcePage={resourcePage}
          />
        );
    } catch (error) {
      const backendMessage = error?.details || error?.message || error ||
        (recId === "0" ? "addFailed" : "editFailed");

      toast.error(
        <TranslationText title={backendMessage} ResourcePage={resourcePage} />
      );

      // Keep form values intact
      setData?.({ ...values });
    } finally {
      setIsLoadingSubmit?.(false);
    }
  };

  return { handleSubmitFormik };
}
