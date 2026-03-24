import { IconSave, IconBack } from '../assets/Icons';
import CustomBtn from './CustomBtn';

/**
 * SaveAndCancelChanges Component
 * 
 * Provides standardized save and cancel buttons for forms and logs.
 * 
 * @param {Function} handleSaveAllChanges - Callback for the save action
 * @param {Function} handleClearAll - Callback for the reset/cancel action
 * @param {string} className - Optional container class
 * @param {object} ReduxResources - Resources for translation
 * @param {string} currentLanguage - Current active language
 */
const SaveAndCancelChanges = ({ 
    handleSaveAllChanges, 
    handleClearAll, 
    className = "",
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
             <CustomBtn 
                type="button"
                onClick={handleClearAll}
                className="btn_text_icon"
                icon={<IconBack />}
                title="clearChanges"
                ResourcePage="General"
            />
            <CustomBtn 
                type="button"
                onClick={handleSaveAllChanges}
                className="btn_text_icon"
                icon={<IconSave />}
                title="save"
                ResourcePage="General"
            />
        </div>
    );
};

export default SaveAndCancelChanges;
