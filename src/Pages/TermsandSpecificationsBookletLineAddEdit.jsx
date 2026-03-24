import { useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import PopupModalSlide from "../Components/PopupModalSlide";
import useGetById from "../Hooks/useGetById";
import CustomInput from "../Components/Form/CustomInput";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import Config from "../utils/Config";

/**
 * TermsandSpecificationsBookletLineAddEdit
 **/
export default function TermsandSpecificationsBookletLineAddEdit({
  recId,
  isVisible,
  ApiPage,
  toggleClick,
  titleSubmitBtn,
  title,
  iconModal,
  fetchGridData,
  ResourcePage,
  ConfiMainPage,
  parentRecId,
  isReadOnly = false,
}) {
  const formikRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [data, setData] = useState({});
  const isAllowedModify = Config.isAllow("Modify", ConfiMainPage) && !isReadOnly;

  const fetchData = useGetById(
    `${ApiPage}`,
    recId,
    setIsLoading,
    setData,
    null,
    ResourcePage
  );
  const { handleSubmitFormik } = useHandleSubmit();

  useEffect(() => {
    if (isVisible && recId > 0) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [recId, isVisible]);

  const handleSubmit = (values) => {
    setIsLoadingSubmit(true);
    const sendData = {
        parentRecId: Number(values.parentRecId),
        name: values.name,
        code: values.code,
        amount: values.amount,
        price: values.price,
    };

    handleSubmitFormik({
      apiPage: ApiPage,
      values: sendData,
      recId: recId,
      resourcePage: ResourcePage,
      setIsLoadingSubmit: setIsLoadingSubmit,
      onSuccess: () => {
          toggleClick();
          if (fetchGridData) fetchGridData();
      },
    });
  };

  return (
    <PopupModalSlide
      modalSize="w-96"
      isVisible={isVisible}
      toggleClick={() => {
        setData({});
        toggleClick();
      }}
      submitClick={() => formikRef.current?.handleSubmit()}
      isLoadingSubmit={isLoadingSubmit}
      isLoading={isLoading}
      icon={iconModal}
      titleSubmitBtn={titleSubmitBtn}
      title={title}
      viewOnly={!isAllowedModify}
      ResourcePage={ResourcePage}
      titleCancel="cancel"
    >
      <Formik
        innerRef={formikRef}
        initialValues={{
          parentRecId: data?.parentRecId || parentRecId,
          name: data?.name || "",
          code: data?.code || "",
          amount: data?.amount || "",
          price: data?.price || "",
        }}
        enableReinitialize={true}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <Form
            autoComplete="off"
            noValidate="noValidate"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4"
          >
            <fieldset disabled={!isAllowedModify} className="grid grid-cols-1 gap-8">
              <CustomInput
                name="name"
                label="name"
                type="text"
                placeholder="enterName"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.name}
                touched={touched.name}
                labelBgColor="bg-white dark:bg-whiteDark"
                required
                ResourcePage={ResourcePage}
                disabled={!isAllowedModify}
              />
              <CustomInput
                name="amount"
                label="amount"
                type="number"
                placeholder="enterAmount"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.amount}
                touched={touched.amount}
                labelBgColor="bg-white dark:bg-whiteDark"
                required
                ResourcePage={ResourcePage}
                disabled={!isAllowedModify}
              />
              <CustomInput
                name="price"
                label="price"
                type="number"
                placeholder="enterPrice"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.price}
                touched={touched.price}
                labelBgColor="bg-white dark:bg-whiteDark"
                required
                ResourcePage={ResourcePage}
                disabled={!isAllowedModify}
              />
            </fieldset>
          </Form>
        )}
      </Formik>
    </PopupModalSlide>
  );
}
