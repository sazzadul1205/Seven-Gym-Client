import { useEffect, useState, useRef } from "react";

// Import Package
import PropTypes from "prop-types";

// Import Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Modal and Components
import TrainerBookingRequestButton from "./TrainerBookingRequestButton/TrainerBookingRequestButton";
import TrainerBookingInfoModal from "./TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";
import TrainerBookingRequestUserBasicInfo from "./TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Icons
import { FaInfo } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

// Parse custom date string (Format: "06-04-2025T11:12")
const parseCustomDate = (input) => {
  if (!input) return null;
  const [datePart, timePart] = input.split("T");
  const [day, month, year] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
};

// Formats date to "06 Apr 2025, 11:12 AM"
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

// Calculates how much time is left before the request expires (1 week window)
const getRemainingTime = (input, now) => {
  const startDate = parseCustomDate(input);
  if (!startDate) return "Invalid date";

  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + 7);

  const diff = expiry - now;
  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m left`;
};

// Determines background color based on booking status
const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-gradient-to-bl from-green-400 to-green-200";
    case "Rejected":
      return "bg-gradient-to-bl from-red-400 to-red-200";
    case "Expired":
      return "bg-gradient-to-bl from-gray-400 to-gray-200";
    default:
      return "bg-white";
  }
};

const TrainerBookingRequest = ({ TrainerBookingRequestData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Current time for comparison
  const [now, setNow] = useState(new Date());

  // Booking ID -> validity status
  const [bookingValidityMap, setBookingValidityMap] = useState({});

  // Booking ID -> invalid reason
  const [bookingInvalidReasonMap, setBookingInvalidReasonMap] = useState({});

  // Selected booking data
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Create a ref for the modal
  const modalRef = useRef(null);

  // Update clock every 60s to refresh expiration countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Validate all pending bookings on initial load and when data changes
  useEffect(() => {
    const validateAllBookings = async () => {
      // Filter only pending bookings
      const pendingBookings = TrainerBookingRequestData.filter(
        (b) => b.status === "Pending"
      );

      // Validate each booking via API
      const results = await Promise.all(
        pendingBookings.map(async (booking) => {
          try {
            const res = await axiosPublic.post(
              "/Trainers_Schedule/SessionValidation",
              {
                trainer: booking.trainer,
                sessions: booking.sessions,
              }
            );
            return {
              id: booking._id,
              valid: res.data.valid,
              reason: res.data.reason,
            };
          } catch (err) {
            console.error(`Validation error for ${booking._id}`, err);
            // Default to valid if error occurs
            return { id: booking._id, valid: true, reason: null };
          }
        })
      );

      // Store validity results in maps
      const newValidityMap = {};
      const newReasonMap = {};

      results.forEach(({ id, valid, reason }) => {
        newValidityMap[id] = valid;
        if (!valid && reason) {
          newReasonMap[id] = reason;
        }
      });

      // Update state with validation results
      setBookingValidityMap(newValidityMap);
      setBookingInvalidReasonMap(newReasonMap);
    };

    // Run validation if booking data is available
    if (TrainerBookingRequestData.length > 0) {
      validateAllBookings();
    }
  }, [TrainerBookingRequestData, axiosPublic]);

  // Create a close handler
  const closeModal = () => {
    modalRef.current?.close();
    // Optionally, clear the selected booking if needed:
    setSelectedBooking(null);
  };

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Header Section */}
      <div className="text-center space-y-1 py-4">
        <h3 className="text-xl font-semibold">Incoming Booking Requests</h3>
        <p className="text-sm text-red-600 italic">
          Note: Requests expire one week after submission if not accepted.
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-white w-1/3 p-[1px]" />

      {/* Main Content Area */}
      <div className="py-4 px-4 md:px-10">
        {TrainerBookingRequestData.length > 0 ? (
          <div className="overflow-x-auto rounded shadow-sm border border-gray-300">
            <table className="min-w-full bg-white">
              {/* Table Header */}
              <thead className="bg-gray-800 text-white text-sm uppercase">
                <tr>
                  {[
                    "Booker",
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
                {/* Filter out rejected bookings */}
                {TrainerBookingRequestData.filter(
                  (booking) => booking.status !== "Rejected"
                ).map((booking) => {
                  // Booking validation and background style setup
                  const isValid = bookingValidityMap[booking._id] !== false;
                  const invalidReason = bookingInvalidReasonMap[booking._id];
                  const rowBg = !isValid
                    ? "bg-red-100 hover:bg-red-200"
                    : booking.status === "Accepted"
                    ? "bg-green-100 hover:bg-green-200"
                    : getStatusBackgroundColor(booking.status);

                  return (
                    <tr
                      key={booking._id}
                      className={`transition-colors duration-200 hover:bg-gray-100 border-b border-gray-500 ${rowBg}`}
                    >
                      {/* Booker Info */}
                      <td className="px-4 py-3 font-medium">
                        <TrainerBookingRequestUserBasicInfo
                          email={booking?.bookerEmail}
                        />
                      </td>

                      {/* Booking Date */}
                      <td className="px-4 py-3">
                        {formatDate(booking.bookedAt)}
                      </td>

                      {/* Total Price */}
                      <td className="px-4 py-3">
                        ${Number(booking.totalPrice).toFixed(2)}
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3">
                        {booking.durationWeeks} Weeks
                      </td>

                      {/* Status Display */}
                      <td className="px-4 py-3 font-bold capitalize">
                        {!isValid ? "Unavailable" : booking.status}
                      </td>

                      {/* Expiry Countdown */}
                      <td className="px-4 py-3 text-center font-semibold">
                        {booking.status === "Accepted"
                          ? "Waiting for payment"
                          : booking.status === "Pending"
                          ? getRemainingTime(booking.bookedAt, now)
                          : "-- / --"}
                      </td>

                      {/* Action Buttons: Accept/Reject & View Details */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {/* Accept / Reject Button */}
                          <TrainerBookingRequestButton
                            booking={booking}
                            refetch={refetch}
                            isBookingValid={isValid}
                            invalidReason={invalidReason}
                          />

                          {/* View Details Button */}
                          <div>
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
                              content="View Detailed Booking Info"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          // No bookings fallback
          <div className="text-center text-gray-500 mt-8 italic">
            No booking requests at the moment.
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <dialog
        ref={modalRef}
        id="User_Trainer_Booking_Info_Modal"
        className="modal"
      >
        <TrainerBookingInfoModal
          closeModal={closeModal}
          selectedBooking={selectedBooking}
          bookingValidity={bookingValidityMap[selectedBooking?._id]}
          bookingInvalidReason={bookingInvalidReasonMap[selectedBooking?._id]}
        />
      </dialog>
    </div>
  );
};

TrainerBookingRequest.propTypes = {
  TrainerBookingRequestData: PropTypes.array.isRequired,
  refetch: PropTypes.func,
};

export default TrainerBookingRequest;
