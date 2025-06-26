import { useMemo, useState } from "react";

// import Packages
import PropTypes from "prop-types";

// import Icons
import { FaSearch } from "react-icons/fa";

// import Component
import CachedUserInfo from "../../AllTrainerBookings/CachedUserInfo";
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

const AllClassBookingRequest = ({ ClassBookingRequestData }) => {
  // State Management
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  // Local Cache fo User Data
  const [userInfoCache, setUserInfoCache] = useState({});

  const normalizedUserSearch = useMemo(
    () => userSearchTerm.trim().toLowerCase(),
    [userSearchTerm]
  );

  // Unique Filters
  const uniqueClasses = useMemo(() => {
    return [...new Set(ClassBookingRequestData.map((d) => d.classesName))];
  }, [ClassBookingRequestData]);

  const uniqueDurations = useMemo(() => {
    return [...new Set(ClassBookingRequestData.map((d) => d.duration))];
  }, [ClassBookingRequestData]);

  const uniqueMonthYears = useMemo(() => {
    return [
      ...new Set(
        ClassBookingRequestData.map((d) => {
          const date = new Date(d.submittedDate);
          return `${date.toLocaleString("default", {
            month: "short",
          })}, ${date.getFullYear()}`;
        })
      ),
    ];
  }, [ClassBookingRequestData]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return ClassBookingRequestData.filter((item) => {
      const applicant = item.applicantData || item;
      const email = applicant?.applicantEmail?.toLowerCase() || "";
      const phone = applicant?.applicantPhone?.toLowerCase() || "";

      const cachedUser = userInfoCache[email];
      const userFullName = cachedUser?.fullName?.toLowerCase() || "";

      const matchesSearch =
        !normalizedUserSearch ||
        email.includes(normalizedUserSearch) ||
        phone.includes(normalizedUserSearch) ||
        userFullName.includes(normalizedUserSearch);

      const date = new Date(item.submittedDate);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })}, ${date.getFullYear()}`;

      const matchesFilters =
        (!selectedClass || item.classesName === selectedClass) &&
        (!selectedDuration || item.duration === selectedDuration) &&
        (!selectedMonthYear || monthYear === selectedMonthYear);

      return matchesSearch && matchesFilters;
    });
  }, [
    ClassBookingRequestData,
    normalizedUserSearch,
    selectedClass,
    selectedDuration,
    selectedMonthYear,
    userInfoCache,
  ]);

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen text-black">
      {/* Header Section */}
      <div className="flex md:block items-center md:mx-auto md:text-center space-y-1 py-4 px-2">
        {/* Title Cars */}
        <div>
          {/* Title */}
          <h3 className="text-xl md:text-2xl sm:text-3xl font-bold text-gray-800">
            Class Booking Requests
          </h3>

          {/* Sub Title */}
          <p className="text-black text-sm md:text-base mt-1">
            Manage and respond to client class bookings
          </p>
        </div>
      </div>

      <div className="mx-auto bg-white w-1/3 p-[1px] mb-3" />

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
                "Applicant Info",
                "Class Name",
                "Duration",
                "Price",
                "Submitted",
                "Phone",
              ].map((label, i) => (
                <th key={i} className="px-4 py-4 border">
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                const applicant = item.applicantData || item;
                const email =
                  applicant?.applicantEmail || item?.applicantData?.email;

                return (
                  <tr key={item._id} className="bg-white hover:bg-gray-50">
                    {/* Serial Number */}
                    <td className="py-3 px-4 font-medium">{index + 1}</td>

                    {/* User Info */}
                    <td className="px-4 py-3 font-medium">
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
                    <td className="py-3 px-4">{item.classesName}</td>

                    {/* Class Duration */}
                    <td className="py-3 px-4 capitalize">{item.duration}</td>

                    {/* Class Price */}
                    <td className="py-3 px-4 font-semibold">
                      $ {parseFloat(item.totalPrice).toFixed(2)}
                    </td>

                    {/* Class Applied Date */}
                    <td className="py-3 px-4">
                      {new Date(item.submittedDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Applicant Number */}
                    <td className="py-3 px-4">
                      {(() => {
                        const rawPhone =
                          applicant?.applicantPhone || applicant?.phone || "";

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
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 bg-white text-black font-semibold italic"
                >
                  No Booking Request Available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Prop Vallation
AllClassBookingRequest.propTypes = {
  ClassBookingRequestData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      applicantData: PropTypes.object,
      applicantEmail: PropTypes.string,
      applicantPhone: PropTypes.string,
      classesName: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      submittedDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};

export default AllClassBookingRequest;
