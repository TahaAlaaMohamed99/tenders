import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomeBtn from "../Components/CustomeBtn";
import { IconEdit,IconAdd, IconDeleteVendorGroup } from "../assets/Icons/IconsSvg";
import useGridData from "../Hooks/useGridData";
import Pagination from "../Components/Pagination";
import Loading from "../Components/loader";

export default function VendorGroups() {
  const navigate = useNavigate();
  const [ vendorGroups, setVendorGroups ] = useState( [] );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalRow = vendorGroups.length;
  const pageSize = 6;
  // const { totalRow, fetchGridData } = useGridData(
  //   "VendorGroups/GetAll",
  //   setVendorGroups,
  //   setIsLoading
  // );

  const handlePageChange = (page) => {
    if (page < 1) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    // fetchGridData(currentPage, pageSize);
    setVendorGroups([
      {
        vendorGroupId: "Test 05",
        dataAreaId: "agtc",
        description: "Test",
        recId: 8,
        createdOn: "2025-12-15T12:24:06.0514184",
      },
      {
        vendorGroupId: "Test 04",
        dataAreaId: "agtc",
        description: "Test Group 4",
        recId: 7,
        createdOn: "2025-12-14T10:15:30.0514184",
      },
      {
        vendorGroupId: "Test 03",
        dataAreaId: "agtc",
        description: "Test Group 3",
        recId: 6,
        createdOn: "2025-12-13T09:20:45.0514184",
      },
      {
        vendorGroupId: "Test 02",
        dataAreaId: "agtc",
        description: "Test Group 2",
        recId: 5,
        createdOn: "2025-12-12T14:30:12.0514184",
      },
      {
        vendorGroupId: "Test 01",
        dataAreaId: "agtc",
        description: "Test Group 1",
        recId: 4,
        createdOn: "2025-12-11T11:45:22.0514184",
      },
      {
        vendorGroupId: "Test 06",
        dataAreaId: "agtc",
        description: "Test Group 6",
        recId: 9,
        createdOn: "2025-12-16T12:24:06.0514184",
      },
      {
        vendorGroupId: "Test 07",
        dataAreaId: "agtc",
        description: "Test Group 7",
        recId: 10,
        createdOn: "2025-12-17T12:24:06.0514184",
      },
      {
        vendorGroupId: "Test 08",
        dataAreaId: "agtc",
        description: "Test Group 8",
        recId: 11,
        createdOn: "2025-12-18T12:24:06.0514184",
      },
    ]);
  }, [currentPage]);

  const handleRowClick = (id) => {
    navigate(`/vendor-groups/${id}`);
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
          <h2 className="text-2xl font-bold text-gray-800">Vendor Groups</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your vendor groups</p>
        </div>
        <CustomeBtn
          onClick={() => handleRowClick(0)}
          className="bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          title="Add New"
          icon={<IconAdd />}
          size="btn_md"
          ResourcePage="VendorGroups"
        />
      </div>

      {/* Table / Content */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created On
              </th>
              <th className="px-12 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                ) : vendorGroups.length > 0 ? (
                vendorGroups.map((group) => (
                  <tr
                    key={group.recId}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(group.recId)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                        {group.vendorGroupId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.dataAreaId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(group.createdOn)}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex -space-x-6 justify-end">
                        <CustomeBtn
                          size="btn_sm"
                          ResourcePage="VendorGroups"
                          icon={<IconEdit className="w-4 h-4" />}
                        />
                        <CustomeBtn
                          size="btn_sm"
                          ResourcePage="VendorGroups"
                          icon={<IconDeleteVendorGroup className="w-5 h-5" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Delete vendor group", group.recId);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-gray-500 text-lg"
                  >
                    No Vendor Groups found
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