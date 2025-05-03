import { useMemo } from "react";

/**
 * TrainerLogs component
 * Displays logs of trainer bookings, sorted by logged time.
 * - On desktop (sm and up): renders a table layout.
 * - On mobile (below sm): falls back to a card-style list view.
 */
const TrainerLogs = ({ TrainerBookingAccepted, TrainerBookingHistory }) => {
  // useMemo to memoize the sorted bookings list to avoid unnecessary re-computation on re-renders
  const sortedBookings = useMemo(() => {
    // Merge accepted and history bookings into one list
    const combined = [
      ...(TrainerBookingAccepted || []), // Use empty array fallback
      ...(TrainerBookingHistory || []),
    ];

    // Filter out entries without a valid loggedTime, then sort by newest first
    return combined
      .filter((entry) => entry.loggedTime)
      .sort((a, b) => {
        // Parse loggedTime assuming format 'dd mm yyyy hh:mm'
        const [d1, m1, y1, t1 = "00:00"] = a.loggedTime.split(" ");
        const [d2, m2, y2, t2 = "00:00"] = b.loggedTime.split(" ");
        const dateA = new Date(`${y1}-${m1}-${d1}T${t1}:00`);
        const dateB = new Date(`${y2}-${m2}-${d2}T${t2}:00`);
        return dateB - dateA; // Sort in descending order (newest first)
      });
  }, [TrainerBookingAccepted, TrainerBookingHistory]);

  // Format a date string from 'dd mm yyyy hh:mm' to human-readable 12-hour format
  const formatLoggedTime = (timeStr) => {
    const [d, m, y, time = "00:00"] = timeStr.split(" ");
    const date = new Date(`${y}-${m}-${d}T${time}:00`);
    return `${d} ${m} ${y} ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  };

  // Calculate end date of a booking by adding durationWeeks to the startAt date
  const getEndDate = (startAt, durationWeeks) => {
    if (!startAt || !durationWeeks) return "N/A";
    const start = new Date(startAt);
    const end = new Date(start);
    end.setDate(start.getDate() + durationWeeks * 7);
    return end.toISOString().split("T")[0]; // Format as yyyy-mm-dd
  };

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Page Header */}
      <div className="text-center py-3">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Trainer Log
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          See the full log of your activity
        </p>
      </div>

      {/* Decorative Divider */}
      <div className="mx-auto bg-white w-1/3 h-[1px] mb-6" />

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
        <table className="min-w-full bg-white">
          {/* Table Header */}
          <thead className="bg-gray-800 text-white text-sm uppercase">
            <tr>
              {["#", "Logged Time", "User Email", "Status", "Details"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 border border-white text-left"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-sm text-center text-gray-700">
            {sortedBookings.map((entry, index) => (
              <tr
                key={entry._id || index}
                className="odd:bg-gray-50 even:bg-white text-left"
              >
                {/* Log Number */}
                <td className="p-3">[{index + 1}]</td>

                {/* Time */}
                <td className="border py-2 px-5">
                  {entry.loggedTime
                    ? formatLoggedTime(entry.loggedTime)
                    : "N/A"}
                </td>

                {/* User Email */}
                <td className="border py-2 px-5">
                  {entry.bookerEmail || "N/A"}
                </td>

                {/* Status */}
                <td className="border py-2 px-5">
                  {entry.status || "Unknown"}
                </td>

                {/* Details */}
                <td className="border py-2 px-5 space-y-1">
                  {/* Show reason for cancellation or drop */}
                  {["Cancelled", "Dropped"].includes(entry.status) && (
                    <p>
                      <span className="font-medium">Reason:</span>{" "}
                      {entry.reason || "N/A"}
                    </p>
                  )}

                  {/* Drop-specific details */}
                  {entry.status === "Dropped" && (
                    <>
                      <p>
                        <span className="font-medium">Dropped At:</span>{" "}
                        {entry.droppedAt || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Refund:</span>{" "}
                        {entry.RefundPercentage || "0%"} (
                        {entry.RefundAmount || 0} $)
                      </p>
                    </>
                  )}

                  {/* Accepted session payment info */}
                  {entry.status === "Accepted" && (
                    <>
                      <p>
                        <span className="font-medium">Paid:</span>{" "}
                        {entry.paid ? "Yes" : "No"}
                      </p>
                      {entry.paid && (
                        <p>
                          <span className="font-medium">Paid At:</span>{" "}
                          {entry.paidAt || "N/A"}
                        </p>
                      )}
                    </>
                  )}

                  {/* Ended session - show end date */}
                  {entry.status === "Ended" && (
                    <p>
                      <span className="font-medium">End At:</span>{" "}
                      {getEndDate(entry.startAt, entry.durationWeeks)}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (below sm) */}
      <div className="md:hidden text-black">
        {sortedBookings.map((entry, index) => (
          <div
            key={entry._id || index}
            className="border border-gray-300 rounded-md shadow-sm p-4 bg-white space-y-2"
          >
            {/* Log */}
            <p className="text-sm font-bold mb-2">Log #{index + 1}</p>
            
            {/* Log Time */}
            <div className="flex justify-between">
              <span className="font-medium">Logged Time:</span>{" "}
              {entry.loggedTime ? formatLoggedTime(entry.loggedTime) : "N/A"}
            </div>

            {/* User Email */}
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>{" "}
              {entry.bookerEmail || "N/A"}
            </div>

            {/* Status */}
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>{" "}
              {entry.status || "Unknown"}
            </div>

            {/* Cancellation or drop reason */}
            {["Cancelled", "Dropped"].includes(entry.status) && (
              <div className="flex justify-between">
                <span className="font-medium">Reason:</span>{" "}
                {entry.reason || "N/A"}
              </div>
            )}

            {/* Drop-specific details */}
            {entry.status === "Dropped" && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Dropped At:</span>{" "}
                  {entry.droppedAt || "N/A"}
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Refund:</span>{" "}
                  {entry.RefundPercentage || "0%"} ({entry.RefundAmount || 0} $)
                </div>
              </>
            )}

            {/* Payment status for accepted bookings */}
            {entry.status === "Accepted" && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Paid:</span>{" "}
                  {entry.paid ? "Yes" : "No"}
                </div>
                {entry.paid && (
                  <div className="flex justify-between">
                    <span className="font-medium">Paid At:</span>{" "}
                    {entry.paidAt || "N/A"}
                  </div>
                )}
              </>
            )}

            {/* End date for ended bookings */}
            {entry.status === "Ended" && (
              <div className="flex justify-between">
                <span className="font-medium">End At:</span>{" "}
                {getEndDate(entry.startAt, entry.durationWeeks)}
              </div>
            )}
          </div>
        ))}

        {/* Show message if no logs are found */}
        {sortedBookings.length === 0 && (
          <p className="text-center text-gray-600 py-6">
            No training logs available.
          </p>
        )}
      </div>
    </div>
  );
};

export default TrainerLogs;
