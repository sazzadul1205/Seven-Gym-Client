import { useEffect, useRef, useState } from "react";

// import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Components & Modal
import UserTrainerBookingInfoModal from "./UserTrainerBookingInfoModal/UserTrainerBookingInfoModal";
import TrainerBookingSessionButton from "./TrainerBookingSessionButton/TrainerBookingSessionButton";

// Utilities
import { formatDate } from "../../../../Utility/formatDate";
import { getRemainingTime } from "../../../../Utility/getRemainingTime";

// import Icons
import { FaInfo } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// Background color based on booking status
const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-200 hover:bg-green-100 text-black py-2";
    case "Rejected":
      return "bg-red-200 hover:bg-red-300 text-black py-2";
    case "Cancelled":
      return "bg-linear-to-bl from-red-300 to-red-500 text-black";
    case "Expired":
      return "bg-gray-200 hover:bg-gray-100 text-black py-2";
    default:
      return "";
  }
};

const UserTrainerBookingSession = ({ TrainersBookingRequestData, refetch }) => {
  const [now, setNow] = useState(new Date());

  // Initializes a state variable for the selected booking.
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Create a ref for the modal
  const modalRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Create a close handler
  const closeModal = () => {
    modalRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedBooking(null);
  };

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

      {/* Divider */}
      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      {/* Bookings List */}
      <div className="py-4">
        {TrainersBookingRequestData.length > 0 ? (
          <div>
            {/*  Bookings List : Desktop View */}
            <div className="overflow-x-auto hidden md:flex">
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
                  {TrainersBookingRequestData.map((booking) => (
                    <tr
                      key={booking._id}
                      className={`border-b hover:bg-gray-100 ${getStatusBackgroundColor(
                        booking.status
                      )}`}
                    >
                      {/* Trainer */}
                      <td className="px-4 py-2 font-semibold">
                        {booking.trainer}
                      </td>

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

                        {/* View Button */}
                        <button
                          id={`view-details-btn-${booking._id}`}
                          className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                          onClick={() => {
                            setSelectedBooking(booking);
                            modalRef.current?.showModal();
                          }}
                        >
                          <FaInfo className="text-yellow-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#view-details-btn-${booking._id}`}
                          content="View Detailed Booking Data"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/*  Bookings List : Mobile View */}
            <div className="flex md:hidden flex-col space-y-4 mb-6">
              {TrainersBookingRequestData.map((booking) => (
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
                      <strong>Total Price:</strong> ${" "}
                      {booking.totalPrice || "0.00"}
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

                      {/* View Button */}
                      <button
                        id={`view-details-btn-${booking._id}`}
                        className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                        onClick={() => {
                          setSelectedBooking(booking);
                          modalRef.current?.showModal();
                        }}
                      >
                        <FaInfo className="text-yellow-500" />
                      </button>
                      <Tooltip
                        anchorSelect={`#view-details-btn-${booking._id}`}
                        content="View Detailed Booking Data"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

      {/* User Trainer Booking Info Modal */}
      <dialog
        ref={modalRef}
        id="User_Trainer_Booking_Info_Sessions_Modal"
        className="modal"
      >
        <UserTrainerBookingInfoModal
          selectedBooking={selectedBooking}
          closeModal={closeModal}
        />
      </dialog>
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
