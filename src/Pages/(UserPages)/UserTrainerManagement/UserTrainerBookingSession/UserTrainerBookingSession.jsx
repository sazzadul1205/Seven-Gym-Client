import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Components
import TrainerBookingSessionButton from "./TrainerBookingSessionButton/TrainerBookingSessionButton";

// Utilities
import { formatDate } from "../../../../Utility/formatDate";
import { getRemainingTime } from "../../../../Utility/getRemainingTime";
import { FaTriangleExclamation } from "react-icons/fa6";

// Background color based on booking status
const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-300 text-white";
    case "Rejected":
    case "Cancelled":
      return "flex";
    case "Expired":
      return "bg-gray-300 text-white";
    default:
      return "bg-white";
  }
};

const UserTrainerBookingSession = ({ TrainersBookingRequestData, refetch }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter out Rejected and Cancelled bookings
  const visibleBookings = TrainersBookingRequestData.filter(
    (booking) => booking.status !== "Rejected" && booking.status !== "Cancelled"
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center py-1">
        <h3 className="text-xl font-semibold">Booked Sessions</h3>
        <p className="text-sm text-red-600 italic">
          Note: Booking requests will automatically expire and be removed after
          one week.
        </p>
      </div>

      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      {/* Bookings List */}
      <div className="py-4">
        {/* Desktop View */}
        <div className="hidden md:block">
          {visibleBookings.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-white border-collapse">
                {/* Table Header */}
                <thead className="bg-[#A1662F] text-white">
                  <tr>
                    {[
                      "Trainer",
                      "Booked At",
                      "Total Price",
                      "Duration",
                      "Status",
                      "Expires In",
                      "Action",
                    ].map((header) => (
                      <th key={header} className="px-4 py-2 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-sm text-gray-700">
                  {visibleBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className={`border-b hover:bg-gray-100 ${getStatusBackgroundColor(
                        booking.status
                      )}`}
                    >
                      {/* Trainer */}
                      <td className="px-4 py-2">{booking.trainer}</td>

                      {/* Booked At */}
                      <td className="px-4 py-2">
                        {formatDate(booking.bookedAt)}
                      </td>

                      {/* Total Price */}
                      <td className="px-4 py-2">
                        $ {booking.totalPrice || "0"}
                      </td>

                      {/* Duration Weeks */}
                      <td className="px-4 py-2">
                        {booking.durationWeeks} Weeks
                      </td>

                      {/* Status */}
                      <td className="px-4 py-2 font-semibold">
                        {booking.status}
                      </td>

                      {/* Recaning Time */}
                      <td className="px-4 py-2 text-sm text-center">
                        {booking.status === "Pending"
                          ? getRemainingTime(booking.bookedAt, now)
                          : "-- / --"}
                      </td>

                      {/* Buttons */}
                      <td className="flex px-4 py-2 gap-2">
                        <TrainerBookingSessionButton
                          booking={booking}
                          refetch={refetch}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // No bookings fallback
            <div className="flex items-center bg-gray-100 py-5 text-black italic">
              <div className="flex gap-4 mx-auto items-center">
                <FaTriangleExclamation className="text-xl text-red-500" />
                No booking requests at the moment.
              </div>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden flex-col space-y-4 mb-6">
          {visibleBookings.map((booking) => (
            <div
              key={booking._id}
              className={`text-black ${getStatusBackgroundColor(
                booking.status
              )} mb-4 p-4 border rounded-lg shadow-md`}
            >
              <div className="flex flex-col space-y-2 text-left">
                {/* Trainer */}
                <p className="font-semibold flex justify-between">
                  <strong>Trainer:</strong> {booking.trainer || "N/A"}
                </p>

                {/* Booked At */}
                <p className="flex justify-between">
                  <strong>Booked At:</strong>
                  {formatDate(booking.bookedAt) || "N/A"}
                </p>

                {/* Total Price */}
                <p className="flex justify-between">
                  <strong>Total Price:</strong> $ {booking.totalPrice || "0.00"}
                </p>

                {/* Duration */}
                <p className="flex justify-between">
                  <strong>Duration:</strong>
                  {booking.durationWeeks === 1
                    ? `${booking.durationWeeks} Week`
                    : `${booking.durationWeeks || "N/A"} Weeks`}
                </p>

                {/* Status */}
                <p className="flex justify-between">
                  <strong>Status:</strong> {booking.status || "Unknown"}
                </p>

                {/* Expires */}
                <p className="flex justify-between">
                  <strong>Expires In:</strong>
                  {booking.status === "Pending"
                    ? getRemainingTime(booking.bookedAt, now)
                    : "-- / --"}
                </p>

                {/* Action Button */}
                <div className="flex justify-between items-center mt-4">
                  <TrainerBookingSessionButton
                    booking={booking}
                    refetch={refetch}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

UserTrainerBookingSession.propTypes = {
  TrainersBookingRequestData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trainer: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.string,
      durationWeeks: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      sessions: PropTypes.arrayOf(PropTypes.string),
      bookerEmail: PropTypes.string,
    })
  ).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default UserTrainerBookingSession;
