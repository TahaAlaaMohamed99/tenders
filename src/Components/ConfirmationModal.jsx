import ActionModal from "./ActionModal";
import { IconColsed } from "../assets/Icons";
import CustomBtn from "./CustomBtn";
import TranslationText from "./TranslationText";
import "../Styles/Components/ConfirmationModal/Confirmation_Modal.css";

/**
 * ConfirmationModal Component
 * A reusable modal component for confirmation actions.
 * 
 * @param {Object} props
 * @param {string} [props.title] - The title of the modal.
 * @param {React.ReactNode} [props.icon] - Optional icon to display in the header or body.
 * @param {string} [props.description] - Main description text.
 * @param {string} [props.type] - Style variant: 'delete', 'primary', 'viweComment', etc.
 * @param {string} [props.confirmButtonLabel] - Label for the primary action button.
 * @param {string} [props.cancelButtonLabel="cancel"] - Label for the cancel button.
 * @param {Function} [props.onConfirm] - Handler for primary action.
 * @param {Function} props.onCancel - Handler for closing/cancelling.
 * @param {string} [props.ResourcePage=""] - Translation namespace.
 * @param {boolean} props.isVisible - Controls visibility.
 * @param {React.ReactNode} [props.children] - Custom content body.
 * @param {boolean} [props.InfoModal=false] - If true, hides action buttons.
 * @param {boolean} [props.isLoadingBtn=false] - Shows loading state on confirm button.
 * @param {boolean} [props.confirmDisabled=false] - Disables the confirm button.
 * @param {string} [props.subTitle] - Secondary title text.
 * @param {boolean} [props.iconAndTitle=false] - Force display of icon next to title.
 * @param {string} [props.ResourceBtns] - Specific translation namespace for buttons.
 * @param {string} [props.className=""] - Custom classes for the modal wrapper.
 * @param {boolean} [props.modalLg=false] - Widen the modal for larger content.
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
  return (
    <ActionModal
      isOpen={isVisible}
      onClose={onCancel}
      mode="full"
      unstyled={true}
      className={`Confirmation_Modal ${type} ${
        modalLg ? "modal_xl" : ""
      } ${className}`}
    >
        <div className={`modal_content ${modalLg ? "modal_xl" : ""} h-full border-none p-0 w-full max-w-full`}>
             <div className={"header_modal " + (!icon && !title ? "justify_end" : "")}>
                <div className="flex gap-1 items-center ">
                  {icon && <div className="modal_icon">{icon}</div>}
                  {title && (
                    <h2 className="modal_title">
                      <TranslationText page={ResourcePage} title={title} />{" "}
                      {subTitle && <TranslationText title={subTitle} />}
                    </h2>
                  )}
                </div>
                {/* Modal Title */}
                <button type="button" onClick={onCancel} className="Closed_btn">
                  <IconColsed />
                </button>
              </div>
              <div className={"modal_body"}>
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
                  <CustomBtn
                    title={cancelButtonLabel}
                    className="btn-border-secondary-filled"
                    onClick={onCancel}
                    size="btn_md"
                  />
                  <CustomBtn
                    title={confirmButtonLabel}
                    className={
                      (type == "delete"
                        ? "btn-delete"
                        : type == "primary"
                        ? "btn-primary"
                        : "btn-default-Modal") + " !w-auto !min-w-fit px-6"
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
    </ActionModal>
  );
}
