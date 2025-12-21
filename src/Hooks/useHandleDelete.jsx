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
    } catch (error) { console.log(error)
      const backendMessage = error?.details || error?.message || error || "deleteFailed";

      toast.error(
        <TranslationText title={backendMessage} ResourcePage={resourcePage} />
      );
    } finally {
      setIsLoading?.(false);
    }
  };

  return { handleDelete };
}
