import Generallists from "../ConfigData/Generallist.json";
import { useSelector } from "react-redux";
import Resources from "../ConfigData/resources.json";

/**
 * Custom hook to fetch and transform data for dropdowns or other Components.
 * Phase 2 fix: Replaced direct store import with useSelector (DIP violation).
 * @see docs/07-action-plan.md#7-fix-dip-violations
 */
const useGetGenerallist = () => {
  // Phase 2: Use React hook instead of direct store.getState() — DIP compliance
  const currentLanguage = useSelector((state) => state.themeSlice.currentLanguage);

  /**
   * Fetch and transform data from `Generallist.json`.
   *
   * @param {string} NameGenerallist - The key in `Generallist.json` representing the list to fetch.
   * @param {Function} setIsLoading - Function to update the loading state.
   * @param {Function} setList - Function to update the transformed list of data.
   * @param {boolean} PageName - Whether to use page-based translation or general list translation.
   * @param {boolean} extrValue - Whether to include extrValue in the returned data.
   * @param {boolean} isFilterGrid - Whether to include the original key for filtering purposes.
   * @returns {Promise<void>}
   */
  const getGenerallist = async (
    NameGenerallist,
    setIsLoading,
    setList,
    extrValue = false,
    isFilterGrid = false
  ) => {
    try {
      setIsLoading(true);

      const response = Generallists[NameGenerallist] || [];
      const data = response.map((item) => {
        const label =
          Resources?.[NameGenerallist]?.values?.[item.label]?.[currentLanguage] || item.label;

        return {
          label,
          value: item.value,
          ...(extrValue ? { "extrValueOperand": item[extrValue] } : {}),
          isDisabled: item.isDisabled || false,
          ...(isFilterGrid ? { sendKey: NameGenerallist } : {})
        };
      });

      setList(data);
    } catch (error) {
      console.error("Error in getGenerallist:", error);
      setList([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch multiple generallists at once.
   *
   * @param {Array} lists - Array of objects: { name, setList, PageName, extrValue, isFilterGrid }
   * @param {Function} setIsLoading - Function to set global loading status.
   * @returns {Promise<void>}
   */
  const getMultipleGenerallists = async (lists, setIsLoading) => {
    try {
      setIsLoading(true);

      await Promise.all(
        lists.map(({ name, setList, extrValue = false, isFilterGrid = false }) =>
          getGenerallist(name, () => { }, setList, extrValue, isFilterGrid)
        )
      );
    } catch (error) {
      console.error("Error in getMultipleGenerallists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { getGenerallist, getMultipleGenerallists };
};

export default useGetGenerallist;
