import React, { useEffect, useState } from "react";
import {
  IconColsed,
  IconError,
  IconMaximize,
  IconMinimize,
} from "../assets/Icons";
import CustomBtn from "./CustomBtn";
import "../Styles/Components/PopupModalSlide/PopupModalSlide.css";
import TranslationText from "./TranslationText";
import Loader from "./loader";
import useTranslationText from "../Hooks/useTranslationText";
import { useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
export default function PopupModalSlide({
  isVisible,
  toggleClick,
  submitClick,
  modalSize,
  title,
  icon,
  children,
  titleSubmitBtn,
  titleCancel,
  CancelClick,
  isfooter = true,
  ResourcePage = "",
  ResourceBtns = "",
  isLoadingSubmit = false,
  isLoading = false,
  isViewer = false,
  notShowenButtons = false,
  printId = "",
  viewOnly = false,
  disabledSubmitBtn = false,
  ResourceSubmitBtn,
  sublength,
  bookMarkMode = false,
  subTitle = null,
  isSelector,
  hideCancel = false,
  hideSubmit = false,
}) {
  const [isFullView, setIsfullView] = useState(false);
  const currentLanguage = useSelector(
    (state) => state.themeSlice.currentLanguage
  );
 

  useEffect(() => {
    if (isVisible || (isVisible && !isViewer)) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isVisible, isViewer]);

  return (
    <div
      id={printId}
      className={`modal z-50 popupModalSlide ${isVisible ? "" : "invisible"}`}
    >
      <div
        onClick={toggleClick}
        className={`overlay_bg  ${isVisible ? "opacity-50" : "opacity-0"}`}
      ></div>

      <div
        className={`${modalSize ? modalSize : ""} ${isViewer && (isFullView ? "w-[100vw]" : "w-[50vw]")
          }    modal_body    ${isVisible
            ? "translate-x-0"
            : "ltr:translate-x-full rtl:-translate-x-full"
          } ${bookMarkMode && "modal_body_custom"}`}
      >
        {isLoading && <Loader />}
        <div
          className={`${bookMarkMode ? "modal_header rounded-lg" : "modal_header"
            } `}
        >
          <div className="box_header">
            {isViewer ? (
              <div className="icon flex justify-center items-center w-8 h-8">
                <button
                  type="button"
                  onClick={() => setIsfullView(!isFullView)}
                  data-tooltip-content={!isFullView ? "maximizeWidth" : "minimizeWidth"}
                  data-resource-page="General"
                  data-tooltip-id="global-tooltip"
                >
                  {!isFullView ? <IconMaximize /> : <IconMinimize />}
                </button>

              </div>
            ) : (
              ""
            )}
            <div className="icon">{icon}</div>
            <h3 className="title text_ellipsis">
              <TranslationText title={title} page={ResourcePage} />{" "}
              {subTitle != null && (
                <>
                  <TranslationText title={subTitle} page={ResourcePage} />{" "}
                </>
              )}
              {sublength && (
                <sub className="text-primary dark:text-primaryDark text-[13px]">
                  ({sublength})
                </sub>
              )}
            </h3>
          </div>
          <button type="button" onClick={toggleClick} className="Closed_btn">
            <IconColsed />
          </button>
        </div>
        <div
          className={
            isfooter
              ? "modal_box pb-4 h-[calc(100%-130px)] "
              : " overflow-y-auto max-h-[calc(100%-80px)]"
          }
        >
          <div className="modal_contact h-full">
            {isVisible && !isLoading && children}
          </div>
        </div>
        {isfooter && (!isViewer || notShowenButtons || isSelector) && (
          <div className="modal_footer justify-center gap-2">
            {!hideSubmit && (
              <CustomBtn
                title={titleSubmitBtn}
                className={`btn-primary ${isSelector ? "w-[250px]" : ""}`}
                type="button"
                isLoading={isLoadingSubmit}
                ResourcePage={
                  ResourceBtns
                    ? ResourceBtns
                    : ResourceSubmitBtn
                      ? ResourceSubmitBtn
                      : "General"
                }
                disabled={viewOnly || disabledSubmitBtn}
                onClick={submitClick}
              />
            )}
            {!hideCancel && (
              <CustomBtn
                type="button"
                title={titleCancel ? titleCancel : "cancel"}
                className={`btn-border-secondary-filled ${isSelector ? "w-[250px]" : ""
                  }`}
                ResourcePage={ResourceBtns ? ResourceBtns : "General"}
                onClick={CancelClick ? CancelClick : toggleClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
