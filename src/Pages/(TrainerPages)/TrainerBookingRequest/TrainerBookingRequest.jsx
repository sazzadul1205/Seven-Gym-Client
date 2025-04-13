import { useEffect, useState, useRef } from "react";
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
import { FaTriangleExclamation } from "react-icons/fa6";

// Import Utility
import { formatDate } from "../../../Utility/formatDate";

// Import Utility
import { getRemainingTime } from "../../../Utility/getRemainingTime";

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

  // State for current time to update expiration countdown
  const [now, setNow] = useState(new Date());

  // State maps to store booking validity and reasons for invalidity
  const [bookingValidityMap, setBookingValidityMap] = useState({});
  const [bookingInvalidReasonMap, setBookingInvalidReasonMap] = useState({});

  // Selected booking data for modal view
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Create a ref for the modal
  const modalRef = useRef(null);

  // Update clock every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Validate all pending bookings when data changes
  useEffect(() => {
    const validateAllBookings = async () => {
      // Filter pending bookings only
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

      const newValidityMap = {};
      const newReasonMap = {};
      results.forEach(({ id, valid, reason }) => {
        newValidityMap[id] = valid;
        if (!valid && reason) newReasonMap[id] = reason;
      });

      setBookingValidityMap(newValidityMap);
      setBookingInvalidReasonMap(newReasonMap);
    };

    if (TrainerBookingRequestData.length > 0) {
      validateAllBookings();
    }
  }, [TrainerBookingRequestData, axiosPublic]);

  // Modal close handler
  const closeModal = () => {
    modalRef.current?.close();
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

      {/* Booking Request Management Table */}
      <div className="py-4 px-4 md:px-10">
        {TrainerBookingRequestData.filter(
          (booking) =>
            booking.status !== "Rejected" && booking.status !== "Cancelled"
        ).length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded shadow-sm border border-gray-300">
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
                  {TrainerBookingRequestData.filter(
                    (booking) =>
                      booking.status !== "Rejected" &&
                      booking.status !== "Cancelled"
                  ).map((booking) => {
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
                        className={`transition-colors duration-200 hover:bg-gray-300 border-b border-gray-500 ${rowBg}`}
                      >
                        {/* Booker Info */}
                        <td className="px-4 py-3 font-medium">
                          <TrainerBookingRequestUserBasicInfo
                            email={booking?.bookerEmail}
                          />
                        </td>

                        {/* Booked At */}
                        <td className="px-4 py-3">
                          {formatDate(booking.bookedAt)}
                        </td>

                        {/* Class Price */}
                        <td className="px-4 py-3">
                          {booking?.totalPrice === "free"
                            ? "Free"
                            : `$ ${booking?.totalPrice}`}
                        </td>

                        {/* Duration */}
                        <td className="px-4 py-3">
                          {booking.durationWeeks}{" "}
                          {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 font-bold capitalize">
                          {!isValid ? "Unavailable" : booking.status}
                        </td>

                        {/* Expires At */}
                        <td className="px-4 py-3 text-center font-semibold">
                          {booking.status === "Accepted"
                            ? "Waiting for payment"
                            : booking.status === "Pending"
                            ? getRemainingTime(booking.bookedAt, now)
                            : "-- / --"}
                        </td>

                        {/* Buttons */}
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {/* Management Button */}
                            <TrainerBookingRequestButton
                              booking={booking}
                              refetch={refetch}
                              isBookingValid={isValid}
                              invalidReason={invalidReason}
                            />

                            {/* Details Button */}
                            <div>
                              <button
                                id={`view-details-btn-${booking._id}`}
                                className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {TrainerBookingRequestData.filter(
                (booking) =>
                  booking.status !== "Rejected" &&
                  booking.status !== "Cancelled"
              ).map((booking) => {
                const isValid = bookingValidityMap[booking._id] !== false;
                const invalidReason = bookingInvalidReasonMap[booking._id];
                const cardBg = !isValid
                  ? "bg-red-100"
                  : booking.status === "Accepted"
                  ? "bg-green-100"
                  : "bg-gray-100";

                return (
                  <div
                    key={booking._id}
                    className={`p-4 rounded-lg shadow-md border ${cardBg}`}
                  >
                    {/* Trainer Info */}
                    <div className="font-semibold mb-1">
                      <TrainerBookingRequestUserBasicInfo
                        email={booking?.bookerEmail}
                      />
                    </div>

                    {/* Booked At */}
                    <div className="text-sm">
                      <p>
                        <strong>Booked At:</strong>{" "}
                        {formatDate(booking.bookedAt)}
                      </p>

                      {/* Price */}
                      <p>
                        <strong>Price:</strong>{" "}
                        {booking?.totalPrice === "free"
                          ? "Free"
                          : `$ ${booking?.totalPrice}`}
                      </p>

                      {/* Duration */}
                      <p>
                        {booking.durationWeeks}{" "}
                        {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                      </p>

                      {/* Status */}
                      <p>
                        <strong>Status:</strong>{" "}
                        {!isValid ? "Unavailable" : booking.status}
                      </p>

                      {/* Expires At */}
                      <p>
                        <strong>Expires In:</strong>
                        {booking.status === "Accepted"
                          ? "Waiting for payment"
                          : booking.status === "Pending"
                          ? getRemainingTime(booking.bookedAt, now)
                          : "-- / --"}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-3 gap-2">
                      {/* Management Button */}
                      <TrainerBookingRequestButton
                        booking={booking}
                        refetch={refetch}
                        isBookingValid={isValid}
                        invalidReason={invalidReason}
                      />

                      {/* Details Button */}
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          modalRef.current?.showModal();
                        }}
                        className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 hover:scale-105 transition-transform duration-200"
                      >
                        <FaInfo className="text-yellow-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          // Fallback if no bookings exist
          <div className="flex items-center bg-gray-100 py-5 text-black italic">
            <div className="flex gap-4 mx-auto items-center">
              <FaTriangleExclamation className="text-xl text-red-500" />
              No booking requests at the moment.
            </div>
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
