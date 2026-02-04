import Resources from "../ConfigData/resources.json";

/**
 * Translation hook for getting localized text
 * 
 * @param {Object} params
 * @param {string} params.title - The key to translate
 * @param {string} params.lang - Language code ("en" or "ar")
 * @param {string} params.page - Optional page/section name for scoped lookup
 * @param {string} params.enumName - Optional enum name for enum translations (e.g., "BiddingType")
 * @returns {string} Translated text or fallback to title
 * 
 * Lookup order:
 * 1. Enums.[enumName].values.[title].[lang] (if enumName provided)
 * 2. [page].[title].[lang] (if page provided)
 * 3. General.[title].[lang]
 * 4. [title].[lang] (root level)
 * 5. Fallback to title
 */
const useTranslationText = ({ title, lang, page, enumName }) => {
    // 1. Try enum lookup if enumName is provided
    if (enumName && Resources?.[enumName]?.values?.[title]?.[lang]) {
        return Resources[enumName].values[title][lang];
    }

    // 2. Try specific page lookup if page is provided
    if (page && Resources?.[page]?.[title]?.[lang]) {
        return Resources[page][title][lang];
    }

    // 3. Try General/Global lookup (common keys like 'logout', 'cancel')
    if (Resources?.["General"]?.[title]?.[lang]) {
        return Resources["General"][title][lang];
    }

    // 4. Try legacy/flat lookup (if any exist at root level)
    if (Resources?.[title]?.[lang]) {
        return Resources[title][lang];
    }

    // 5. Fallback to title
    return title;
};

export default useTranslationText;
