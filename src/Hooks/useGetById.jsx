import { toast } from 'react-toastify';
import { Api } from '../services/Api';
import TranslationText from '../Components/TranslationText';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for fetching data by ID from a given API endpoint.
 * 
 * @param {string} api - The API endpoint to fetch data from.
 * @param {string | number} id - The ID of the data to fetch.
 * @param {Function} setIsLoading - State setter to indicate if the data is loading.
 * @param {Function} setData - State setter to store the fetched data.
 * @returns {Function} fetchData - The function that triggers the data fetching.
 */
const useGetById = (api, id, setIsLoading, setData, prevRoute , ResourcePage) => {
  // Navigate between routes
  const navigate = useNavigate();
  // Function that performs the data fetch
  const fetchData = async () => {
    if (!id) return; // Skip fetch if no ID is provided

    setIsLoading(true);  // Set loading state to true when starting to fetch
    try {
      // Send GET request to fetch data by ID from the API
      const response = await Api.get(`${api}/GetById?id=${id}`);
      const upData = { ...response, status: response.status == 0 ? 1 : response.status }
      setData(upData);  // Update the state with the fetched data
      setIsLoading(false);
     
    } catch (err) {
        toast.error(<TranslationText page={ResourcePage} title="notFound" />)
        if(prevRoute){
          navigate(prevRoute)
        }
        setIsLoading(false);

    }
  };

  return fetchData;  // Return the function that performs the fetch
};

export default useGetById;
