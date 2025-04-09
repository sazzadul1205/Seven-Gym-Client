import { useEffect, useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import icons
import { FaCheck, FaInfo, FaRegTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Import Modal
import UserTrainerBookingInfoModal from "../../(UserPages)/UserTrainerManagement/UserTrainerBookingSession/UserTrainerBookingInfoModal/UserTrainerBookingInfoModal";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import TrainerBookingRequestButton from "./TrainerBookingRequestButton/TrainerBookingRequestButton";

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

const TrainerBookingRequest = ({ TrainerBookingRequestData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  const [now, setNow] = useState(new Date());
  const [bookingValidityMap, setBookingValidityMap] = useState({});

  // Update "now" every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Validate each pending booking on load
  useEffect(() => {
    const validateAllBookings = async () => {
      const pendingBookings = TrainerBookingRequestData.filter(
        (b) => b.status === "Pending"
      );

      const results = await Promise.all(
        pendingBookings.map(async (booking) => {
          try {
            const res = await axiosPublic.post(
              "/Trainers_Schedule/SessionValidation",
              {
                trainer: booking.trainerName,
                sessions: booking.sessionKeys,
              }
            );
            return { id: booking._id, valid: res.data.valid };
          } catch (err) {
            console.error(`Validation error for ${booking._id}`, err);
            return { id: booking._id, valid: false };
          }
        })
      );

      const newValidityMap = {};
      results.forEach(({ id, valid }) => {
        newValidityMap[id] = valid;
      });

      setBookingValidityMap(newValidityMap);
    };

    if (TrainerBookingRequestData.length > 0) {
      validateAllBookings();
    }
  }, [TrainerBookingRequestData, axiosPublic]);

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-1 py-4">
        <h3 className="text-xl font-semibold">Incoming Booking Requests</h3>
        <p className="text-sm text-red-600 italic">
          Note: Requests expire one week after submission if not accepted.
        </p>
      </div>

      <div className="mx-auto bg-white w-1/3 p-[1px]" />

      <div className="py-4 px-4 md:px-10">
        {TrainerBookingRequestData.length > 0 ? (
          <div className="overflow-x-auto rounded shadow-sm border border-gray-300">
            <table className="min-w-full bg-white">
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

              <tbody className="text-sm text-gray-700">
                {TrainerBookingRequestData.filter(
                  (booking) => booking.status !== "Rejected"
                ).map((booking) => {
                  const isValid = bookingValidityMap[booking._id] !== false;
                  const rowBg = !isValid
                    ? "bg-red-100 hover:bg-red-200"
                    : booking.status === "Accepted"
                    ? "bg-green-100 hover:bg-green-200"
                    : getStatusBackgroundColor(booking.status);

                  return (
                    <tr
                      key={booking._id}
                      className={`transition-colors duration-200 hover:bg-gray-100 border border-b border-gray-500 ${rowBg}`}
                    >
                      <td className="px-4 py-3 font-medium">
                        {booking.bookerEmail}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(booking.bookedAt)}
                      </td>
                      <td className="px-4 py-3">
                        $ {Number(booking.totalPrice).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {booking.durationWeeks} Weeks
                      </td>

                      {/* Show "Unavailable" if invalid */}
                      <td className="px-4 py-3 capitalize">
                        {!isValid ? "Unavailable" : booking.status}
                      </td>

                      <td className="px-4 py-3 text-center font-semibold">
                        {booking.status === "Accepted"
                          ? "Waiting for payment"
                          : booking.status === "Pending"
                          ? getRemainingTime(booking.bookedAt, now)
                          : "-- / --"}
                      </td>

                      <td className="flex px-4 py-3 gap-2 items-center">
                        <TrainerBookingRequestButton
                          booking={booking}
                          refetch={refetch}
                          isBookingValid={isValid}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8 italic">
            No booking requests at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

TrainerBookingRequest.propTypes = {
  TrainerBookingRequestData: PropTypes.array.isRequired,
  refetch: PropTypes.func,
};

export default TrainerBookingRequest;
