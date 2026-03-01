/**
 * LanguageSelector Component
 * Renders the list of available languages.
 * 
 * @param {Object} props
 * @param {string} props.currentLanguage - Currently selected language code ('en' or 'ar')
 * @param {Function} props.onSelect - Callback when a language is selected
 */
export default function LanguageSelector({ currentLanguage, onSelect }) {
  return (
    <div className="space-y-1">
        <button 
            onClick={() => onSelect("en")}
            className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${currentLanguage === "en" ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
        >
            <span className="font-medium text-sm">English</span>
            {currentLanguage === "en" && <div className="w-2 h-2 bg-primary rounded-full"></div>}
        </button>
        <button 
            onClick={() => onSelect("ar")}
            className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${currentLanguage === "ar" ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
        >
            <span className="font-medium text-sm">العربية</span>
            {currentLanguage === "ar" && <div className="w-2 h-2 bg-primary rounded-full"></div>}
        </button>
    </div>
  );
}
