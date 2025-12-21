import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomeBtn from "../Components/CustomeBtn";
import { IconAdd, IconTrash } from "../assets/Icons/IconsSvg";
import useGridData from "../Hooks/useGridData";
import useHandleDelete from "../Hooks/useHandleDelete";
import Pagination from "../Components/Pagination";
import Loading from "../Components/loader";
export default function Vendors() {
  const navigate = useNavigate();
  const [ vendors, setVendors ] = useState( [] );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ isDeleting, setIsDeleting ] = useState( false );

  const { handleDelete } = useHandleDelete();

  const handleDeleteVendor = (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    handleDelete({
      apiPage: "Vendors",
      recId: id,
      resourcePage: "Vendors",
      setIsLoading: setIsDeleting,
      onSuccess: () => fetchGridData(currentPage, pageSize),
    });
  };

  // const totalRow = vendors.length;
  const pageSize = 10;
  const { totalRow, fetchGridData } = useGridData(
    "Vendors/GetAll",
    setVendors,
    setIsLoading
  );

  const handlePageChange = (page) => {
    if (page < 1) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchGridData(currentPage, pageSize);
    // setVendors([
    //   {
    //     recId: 1,
    //     name: "Vendor 1",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 2,
    //     name: "Vendor 2",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 3,
    //     name: "Vendor 3",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 4,
    //     name: "Vendor 4",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 5,
    //     name: "Vendor 5",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 6,
    //     name: "Vendor 6",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 7,
    //     name: "Vendor 7",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 8,
    //     name: "Vendor 8",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 9,
    //     name: "Vendor 9",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 10,
    //     name: "Vendor 10",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 11,
    //     name: "Vendor 11",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    //   {
    //     recId: 12,
    //     name: "Vendor 12",
    //     vendorAccountNumber: "1234567890",
    //     currencyCode: "USD",
    //     vendorPartyType: "Supplier",
    //     createdOn: "2023-01-01",
    //   },
    // ]);
  }, [currentPage]);

  const handleRowClick = (id) => {
    navigate(`/vendors/${id}`);
  };
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  return (
    <div className="grid grid-cols-1 gap-6 pt-1">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vendors</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your vendors</p>
        </div>
        <CustomeBtn
          onClick={() => handleRowClick(0)}
          className="bg-teal-600 text-white hover:bg-teal-700 transition-colors gap-2"
          title="Add New"
          icon={<IconAdd />}
          size="btn_md"
          ResourcePage="Vendors"
        />
      </div>

      {/* Table / Content */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <table className="w-full table-fixed">
          <thead className=" border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Currency Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created On
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
        </table>

        <div className="overflow-y-auto max-h-[500px]">
          <table className="w-full table-fixed">
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-20">
                    <Loading />
                  </td>
                </tr>
              ) : vendors.length > 0 ? (
                vendors.map((c) => (
                  <tr
                    key={c.recId}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(c.recId)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {c.vendorAccountNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap truncate">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                        {c.currencyCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {c.vendorPartyType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {c.vendorGroupId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {formatDate(c.createdOn)}
                    </td>
                    <td className="py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex -space-x-8">
                        <CustomeBtn size="btn_sm" ResourcePage="Vendors" />
                        <CustomeBtn
                          size="btn_sm"
                          ResourcePage="Vendors"
                          icon={<IconTrash className="w-4 h-4" />}
                          disabled={isDeleting}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVendor(c.recId);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center text-gray-500 text-lg"
                  >
                    No Vendors found
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
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}