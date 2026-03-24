
import TranslationText from './TranslationText';
import { IconArrowDown, IconArrowLeft } from '../assets/Icons';
import '../Styles/components/CustomAccordion/CustomAccordion.scss'
import CustomeBtn from './CustomBtn';
import CustomCheckbox from './Form/CustomCheckbox';
/**
 * A custom accordion component that displays a header with an icon and a title,
 * and a collapsible body with the provided children.
 * @param {ComponentType} icon - The icon component to display in the header.
 * @param {string} title - The title of the accordion.
 * @param {string} ResourcePage - The resource page for the translation text.
 * @param {ReactNode} children - The children to display in the accordion body.
 * @param {boolean} open - Determines whether the accordion is open or not.
 * @returns {JSX.Element} The CustomAccordion component.
 */
export default function CustomAccordion({ icon, title, ResourcePage, children, open, onClick, toggleClick, isFooter = true, submitClick, titleSubmitBtn = "save", titleCancel, isLoadingSubmit = false, className = "", onClickSelectAll, checkedAll, countSelected }) {
  return (
    <div className={"Custom_Accordion " + (open ? "active_Accordion " : "default_Accordion ") + (className)}>
      <div className="Accordion_Header" onClick={children ? toggleClick : onClick}>
        <div className='Header_content'>
          {
            onClickSelectAll != null &&
            <div onClick={(e) => e.stopPropagation()} className='select_all_checkbox_left mr-3'>
              <CustomCheckbox
                value={checkedAll}
                onChange={() => {
                  onClickSelectAll()
                }}
              />
            </div>
          }
          {icon &&
            <span className="icon">{icon}</span>
          }
          <h2 className="title"><TranslationText page={ResourcePage} title={title} /></h2>
          {countSelected > 0 && <span className='count_selected'>{countSelected}</span>}
        </div>
        <div className='header_actions'>
          {children ?
            <span className='icon_arrow'><IconArrowDown /></span>
            :
            <span className='icon_arrow_open'><IconArrowLeft /></span>
          }
        </div>

      </div>
      {children &&
        <div className={"Accordion_Body " + (open ? "pt-6" : "")}>
          {open && children}
        </div>
      }

      {isFooter && open &&
        <div className='Accordion_Footer'>
          <CustomeBtn
            type="button"
            size='btn_md'
            title={titleCancel ? titleCancel : "Cancel"}
            className="btn-border-secondary"
            ResourcePage="General"
            onClick={toggleClick}
          />
          <CustomeBtn
            title={titleSubmitBtn}
            className="btn-primary"
            size='btn_md'
            type="submit"
            isLoading={isLoadingSubmit}
            ResourcePage="General"
            onClick={submitClick}
          />
        </div>
      }
    </div>
  );
}
