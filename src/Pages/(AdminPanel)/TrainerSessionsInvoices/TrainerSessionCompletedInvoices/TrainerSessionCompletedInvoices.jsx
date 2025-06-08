import { useRef, useState, useMemo } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Basic Information
import BookedTrainerBasicInfo from "../../../../Shared/Component/BookedTrainerBasicInfo";
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Modal
import UserSessionPaymentInvoiceModal from "../../../(UserPages)/UserTrainerManagement/UserSessionInvoice/UserSessionPaymentInvoiceModal/UserSessionPaymentInvoiceModal";

// Import Icons
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { FaFileInvoiceDollar, FaSearch } from "react-icons/fa";
import CachedUserInfo from "../../AllTrainerBookings/CachedUserInfo";

// Helper to generate Month-Year options
const generateMonthYearOptions = (data) => {
  const monthYearSet = new Set();

  data.forEach((item) => {
    const date = new Date(item.paymentTime);
    if (!isNaN(date)) {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const value = `${month}-${year}`;
      const label = `${date.toLocaleString("default", {
        month: "long",
      })}, ${year}`;
      monthYearSet.add(JSON.stringify({ value, label }));
    }
  });

  // Convert Set of JSON strings back to sorted array of objects
  return Array.from(monthYearSet)
    .map((item) => JSON.parse(item))
    .sort((a, b) => {
      const [am, ay] = a.value.split("-").map(Number);
      const [bm, by] = b.value.split("-").map(Number);
      return ay === by ? am - bm : ay - by;
    });
};

