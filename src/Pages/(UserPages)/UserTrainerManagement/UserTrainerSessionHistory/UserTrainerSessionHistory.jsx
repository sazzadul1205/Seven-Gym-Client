import { useRef, useState } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import { FaInfo } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// Import Modal
import UserTrainerBookingHistoryInfoModal from "./UserTrainerBookingHistoryInfoModal/UserTrainerBookingHistoryInfoModal";
import { formatDate } from "../../../../Utility/formatDate";

const UserTrainerSessionHistory = ({ TrainersBookingHistoryData }) => {
  // Initializes a state variable for the selected booking.
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Create a ref for the modal
  const modalRef = useRef(null);

  // Function to determine background color based on status
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-linear-to-bl from-yellow-400 to-yellow-200";
      case "Rejected":
        return "bg-linear-to-bl from-red-400 to-red-200";
      case "Expired":
        return "bg-linear-to-bl from-gray-400 to-gray-200";
      default:
        return "bg-white"; // Default background (for Pending)
    }
  };
  // Create a close handler
  const closeModal = () => {
    modalRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedBooking(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center py-1">
        {/* Title */}
        <h3 className="text-center text-xl font-semibold">
          Booked Sessions History
        </h3>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      {/* Bookings List */}
      <div className="py-4">
        {TrainersBookingHistoryData.length > 0 ? (
          <div>
            {/* Desktop View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full table-auto bg-white border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#A1662F] text-white">
                    <th className="px-4 py-2 text-left">Trainer</th>
                    <th className="px-4 py-2 text-left">Booked At</th>
                    <th className="px-4 py-2 text-left">Total Price</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-center">Expired In</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {TrainersBookingHistoryData.map((booking) => (
                    <tr
                      key={booking._id}
                      className={`border-b hover:bg-gray-100 ${getStatusBackgroundColor(
                        booking.status
                      )}`}
                    >
                      {/* Table : Trainer */}
                      <td className="px-4 py-2">{booking.trainer}</td>
                      {/* Table : Booked At */}
                      <td className="px-4 py-2">
                        {formatDate(booking.bookedAt)}
                      </td>
                      {/* Table : Total Price */}
                      <td className="px-4 py-2">$ {booking.totalPrice}</td>
                      {/* Table : Duration Weeks */}
                      <td className="px-4 py-2">
                        {booking.durationWeeks} Weeks
                      </td>
                      {/* Table : Status */}
                      <td className="px-4 py-2">{booking.status}</td>
                      {/* Table : Remaining Time */}
                      <td className="px-4 py-2 font-semibold text-sm text-center">
                        {
                          booking.status === "Expired"
                            ? formatDate(booking.expiredAt) // Show remaining time if Pending
                            : "-- / --" // Show Expired if not Pending
                        }
                      </td>

                      {/* Table : Buttons */}
                      <td className="flex px-4 py-2 gap-2">
                        <button
                          id={`view-details-btn-${booking._id}`} // Unique ID for each button
                          className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                          onClick={() => {
                            setSelectedBooking(booking);
                            document
                              .getElementById(
                                "User_Trainer_Booking_History_Info_Modal"
                              )
                              .showModal();
                          }}
                        >
                          <FaInfo className="text-yellow-500" />{" "}
                          {/* Info Icon */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden flex-col space-y-4 mb-6">
              {TrainersBookingHistoryData.map((booking) => (
                <div
                  key={booking._id}
                  className={`text-black text-center ${getStatusBackgroundColor(
                    booking.status
                  )} mb-4 p-4 border-b`}
                >
                  <div className="flex flex-col space-y-2">
                    {/* Trainer */}
                    <div className="font-semibold">
                      Trainer: {booking.trainer}
                    </div>

                    {/* Booked At */}
                    <div className="flex justify-between items-center pt-2">
                      <p className="font-bold">Booked At:</p>
                      <span>{formatDate(booking.bookedAt)}</span>
                    </div>

                    {/* Total Price */}
                    <div className="flex justify-between items-center">
                      <p className="font-bold">Total Price:</p>
                      <span>$ {booking.totalPrice}</span>
                    </div>

                    {/* Duration */}
                    <div className="flex justify-between items-center">
                      <p className="font-bold">Duration:</p>
                      <span>{booking.durationWeeks} Weeks</span>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <p className="font-bold">Status:</p>
                      <span>{booking.status}</span>
                    </div>

                    {/* Remaining Time */}
                    <div className="flex justify-between items-center font-semibold text-sm">
                      <p className="font-bold">Expired In:</p>
                      <span>
                        {
                          booking.status === "Expired"
                            ? formatDate(booking.expiredAt) // Show remaining time if Pending
                            : "-- / --" // Show Expired if not Pending
                        }
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-4 pt-4">
                      <button
                        id={`view-details-btn-${booking._id}`} // Unique ID for each button
                        className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                        onClick={() => {
                          setSelectedBooking(booking);
                          document
                            .getElementById(
                              "User_Trainer_Booking_History_Info_Modal"
                            )
                            .showModal();
                        }}
                      >
                        <FaInfo className="text-yellow-500" /> {/* Info Icon */}
                      </button>
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
        id="User_Trainer_Booking_History_Info_Modal"
        className="modal"
      >
        <UserTrainerBookingHistoryInfoModal
          closeModal={closeModal}
          selectedBooking={selectedBooking}
        />
      </dialog>
    </div>
  );
};

UserTrainerSessionHistory.propTypes = {
  TrainersBookingHistoryData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trainer: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Allow both string and number
      durationWeeks: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      expiredAt: PropTypes.string, // This is optional
    })
  ).isRequired,
};

export default UserTrainerSessionHistory;
