import { useEffect, useState } from "react";

// Import icons
import { FaInfo, FaRegTrashAlt } from "react-icons/fa";

// Import Packages
import PropTypes from "prop-types";
import UserTrainerBookingInfoModal from "./UserTrainerBookingInfoModal/UserTrainerBookingInfoModal";

// Format: "06-04-2025T11:12"
const parseCustomDate = (input) => {
  if (!input) return null;
  const [datePart, timePart] = input.split("T");
  const [day, month, year] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
};

//  Formats the input date string into a custom date format.
const formatDate = (input) => {
  const dateObj = parseCustomDate(input);
  if (!dateObj) return "";

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return dateObj.toLocaleString("en-US", options);
};

// Calculates the remaining time between the input date and the current date.
const getRemainingTime = (input, now) => {
  const startDate = parseCustomDate(input);
  if (!startDate) return "Invalid date";

  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + 7); // 1 week later

  const diff = expiry - now;
  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m left`;
};

const UserTrainerBookingSession = ({ TrainersBookingRequestData }) => {
  const [now, setNow] = useState(new Date());

  // Initializes a state variable for the selected booking.
  const [selectedBooking, setSelectedBooking] = useState(null);

  //  useEffect hook that updates the current time every 60 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every 1 minute

    return () => clearInterval(interval);
  }, []);

  // Return Null if data is none
  if (!TrainersBookingRequestData) return null;

  return (
    <div>
      {/* Header */}
      <div className="text-center py-1">
        {/* Title */}
        <h3 className="text-center text-xl font-semibold">Booked Sessions</h3>

        {/* Warnings */}
        <p className="text-sm text-red-600 italic">
          Note: Booking requests will automatically expire and be removed after
          one week from the time of booking.
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      {/* Booking Table */}
      <div className="py-4">
        {/* Desktop View */}
        <div className="hidden md:block">
          {TrainersBookingRequestData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-white border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#A1662F] text-white">
                    <th className="px-4 py-2 text-left">Trainer</th>
                    <th className="px-4 py-2 text-left">Booked At</th>
                    <th className="px-4 py-2 text-left">Total Price</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Expires In</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {TrainersBookingRequestData.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b hover:bg-gray-100"
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
                      <td className="px-4 py-2 font-semibold text-sm">
                        {getRemainingTime(booking.bookedAt, now)}
                      </td>

                      {/* Table : Buttons */}
                      <td className="flex px-4 py-2 gap-2">
                        {/* Information Button */}
                        <button
                          data-tip="View Details"
                          className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105"
                          onClick={() => {
                            setSelectedBooking(booking);
                            document
                              .getElementById("User_Trainer_Booking_Info_Modal")
                              .showModal();
                          }}
                        >
                          <FaInfo className="text-green-500" />
                        </button>

                        {/* Delete Button */}
                        <button
                          data-tip="Cancel Booking"
                          className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                        >
                          <FaRegTrashAlt className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No bookings available.</p>
          )}
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden flex-col space-y-4 mb-6">
          {TrainersBookingRequestData.map((booking, idx) => (
            <div
              key={booking._id}
              className={`text-black text-center ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } mb-4 p-4 border-b`}
            >
              <div className="flex flex-col space-y-2">
                {/* Trainer */}
                <div className="font-semibold">Trainer: {booking.trainer}</div>

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
                  <p className="font-bold">Expires In:</p>
                  <span>{getRemainingTime(booking.bookedAt, now)}</span>
                </div>

                {/* Buttons */}
                <div className="flex justify-between gap-4 pt-4">
                  {/* Information Button */}
                  <button
                    data-tip="View Details"
                    className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105"
                    onClick={() => {
                      setSelectedBooking(booking);
                      document
                        .getElementById("User_Trainer_Booking_Info_Modal")
                        .showModal();
                    }}
                  >
                    <FaInfo className="text-green-500" />
                  </button>

                  {/* Delete Button */}
                  <button
                    data-tip="Cancel Booking"
                    className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                  >
                    <FaRegTrashAlt className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Trainer Booking Info Modal */}
      <dialog id="User_Trainer_Booking_Info_Modal" className="modal">
        <UserTrainerBookingInfoModal selectedBooking={selectedBooking} />
      </dialog>
    </div>
  );
};

// Prop Type Validation
UserTrainerBookingSession.propTypes = {
  TrainersBookingRequestData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trainer: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.string,
      durationWeeks: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
};

export default UserTrainerBookingSession;
