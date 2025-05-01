// Import Icons
import { Tooltip } from "react-tooltip";
import { ImCross } from "react-icons/im";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import Hook and Helpers
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Reason Part
import { getRejectionReason } from "./getRejectionReasonPrompt";

// Helper: Checks if expired booking can be deleted (only after 12 days)
const canDeleteExpired = (bookedAt) => {
  // bookedAt format: "DD-MM-YYYYTHH:mm"
  // Split the date and reverse parts to create a YYYY-MM-DD string for Date() constructor
  const bookingDate = new Date(
    bookedAt.split("T")[0].split("-").reverse().join("-")
  );
  const now = new Date();
  const diffDays = Math.floor((now - bookingDate) / (1000 * 60 * 60 * 24));
  return diffDays >= 12;
};

// Helper: Get formatted current date as "DD-MM-YYYYTHH:mm"
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

const TrainerBookingRequestButton = ({ booking, refetch, isBookingValid }) => {
  const axiosPublic = useAxiosPublic();

  // Function: Handle booking acceptance and update schedule accordingly
  const handleAccept = async (booking) => {
    try {
      // Step 1: Ask for user confirmation via SweetAlert
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to accept this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Accept it",
        cancelButtonText: "No, Cancel",
      });

      // If user cancels, exit early
      if (!isConfirmed) return;

      // Step 2: Prepare data payloads
      const formattedDate = getFormattedStartDate(); // Custom utility for timestamp

      // Payload to update the booking status in the database
      const bookingUpdatePayload = {
        status: "Accepted",
        acceptedAt: formattedDate,
        paid: false,
      };

      // Payload to add participant to the trainer's schedule
      const participantPayload = {
        trainerName: booking.trainer,
        ids: booking.sessions, // Array of session IDs to be updated
        payload: {
          bookerEmail: booking.bookerEmail,
          duration: booking.durationWeeks,
          bookingReqID: booking._id,
          acceptedAt: formattedDate,
          paid: false,
        },
      };

      // Step 3: Send PATCH request to update booking status
      const updateRes = await axiosPublic.patch(
        `/Trainer_Booking_Request/${booking._id}`,
        bookingUpdatePayload
      );

      // If update response does not contain success message, throw error
      if (!updateRes.data?.message) {
        throw new Error("Failed to update booking status.");
      }

      // Step 4: Send PUT request to update the trainer's schedule
      const scheduleRes = await axiosPublic.put(
        "/Trainers_Schedule/AddParticipant",
        participantPayload
      );

      // Validate the schedule update was successful
      const participantAdded =
        scheduleRes.data?.message === "Participants added successfully." ||
        typeof scheduleRes.data === "string";

      if (!participantAdded) {
        throw new Error("Failed to add participant to schedule.");
      }

      // Step 5: Show success message and refresh the UI
      await Swal.fire({
        icon: "success",
        title: "Booking Accepted",
        text: "The participant was successfully added to the schedule.",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch(); // Refresh UI or data table
    } catch (err) {
      // Step 6: Show error message on failure
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text:
          err?.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while processing the booking.",
      });
    }
  };

  // Function: Reject Booking with reason input
  const handleReject = async (booking) => {
    // Step 1: Confirm rejection action
    const confirmReject = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject it",
      cancelButtonText: "No, Keep it",
    });
    if (!confirmReject.isConfirmed) return;

    // Step 2: Prompt user for rejection reason
    const reason = await getRejectionReason();
    if (!reason) return; // Exit if cancelled or no reason provided

    // Step 3: Update backend booking status to "Rejected"
    try {
      await axiosPublic.patch(`/Trainer_Booking_Request/${booking._id}`, {
        status: "Rejected",
        rejectedAt: getFormattedStartDate(),
        reason: reason,
      });
      // Step 4: Show success message and refresh UI
      await Swal.fire({
        title: "Booking Rejected",
        text: `Reason: ${reason}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
      console.error("Error rejecting booking:", error);
      Swal.fire({
        title: "Update Failed",
        text: "Something went wrong while rejecting the booking.",
        icon: "error",
      });
    }
  };

  // Function: Delete Expired Booking by ID
  const handleDeleteExpired = async (booking) => {
    // Step 1: Confirm deletion from the user
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it",
      cancelButtonText: "No, Keep it",
    });

    // Step 2: Exit if user cancels
    if (!confirmDelete.isConfirmed) return;

    try {
      // Step 3: Send DELETE request to server using booking ID as query parameter
      const response = await axiosPublic.delete(
        `/Trainer_Booking_Request?id=${booking._id}`
      );

      // Step 4: Handle server response
      if (response.data?.message) {
        // Step 5: Show success alert and trigger data refetch
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Booking has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch(); // Refresh booking list
      } else {
        throw new Error("No success message in response");
      }
    } catch (error) {
      // Step 6: Handle failure case with error message
      console.error("Delete error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while deleting the booking.",
      });
    }
  };

  // Function: Cancel Accepted Booking and Remove Participant
  const handleCancelAcceptedBooking = async (booking) => {
    // Step 1: Ask for confirmation before canceling
    const confirmCancel = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it",
      cancelButtonText: "No, Keep it",
    });

    // Step 2: Exit early if user cancels the confirmation dialog
    if (!confirmCancel.isConfirmed) return;

    // Step 3: Ask for a reason for cancellation
    const reason = await getRejectionReason();

    // Step 4: Exit early if no reason is provided
    if (!reason) return;

    // Step 5: Prepare the payload to cancel the booking
    const bookingCancelData = {
      status: "Cancelled",
      reason: reason,
      cancelAt: getFormattedStartDate(),
      paid: false,
    };

    // Step 6: Prepare the payload to remove the participant from the trainer's schedule
    const removeParticipantData = {
      trainerName: booking.trainer,
      ids: booking.sessions,
      bookerEmail: booking.bookerEmail,
    };

    try {
      // Step 7: Send cancellation request to the booking API
      const bookingResponse = await axiosPublic.patch(
        `/Trainer_Booking_Request/${booking._id}`,
        bookingCancelData
      );

      // Step 8: Validate response from booking cancellation
      if (
        !bookingResponse.data?.message &&
        bookingResponse.data !== "Booking updated successfully."
      ) {
        throw new Error("Failed to cancel booking.");
      }

      // Step 9: Send request to remove participant from the trainer schedule
      const removeResponse = await axiosPublic.put(
        "/Trainers_Schedule/RemoveParticipant",
        removeParticipantData
      );

      // Step 10: Validate response from participant removal
      if (
        !removeResponse.data?.message &&
        removeResponse.data !== "Participant removed successfully."
      ) {
        throw new Error("Failed to remove participant.");
      }

      // Step 11: Show success alert to the user
      Swal.fire({
        icon: "success",
        title: "Cancelled!",
        text: "Booking has been cancelled and participant removed.",
        timer: 1500,
        showConfirmButton: false,
      });

      // Step 12: Refresh the data
      refetch();
    } catch (error) {
      // Step 13: Handle and display errors during the process
      console.error("Error cancelling booking:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while cancelling the booking.",
      });
    }
  };

  // Function: Mark a booking as "Unavailable" with a rejection reason
  const handleUnavailableBooking = async (booking) => {
    // Step 1: Show confirmation modal before proceeding
    const confirmReject = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Unavailable this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Unavailable it",
      cancelButtonText: "No, Keep it",
    });

    // Step 2: Exit early if user cancels the confirmation
    if (!confirmReject.isConfirmed) return;

    // Step 3: Send PATCH request to update the booking status to "Unavailable"
    try {
      await axiosPublic.patch(`/Trainer_Booking_Request/${booking._id}`, {
        status: "Unavailable",
        rejectedAt: getFormattedStartDate(),
        reason: "Some Sessions are Already Fully Booked",
      });

      // Step 4: Notify the user of success and refresh the data
      await Swal.fire({
        title: "Booking Unavailable",
        text: `Reason: Some Sessions are Already Fully Booked`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Step 5: Refresh the booking list
      refetch();
    } catch {
      // Step 6: Show error modal if update fails
      Swal.fire({
        title: "Update Failed",
        text: "Something went wrong while Unavailable the booking.",
        icon: "error",
      });
    }
  };

  return (
    <>
      {/* For invalid bookings: Show Delete button */}
      {!isBookingValid ? (
        <>
          <button
            id={`delete-btn-${booking._id}`}
            className="border-2 border-red-600 bg-red-200 rounded-full p-2 text-sm text-red-800 cursor-pointer"
            onClick={() => handleUnavailableBooking(booking)}
          >
            <FaRegTrashAlt className="text-red-500" />
          </button>
          <Tooltip
            anchorSelect={`#delete-btn-${booking._id}`}
            content="Delete Unavailable Booking"
          />
        </>
      ) : (
        <>
          {/* For Expired bookings: Show Delete button (disabled until after 12 days) */}
          {booking.status === "Expired" && (
            <>
              <button
                id={`delete-btn-${booking._id}`}
                className="border-2 border-red-600 bg-red-200 rounded-full p-2 text-sm text-red-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canDeleteExpired(booking.bookedAt)}
                onClick={() => handleDeleteExpired(booking)}
              >
                <FaRegTrashAlt className="text-red-500" />
              </button>
              <Tooltip
                anchorSelect={`#delete-btn-${booking._id}`}
                content="Delete Expired Booking"
              />
            </>
          )}

          {/* For Accepted bookings: Show Cancel button */}
          {booking.status === "Accepted" && (
            <>
              <button
                id={`cancel-btn-${booking._id}`}
                className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                onClick={() => handleCancelAcceptedBooking(booking)}
              >
                <ImCross className="text-red-500" />
              </button>
              <Tooltip
                anchorSelect={`#cancel-btn-${booking._id}`}
                content="Cancel Accepted Booking"
              />
            </>
          )}

          {/* For Pending bookings: Show Accept and Reject buttons */}
          {booking.status === "Pending" && (
            <>
              <button
                id={`accept-btn-${booking._id}`}
                className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105"
                onClick={() => handleAccept(booking)}
              >
                <FaCheck className="text-green-500" />
              </button>
              <Tooltip
                anchorSelect={`#accept-btn-${booking._id}`}
                content="Accept Booking Request"
              />

              <button
                id={`reject-btn-${booking._id}`}
                className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                onClick={() => handleReject(booking)}
              >
                <ImCross className="text-red-500" />
              </button>
              <Tooltip
                anchorSelect={`#reject-btn-${booking._id}`}
                content="Reject Booking Request"
              />
            </>
          )}
        </>
      )}
    </>
  );
};

// Prop Validation
TrainerBookingRequestButton.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.oneOf([
      "Pending",
      "Accepted",
      "Rejected",
      "Expired",
      "Unavailable",
    ]).isRequired,
    bookedAt: PropTypes.string.isRequired,
    trainer: PropTypes.string.isRequired,
    bookerEmail: PropTypes.string.isRequired,
    sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
    durationWeeks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  isBookingValid: PropTypes.bool.isRequired,
};

export default TrainerBookingRequestButton;
