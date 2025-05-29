import { useState, useMemo } from "react";
import PropTypes from "prop-types";

// Import Icons
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Basic Information
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const AllRefundedInvoices = ({ TierUpgradeRefundData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const refundsPerPage = 10;

  // Calculate total pages based on refund data length
  const totalPages = useMemo(() => {
    return Math.ceil(TierUpgradeRefundData.length / refundsPerPage) || 1;
  }, [TierUpgradeRefundData.length]);

  // Get refunds for the current page
  const currentRefunds = useMemo(() => {
    const startIndex = (currentPage - 1) * refundsPerPage;
    return TierUpgradeRefundData.slice(startIndex, startIndex + refundsPerPage);
  }, [currentPage, TierUpgradeRefundData]);

  return (
    <div>
      {/* Section Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Tier Upgrade Refunds
        </h3>
      </div>

      {/* Data Table */}
      {Array.isArray(TierUpgradeRefundData) &&
      TierUpgradeRefundData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            {/* Table : Header */}
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Linked Payment</th>
                <th className="px-4 py-2 border">Total ($)</th>
                <th className="px-4 py-2 border">Refunded ($)</th>
                <th className="px-4 py-2 border">Reason</th>
                <th className="px-4 py-2 border">Refunded</th>
                <th className="px-4 py-2 border">Payment Time</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>

            {/* Table : Body */}
            <tbody>
              {currentRefunds.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* index */}
                  <td className="border px-4 py-2">
                    {(currentPage - 1) * refundsPerPage + index + 1}
                  </td>

                  {/* User */}
                  <td className="border px-4 py-2">
                    <TrainerBookingRequestUserBasicInfo email={item.email} />
                  </td>

                  {/* Recept ID */}
                  <td className="border px-4 py-2">
                    {item.linkedPaymentReceptID}
                  </td>

                  {/* Payed Amount */}
                  <td className="border px-4 py-2">
                    ${item.totalPrice.toFixed(2)}
                  </td>

                  {/* Refunded Amount */}
                  <td className="border px-4 py-2">
                    ${parseFloat(item.refundAmount).toFixed(2)}
                  </td>

                  {/* Refunded Reason */}
                  <td className="border px-4 py-2">{item.refundedReason}</td>

                  {/* Refunded True/False */}
                  <td className="border px-4 py-2">
                    {item.refunded ? "Yes" : "No"}
                  </td>

                  {/* Refunded Time */}
                  <td className="border px-4 py-2">
                    {new Date(item.paymentTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  {/* Action */}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => console.log("Refund clicked:", item._id)}
                      className="border-2 border-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                      id={`view-details-btn-${item._id}`} 
                    >
                      <FaFileInvoiceDollar className="text-gray-500" />
                    </button>
                    <Tooltip
                      anchorSelect={`#view-details-btn-${item._id}`}
                      content="View Tier Upgrade Refunded Invoice"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="join">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesLeft />
              </button>

              {/* Page Info */}
              <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
                Page {currentPage} / {totalPages}
              </span>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesRight />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Fallback message if no data available
        <div className=" bg-gray-200  p-4">
          <p className="text-center font-semibold text-black">
            No refund data available.
          </p>
        </div>
      )}
    </div>
  );
};

// ✅ Prop Type Validation
AllRefundedInvoices.propTypes = {
  TierUpgradeRefundData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      linkedPaymentReceptID: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      refundAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      refundedReason: PropTypes.string,
      refunded: PropTypes.bool.isRequired,
      paymentTime: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AllRefundedInvoices;
