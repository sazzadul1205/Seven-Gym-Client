import { useState, useRef } from "react";
import PropTypes from "prop-types";

// import Packages
import { Tooltip } from "react-tooltip";

// Import Icons
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Basic Information
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Modal
import TierUpgradePaymentInvoiceModal from "../../../(UserPages)/UserSettings/UserPaymentInvoices/TierUpgradePaymentInvoiceModal/TierUpgradePaymentInvoiceModal";

const AllPayedInvoices = ({ TierUpgradePaymentData }) => {
  // Local state to track current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState(null);

  // Create a ref for the modal
  const modalPaymentInvoiceRef = useRef(null);

  // Fixed number of items per page for pagination
  const itemsPerPage = 10;

  // Calculate total number of pages needed
  const totalPages = Math.ceil(
    (TierUpgradePaymentData?.length || 0) / itemsPerPage
  );

  // Slice the data array to only show items for the current page
  const currentData = TierUpgradePaymentData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close Modal Handler
  const closePaymentInvoiceModal = () => {
    modalPaymentInvoiceRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedPaymentInvoice(null);
  };

  return (
    <div>
      {/* Header section */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Tier Upgrade Payment&apos;s
        </h3>
      </div>

      {/* Check if data exists and has length > 0 */}
      {Array.isArray(TierUpgradePaymentData) &&
      TierUpgradePaymentData.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Table for displaying invoices */}
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            {/* Table : Header */}
            <thead>
              <tr className="bg-gray-100 text-left">
                {/* Table headers */}
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Tier</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">End Date</th>
                <th className="px-4 py-2 border">Total ($)</th>
                <th className="px-4 py-2 border">Payed</th>
                <th className="px-4 py-2 border">Payment Time</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>

            {/* Table : Body */}
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* Index */}
                  <td className="border px-4 py-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  {/* User */}
                  <td className="border px-4 py-2">
                    <TrainerBookingRequestUserBasicInfo email={item.email} />
                  </td>

                  {/* Tier */}
                  <td className="border px-4 py-2">{item.tier}</td>

                  {/* Duration */}
                  <td className="border px-4 py-2">{item.duration}</td>

                  {/* Start Date */}
                  <td className="border px-4 py-2">{item.startDate}</td>

                  {/* End date */}
                  <td className="border px-4 py-2">{item.endDate}</td>

                  {/* Payed Price */}
                  <td className="border px-4 py-2">
                    ${item.totalPrice.toFixed(2)}
                  </td>

                  {/* Payed True / False */}
                  <td className="border px-4 py-2">
                    {item.Payed ? "Yes" : "No"}
                  </td>

                  {/* Payed Time  */}
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
                      onClick={() => {
                        setSelectedPaymentInvoice(item?.paymentID);
                        modalPaymentInvoiceRef.current?.showModal();
                      }}
                      className="border-2 border-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                      id={`view-details-btn-${item._id}`}
                    >
                      <FaFileInvoiceDollar className="text-gray-500" />
                    </button>
                    <Tooltip
                      anchorSelect={`#view-details-btn-${item._id}`}
                      content="View Tier Upgrade Payment Invoice"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="join">
              {/* Previous page button */}
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

              {/* Page indicator */}
              <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
                Page {currentPage} / {totalPages}
              </span>

              {/* Next page button */}
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

      {/* Payment success modal */}
      <dialog ref={modalPaymentInvoiceRef} className="modal">
        <TierUpgradePaymentInvoiceModal
          PaymentID={selectedPaymentInvoice}
          Close={closePaymentInvoiceModal}
        />
      </dialog>
    </div>
  );
};

// PropTypes validation for better reliability and catching issues early
AllPayedInvoices.propTypes = {
  TierUpgradePaymentData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      tier: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      Payed: PropTypes.bool.isRequired,
      paymentTime: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
    })
  ),
};

export default AllPayedInvoices;
