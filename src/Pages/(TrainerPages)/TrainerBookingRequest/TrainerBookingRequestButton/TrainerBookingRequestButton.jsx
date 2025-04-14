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

  // Function: Accept Session
  const handleAccept = async (booking) => {
    try {
      // Step 1: Confirm with the user
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to accept this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Accept it",
        cancelButtonText: "No, Cancel",
      });
      if (!isConfirmed) return;

      // Step 2: Construct payloads with formatted date
      const formattedDate = getFormattedStartDate();
      const bookingUpdatePayload = {
        status: "Accepted",
        acceptedAt: formattedDate,
        paid: false,
      };
      const participantPayload = {
        trainerName: booking.trainer,
        ids: booking.sessions, // Array of session IDs
        payload: {
          bookerEmail: booking.bookerEmail,
          duration: booking.durationWeeks,
          bookingReqID: booking._id,
          acceptedAt: formattedDate,
          paid: false,
        },
      };

      // Step 3: Update booking status
      const updateRes = await axiosPublic.patch(
        `/Trainers_Booking_Request/${booking._id}`,
        bookingUpdatePayload
      );
      if (!updateRes.data?.message) {
        throw new Error("Booking status update failed.");
      }

      // Step 4: Add participant to trainer's schedule
      const scheduleRes = await axiosPublic.put(
        "/Trainers_Schedule/AddParticipant",
        participantPayload
      );
      const success =
        scheduleRes.data?.message === "Participants added successfully." ||
        typeof scheduleRes.data === "string";
      if (!success) throw new Error("Participant addition failed.");

      // Step 5: Show success notification and refresh UI
      await Swal.fire({
        icon: "success",
        title: "Booking Accepted!",
        text: "The participant was successfully added to the schedule.",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (err) {
      console.error("Error in handleAccept:", err);
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text:
          err?.response?.data?.message ||
          err.message ||
          "An error occurred while processing the booking.",
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
      await axiosPublic.patch(`/Trainers_Booking_Request/${booking._id}`, {
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

  // Function: Delete Expired Booking
  const handleDeleteExpired = async (booking) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it",
      cancelButtonText: "No, Keep it",
    });
    if (!confirmDelete.isConfirmed) return;

    try {
      // Here, we assume deletion by booking ID in query parameter is corrected on backend.
      const response = await axiosPublic.delete(
        `/Trainers_Booking_Request?id=${booking._id}`
      );
      if (response.data?.message) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Booking has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        throw new Error("No success message in response");
      }
    } catch (error) {
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
    const confirmCancel = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it",
      cancelButtonText: "No, Keep it",
    });
    if (!confirmCancel.isConfirmed) return;

    const reason = await getRejectionReason();
    if (!reason) return;

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
      const bookingResponse = await axiosPublic.patch(
        `/Trainers_Booking_Request/${booking._id}`,
        bookingCancelData
      );
      if (
        !bookingResponse.data?.message &&
        bookingResponse.data !== "Booking updated successfully."
      ) {
        throw new Error("Failed to cancel booking.");
      }
      const removeResponse = await axiosPublic.put(
        "/Trainers_Schedule/RemoveParticipant",
        removeParticipantData
      );
      if (
        !removeResponse.data?.message &&
        removeResponse.data !== "Participant removed successfully."
      ) {
        throw new Error("Failed to remove participant.");
      }
      Swal.fire({
        icon: "success",
        title: "Cancelled!",
        text: "Booking has been cancelled and participant removed.",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while cancelling the booking.",
      });
    }
  };

  // Function: Unavailable Booking with reason input
  const handleUnavailableBooking = async (booking) => {
    // Step 1: Confirm rejection action
    const confirmReject = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Unavailable this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Unavailable it",
      cancelButtonText: "No, Keep it",
    });
    if (!confirmReject.isConfirmed) return;

    // Step 3: Update backend booking status to "Rejected"
    try {
      await axiosPublic.patch(`/Trainers_Booking_Request/${booking._id}`, {
        status: "Unavailable",
        rejectedAt: getFormattedStartDate(),
        reason: "Some Sessions are Already Fully Booked",
      });
      // Step 4: Show success message and refresh UI
      await Swal.fire({
        title: "Booking Unavailable",
        text: `Reason: Some Sessions are Already Fully Booked`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    } catch (error) {
      console.error("Error Unavailable booking:", error);
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

TrainerBookingRequestButton.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["Pending", "Accepted", "Rejected", "Expired"])
      .isRequired,
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
