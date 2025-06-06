import { useMemo, useRef, useState } from "react";

// Import Icons
import { FaInfo, FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Packages
import dayjs from "dayjs";

import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Utility
import { isBookingInMonthYear } from "../../../../Utility/bookingDateFilter";

// import Shared
import BookedTrainerBasicInfo from "../../../../Shared/Component/BookedTrainerBasicInfo";

// import Modals & Components
import AllTrainerBookingModal from "../AllTrainerBookingModal/AllTrainerBookingModal";
import TrainerBookingRequestUserBasicInfo from "../../../(TrainerPages)/TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import CachedUserInfo from "../CachedUserInfo";

const AllTrainerBookingHistory = ({ AllTrainerBookingHistoryData }) => {
  const modalTrainerBookingRef = useRef(null);

  // Store the currently selected booking for modal display
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Search input states for filtering by user and trainer names
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [trainerSearchTerm, setTrainerSearchTerm] = useState("");

  // Dropdown filter states for session count, duration, and month-year
  const [sessionFilter, setSessionFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [monthYearFilter, setMonthYearFilter] = useState("");

  // Cache loaded user data by email to prevent redundant fetches
  const [userInfoCache, setUserInfoCache] = useState({});

  // Pagination states: current page and fixed items per page count
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Normalized search strings
  const normalizedUserSearch = userSearchTerm.trim().toLowerCase();
  const normalizedTrainerSearch = trainerSearchTerm.trim().toLowerCase();

  // Extract unique session counts from accepted bookings for dropdown options
  const sessionOptions = useMemo(() => {
    const uniqueSessions = new Set(
      AllTrainerBookingHistoryData.map((b) => b.sessions.length)
    );
    return Array.from(uniqueSessions).sort((a, b) => a - b);
  }, [AllTrainerBookingHistoryData]);

  // Extract unique durations from accepted bookings for dropdown options
  const durationOptions = useMemo(() => {
    const uniqueDurations = new Set(
      AllTrainerBookingHistoryData.map((b) => b.durationWeeks)
    );
    return Array.from(uniqueDurations).sort((a, b) => a - b);
  }, [AllTrainerBookingHistoryData]);

  // Extract unique year-month values from booking dates for dropdown options
  const monthYearOptions = useMemo(() => {
    const unique = new Set();

    AllTrainerBookingHistoryData.forEach(({ bookedAt }) => {
      if (!bookedAt) return;

      // Fix format by appending seconds if missing, then split by T
      const fixed = bookedAt.length === 16 ? bookedAt + ":00" : bookedAt;
      const [datePart] = fixed.split("T");

      // Destructure date components: day, month, year
      // eslint-disable-next-line no-unused-vars
      const [day, month, year] = datePart.split("-");

      // Add year-month string to the set if valid
      if (year && month) {
        unique.add(`${year}-${month}`);
      }
    });

    // Sort descending to show recent months first
    return Array.from(unique).sort().reverse();
  }, [AllTrainerBookingHistoryData]);

  // Filter accepted bookings based on all active search and dropdown filters
  const filteredData = useMemo(() => {
    return AllTrainerBookingHistoryData.filter((booking) => {
      const user = userInfoCache[booking.bookerEmail];
      const userFullName = user?.fullName?.toLowerCase() || "";
      const trainer = booking.trainer?.toLowerCase() || "";

      // Match user search if provided
      const matchesUser =
        !normalizedUserSearch || userFullName.includes(normalizedUserSearch);

      // Match trainer search if provided
      const matchesTrainer =
        !normalizedTrainerSearch || trainer.includes(normalizedTrainerSearch);

      // Match session count filter if set
      const matchesSessions =
        !sessionFilter || booking.sessions.length === Number(sessionFilter);

      // Match duration filter if set
      const matchesDuration =
        !durationFilter || booking.durationWeeks === Number(durationFilter);

      // Match month-year filter using external helper function
      const matchesMonthYear = isBookingInMonthYear(
        booking.bookedAt,
        monthYearFilter
      );

      // Return true only if all conditions match
      return (
        matchesUser &&
        matchesTrainer &&
        matchesSessions &&
        matchesDuration &&
        matchesMonthYear
      );
    });
  }, [
    AllTrainerBookingHistoryData,
    normalizedUserSearch,
    normalizedTrainerSearch,
    sessionFilter,
    durationFilter,
    monthYearFilter,
    userInfoCache,
  ]);

  // Calculate total pages based on filtered data length and items per page
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Slice the filtered data to get the current page’s items
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to close the booking modal and clear selected booking state
  const closeTrainerBookingModal = () => {
    modalTrainerBookingRef.current?.close();
    setSelectedBooking(null);
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          All Trainer Bookings History
        </h3>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
        {/* Search by User Name */}
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

        {/* Search by Trainer Name */}
        <div className="flex flex-col flex-1 max-w-[300px]">
          <label className="text-sm font-semibold text-white mb-1">
            Search by Trainer Name
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search trainer..."
              value={trainerSearchTerm}
              onChange={(e) => setTrainerSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Filter: Sessions */}
        <div className="flex flex-col flex-1 max-w-[200px]">
          <label className="text-sm font-semibold text-white mb-1">
            Filter by Sessions
          </label>
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
          >
            <option value="">All</option>
            {sessionOptions.map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "session" : "sessions"}
              </option>
            ))}
          </select>
        </div>

        {/* Filter: Duration */}
        <div className="flex flex-col flex-1 max-w-[200px]">
          <label className="text-sm font-semibold text-white mb-1">
            Filter by Duration
          </label>
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
          >
            <option value="">All</option>
            {durationOptions.map((weeks) => (
              <option key={weeks} value={weeks}>
                {weeks} {weeks === 1 ? "week" : "weeks"}
              </option>
            ))}
          </select>
        </div>

        {/* Filter: Booked Month-Year */}
        <div className="flex flex-col flex-1 max-w-[200px]">
          <label className="text-sm font-semibold text-white mb-1">
            Filter by Month-Year ( Booked )
          </label>
          <select
            value={monthYearFilter}
            onChange={(e) => setMonthYearFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
          >
            <option value="">All</option>
            {monthYearOptions.map((val) => (
              <option key={val} value={val}>
                {new Date(val + "-01").toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </option>
            ))}
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
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Booker</th>
                <th className="px-4 py-2">Trainer</th>
                <th className="px-4 py-2">Sessions</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Booked At</th>
                <th className="px-4 py-2">Reason / End</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {currentData?.map((booking, idx) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  {/* Serial Number */}
                  <td className="px-4 py-2">{idx + 1}</td>

                  {/* Booker User Information */}
                  <td className="border px-4 py-2">
                    <TrainerBookingRequestUserBasicInfo
                      email={booking.bookerEmail}
                      renderUserInfo={(user) => (
                        <CachedUserInfo
                          user={user}
                          email={booking.bookerEmail}
                          setUserInfoCache={setUserInfoCache}
                          userInfoCache={userInfoCache}
                        />
                      )}
                    />
                  </td>

                  {/* Booker Trainer Information */}
                  <td className="border px-4 py-2">
                    <BookedTrainerBasicInfo
                      trainerID={booking.trainerId}
                      py={1}
                    />
                  </td>

                  {/* Sessions Count */}
                  <td className="border px-4 py-2">
                    {booking.sessions.length} session
                    {booking.sessions.length > 1 ? "s" : ""}
                  </td>

                  {/* Duration */}
                  <td className="border px-4 py-2">
                    {booking.durationWeeks}{" "}
                    {booking.durationWeeks === 1 ? "week" : "weeks"}
                  </td>

                  {/* Price */}
                  <td className="border px-4 py-2">
                    {booking.totalPrice === "Free" ||
                    parseFloat(booking.totalPrice) === 0
                      ? "Free"
                      : `$ ${booking.totalPrice}`}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2">
                    {booking.status === "Ended" ? "Completed" : booking.status}
                  </td>

                  {/* Booked At */}
                  <td className="border px-4 py-2">
                    {(() => {
                      const raw = booking.bookedAt;
                      const fixed = raw.length === 16 ? raw + ":00" : raw;
                      const [datePart, timePart] = fixed.split("T");
                      const [day, month, year] = datePart.split("-");
                      const iso = `${year}-${month}-${day}T${timePart}`;
                      const date = new Date(iso);
                      return date.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });
                    })()}
                  </td>

                  {/* Reasons */}
                  <td className="border px-4 py-2">
                    {booking.reason ? (
                      booking.reason
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">Ended :</p>
                        <p>
                          {dayjs(booking.startAt)
                            .add(booking.durationWeeks, "week")
                            .format("MMM D, YYYY")}
                        </p>
                      </div>
                    )}
                  </td>

                  {/* Action */}
                  <td className="border px-4 py-2">
                    <button
                      id={`view-details-btn-${booking._id}`}
                      className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        setSelectedBooking(booking);
                        modalTrainerBookingRef.current?.showModal();
                      }}
                    >
                      <FaInfo className="text-yellow-500" />
                    </button>
                    <Tooltip
                      anchorSelect={`#view-details-btn-${booking._id}`}
                      content="View Detailed Booking Info"
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
            No Booking History Available.
          </p>
        </div>
      )}

      <dialog ref={modalTrainerBookingRef} className="modal">
        <AllTrainerBookingModal
          closeModal={closeTrainerBookingModal}
          selectedBooking={selectedBooking}
        />
      </dialog>
    </>
  );
};

AllTrainerBookingHistory.propTypes = {
  AllTrainerBookingHistoryData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      trainer: PropTypes.string.isRequired,
      sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
      durationWeeks: PropTypes.number.isRequired,
      price: PropTypes.number,
      bookedAt: PropTypes.string,
      status: PropTypes.string,
      reason: PropTypes.string,
    })
  ).isRequired,
};

export default AllTrainerBookingHistory;
