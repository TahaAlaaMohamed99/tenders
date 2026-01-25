import CustomBtn from "./CustomBtn";

/**
 * Pagination Component using CustomBtn
 *
 * @param {number} currentPage - Current active page
 * @param {number} totalRows - Total number of rows/items
 * @param {number} pageSize - Number of rows per page
 * @param {function} onPageChange - Callback when page changes
 */
export default function Pagination({
  className,
  currentPage,
  totalRows,
  pageSize,
  onPageChange,
}) {
  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1); // Always at least 1 page

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) onPageChange(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <div className="flex items-center justify-between mt-2">
      <span className="text-sm text-gray-600 whitespace-nowrap">
        {`Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
          currentPage * pageSize,
          totalRows,
        )} of ${totalRows} entries`}
      </span>
      <div className={`flex items-center gap-2 mt-4 ${className || ""}`}>
        <CustomBtn
          title="Prev"
          size="btn_sm"
          disabled={currentPage === 1}
          onClick={handlePrev}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {pageNumbers.map((num) => (
          <CustomBtn
            key={num}
            title={num.toString()}
            size="btn_sm"
            onClick={() => handlePageClick(num)}
            className={
              num === currentPage
                ? "bg-teal-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            }
          />
        ))}

        <CustomBtn
          title="Next"
          size="btn_sm"
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
