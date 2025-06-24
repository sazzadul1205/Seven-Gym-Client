import { useMemo, useState } from "react";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { FaSearch, FaInfo } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import TrainerBookingRequestUserBasicInfo from "../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import CachedUserInfo from "../../(AdminPanel)/AllTrainerBookings/CachedUserInfo";
import PropTypes from "prop-types";

import ClassRejectedDetailsModal from "../../(UserPages)/UserClassManagement/UserClassManagementRejected/ClassRejectedDetailsModal/ClassRejectedDetailsModal";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

const ClassRejected = ({ ClassBookingRejectedData }) => {
  // Local Cache fo User Data
  const [userInfoCache, setUserInfoCache] = useState({});
  const [selectedRejectedData, setSelectedRejectedData] = useState("");

  // State Management
  const [selectedClass, setSelectedClass] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Normalized search term
  const normalizedUserSearch = useMemo(
    () => userSearchTerm.trim().toLowerCase(),
    [userSearchTerm]
  );

  // Unique Filters
  const uniqueClasses = useMemo(() => {
    return [
      ...new Set(ClassBookingRejectedData.map((d) => d.applicant?.classesName)),
    ];
  }, [ClassBookingRejectedData]);

  const uniqueDurations = useMemo(() => {
    return [
      ...new Set(ClassBookingRejectedData.map((d) => d.applicant?.duration)),
    ];
  }, [ClassBookingRejectedData]);

  const uniqueMonthYears = useMemo(() => {
    return [
      ...new Set(
        ClassBookingRejectedData.map((d) => {
          const date = new Date(d.applicant?.submittedDate);
          return `${date.toLocaleString("default", {
            month: "short",
          })}, ${date.getFullYear()}`;
        })
      ),
    ];
  }, [ClassBookingRejectedData]);

  // Filtered Data Logic
  const filteredData = useMemo(() => {
    return ClassBookingRejectedData.filter((item) => {
      const applicant = item.applicant || {};
      const applicantData = applicant.applicantData || {};

      // ✅ Fallback order: Cache > applicantData.name > applicant.name
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

      // 🗓 Month-Year Filtering
      const date = new Date(applicant?.submittedDate);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })}, ${date.getFullYear()}`;

      // ✅ Class, Duration, Month-Year, and Status Filters
      const matchesFilters =
        (!selectedClass || applicant.classesName === selectedClass) &&
        (!selectedDuration || applicant.duration === selectedDuration) &&
        (!selectedMonthYear || monthYear === selectedMonthYear) &&
        (filterStatus === "all" || item.status === filterStatus);

      return matchesSearch && matchesFilters;
    });
  }, [
    ClassBookingRejectedData,
    normalizedUserSearch,
    selectedMonthYear,
    selectedDuration,
    filterStatus,
    selectedClass,
    userInfoCache,
  ]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDrawer = () => {
    const drawerCheckbox = document.getElementById("trainer-settings-drawer");
    if (drawerCheckbox) drawerCheckbox.checked = true;
  };

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen text-black">
      {/* Header */}
      <div className="flex md:block items-center justify-between md:mx-auto md:text-center space-y-1 py-4 px-2">
        <h3 className="text-xl md:text-2xl sm:text-3xl font-bold text-gray-800">
          Class Booking Rejected / Dropped
        </h3>
        <div
          className="flex md:hidden p-1 bg-white rounded-full"
          onClick={openDrawer}
        >
          <div className="bg-blue-200 p-2 rounded-full">
            <RiArchiveDrawerLine className="text-2xl" />
          </div>
        </div>
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

        {/* Rejected Toggle */}
        <div className="flex flex-col items-center">
          <label className="text-sm text-white mb-1">Rejected</label>
          <input
            type="checkbox"
            className="toggle toggle-lg toggle-error"
            checked={filterStatus === "Rejected"}
            onChange={() =>
              setFilterStatus((prev) =>
                prev === "Rejected" ? "all" : "Rejected"
              )
            }
          />
        </div>

        {/* Dropped Toggle */}
        <div className="flex flex-col items-center">
          <label className="text-sm text-white mb-1">Dropped</label>
          <input
            type="checkbox"
            className="toggle toggle-lg toggle-warning"
            checked={filterStatus === "Dropped"}
            onChange={() =>
              setFilterStatus((prev) =>
                prev === "Dropped" ? "all" : "Dropped"
              )
            }
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {/* Data Table */}
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          {/* Table Header */}
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="py-3 px-4 border">#</th>
              <th className="py-3 px-4 border">Applicant</th>
              <th className="py-3 px-4 border">Phone</th>
              <th className="py-3 px-4 border">Class Name</th>
              <th className="py-3 px-4 border">Duration</th>
              <th className="py-3 px-4 border">Submitted</th>
              <th className="py-3 px-4 border">Dropped/Rejected</th>
              <th className="py-3 px-4 border">Status</th>
              <th className="py-3 px-4 border">Reason</th>
              <th className="py-3 px-4 border">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {currentData?.length > 0 ? (
              currentData.map((item, index) => {
                const applicant =
                  item.applicant.applicantData || item.applicant;
                const altEmail = applicant.applicantEmail;
                const { email} = applicant;

                return (
                  <tr key={item?._id} className="bg-white hover:bg-gray-50">
                    {/* Serial Number */}
                    <td className="py-3 px-4 font-medium">{index + 1}</td>

                    {/* Applicant */}
                    <td className="p-3 font-semibold">
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

                    {/* Class NAme */}
                    <td className="p-3">{item?.applicant?.classesName}</td>

                    {/* Duration */}
                    <td className="p-3 capitalize">
                      {item?.applicant?.duration}
                    </td>

                    {/* Submitted At */}
                    <td className="p-3">
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

                    {/* Rejected At / Dropped At */}
                    <td className="p-3">
                      {new Date(
                        item?.rejectedAt || item?.droppedAt
                      ).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>

                    {/* Status */}
                    <td className="p-3 font-bold">
                      <span
                        className={`px-2 py-1 rounded-md text-white ${
                          item?.status === "Rejected"
                            ? "bg-red-500"
                            : item?.status === "Dropped"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {item?.status}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="p-3 text-sm">{item?.reason}</td>

                    {/* Action */}
                    <td className="p-3">
                      <button
                        id={`details-applicant-btn-${item._id}`}
                        className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                        onClick={() => {
                          document
                            .getElementById("Class_Reject_Details_Modal")
                            .showModal();
                          setSelectedRejectedData(item);
                        }}
                      >
                        <FaInfo className="text-yellow-500" />
                      </button>
                      <Tooltip
                        anchorSelect={`#details-applicant-btn-${item._id}`}
                        className="!z-[9999]"
                        content="Details Rejected Data"
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
                  No Booking Rejected / Dropped Data Available.
                </td>
              </tr>
            )}
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

      {/* Modal */}
      <dialog id="Class_Reject_Details_Modal" className="modal">
        <ClassRejectedDetailsModal
          id="Class_Reject_Details_Modal"
          selectedRejectedData={selectedRejectedData}
        />
      </dialog>
    </div>
  );
};

ClassRejected.propTypes = {
  ClassBookingRejectedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      applicant: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        classesName: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        totalPrice: PropTypes.number.isRequired,
        submittedDate: PropTypes.string.isRequired,
        applicantData: PropTypes.shape({
          Userid: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          email: PropTypes.string,
          phone: PropTypes.string,
        }),
      }),
      status: PropTypes.string.isRequired,
      rejectedAt: PropTypes.string,
      droppedAt: PropTypes.string,
      reason: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ClassRejected;
