import { useState, useMemo, useRef } from "react";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Icons
import { FaFileInvoiceDollar, FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Basic User Info
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Invoice Modal
import TierUpgradeRefundInvoiceModal from "../../../(UserPages)/UserSettings/UserRefundInvoices/TierUpgradeRefundInvoiceModal/TierUpgradeRefundInvoiceModal";
import CachedUserInfo from "../../AllTrainerBookings/CachedUserInfo";

const AllRefundedInvoices = ({ TierUpgradeRefundData }) => {
  const modalRefundInvoiceRef = useRef(null);

  // State
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [paymentIdFilter, setPaymentIdFilter] = useState("");
  const [selectedRefundInvoice, setSelectedRefundInvoice] = useState(null);

  // Cache to store loaded user data by email
  const [userInfoCache, setUserInfoCache] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Normalized search term
  const normalizedUserSearch = useMemo(
    () => userSearchTerm.trim().toLowerCase(),
    [userSearchTerm]
  );

  const normalizedPaymentSearch = useMemo(
    () => paymentIdFilter.trim().toLowerCase(),
    [paymentIdFilter]
  );

  // Filtered Data
  const filteredData = useMemo(() => {
    return TierUpgradeRefundData.filter((item) => {
      const user = userInfoCache[item.email?.toLowerCase()];
      const userFullName = user?.fullName?.toLowerCase() || "";

      const matchesUser =
        !normalizedUserSearch || userFullName.includes(normalizedUserSearch);

      const matchesPayment =
        !normalizedPaymentSearch ||
        item.linkedPaymentReceptID
          ?.toLowerCase()
          .includes(normalizedPaymentSearch);

      return matchesUser && matchesPayment;
    });
  }, [
    TierUpgradeRefundData,
    userInfoCache,
    normalizedUserSearch,
    normalizedPaymentSearch,
  ]);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current page's data
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close modal and reset selected invoice
  const closeRefundInvoiceModal = () => {
    modalRefundInvoiceRef.current?.close();
    setSelectedRefundInvoice(null);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Tier Upgrade Refunds
        </h3>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
        {/* Search by Name */}
        <div className="flex flex-col flex-1 max-w-[300px]">
          <label className="text-sm font-semibold text-white mb-1">
            Search by User Name
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search user..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Payment Receipt ID Filter */}
        <div className="flex flex-col flex-1 max-w-[500px]">
          <label className="text-sm text-white mb-1">
            Search by Linked Payment
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search payment ID..."
              value={paymentIdFilter}
              onChange={(e) => {
                setPaymentIdFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {currentData.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Data Table */}
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            {/* Table Header */}
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

            {/* Table Body */}
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* Serial Number */}
                  <td className="border px-4 py-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  {/* User info */}
                  <td className="border px-4 py-2">
                    <TrainerBookingRequestUserBasicInfo
                      email={item?.email}
                      renderUserInfo={(user) => (
                        <CachedUserInfo
                          user={user}
                          email={item?.email}
                          setUserInfoCache={setUserInfoCache}
                          userInfoCache={userInfoCache}
                        />
                      )}
                    />
                  </td>

                  {/* Linked Payment ID */}
                  <td className="border px-4 py-2">
                    {item.linkedPaymentReceptID}
                  </td>

                  {/* Price  */}
                  <td className="border px-4 py-2">
                    ${item.totalPrice.toFixed(2)}
                  </td>

                  {/* Refund Amount */}
                  <td className="border px-4 py-2">
                    ${parseFloat(item.refundAmount).toFixed(2)}
                  </td>

                  {/* Refund Reason */}
                  <td className="border px-4 py-2">{item.refundedReason}</td>

                  {/* Is Refund */}
                  <td className="border px-4 py-2">
                    {item.refunded ? "Yes" : "No"}
                  </td>

                  {/* Refund Time */}
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
                        setSelectedRefundInvoice(item?.RefundID);
                        modalRefundInvoiceRef.current?.showModal();
                      }}
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

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="join">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesLeft />
              </button>
              <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm ${
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
        <div className="bg-gray-200 p-4">
          <p className="text-center font-semibold text-black">
            No refund data available.
          </p>
        </div>
      )}

      {/* Modal */}
      <dialog ref={modalRefundInvoiceRef} className="modal">
        <TierUpgradeRefundInvoiceModal
          RefundID={selectedRefundInvoice}
          Close={closeRefundInvoiceModal}
        />
      </dialog>
    </div>
  );
};

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
      RefundID: PropTypes.string, // Required for modal
    })
  ).isRequired,
};

export default AllRefundedInvoices;
