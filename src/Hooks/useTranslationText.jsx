import Resources from "../resources.json";

const useTranslationText = ({ title, lang }) => {

    // Get the translated text or fallback to the title
    const translatedText = Resources?.[title]?.[lang] || title;

    return translatedText;
};

export default useTranslationText;
