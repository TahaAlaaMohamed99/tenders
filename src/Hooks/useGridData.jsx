import { useState, useCallback } from "react";
import { Api } from "../services/Api";
import { mapFiltersToBackend } from "../utils/gridFilters";
// Phase 2: Removed unused dummyData import (see docs/06-unused-and-gaps.md#34-dummydatajson)

const useGridData = (ApiGet, setDataGrid, setIsLoading, isGetAll = true) => {
  const [totalRow, setTotalRow] = useState(0);

  // Current language logic



  const fetchGridData = useCallback(async (PageNumber, PageSize, filters = null) => {
    setIsLoading(true);
    try {
      let response;
      const hasFilters = filters && Object.keys(filters).length > 0;

      if (hasFilters) {
        // Map frontend key-value filters to backend array format
        // The endpoint typically expects: { filters: [{ field, operator, value, valueTo }], useAnd: true }
        const backendFilters = mapFiltersToBackend(filters);

        const body = {
          filters: backendFilters,
          useAnd: true
        };

        const queryParams = new URLSearchParams();
        if (PageNumber) queryParams.append('pageNumber', PageNumber);
        if (PageSize) queryParams.append('pageSize', PageSize);
        // Sometimes backend requires page/pageSize in query, sometimes in body. 
        // Based on prompt: "params pageNumber, pageSize and body..."
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        response = await Api.post(`/${ApiGet}/FilterData${queryString}`, body);
      } else {
        // Fallback to original GET logic when no filters
        response = await Api.get(
          `/${ApiGet}${isGetAll ? `/GetAll?` : "&"}${PageNumber ? `pageNumber=${PageNumber}` : ""}${PageSize ? `&pageSize=${PageSize}` : ""}`
        );
      }

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
          (Array.isArray(updatedData) ? updatedData.length : 0);
        setTotalRow(total);
      } else {
        // Fallback to dummy data on 404
        setDataGrid([]);
        setTotalRow(0);
      }
    } catch (error) {
      // Fallback to dummy data on error (e.g., CORS)
      setDataGrid([]);
      setTotalRow(0);
    } finally {
      setIsLoading(false);
    }
  }, [ApiGet, isGetAll, setDataGrid, setIsLoading]);

  return { totalRow, fetchGridData };
};

export default useGridData;
