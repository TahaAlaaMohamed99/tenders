import { useState } from "react";
import { Api } from "../services/Api";

const useGridData = (ApiGet, setDataGrid, setIsLoading,isGetAll = true) => {
  const [totalRow, setTotalRow] = useState(0);

  // Current language logic



  const fetchGridData = async (PageNumber, PageSize) => {
    setIsLoading(true);
    try {
      const response = await Api.get(
        `/${ApiGet}${isGetAll ? `/GetAll?` : "&"}${PageNumber ? `pageNumber=${PageNumber}` : ""}${PageSize ? `&pageSize=${PageSize}` : ""}`
      );
      if (response !== 404) {
        const hasMetaTotal =
          response?.totalCount !== undefined ||
          response?.total !== undefined ||
          response?.totalRows !== undefined;
        const updatedData = response?.data && hasMetaTotal ? response : response?.data ? response.data : response;
        const rows = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(updatedData?.data)
              ? updatedData.data
              : Array.isArray(updatedData)
                ? updatedData
                : [];

        setDataGrid(rows);
        // Handle different API response structures for total count
        const total =
          updatedData?.totalCount ??
          updatedData?.total ??
          updatedData?.totalRows ??
          response?.totalCount ??
          response?.total ??
          response?.totalRows ??
          0;
        setTotalRow(total);
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
