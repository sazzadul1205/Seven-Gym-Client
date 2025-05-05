import { Link } from "react-router";
import { useState } from "react";

// import Prop Validation
import PropTypes from "prop-types";

const TrainerDashboardSessionHistory = ({
  TrainerBookingAccepted,
  TrainerBookingHistory,
}) => {
  // Controls how many entries are initially visible
  const [visibleCount] = useState(5);

  // Merge accepted and historical bookings into one array (defensive fallback with || [])
  const CombinedTrainerBookings = [
    ...(TrainerBookingAccepted || []),
    ...(TrainerBookingHistory || []),
  ];

  // Sort bookings by 'loggedTime' descending — most recent first
  const sortedBookings = [...CombinedTrainerBookings].sort((a, b) => {
    const [d1, m1, y1, t1 = "00:00"] = a.loggedTime.split(" ");
    const [d2, m2, y2, t2 = "00:00"] = b.loggedTime.split(" ");
    const dateA = new Date(`${y1}-${m1}-${d1}T${t1}:00`);
    const dateB = new Date(`${y2}-${m2}-${d2}T${t2}:00`);
    return dateB - dateA;
  });

  // Get only the visible subset of the bookings
  const visibleBookings = sortedBookings.slice(0, 5);

  // Format 'loggedTime' into readable form: dd mm yyyy hh:mm AM/PM
  const formatLoggedTime = (timeStr) => {
    const [d, m, y, time = "00:00"] = timeStr.split(" ");
    const date = new Date(`${y}-${m}-${d}T${time}:00`);
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedTime = date.toLocaleTimeString("en-US", options);
    return `${d} ${m} ${y} ${formattedTime}`;
  };

  // Calculate end date of a session from start date and duration
  const getEndDate = (startAt, durationWeeks) => {
    if (!startAt || !durationWeeks) return null;
    const startDate = new Date(startAt);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationWeeks * 7);
    return endDate.toISOString().split("T")[0]; // yyyy-mm-dd
  };

  return (
    <div className="w-full text-black">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-center mb-6">
        Trainer Session History
      </h2>

      {/* Table Header: visible only on medium+ screens */}
      <div className="hidden md:flex font-semibold border-2 border-white px-5 py-3 bg-gray-800 text-white">
        <div className="w-1/12">#</div>
        <div className="w-3/12">Logged Time</div>
        <div className="w-3/12">Email</div>
        <div className="w-2/12">Status</div>
        <div className="w-3/12">Details</div>
      </div>

      {/* Table Body: list of session records */}
      <div>
        {visibleBookings.map((entry, index) => (
          <div
            key={entry._id}
            className="flex flex-col md:flex-row border rounded px-4 py-5 bg-gray-50"
          >
            {/* Serial Number */}
            <div className="md:w-1/12 font-semibold">[{index + 1}]</div>

            {/* Formatted Logged Time */}
            <div className="md:w-3/12">
              {formatLoggedTime(entry.loggedTime)}
            </div>

            {/* Booker Email */}
            <div className="md:w-3/12 break-words">{entry.bookerEmail}</div>

            {/* Status (Accepted, Cancelled, Ended, Dropped, etc.) */}
            <div className="md:w-2/12">{entry.status}</div>

            {/* Dynamic Details Based on Status */}
            <div className="md:w-3/12 space-y-1">
              {/* Show reason if booking was Cancelled or Dropped */}
              {["Cancelled", "Dropped"].includes(entry.status) && (
                <p>
                  <span className="font-medium">Reason:</span> {entry.reason}
                </p>
              )}

              {/* Extra details for Dropped status */}
              {entry.status === "Dropped" && (
                <>
                  <p>
                    <span className="font-medium">Dropped At:</span>{" "}
                    {entry.droppedAt}
                  </p>
                  <p>
                    <span className="font-medium">Refund:</span>{" "}
                    {entry.RefundPercentage} ({entry.RefundAmount} $ )
                  </p>
                </>
              )}

              {/* Payment info for Accepted bookings */}
              {entry.status === "Accepted" && (
                <>
                  <p>
                    <span className="font-medium">Paid:</span>{" "}
                    {entry.paid ? "Yes" : "No"}
                  </p>
                  {entry.paid && (
                    <p>
                      <span className="font-medium">Paid At:</span>{" "}
                      {entry.paidAt}
                    </p>
                  )}
                </>
              )}

              {/* Show end date for Ended bookings */}
              {entry.status === "Ended" && (
                <p>
                  <span className="font-medium">End At:</span>{" "}
                  {getEndDate(entry.startAt, entry.durationWeeks)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button: link to full session log view if more exist */}
      {visibleCount < sortedBookings.length && (
        <div className="text-center py-5 bg-gray-800">
          <Link
            to={`/Trainer?tab=Trainer_Logs`}
            className="text-white font-bold underline hover:text-gray-300 cursor-pointer"
          >
            ... Show More
          </Link>
        </div>
      )}
    </div>
  );
};

// ✅ PropTypes validation
TrainerDashboardSessionHistory.propTypes = {
  TrainerBookingAccepted: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      loggedTime: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string,
      status: PropTypes.string,
      reason: PropTypes.string,
      droppedAt: PropTypes.string,
      RefundPercentage: PropTypes.string,
      RefundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paid: PropTypes.bool,
      paidAt: PropTypes.string,
      startAt: PropTypes.string,
      durationWeeks: PropTypes.number,
    })
  ),
  TrainerBookingHistory: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      loggedTime: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string,
      status: PropTypes.string,
      reason: PropTypes.string,
      droppedAt: PropTypes.string,
      RefundPercentage: PropTypes.string,
      RefundAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paid: PropTypes.bool,
      paidAt: PropTypes.string,
      startAt: PropTypes.string,
      durationWeeks: PropTypes.number,
    })
  ),
};

export default TrainerDashboardSessionHistory;
