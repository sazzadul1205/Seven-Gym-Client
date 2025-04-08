import { useEffect, useState } from "react";

// Import Package

import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import icons
import { FaCheck, FaInfo } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Import Modal
import UserTrainerBookingInfoModal from "../../(UserPages)/UserTrainerManagement/UserTrainerBookingSession/UserTrainerBookingInfoModal/UserTrainerBookingInfoModal";

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

// Function to determine background color based on status
const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-linear-to-bl from-green-400 to-green-200";
    case "Rejected":
      return "bg-linear-to-bl from-red-400 to-red-200";
    case "Expired":
      return "bg-linear-to-bl from-gray-400 to-gray-200";
    default:
      return "bg-white";
  }
};

const TrainerBookingRequest = ({ TrainerBookingRequestData }) => {
  // Now State
  const [now, setNow] = useState(new Date());

  // Initializes a state variable for the selected booking.
  const [selectedBooking, setSelectedBooking] = useState(null);

  // useEffect hook that updates the current time every 60 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-1 py-4">
        {/* Title */}
        <h3 className="text-xl font-semibold">Incoming Booking Requests</h3>

        {/* Warnings */}
        <p className="text-sm text-red-600 italic">
          Note: Requests expire one week after submission if not accepted.
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-gray-300 w-1/3 h-[2px]" />

      {/* Booking Table */}
      <div className="py-4 px-4 md:px-10">
        {TrainerBookingRequestData.length > 0 ? (
          <div className="overflow-x-auto rounded shadow-sm border border-gray-300">
            <table className="min-w-full bg-white ">
              {/* Table Header */}
              <thead className="bg-gray-800 text-white text-sm uppercase">
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
                    <th
                      key={header}
                      className="px-4 py-3 border-b border-gray-600 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="text-sm text-gray-700">
                {TrainerBookingRequestData.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`transition-colors duration-200 hover:bg-gray-100 border border-b border-gray-500  ${getStatusBackgroundColor(
                      booking.status
                    )}`}
                  >
                    {/* Column: Trainer Name */}
                    <td className="px-4 py-3 font-medium">{booking.trainer}</td>

                    {/* Column: Booking Date (formatted) */}
                    <td className="px-4 py-3">
                      {formatDate(booking.bookedAt)}
                    </td>

                    {/* Column: Total Price */}
                    <td className="px-4 py-3">
                      $ {Number(booking.totalPrice).toFixed(2)}
                    </td>

                    {/* Column: Duration in Weeks */}
                    <td className="px-4 py-3">{booking.durationWeeks} Weeks</td>

                    {/* Column: Current Booking Status */}
                    <td className="px-4 py-3 capitalize">{booking.status}</td>

                    {/* Column: Remaining Time until expiration (only shown if status is Pending) */}
                    <td className="px-4 py-3 text-center font-semibold">
                      {booking.status === "Pending"
                        ? getRemainingTime(booking.bookedAt, now)
                        : "-- / --"}
                    </td>

                    {/* Column: Buttons */}
                    <td className="flex px-4 py-3 gap-2 items-center">
                      {/* View Details Button */}
                      <button
                        id={`view-details-btn-${booking._id}`}
                        className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105"
                        onClick={() => {
                          setSelectedBooking(booking);
                          document
                            .getElementById("User_Trainer_Booking_Info_Modal")
                            .showModal();
                        }}
                      >
                        <FaInfo className="text-yellow-500" />
                      </button>
                      <Tooltip
                        anchorSelect={`#view-details-btn-${booking._id}`}
                        content="View Detailed Booking Info"
                      />

                      {/* Accept Request Button */}
                      <button
                        id={`accept-btn-${booking._id}`}
                        className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      >
                        <FaCheck className="text-green-500" />
                      </button>
                      <Tooltip
                        anchorSelect={`#accept-btn-${booking._id}`}
                        content="Accept Booking Request"
                      />

                      {/* Reject Request Button */}
                      <button
                        id={`reject-btn-${booking._id}`}
                        className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      >
                        <ImCross className="text-red-500" />
                      </button>
                      <Tooltip
                        anchorSelect={`#reject-btn-${booking._id}`}
                        content="Reject Booking Request"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8 italic">
            No booking requests at the moment.
          </div>
        )}
      </div>

      {/* User Trainer Booking Info Modal */}
      <dialog id="User_Trainer_Booking_Info_Modal" className="modal">
        <UserTrainerBookingInfoModal selectedBooking={selectedBooking} />
      </dialog>
    </div>
  );
};

TrainerBookingRequest.propTypes = {
  TrainerBookingRequestData: PropTypes.array.isRequired,
};

export default TrainerBookingRequest;
