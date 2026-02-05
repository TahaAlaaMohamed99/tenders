
import React, { useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import PopupModalSlide from "../Components/PopupModalSlide";
import useGetById from "../Hooks/useGetById";
import CustomInput from "../Components/Form/CustomInput";
import AsyncSelectWrapper from "../Components/Form/AsyncSelectWrapper";
import useHandleSubmit from "../Hooks/useHandleSubmit";
import Config from "../utils/Config";
import { useSafeSelector } from "../Hooks/useSafeSelector";
import useTranslationText from "../Hooks/useTranslationText";

/**
 * SubmissionDocumentLineAddEdit
 *
 * This component renders a form to add or edit data. It accepts the following props:
 *
 * - recId: The id of the record to be edited. If not provided, the component will render a form to add a new record.
 * - isVisible: A boolean indicating whether the component is visible or not.
 * - ApiPage: The API endpoint to be used for add or edit operations.
 * - toggleClick: A function to be called when the component is closed.
 * - titleSubmitBtn: The text to be displayed on the submit button.
 * - title: The title of the component.
 * - iconModal: The icon to be used in the modal header.
 * - fetchGridData: A function to be called when the component is submitted.
 * - ResourcePage: The resource page to be used for validation and error messages.
 *
 * The component will fetch data from the API if recId is provided and isVisible is true. It will then render a form with the following fields:
 *
 * - name: A text input field for the name of the record.
 * - createdOn: A date picker field for the creation date of the record.
 *
 * The component will validate the fields using the NameSchema and render error messages if any of the fields are invalid.
 *
 * When the form is submitted, the component will call the handleSubmitFormik function from the useHandleSubmit hook, passing the form values and the other props as arguments.
 *
 * The component will also call the fetchGridData function when the form is submitted, passing the recId and ResourcePage as arguments.
 **/
export default function SubmissionDocumentLineAddEdit({
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
}) {
  const formikRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [data, setData] = useState({});
  const [unit, setUnit] = useState("");
  const isAllowedModify = Config.isAllow("Modify", ConfiMainPage);
  const { currentLanguage } = useSafeSelector((state) => state.themeSlice);

  const unknownUnitText = useTranslationText({
    title: "unknownUnit",
    page: ResourcePage,
    lang: currentLanguage,
  });

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
        purchaseQuantity: values.purchaseQuantity,
        itemRecId: values.itemRecId,
        departmentRecId: values.departmentRecId,
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
        setUnit("");
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
          parentRecId: data?.parentRecId || parentRecId || "",
          purchaseQuantity: data?.purchaseQuantity || "",
          itemRecId: data?.itemRecId || "",
          departmentRecId: data?.departmentRecId || "",
        }}
        enableReinitialize={true}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
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
              <AsyncSelectWrapper
                name="itemRecId"
                label="item"
                required
                value={values.itemRecId}
                onChange={(val) => setFieldValue('itemRecId', val)}
                lookup={{
                    api: 'Item/GetLookup',
                    valueKey: 'recId',
                    labelKey: 'itemNumber'
                }}
                onSelectionChange={(selected) => {
                    setUnit(selected?.original?.inventoryUnitSymbol || unknownUnitText);
                }}
                errors={errors.itemRecId}
                touched={touched.itemRecId}
                labelBgColor="bg-white dark:bg-whiteDark"
                ResourcePage={ResourcePage}
              />
              <CustomInput
                name="unit"
                label="unit"
                value={unit}
                readOnly={true}
                disabled={true}
                labelBgColor="bg-white dark:bg-whiteDark"
                ResourcePage={ResourcePage}
              />
              <CustomInput
                name="purchaseQuantity"
                label="purchaseQuantity"
                type="number"
                value={values.purchaseQuantity}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors.purchaseQuantity}
                touched={touched.purchaseQuantity}
                labelBgColor="bg-white dark:bg-whiteDark"
                required
                ResourcePage={ResourcePage}
              />
              <AsyncSelectWrapper
                name="departmentRecId"
                label="department"
                required
                value={values.departmentRecId}
                onChange={(val) => setFieldValue('departmentRecId', val)}
                lookup={{
                    api: 'Department/GetLookup',
                    valueKey: 'recId',
                    labelKey: 'name'
                } }
                labelBgColor="bg-white dark:bg-whiteDark"
                errors={errors.departmentRecId}
                touched={touched.departmentRecId}
                ResourcePage={ResourcePage}
              />
            </fieldset>
          </Form>
        )}
      </Formik>
    </PopupModalSlide>
  );
}