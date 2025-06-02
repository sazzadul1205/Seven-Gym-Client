import { useRef, useState, useMemo } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Basic Information
import BookedTrainerBasicInfo from "../../../../Shared/Component/BookedTrainerBasicInfo";
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Modal
import UserSessionRefundInvoiceModal from "../../../(UserPages)/UserTrainerManagement/UserSessionInvoice/UserSessionRefundInvoiceModal/UserSessionRefundInvoiceModal";

// Import Icons
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { FaFileInvoiceDollar, FaSearch } from "react-icons/fa";

const TrainerSessionRefundInvoices = ({ TrainerSessionRefundData }) => {
  // Ref for controlling the refund invoice modal
  const modalRefundInvoiceRef = useRef(null);

  // State to hold the currently selected refund invoice for the modal
  const [selectedRefundInvoice, setSelectedRefundInvoice] = useState(null);

  // Search inputs for filtering by user name, trainer name, and refund ID
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [trainerSearchTerm, setTrainerSearchTerm] = useState("");
  const [refundIdSearchTerm, setRefundIdSearchTerm] = useState("");

  // Cache to store user info to avoid redundant fetches
  const [userInfoCache, setUserInfoCache] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to show per page

  // Function to close the refund invoice modal and reset the selected invoice
  const closeRefundInvoiceModal = () => {
    modalRefundInvoiceRef.current?.close();
    setSelectedRefundInvoice(null);
  };

  // Normalize search inputs for case-insensitive filtering
  const normalizedUserSearch = userSearchTerm.trim().toLowerCase();
  const normalizedTrainerSearch = trainerSearchTerm.trim().toLowerCase();
  const normalizedRefundIdSearch = refundIdSearchTerm.trim().toLowerCase();

  // Memoized filtered data based on search inputs and cached user info
  const filteredData = useMemo(() => {
    return TrainerSessionRefundData.filter((item) => {
      const info = item.bookingDataForHistory;

      // Get cached user info using the booker email
      const user = userInfoCache[info?.bookerEmail];
      const userFullName = user?.fullName?.toLowerCase();

      // Extract trainer name and refund ID for filtering
      const trainerName = info?.trainer?.toLowerCase();
      const refundId = item?.refundID?.toLowerCase();

      // Apply each filter condition
      const matchesUser =
        !normalizedUserSearch || userFullName?.includes(normalizedUserSearch);

      const matchesTrainer =
        !normalizedTrainerSearch ||
        (trainerName && trainerName.includes(normalizedTrainerSearch));

      const matchesRefundId =
        !normalizedRefundIdSearch ||
        (refundId && refundId.includes(normalizedRefundIdSearch));

      // Return true if all conditions match
      return matchesUser && matchesTrainer && matchesRefundId;
    });
  }, [
    TrainerSessionRefundData,
    normalizedUserSearch,
    normalizedTrainerSearch,
    normalizedRefundIdSearch,
    userInfoCache,
  ]);

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current page data for display
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log(
    "Trainer Session Refund Data (Example) :",
    TrainerSessionRefundData[0]
  );

  return (
    <>
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Trainer Sessions Refund&apos;s Invoices
        </h3>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
        {/* User Name Search */}
        <div className="flex flex-col flex-1 max-w-[400px]">
          <label className="text-sm font-semibold text-white mb-1">
            Search by User Name
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search user..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Trainer Name Search */}
        <div className="flex flex-col flex-1 max-w-[400px]">
          <label className="text-sm font-semibold text-white mb-1">
            Search by Trainer Name
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search trainer..."
              value={trainerSearchTerm}
              onChange={(e) => setTrainerSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Refund ID Search */}
        <div className="flex flex-col flex-1 max-w-[400px]">
          <label className="text-sm font-semibold text-white mb-1">
            Search by Refund ID
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search refund ID..."
              value={refundIdSearchTerm}
              onChange={(e) => setRefundIdSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table Display */}
      {currentData.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            {/* Data Table */}
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              {/* Table Header */}
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Booker Email</th>
                  <th className="px-4 py-2 border">Trainer</th>
                  <th className="px-4 py-2 border">Total Price</th>
                  <th className="px-4 py-2 border">Refund Amount</th>
                  <th className="px-4 py-2 border">Refunded At</th>
                  <th className="px-4 py-2 border">Refund ID</th>
                  <th className="px-4 py-2 border">Reason</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {currentData.map((item, index) => {
                  const info = item.bookingDataForHistory;

                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      {/* Serial Number */}
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      {/* Booker Info */}
                      <td className="border px-4 py-2">
                        <TrainerBookingRequestUserBasicInfo
                          email={info?.bookerEmail}
                          renderUserInfo={(user) => {
                            if (!userInfoCache[info?.bookerEmail]) {
                              setUserInfoCache((prev) => ({
                                ...prev,
                                [info?.bookerEmail]: user,
                              }));
                            }
                            return (
                              <div className="flex items-center gap-2">
                                {/* Avatar */}
                                <div className="border-r-2 pr-2 border-black">
                                  <img
                                    src={user.profileImage}
                                    alt={user.fullName}
                                    className="w-16 h-16 rounded-full object-cover"
                                  />
                                </div>

                                {/* Name + Email */}
                                <div>
                                  <span className="font-medium block leading-tight">
                                    {user.fullName}
                                  </span>
                                  <span className="text-xs ">{user.email}</span>
                                </div>
                              </div>
                            );
                          }}
                        />
                      </td>

                      {/* Trainer Info */}
                      <td className="border px-4 py-2">
                        <BookedTrainerBasicInfo
                          trainerID={info?.trainerId}
                          py={1}
                        />
                      </td>

                      {/* Price Amount */}
                      <td className="px-4 py-2 border">
                        {info?.totalPrice === "free" ||
                        Number(info?.totalPrice) === 0
                          ? "Free"
                          : `$ ${info.totalPrice}`}
                      </td>

                      {/* Refund Amount */}
                      <td className="px-4 py-2 border">
                        {info?.totalPrice === "free" ||
                        isNaN(Number(item.PaymentRefund?.refundAmount)) ||
                        Number(item.PaymentRefund?.refundAmount) === 0
                          ? "Free"
                          : `$ ${item.PaymentRefund.refundAmount} (${info.RefundPercentage})`}
                      </td>

                      {/* Refund At */}
                      <td className="px-4 py-2 border">
                        {new Date(info?.refundTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>

                      {/* Refund ID */}
                      <td className="px-4 py-2 border">
                        {item.refundID &&
                        typeof item.refundID === "string" &&
                        item.refundID.trim() !== "" ? (
                          <span title={item.refundID}>
                            {item.refundID.length > 18
                              ? `${item.refundID.slice(
                                  0,
                                  10
                                )}...${item.refundID.slice(-4)}`
                              : item.refundID}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      {/* Reason */}
                      <td className="px-4 py-2 border">
                        {info?.reason || "N/A"}
                      </td>

                      {/* Action Button */}
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => {
                            setSelectedRefundInvoice(item);
                            modalRefundInvoiceRef.current?.showModal();
                          }}
                          className="border-2 border-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                          id={`view-details-btn-${item._id}`}
                        >
                          <FaFileInvoiceDollar className="text-gray-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#view-details-btn-${item._id}`}
                          content="View Session Refund Invoice"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="join">
              {/* Previous Page Button */}
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

              {/* Next Page Button */}
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
        </>
      ) : (
        <div className="bg-gray-200 p-4">
          <p className="text-center font-semibold text-black">
            No Active data available.
          </p>
        </div>
      )}

      {/* Modal */}
      <dialog ref={modalRefundInvoiceRef} className="modal">
        <UserSessionRefundInvoiceModal
          closeModal={closeRefundInvoiceModal}
          selectedRefundInvoice={selectedRefundInvoice}
        />
      </dialog>
    </>
  );
};

// Prop validation
TrainerSessionRefundInvoices.propTypes = {
  TrainerSessionRefundData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      refundID: PropTypes.string,
      refundTime: PropTypes.string,
      PaymentRefund: PropTypes.shape({
        stripePaymentID: PropTypes.string,
        refundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      bookingDataForHistory: PropTypes.shape({
        bookerEmail: PropTypes.string,
        trainerId: PropTypes.string,
        trainer: PropTypes.string,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        durationWeeks: PropTypes.number,
        status: PropTypes.string,
        reason: PropTypes.string,
        paidAt: PropTypes.string,
        RefundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        RefundPercentage: PropTypes.string,
      }).isRequired,
    })
  ).isRequired,
};

export default TrainerSessionRefundInvoices;
