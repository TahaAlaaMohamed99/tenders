import { useSelector } from "react-redux";
import useTranslationText from "../Hooks/useTranslationText";

export default function TranslationText({  title, page }) {
  // Current language logic
  const currentLanguage = useSelector((state) => state.themeSlice.currentLanguage);
  const translatedText = useTranslationText({  title, lang: currentLanguage, page });
  return translatedText;
}
