import { Api } from "../services/Api";
import { toast } from "react-toastify";
import TranslationText from "../Components/TranslationText";
import { useNavigate } from "react-router-dom";

export default function useHandleDelete() {
  const navigate = useNavigate();

  const handleDelete = async ({
    apiPage,
    recId,
    resourcePage = "General",
    setIsLoading,
    navigateTo,
    onSuccess,
    useCustomUrl = false,
  }) => {
    try {
      setIsLoading?.(true);

      const urlApi = useCustomUrl
        ? apiPage
        : `${apiPage}/DeleteById?id=${recId}`;

      const response = await Api.delete(urlApi);
      const data = response || {};
      const isError = data?.isError === true;

      if (!isError) {
        toast.success(
          data?.message || (
            <TranslationText
              title="deleteSuccessfully"
              ResourcePage={resourcePage}
            />
          )
        );

        onSuccess?.();

        if (navigateTo) navigate(navigateTo);
        return;
      }

      toast.error(
        <TranslationText
          title={
            Array.isArray(data?.message)
              ? data.message[0]
              : data?.message || "deleteFailed"
          }
          ResourcePage={resourcePage}
        />
      );
    } catch (error) {
      const errorMessage = error?.details?.message || error?.message || "deleteFailed";
      const title = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;

      toast.error(
        <TranslationText title={title} ResourcePage={resourcePage} />
      );
    } finally {
      setIsLoading?.(false);
    }
  };



  const handleDeleteBatch = async ({
    apiPage,
    ids = [],
    resourcePage = "General",
    setIsLoading,
    onSuccess,
    useCustomUrl = false, // Kept for interface compatibility, though currently unused in loop
  }) => {
    try {
      if (!ids || ids.length === 0) {
        console.warn("No IDs provided for batch delete");
        return;
      }

      setIsLoading?.(true);

      const urlApi = useCustomUrl
        ? apiPage
        : `${apiPage}/DeleteByIds`;

      // 405 Method Not Allowed usually means we used POST but server wants DELETE.
      // Axios delete accepts config as second argument, where body is in 'data'.
      const response = await Api.delete(urlApi, { data: ids });
      const data = response || {};
      const isError = data?.isError === true;

      if (!isError) {
        toast.success(
          data?.message || (
            <TranslationText
              title="deleteSuccessfully"
              ResourcePage={resourcePage}
            />
          )
        );

        onSuccess?.();
        return;
      }

      toast.error(
        <TranslationText
          title={
            Array.isArray(data?.message)
              ? data.message[0]
              : data?.message || "deleteFailed"
          }
          ResourcePage={resourcePage}
        />
      );
    } catch (error) {
      const errorMessage = error?.details?.message || error?.message || "deleteFailed";
      const title = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;

      toast.error(
        <TranslationText title={title} ResourcePage={resourcePage} />
      );
      console.error("Batch delete error:", error);
    } finally {
      setIsLoading?.(false);
    }
  };

  return { handleDelete, handleDeleteBatch };
}
