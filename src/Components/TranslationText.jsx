import { useSelector } from "react-redux";
import useTranslationText from "../Hooks/useTranslationText";

/**
 * TranslationText Component
 * 
 * A React component wrapper for useTranslationText hook that automatically
 * retrieves the current language from Redux store.
 * 
 * @param {Object} props
 * @param {string} props.title - The key to translate
 * @param {string} props.page - Optional page/section name for scoped lookup
 * @param {string} props.enumName - Optional enum name for enum translations (e.g., "BiddingType")
 * @returns {string} Translated text or fallback to title
 * 
 * @example
 * // Page-specific translation
 * <TranslationText title="save" page="General" />
 * 
 * @example
 * // Enum translation
 * <TranslationText title="tender" enumName="BiddingType" />
 * 
 * @example
 * // General translation
 * <TranslationText title="cancel" />
 */
export default function TranslationText({ title, page, enumName }) {
  // Get current language from Redux store
  const currentLanguage = useSelector((state) => state.themeSlice.currentLanguage);
  
  // Use translation hook with current language
  const translatedText = useTranslationText({ title, lang: currentLanguage, page, enumName });
  
  return translatedText;
}
