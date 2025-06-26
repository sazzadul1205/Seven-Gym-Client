import { useMemo, useRef, useState } from "react";

// Import Packages
import { Tooltip } from "react-tooltip";
import PropTypes from "prop-types";

// Import Icons
import { FaFileInvoiceDollar, FaSearch } from "react-icons/fa";

// USer Basic information
import CachedUserInfo from "../../AllTrainerBookings/CachedUserInfo";
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// import Modal
import RejectedClassReceptModal from "../../../(UserPages)/UserSettings/UserClassRefundInvoices/RejectedClassReceptModal/RejectedClassReceptModal";

const AllClassBookingRefundedRecept = ({ ClassBookingRefundData }) => {
  const modalRefundInvoiceRef = useRef(null);

  // Selected State Management
  const [selectedRefundInvoice, setSelectedRefundInvoice] = useState(null);

  // State Management
  const [selectedClass, setSelectedClass] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  // Local Cache fo User Data
  const [userInfoCache, setUserInfoCache] = useState({});

  // Normalized search term
  const normalizedUserSearch = useMemo(
    () => userSearchTerm.trim().toLowerCase(),
    [userSearchTerm]
  );

  // Unique Filters
  const uniqueClasses = useMemo(() => {
    return [
      ...new Set(ClassBookingRefundData.map((d) => d.applicant?.classesName)),
    ];
  }, [ClassBookingRefundData]);

  const uniqueDurations = useMemo(() => {
    return [
      ...new Set(ClassBookingRefundData.map((d) => d.applicant?.duration)),
    ];
  }, [ClassBookingRefundData]);

  const uniqueMonthYears = useMemo(() => {
    return [
      ...new Set(
        ClassBookingRefundData.map((d) => {
          const date = new Date(d.applicant?.submittedDate);
          return `${date.toLocaleString("default", {
            month: "short",
          })}, ${date.getFullYear()}`;
        })
      ),
    ];
  }, [ClassBookingRefundData]);

  // Filtered Data Logic
  const filteredData = useMemo(() => {
    return ClassBookingRefundData.filter((item) => {
      const applicant = item.applicant || {};
      const applicantData = applicant.applicantData || {};

      const email =
        applicant.applicantEmail?.toLowerCase() ||
        applicantData.email?.toLowerCase() ||
        "";

      const userFullName = (
        userInfoCache[email]?.fullName ||
        applicantData?.name ||
        applicant?.name ||
        ""
      ).toLowerCase();

      // Search only by full name
      const matchesSearch =
        !normalizedUserSearch || userFullName.includes(normalizedUserSearch);

      const date = new Date(applicant?.submittedDate);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })}, ${date.getFullYear()}`;

      const matchesFilters =
        (!selectedClass || applicant.classesName === selectedClass) &&
        (!selectedDuration || applicant.duration === selectedDuration) &&
        (!selectedMonthYear || monthYear === selectedMonthYear);

      return matchesSearch && matchesFilters;
    });
  }, [
    ClassBookingRefundData,
    normalizedUserSearch,
    selectedMonthYear,
    selectedDuration,
    selectedClass,
    userInfoCache,
  ]);

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          All Class Refund Recept&apos;s
        </h3>
      </div>

      {/* Filter Section */}
      <div className="flex md:flex-row flex-col md:flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
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
          <label className="text-sm text-white mb-1">Search by Class</label>
          <select
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {uniqueClasses.map((cls, i) => (
              <option key={i} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm text-white mb-1">Search by Duration</label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Durations</option>
            {uniqueDurations.map((dur, i) => (
              <option key={i} value={dur}>
                {dur}
              </option>
            ))}
          </select>
        </div>

        {/* Month-Year Filter */}
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm text-white mb-1">Search by Date</label>
          <select
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Months</option>
            {uniqueMonthYears.map((my, i) => (
              <option key={i} value={my}>
                {my}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="hidden md:flex overflow-x-auto">
        {/* Data Table */}
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          {/* Table Header */}
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              {[
                "#",
                "Participants",
                "Class",
                "Duration",
                "Price ($)",
                "Refund ($)",
                "Dropped At",
                "Reason",
                "Status",
                "Action",
              ].map((heading) => (
                <th key={heading} className={`px-4 py-3 border`}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => {
                const applicant = item.applicant || {};
                const { classesName, duration, totalPrice } = applicant;
                const email = applicant?.applicantData?.email;
                return (
                  <tr key={item._id} className="border-b hover:bg-gray-100">
                    {/* Index */}
                    <td className="p-3">{idx + 1}</td>

                    {/* Class Name */}
                    <td className="p-3">
                      <TrainerBookingRequestUserBasicInfo
                        email={email}
                        renderUserInfo={(user) => (
                          <CachedUserInfo
                            user={user}
                            email={email}
                            setUserInfoCache={setUserInfoCache}
                            userInfoCache={userInfoCache}
                          />
                        )}
                      />
                    </td>

                    {/* Class Name */}
                    <td className="p-3">{classesName}</td>

                    {/* Duration */}
                    <td className="p-3">{duration}</td>

                    {/* Total Price */}
                    <td className="p-3 text-right">
                      $ {totalPrice.toFixed(2)}
                    </td>

                    {/* RefundPrice */}
                    <td className="p-3 text-right">
                      $ {item.refundAmount.toFixed(2)}
                    </td>

                    {/* Dropped At */}
                    <td className="p-3 text-center">
                      {new Date(
                        item.droppedAt || item.rejectedAt
                      ).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>

                    {/* Reason */}
                    <td className="p-3 text-left">{item.reason}</td>

                    {/* Status */}
                    <td className="p-3 text-center">
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {item.status}
                      </span>
                    </td>

                    {/* Invoice Button */}
                    <td className="p-3 text-center">
                      <button
                        id={`class-refund-invoice-${item._id}`}
                        className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          setSelectedRefundInvoice(item);
                          modalRefundInvoiceRef.current?.showModal();
                        }}
                      >
                        <FaFileInvoiceDollar className="text-red-500" />
                      </button>
                      <Tooltip
                        anchorSelect={`#class-refund-invoice-${item._id}`}
                        content="View Refund Invoice"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-6 bg-white text-black font-semibold italic"
                >
                  No Booking Accepted Data Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Class Payment Invoice Modal */}
      <dialog
        ref={modalRefundInvoiceRef}
        id="Rejected_Class_Recept_Modal"
        className="modal"
      >
        <RejectedClassReceptModal SelectRefundInvoice={selectedRefundInvoice} />
      </dialog>
    </>
  );
};

// Prop Validation
AllClassBookingRefundedRecept.propTypes = {
  ClassBookingRefundData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      applicant: PropTypes.shape({
        applicantData: PropTypes.object,
        applicantEmail: PropTypes.string,
        classesName: PropTypes.string,
        duration: PropTypes.string,
        totalPrice: PropTypes.number,
        submittedDate: PropTypes.string,
        name: PropTypes.string,
      }),
      refundAmount: PropTypes.number.isRequired,
      droppedAt: PropTypes.string,
      rejectedAt: PropTypes.string,
      reason: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
};

export default AllClassBookingRefundedRecept;
