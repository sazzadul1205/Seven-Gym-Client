import { useMemo, useState } from "react";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Icons
import { FaInfo, FaSearch } from "react-icons/fa";

// Import Date Formation
import { format, parse } from "date-fns";

// Import User Info Card
import CachedUserInfo from "../../AllTrainerBookings/CachedUserInfo";

// Import Booking Request User Info
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// import Modal
import ClassAcceptedDetailsModal from "../../../(ClassManagement)/ClassAccepted/ClassAcceptedDetailsModal/ClassAcceptedDetailsModal";

const AllClassBookingAccepted = ({ ClassBookingAcceptedData }) => {
  // State Management
  const [selectedClass, setSelectedClass] = useState("");
  const [showOnlyPaid, setShowOnlyPaid] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [selectedBookingAcceptedData, setSelectedBookingAcceptedData] =
    useState("");
  const [showOnlyStarted, setShowOnlyStarted] = useState(false);

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
      ...new Set(ClassBookingAcceptedData.map((d) => d.applicant?.classesName)),
    ];
  }, [ClassBookingAcceptedData]);

  const uniqueDurations = useMemo(() => {
    return [
      ...new Set(ClassBookingAcceptedData.map((d) => d.applicant?.duration)),
    ];
  }, [ClassBookingAcceptedData]);

  const uniqueMonthYears = useMemo(() => {
    return [
      ...new Set(
        ClassBookingAcceptedData.map((d) => {
          const date = new Date(d.applicant?.submittedDate);
          return `${date.toLocaleString("default", {
            month: "short",
          })}, ${date.getFullYear()}`;
        })
      ),
    ];
  }, [ClassBookingAcceptedData]);

  // Filtered Data Logic
  const filteredData = useMemo(() => {
    return ClassBookingAcceptedData.filter((item) => {
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

      // 🔍 Search only by full name
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

      const matchesPayment = !showOnlyPaid || item.paid === true;
      const matchesStarted = !showOnlyStarted || Boolean(item.startDate);

      return (
        matchesSearch && matchesFilters && matchesPayment && matchesStarted
      );
    });
  }, [
    ClassBookingAcceptedData,
    normalizedUserSearch,
    selectedMonthYear,
    selectedDuration,
    showOnlyStarted,
    selectedClass,
    userInfoCache,
    showOnlyPaid,
  ]);

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          All Class Booking Accepted
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

        {/* Paid Filter */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-1">All / Paid</label>
          <input
            type="checkbox"
            className="toggle toggle-xl toggle-secondary"
            checked={showOnlyPaid}
            onChange={(e) => setShowOnlyPaid(e.target.checked)}
          />
        </div>

        {/* Start Time Set Filter */}
        <div className="flex flex-col">
          <label className="text-sm text-white mb-1">Pending Only</label>
          <input
            type="checkbox"
            className="toggle toggle-xl toggle-primary"
            checked={showOnlyStarted}
            onChange={(e) => setShowOnlyStarted(e.target.checked)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="hidden md:flex overflow-x-auto">
        {/* Data Table */}
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          {/* Table Header */}
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="py-3 px-4 border">#</th>
              <th className="py-3 px-4 border">Applicant</th>
              <th className="py-3 px-4 border">Class Name</th>
              <th className="py-3 px-4 border">Phone</th>
              <th className="py-3 px-4 border">Duration</th>
              <th className="py-3 px-4 border">Price</th>
              <th className="py-3 px-4 border">Submitted</th>
              <th className="py-3 px-4 border">Start At</th>
              <th className="py-3 px-4 border">End At</th>
              <th className="py-3 px-4 border">Paid</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredData.length > 0 ? (
              filteredData?.map((item, index) => {
                const applicant =
                  item.applicant.applicantData || item.applicant;
                const altEmail = applicant.applicantEmail;
                const { email } = applicant;
                const paid = item.paid;

                const isCompleted = isClassCompleted(item.endDate);
                return (
                  <tr
                    key={item._id}
                    className={`${
                      isCompleted
                        ? "bg-red-100 hover:bg-red-200"
                        : !paid
                        ? "bg-yellow-100 hover:bg-yellow-200"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {/* Serial Number */}
                    <td className="py-3 px-4 font-medium">{index + 1}</td>

                    {/* User Info */}
                    <td className="py-3 px-4">
                      <TrainerBookingRequestUserBasicInfo
                        email={email || altEmail}
                        renderUserInfo={(user) => (
                          <CachedUserInfo
                            user={user}
                            email={email || altEmail}
                            setUserInfoCache={setUserInfoCache}
                            userInfoCache={userInfoCache}
                          />
                        )}
                      />
                    </td>

                    {/* Class Name */}
                    <td className="py-3 px-4 font-semibold">
                      {isCompleted ? (
                        <span className="text-red-600">Completed</span>
                      ) : (
                        item.applicant.classesName
                      )}
                    </td>

                    {/* Applicant Number */}
                    <td className="p-3">
                      {(() => {
                        const rawPhone =
                          item.applicant?.applicantData?.phone ||
                          item.applicant?.applicantPhone ||
                          "";

                        // Ensure it starts with a '+' and add a space after the first 3 digits
                        const formattedPhone = rawPhone
                          ? `${
                              rawPhone.startsWith("+") ? "" : "+"
                            }${rawPhone}`.replace(
                              /^(\+\d{3})(\d+)/,
                              (_, code, rest) => `${code} ${rest}`
                            )
                          : "N/A";

                        return formattedPhone;
                      })()}
                    </td>

                    {/* Applicant Phone Number */}
                    <td className="py-3 px-4">{item.applicant.duration}</td>

                    {/* Class Price */}
                    <td className="py-3 px-4">
                      $ {parseFloat(item.applicant.totalPrice).toFixed(2)}
                    </td>

                    {/* Submitted At */}
                    <td className="py-3 px-4">
                      {new Date(item?.applicant?.submittedDate).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </td>

                    {/* Start At */}
                    <td className="py-3 px-4">
                      {paid ? (
                        item.startDate ? (
                          <span className="text-black font-medium">
                            {formatDate(item.startDate)}
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">
                            Set Start Time ...
                          </span>
                        )
                      ) : (
                        <span className="italic text-gray-500">
                          Waiting for payment...
                        </span>
                      )}
                    </td>

                    {/* End At */}
                    <td className="py-3 px-4">
                      {paid ? (
                        item.endDate ? (
                          <span className="text-black font-medium">
                            {formatDate(item.endDate)}
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">
                            Set End Time ...
                          </span>
                        )
                      ) : (
                        <span className="italic text-gray-500">
                          Waiting for payment...
                        </span>
                      )}
                    </td>

                    {/* End At */}

                    <td className="p-3 font-bold">
                      {paid ? (
                        <span className="text-green-600">Paid</span>
                      ) : (
                        <span className="text-red-500">Unpaid</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-3">
                        <>
                          <button
                            id={`details-applicant-btn-${item._id}`}
                            className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                            onClick={() => {
                              setSelectedBookingAcceptedData(item);
                              document
                                .getElementById("Class_Accepted_Details_Modal")
                                .showModal();
                            }}
                          >
                            <FaInfo className="text-yellow-500" />
                          </button>
                          <Tooltip
                            anchorSelect={`#details-applicant-btn-${item._id}`}
                            content="details Applicant"
                          />
                        </>
                      </div>
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

        {/* Modal */}
        <dialog id="Class_Accepted_Details_Modal" className="modal">
          <ClassAcceptedDetailsModal
            selectedBookingAcceptedData={selectedBookingAcceptedData}
          />
        </dialog>
      </div>
    </>
  );
};

// Prop Validation
AllClassBookingAccepted.propTypes = {
  ClassBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      applicant: PropTypes.shape({
        applicantData: PropTypes.object,
        applicantEmail: PropTypes.string,
        applicantPhone: PropTypes.string,
        classesName: PropTypes.string,
        duration: PropTypes.string,
        name: PropTypes.string,
        phone: PropTypes.string,
        submittedDate: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      paid: PropTypes.bool,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    })
  ).isRequired,
};

export default AllClassBookingAccepted;

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  // Parse date from "dd-MM-yyyy" format
  const parsedDate = parse(dateStr, "dd-MM-yyyy", new Date());

  // If invalid date, fallback
  if (isNaN(parsedDate)) return dateStr;

  // Format to "MMM, d, yyyy" → e.g. Mar, 20, 2025
  return format(parsedDate, "MMM, d  yyyy");
};

const isClassCompleted = (endDateStr) => {
  if (!endDateStr) return false;

  const [day, month, year] = endDateStr.split("-").map(Number);
  const endDate = new Date(year, month - 1, day);
  const today = new Date();

  // Set both to midnight for date-only comparison
  endDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return endDate < today; // strictly before today
};
