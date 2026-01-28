import Resources from "../ConfigData/resources.json";

const useTranslationText = ({ title, lang, page }) => {
    // 1. Try specific page lookup if page is provided
    if (page && Resources?.[page]?.[title]?.[lang]) {
        return Resources[page][title][lang];
    }

    // 2. Try General/Global lookup (common keys like 'logout', 'cancel')
    if (Resources?.["General"]?.[title]?.[lang]) {
        return Resources["General"][title][lang];
    }

    // 3. Try legacy/flat lookup (if any exist at root level)
    if (Resources?.[title]?.[lang]) {
        return Resources[title][lang];
    }

    // 4. Fallback to title
    return title;
};

export default useTranslationText;