const TrainerSessionCompletedInvoices = ({ TrainerSessionCompletedData }) => {
  const modalCompletedInvoiceRef = useRef(null);

  // State for selected invoice (for the modal)
  const [selectedCompletedInvoice, setSelectedCompletedInvoice] =
    useState(null);

  // Search filters for user name, trainer name, and payment ID
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [trainerSearchTerm, setTrainerSearchTerm] = useState("");
  const [paymentIdSearchTerm, setPaymentIdSearchTerm] = useState("");

  // Dropdown filter for selected month and year (e.g., "03-2025")
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  // Cache to store user info for quicker lookup
  const [userInfoCache, setUserInfoCache] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const itemsPerPage = 10; // Number of items to display per page

  // Close modal and reset selected invoice
  const closeActiveCompletedModal = () => {
    modalCompletedInvoiceRef.current?.close();
    setSelectedCompletedInvoice(null);
  };

  // Normalize search terms for case-insensitive comparison
  const normalizedUserSearch = userSearchTerm.trim().toLowerCase();
  const normalizedTrainerSearch = trainerSearchTerm.trim().toLowerCase();
  const normalizedPaymentIdSearch = paymentIdSearchTerm.trim().toLowerCase();

  // Filter data based on search terms
  const filteredData = useMemo(() => {
    return TrainerSessionCompletedData.filter((item) => {
      const booking = item?.BookingInfo;

      // Get cached user info (if available)
      const user = userInfoCache[booking?.bookerEmail];
      const userFullName = user?.fullName?.toLowerCase();
      const trainerName = booking?.trainer?.toLowerCase();
      const paymentId = item?.stripePaymentID?.toLowerCase();

      // Apply search filters
      const matchesUser =
        !normalizedUserSearch || userFullName?.includes(normalizedUserSearch);
      const matchesTrainer =
        !normalizedTrainerSearch ||
        (trainerName && trainerName.includes(normalizedTrainerSearch));
      const matchesPaymentId =
        !normalizedPaymentIdSearch ||
        (paymentId && paymentId.includes(normalizedPaymentIdSearch));

      // Extract month and year from paymentTime for dropdown filter
      const paidDate = new Date(item.paymentTime);
      const itemMonth = String(paidDate.getMonth() + 1).padStart(2, "0"); // "03"
      const itemYear = String(paidDate.getFullYear()); // "2025"
      const itemMonthYear = `${itemMonth}-${itemYear}`; // "03-2025"

      const matchesMonthYear =
        !selectedMonthYear || itemMonthYear === selectedMonthYear;

      // Return true if all filters match
      return (
        matchesUser && matchesTrainer && matchesPaymentId && matchesMonthYear
      );
    });
  }, [
    TrainerSessionCompletedData,
    normalizedUserSearch,
    normalizedTrainerSearch,
    normalizedPaymentIdSearch,
    selectedMonthYear,
    userInfoCache,
  ]);

  // Calculate total number of pages based on filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Slice data to get items for the current page
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          Completed Trainer Session&apos;s Invoices
        </h3>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
        {/* Search by User Name */}
        <div className="flex flex-col flex-1 max-w-[300px]">
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

        {/* Search by Trainer Name */}
        <div className="flex flex-col flex-1 max-w-[300px]">
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

        {/* Search by Payment ID */}
        <div className="flex flex-col flex-1 max-w-[300px]">
          <label className="text-sm font-semibold text-white mb-1">
            Search by Payment ID
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search payment ID..."
              value={paymentIdSearchTerm}
              onChange={(e) => setPaymentIdSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Month-Year Filter */}
        <div className="flex flex-col flex-1 max-w-[250px]">
          <label className="text-sm font-semibold text-white mb-1">
            Filter by Month & Year
          </label>
          <select
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {generateMonthYearOptions(TrainerSessionCompletedData).map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )
            )}
          </select>
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
                <th className="px-4 py-2 border">Booker</th>
                <th className="px-4 py-2 border">Trainer</th>
                <th className="px-4 py-2 border">Total Price</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Paid At</th>
                <th className="px-4 py-2 border">Card Holder</th>
                <th className="px-4 py-2 border">Payment ID</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* Serial Number */}
                  <td className="px-4 py-2 border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  {/* Booker Info */}
                  <td className="border px-4 py-2">
                    <TrainerBookingRequestUserBasicInfo
                      email={item?.BookingInfo?.bookerEmail}
                      renderUserInfo={(user) => (
                        <CachedUserInfo
                          user={user}
                          email={item?.BookingInfo?.bookerEmail}
                          setUserInfoCache={setUserInfoCache}
                          userInfoCache={userInfoCache}
                        />
                      )}
                    />
                  </td>

                  {/* Trainer Info */}
                  <td className="border px-4 py-2">
                    <BookedTrainerBasicInfo
                      trainerID={item?.BookingInfo?.trainerId}
                      py={1}
                    />
                  </td>

                  {/* Total Price */}
                  <td className="px-4 py-2 border">
                    {item?.BookingInfo?.totalPrice === "free"
                      ? "Free"
                      : `$ ${item.BookingInfo.totalPrice}`}
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-2 border">
                    {item?.BookingInfo?.durationWeeks === 1
                      ? "1 Week"
                      : `${item.BookingInfo.durationWeeks} Weeks`}
                  </td>

                  {/* Payment Time */}
                  <td className="px-4 py-2 border">
                    {new Date(item.paymentTime).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>

                  {/* Card Holder */}
                  <td className="px-4 py-2 border">{item.cardHolder}</td>

                  {/* Payment ID */}
                  <td className="px-4 py-2 border">
                    <span title={item.stripePaymentID}>
                      {item.stripePaymentID.length > 12
                        ? `${item.stripePaymentID.slice(
                            0,
                            6
                          )}...${item.stripePaymentID.slice(-4)}`
                        : item.stripePaymentID}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedCompletedInvoice(item);
                        modalCompletedInvoiceRef.current?.showModal();
                      }}
                      className="border-2 border-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                      id={`view-details-btn-${item._id}`}
                    >
                      <FaFileInvoiceDollar className="text-gray-500" />
                    </button>

                    <Tooltip
                      anchorSelect={`#view-details-btn-${item._id}`}
                      content="View Session Payment Invoice"
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
            No Active data available.
          </p>
        </div>
      )}

      {/* Modal for Invoice */}
      <dialog ref={modalCompletedInvoiceRef} className="modal">
        <UserSessionPaymentInvoiceModal
          closeModal={closeActiveCompletedModal}
          selectedPaymentInvoice={selectedCompletedInvoice}
        />
      </dialog>
    </>
  );
};

// Prop Validation
TrainerSessionCompletedInvoices.propTypes = {
  TrainerSessionCompletedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      cardHolder: PropTypes.string,
      paymentMethod: PropTypes.string,
      stripePaymentID: PropTypes.string,
      paymentTime: PropTypes.string,
      BookingInfo: PropTypes.shape({
        bookerEmail: PropTypes.string,
        trainer: PropTypes.string,
        trainerId: PropTypes.string,
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        durationWeeks: PropTypes.number,
        paidAt: PropTypes.string,
      }),
    })
  ),
};

export default TrainerSessionCompletedInvoices;
