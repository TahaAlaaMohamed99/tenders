import { Api } from '../services/Api';

const useGetLookup = () => {
 
/**
 * Fetches a list of items from a given API endpoint and transforms them into a list 
 * of objects with dynamic keys for label, value, and extra keys. 
 *  
 * @param {string} api - The API endpoint to fetch the list from.
 * @param {string} labelKey - The key to use for the label property.
 * @param {string} [extraLabelKey] - Optional key to concatenate with the label key.
 * @param {string} valueKey - The key to use for the value property.
 * @param {Function} setIsLoading - Function to update the loading state.
 * @param {Function} setList - Function to update the list state.
 * @param {string[]} [extraKeys] - Optional array of additional keys to include in the result.
 * @returns {Promise<void>}
 */
  const getLookup = async (
    api,
    labelKey,
    extraLabelKey = null,
    valueKey,
    setIsLoading,
    setList,
    extraKeys = [], // Optional: An array of additional keys to include in the result
    disabledList = null,
    isLookupValue = false
  ) => {
    try {
      setIsLoading(true);
      const response = await Api.get(`${api}${isLookupValue ? `` : '/GetLookup'}`);

      // Map the response to include label, value, and extra keys dynamically
      const data = response.map((item) => {
        const mappedItem = {
          label: extraLabelKey
            ? `${item[labelKey]}-${item[extraLabelKey]}` // Concatenate value and extraLabelKey if provided
            : item[labelKey], // Use the specified key for label
          value: item[valueKey], // Use the specified key for value
          isDisabled: disabledList?.some((disabledItem) => disabledItem.id == item[valueKey]) || false,
          ...extraKeys?.reduce((acc, key) => {
            acc[key] = item[key]; // Add extra keys dynamically
            return acc;
          }, {}),
        };
        return mappedItem;
      });

      setList(data); // Update the list with the mapped data
      
    } catch (err) {
      console.error(err); // Handle errors
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return { getLookup };
};

export default useGetLookup;