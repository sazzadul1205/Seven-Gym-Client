import { useRef, useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { FaInfo } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FaTriangleExclamation } from "react-icons/fa6";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Modal & Components
import TrainerBookingInfoModal from "../../TrainerBookingRequest/TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";
import TrainerBookingRequestUserBasicInfo from "../../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Import Utility
import { formatDate } from "../../../../Utility/formatDate";

// Component
const TrainerScheduleParticipantReserved = ({
  TrainerBookingRequestData,
  refetch,
}) => {
  const axiosPublic = useAxiosPublic();

  // Filter only accepted bookings
  const acceptedBookings =
    TrainerBookingRequestData?.filter(
      (booking) => booking.status === "Accepted"
    ) || [];

  TrainerBookingRequestData = TrainerBookingRequestData || [];

  // Ref to control modal visibility using native <dialog> element
  const modalRef = useRef(null);

  // State to track which booking is selected for modal view
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Helper function to format the current date-time for cancellation
  const getFormattedStartDate = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    return `${day}-${month}-${year}T${hours}:${minutes}`;
  };

  // Modal close handler
  const closeModal = () => {
    modalRef.current?.close();
    setSelectedBooking(null);
  };

  // Function: Cancel accepted booking and remove participant
  const cancelAcceptedBooking = async (booking, simulate = false) => {
    // Step 1: Ask user for confirmation to cancel the booking
    const confirmCancel = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it",
      cancelButtonText: "No, Keep it",
    });

    // If user cancels the confirmation prompt, exit the function
    if (!confirmCancel.isConfirmed) return;

    // Step 2: Ask the user to provide a reason for cancellation
    const { value: reason } = await Swal.fire({
      title: "Reason for Rejection",
      html: `
      <div class="flex flex-col space-y-2">
        <label for="reasonInput" class="text-left text-sm font-medium text-gray-700">
          Select or type a reason
        </label>
        <input 
          id="reasonInput" 
          list="reasonOptions"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all w-full text-sm" 
          placeholder="e.g. Trainer not available or write your own"
        />
        <datalist id="reasonOptions">
          <option value="Trainer not available"></option>
          <option value="Invalid time slot"></option>
          <option value="Payment issue"></option>
          <option value="Violation of gym policy"></option>
          <option value="Scheduling conflict"></option>
          <option value="Session already booked by another client"></option>
          <option value="Insufficient information provided"></option>
          <option value="Client request to cancel"></option>
          <option value="Trainer unavailable due to emergency"></option>
          <option value="Session overlaps with another appointment"></option>
          <option value="Client is not eligible for this session"></option>
          <option value="Technical issue during booking"></option>
          <option value="Exceeded session limit for this trainer"></option>
          <option value="Unverified or suspicious booking details"></option>
          <option value="Other"></option>
        </datalist>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Submit Reason",
      focusConfirm: false,
      preConfirm: () => {
        // Validate input – user must provide a reason
        const input = document.getElementById("reasonInput").value.trim();
        if (!input) {
          Swal.showValidationMessage("Please provide a reason.");
        }
        return input;
      },
    });

    // If no reason provided, exit function
    if (!reason) return;

    // Step 3: Prepare data to update the booking and remove participant
    const bookingCancelData = {
      status: "Cancelled",
      reason: reason,
      cancelAt: getFormattedStartDate(),
      paid: false,
    };

    const removeParticipantData = {
      trainerName: booking.trainer,
      ids: booking.sessions,
      bookerEmail: booking.bookerEmail,
    };

    try {
      // Step 4: Simulate mode (used for testing without real API calls)
      if (simulate) {
        console.log("Simulation - Booking Cancel Payload:", bookingCancelData);
        console.log(
          "Simulation - Remove Participant Payload:",
          removeParticipantData
        );
        Swal.fire({
          icon: "success",
          title: "Cancelled!",
          text: "Booking cancelled and participant removed (simulation).",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch(); // Refresh data
        return;
      }

      // Step 5: Send PATCH request to update booking status
      const bookingResponse = await axiosPublic.patch(
        `/Trainer_Booking_Request/${booking._id}`,
        bookingCancelData
      );

      // If booking update is successful, proceed to remove participant
      if (
        bookingResponse.data?.message ||
        bookingResponse.data === "Booking updated successfully."
      ) {
        // Step 6: Send PUT request to remove participant from trainer's schedule
        const removeResponse = await axiosPublic.put(
          "/Trainers_Schedule/RemoveParticipant",
          removeParticipantData
        );

        // If participant removed successfully, show success message
        if (
          removeResponse.data?.message ||
          removeResponse.data === "Participant removed successfully."
        ) {
          Swal.fire({
            icon: "success",
            title: "Cancelled!",
            text: "Booking has been cancelled and participant removed.",
            timer: 1500,
            showConfirmButton: false,
          });
          refetch(); // Refresh data
          window.location.reload();
        } else {
          // If participant removal fails
          throw new Error("Failed to remove participant.");
        }
      } else {
        // If booking update fails
        throw new Error("Failed to cancel booking.");
      }
    } catch (error) {
      // Step 7: Handle and display errors if any part fails
      console.error("Error cancelling booking:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while cancelling the booking.",
      });
    }
  };

  // Ensure that `TrainerBookingRequestData` is not undefined or null
  if (!TrainerBookingRequestData) return null; // Or a fallback loading state

  return (
    <div className="px-5 pb-5">
      {/* Section Title */}
      <p className="text-xl font-semibold text-black border-b-2 border-gray-700 pb-2">
        Reserved Class Participant
      </p>

      {/* Accepted Bookings Data */}
      {acceptedBookings.length > 0 ? (
        <>
          {/* Accepted Bookings : Desktop View */}
          <div className="hidden md:block">
            <table className="min-w-full bg-white text-black">
              {/* Accepted Bookings Header */}
              <thead className="bg-gray-800 text-white text-sm uppercase">
                <tr>
                  {[
                    "Booker",
                    "Booked At",
                    "Total Price",
                    "Duration",
                    "Status",
                    "Accepted At",
                    "Actions",
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

              {/* Accepted Bookings Body */}
              <tbody>
                {acceptedBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition-colors duration-200 hover:bg-gray-100 border-b border-gray-500"
                  >
                    {/* Booker Info */}
                    <td className="px-4 py-3 font-medium">
                      <TrainerBookingRequestUserBasicInfo
                        email={booking.bookerEmail}
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

                    {/* Class Duration */}
                    <td className="px-4 py-3">
                      {booking.durationWeeks}{" "}
                      {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                    </td>

                    {/* If Paid or Not */}
                    <td className="px-4 py-3 font-bold capitalize">
                      {booking.paid ? "Paid" : "Not Paid"}
                    </td>

                    {/* Accepted At */}
                    <td className="px-4 py-3">
                      {formatDate(booking.acceptedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {/* View Details Button */}
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

                        {/* Cancel Button */}
                        <div>
                          <button
                            id={`cancel-btn-${booking._id}`}
                            className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => cancelAcceptedBooking(booking)}
                          >
                            <ImCross className="text-red-500" />
                          </button>
                          <Tooltip
                            anchorSelect={`#cancel-btn-${booking._id}`}
                            content="Cancel Accepted Booking"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Accepted Bookings : Mobile View */}
          <div className="md:hidden space-y-4 text-black">
            {acceptedBookings.map((booking) => (
              <div
                key={booking._id}
                className="p-4 rounded-lg shadow-md border bg-white"
              >
                {/* User Info */}
                <div className="mb-2 font-medium">
                  <TrainerBookingRequestUserBasicInfo
                    email={booking.bookerEmail}
                  />
                </div>

                {/* Booking Data */}
                <div className="text-sm space-y-1">
                  {/* Booked */}
                  <div className="flex justify-between">
                    <strong>Booked At:</strong> {formatDate(booking.bookedAt)}
                  </div>

                  {/* Price */}
                  <p className="flex justify-between">
                    <strong>Price:</strong>{" "}
                    {booking?.totalPrice === "free"
                      ? "Free"
                      : `$ ${booking?.totalPrice}`}
                  </p>

                  {/* Duration */}
                  <p className="flex justify-between">
                    <strong>Duration:</strong> {booking.durationWeeks}{" "}
                    {booking.durationWeeks === 1 ? "Week" : "Weeks"}
                  </p>

                  {/* Status */}
                  <p className="flex justify-between">
                    <strong>Status:</strong>{" "}
                    {booking.paid ? "Paid" : "Not Paid"}
                  </p>

                  {/* Accepted */}
                  <p className="flex justify-between">
                    <strong>Accepted At:</strong>{" "}
                    {formatDate(booking.acceptedAt)}
                  </p>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex justify-end mt-3 gap-2">
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
                  <div>
                    <button
                      id={`cancel-btn-${booking._id}`}
                      className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => cancelAcceptedBooking(booking)}
                    >
                      <ImCross className="text-red-500" />
                    </button>
                    <Tooltip
                      anchorSelect={`#cancel-btn-${booking._id}`}
                      content="Cancel Accepted Booking"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Fallback display when no accepted bookings exist
        <div className="flex flex-col items-center bg-gray-100 py-5 text-black italic">
          <FaTriangleExclamation className="text-xl text-red-500 mb-2" />
          <span>No accepted bookings available.</span>
        </div>
      )}

      {/* Booking Details Modal */}
      <dialog
        ref={modalRef}
        id="User_Trainer_Booking_Info_Modal"
        className="modal"
      >
        <TrainerBookingInfoModal
          closeModal={closeModal}
          selectedBooking={selectedBooking}
        />
      </dialog>
    </div>
  );
};

TrainerScheduleParticipantReserved.propTypes = {
  TrainerBookingRequestData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      durationWeeks: PropTypes.number.isRequired,
      paid: PropTypes.bool,
      bookerCode: PropTypes.string,
      sessions: PropTypes.arrayOf(PropTypes.string),
      status: PropTypes.string,
      trainer: PropTypes.string,
    })
  ).isRequired,
  refetch: PropTypes.func,
};

export default TrainerScheduleParticipantReserved;
