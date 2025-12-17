import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomeBtn from "../Components/CustomeBtn";
import { IconEdit, IconAdd, IconDeleteCurrency } from "../assets/Icons/IconsSvg";
import useGridData from "../Hooks/useGridData";
import Pagination from "../Components/Pagination";
import Loading from "../Components/loader";

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // const totalRow = currencies.length;
  const { totalRow, fetchGridData } = useGridData(
    "Currencies/GetAll",
    setCurrencies,
    setIsLoading
  );

  const handlePageChange = (page) => {
    if (page < 1) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchGridData(currentPage, pageSize);
    // setCurrencies([
    //   {
    //     currencyCode: "AOA",
    //     recId: 13,
    //     createdOn: "2025-12-14T14:43:32.4906335",
    //     name: "ANGOLA Currency",
    //   },
    //   {
    //     currencyCode: "NGN",
    //     recId: 12,
    //     createdOn: "2025-12-14T14:30:25.0711346",
    //     name: "Nigeriaa",
    //   },
    //   {
    //     currencyCode: "EGP",
    //     recId: 11,
    //     createdOn: "2025-12-14T14:06:36.8408815",
    //     name: "Egypt Currency",
    //   },
    //   {
    //     currencyCode: "GBP",
    //     recId: 10,
    //     createdOn: "2025-12-14T14:06:33.2844631",
    //     name: "Pound Sterling",
    //   },
    //   {
    //     currencyCode: "CNY",
    //     recId: 9,
    //     createdOn: "2025-12-14T14:06:31.5822213",
    //     name: "Yuan Renminbi",
    //   },
    //   {
    //     currencyCode: "CHF",
    //     recId: 8,
    //     createdOn: "2025-12-14T14:06:29.9489311",
    //     name: "Swiss Franc",
    //   },
    //   {
    //     currencyCode: "QAR",
    //     recId: 7,
    //     createdOn: "2025-12-14T14:06:28.0552512",
    //     name: "Qatari Rial",
    //   },
    //   {
    //     currencyCode: "SAR",
    //     recId: 6,
    //     createdOn: "2025-12-14T14:06:24.5307478",
    //     name: "Saudi Riyal",
    //   },
    //   {
    //     currencyCode: "AED",
    //     recId: 5,
    //     createdOn: "2025-12-14T14:06:21.1909939",
    //     name: "UAE Dirham",
    //   },
    //   {
    //     currencyCode: "OMR",
    //     recId: 4,
    //     createdOn: "2025-12-14T14:06:17.7655592",
    //     name: "Rial Omani",
    //   },
    //   {
    //     currencyCode: "EUR",
    //     recId: 3,
    //     createdOn: "2025-12-14T14:06:15.9049108",
    //     name: "Euro",
    //   },
    //   {
    //     currencyCode: "USD",
    //     recId: 2,
    //     createdOn: "2025-12-14T14:06:14.1516051",
    //     name: "US Dollar",
    //   },
    //   {
    //     currencyCode: "KWD",
    //     recId: 1,
    //     createdOn: "2025-12-14T14:06:04.8710048",
    //     name: "Kuwaiti Dinar",
    //   },
    // ]);
  }, [currentPage]);

  const navigate = useNavigate();
  const handleRowClick = (id) => {
    navigate(`/currencies/${id}`);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="grid grid-cols-1 gap-6 pt-6">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Currencies</h2>
          <p className="text-sm text-gray-500 mt-3">Manage currencies</p>
        </div>
        <CustomeBtn
          onClick={() => handleRowClick(0)}
          className="bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          title="Add New"
          icon={<IconAdd />}
          size="btn_md"
          ResourcePage="Currencies"
        />
      </div>

      {/* Table / Content */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Currency Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created On
              </th>
              <th className="px-20 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
        </table>

        <div className="overflow-y-auto max-h-[400px]">
          <table className="w-full table-fixed">
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-20">
                    <Loading />
                  </td>
                </tr>
              ) : currencies.length > 0 ? (
                currencies.map((c) => (
                  <tr
                    key={c.recId}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(c.recId)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                        {c.currencyCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(c.createdOn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex -space-x-6 justify-end gap-2">
                        <CustomeBtn
                          size="btn_sm"
                          ResourcePage="Currencies"
                          icon={<IconEdit className="w-4 h-4" />}
                        />
                        <CustomeBtn
                          size="btn_sm"
                          ResourcePage="Currencies"
                          icon={<IconDeleteCurrency className="w-5 h-5" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Delete currency", c.recId);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-40 text-center text-gray-500 text-lg"
                  >
                    No currencies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && totalRow > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalRows={totalRow}
          pageSize={pageSize}
          onPageChange={ handlePageChange }
        />
      )}
    </div>
  );
}
