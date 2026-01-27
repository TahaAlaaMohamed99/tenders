import React, { useEffect } from "react";
import { IconColsed } from "../assets/Icons/IconsSvg";
import CustomeBtn from "./CustomeBtn";
import TranslationText from "./TranslationText";
import "../Styles/Components/ConfirmationModal/Confirmation_Modal.css";
/**
 * ConfirmationModal Component
 * A reusable modal component for confirmation actions.
 * Props:
 * - `title` (string): The title of the modal.
 * - `description` (string): The description or message displayed inside the modal.
 * - `confirmButtonLabel` (string): Label for the confirm button.
 * - `cancelButtonLabel` (string): Label for the cancel button (default: "Cancel").
 * - `onConfirm` (function): Callback function triggered when the confirm button is clicked.
 * - `onCancel` (function): Callback function triggered when the cancel button is clicked.
 * - `isVisible` (boolean): Determines if the modal is visible or hidden.
 */
export default function ConfirmationModal({
  title,
  icon,
  description,
  type,
  confirmButtonLabel,
  cancelButtonLabel = "cancel",
  onConfirm,
  onCancel,
  ResourcePage = "",
  isVisible, // State to control modal visibility
  children,
  InfoModal = false,
  isLoadingBtn = false,
  confirmDisabled = false,
  subTitle,
  iconAndTitle = false,
  ResourceBtns,
  className = "",
  modalLg = false,
}) {
  // Add or remove `overflow-hidden` class on the body based on modal visibility
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup: Ensure the class is removed when the component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isVisible]);

  /**
   * Handles click on the overlay to close the modal
   */
  const toggleClick = () => {
    if (isVisible) {
      onCancel(); // Trigger the onCancel callback when the overlay is clicked
    }
  };

  // Render modal structure
  return (
    isVisible && (
      <div
        className={`modal Confirmation_Modal  ${type} ${
          isVisible ? "visible" : "hidden"
        } `}
      >
        {/* Background overlay */}
        <div
          onClick={toggleClick}
          className={`overlay_bg ${isVisible ? "opacity-50" : "opacity-0"}`}
        ></div>
        <div
          className={`modal_content ${modalLg ? "modal_xl" : ""} ${className}`}
        >
          <div className={"header_modal " + (!icon ? "justify_end" : "")}>
            {type == "viweComment" || iconAndTitle ? (
              <div className="flex gap-1 items-center ">
                {icon && <div className="modal_icon">{icon}</div>}
                <h2 className="modal_title">
                  <TranslationText page={ResourcePage} title={title} />{" "}
                  {subTitle && <TranslationText title={subTitle} />}
                </h2>
              </div>
            ) : (
              icon && <div className="modal_icon">{icon}</div>
            )}
            {/* Modal Title */}
            <button type="button" onClick={toggleClick} className="Closed_btn">
              <IconColsed />
            </button>
          </div>
          <div className={"modal_body"}>
            {/* Conditionally render icon */}
            {title && type != "viweComment" && !iconAndTitle && (
              <h2 className="modal_title">
                <TranslationText page={ResourcePage} title={title} />{" "}
                {subTitle && <TranslationText title={subTitle} />}
              </h2>
            )}
            {/* Modal Description */}
            {description && (
              <p className="modal_description">
                <TranslationText page={ResourcePage} title={description} />
              </p>
            )}
            <div
              className={
                modalLg ? "modal_xl_body_content" : "modal_content_body"
              }
            >
              {children}
            </div>
          </div>

          {/* Action Buttons */}
          {!InfoModal && (
            <div className="modal_footer">
              <CustomeBtn
                title={cancelButtonLabel}
                className="btn-border-secondary"
                onClick={onCancel}
                size="btn_md"
              />
              <CustomeBtn
                title={confirmButtonLabel}
                className={
                  type == "delete"
                    ? "btn-delete"
                    : type == "primary"
                    ? "btn-primary"
                    : "btn-default-Modal"
                }
                size="btn_md"
                disabled={confirmDisabled}
                isLoading={isLoadingBtn}
                onClick={onConfirm}
                ResourcePage={ResourceBtns ? ResourceBtns : "General"}
              />
            </div>
          )}
        </div>
      </div>
    )
  );
}
