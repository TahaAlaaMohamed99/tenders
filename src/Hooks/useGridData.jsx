import { useState } from "react";
import { Api } from "../services/Api";

const useGridData = (ApiGet, setDataGrid, setIsLoading) => {
  const [totalRow, setTotalRow] = useState(0);

  // Current language logic



  const fetchGridData = async (PageNumber, PageSize) => {
    setIsLoading(true);
    try {
      const response = await Api.get(
        `/${ApiGet}?${PageNumber ? `pageNumber=${PageNumber}` : ""}${PageSize ? `&pageSize=${PageSize}` : ""}`
      );
      if (response !== 404) {
        let updatedData = response.data;

        setDataGrid(updatedData);
        setTotalRow(response.total);
      } else {
        setDataGrid([]);
        setTotalRow(0);
      }
    } catch (error) {
      setDataGrid([]);
      setTotalRow(0);
    } finally {
      setIsLoading(false);
    }
  };

  return { totalRow, fetchGridData };
};

export default useGridData;
