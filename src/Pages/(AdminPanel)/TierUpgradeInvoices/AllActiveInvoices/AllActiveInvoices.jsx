import { useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";

// import Packages
import { Tooltip } from "react-tooltip";

// Import Icons
import { FaFileInvoiceDollar, FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Basic Information
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Modal
import TierUpgradePaymentInvoiceModal from "../../../(UserPages)/UserSettings/UserPaymentInvoices/TierUpgradePaymentInvoiceModal/TierUpgradePaymentInvoiceModal";
import CachedUserInfo from "../../AllTrainerBookings/CachedUserInfo";

const AllActiveInvoices = ({ ActiveTierPaymentData }) => {
  const modalPaymentInvoiceRef = useRef(null);

  // Filter State
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState(null);

  // Cache to store loaded user data by email
  const [userInfoCache, setUserInfoCache] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Normalize and memoize search term
  const normalizedUserSearch = useMemo(
    () => userSearchTerm.trim().toLowerCase(),
    [userSearchTerm]
  );

  // Unique Tier options
  const tierOptions = useMemo(() => {
    return [...new Set(ActiveTierPaymentData?.map((item) => item.tier))];
  }, [ActiveTierPaymentData]);

  // Unique Duration options
  const durationOptions = useMemo(() => {
    return [...new Set(ActiveTierPaymentData?.map((item) => item.duration))];
  }, [ActiveTierPaymentData]);

  // Filtered Data Logic
  const filteredData = useMemo(() => {
    if (!ActiveTierPaymentData) return [];

    return ActiveTierPaymentData.filter((item) => {
      const email = item.email?.toLowerCase();
      const user = userInfoCache[email];
      const userFullName = user?.fullName?.toLowerCase() || "";

      const matchesUser =
        !normalizedUserSearch || userFullName.includes(normalizedUserSearch);

      const matchesTier = selectedTier ? item.tier === selectedTier : true;
      const matchesDuration = selectedDuration
        ? item.duration === selectedDuration
        : true;

      return matchesUser && matchesTier && matchesDuration;
    });
  }, [
    ActiveTierPaymentData,
    userInfoCache,
    normalizedUserSearch,
    selectedTier,
    selectedDuration,
  ]);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current page's data
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close modal and reset selected invoice
  const closePaymentInvoiceModal = () => {
    modalPaymentInvoiceRef.current?.close();
    setSelectedPaymentInvoice(null);
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Tier Upgrade Payment&apos;s
        </h3>
      </div>

      {/* Filter Section */}
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

        {/* Filter by Tier */}
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm text-white mb-1">Tier</label>
          <select
            value={selectedTier}
            onChange={(e) => {
              setSelectedTier(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tiers</option>
            {tierOptions.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Duration */}
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm text-white mb-1">Duration</label>
          <select
            value={selectedDuration}
            onChange={(e) => {
              setSelectedDuration(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Durations</option>
            {durationOptions.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table or Message if No Data */}
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Data Table */}
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            {/* Table Header */}
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                {[
                  "#",
                  "User",
                  "Tier",
                  "Duration",
                  "Start Date",
                  "End Date",
                  "Total ($)",
                  "Payed",
                  "Payment Time",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-2 border">
                    {heading}
                  </th>
                ))}
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

                  {/* User Info */}
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

                  {/* Tier */}
                  <td className="border px-4 py-2">{item.tier}</td>

                  {/* Duration */}
                  <td className="border px-4 py-2">{item.duration}</td>

                  {/* Start Date */}
                  <td className="border px-4 py-2">{item.startDate}</td>

                  {/* End Date */}
                  <td className="border px-4 py-2">{item.endDate}</td>

                  {/* Total Price */}
                  <td className="border px-4 py-2">
                    ${item.totalPrice.toFixed(2)}
                  </td>

                  {/* Paid Status */}
                  <td className="border px-4 py-2">
                    {item.Payed ? "Yes" : "No"}
                  </td>

                  {/* Payment Time (Formatted) */}
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

                  {/* View Invoice Action */}
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
                    {/* Tooltip for button */}
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
        </div>
      ) : (
        <div className="bg-gray-200 p-4">
          <p className="text-center font-semibold text-black">
            No Payment data available.
          </p>
        </div>
      )}

      {/* Modal for Payment Invoice */}
      <dialog ref={modalPaymentInvoiceRef} className="modal">
        <TierUpgradePaymentInvoiceModal
          PaymentID={selectedPaymentInvoice}
          Close={closePaymentInvoiceModal}
        />
      </dialog>
    </>
  );
};

AllActiveInvoices.propTypes = {
  ActiveTierPaymentData: PropTypes.arrayOf(
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

export default AllActiveInvoices;
