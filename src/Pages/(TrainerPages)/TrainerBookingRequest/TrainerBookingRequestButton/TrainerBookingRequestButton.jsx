/* eslint-disable react/prop-types */
// Import Icons
import { Tooltip } from "react-tooltip";
import { ImCross } from "react-icons/im";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import Hook
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Helper: Checks if expired booking can be deleted (only after 12 days)
const canDeleteExpired = (bookedAt) => {
  const bookingDate = new Date(
    bookedAt.split("T")[0].split("-").reverse().join("-")
  );
  const now = new Date();
  const diffDays = Math.floor((now - bookingDate) / (1000 * 60 * 60 * 24));
  return diffDays >= 12;
};

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

  const handleAccept = async (booking, simulate = false) => {
    // Confirm acceptance with SweetAlert
    const confirmAccept = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to accept this booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept it",
      cancelButtonText: "No, Cancel",
    });

    if (!confirmAccept.isConfirmed) return;

    // Prepare data for updating the booking request.
    const BookingAcceptData = {
      status: "Accepted",
      acceptedAt: getFormattedStartDate(),
      paid: false,
    };

    // Prepare data for adding the booking participant into the trainer's schedule.
    const SessionData = {
      trainerName: booking.trainer, // e.g., "Thomas King"
      ids: booking.sessions, // Use the array of session IDs
      payload: {
        bookerEmail: booking.bookerEmail, // Use the correct field from your data
        duration: booking.durationWeeks, // Duration in weeks
        bookingReqID: booking._id,
        acceptedAt: getFormattedStartDate(),
        paid: false,
      },
    };

    try {
      if (simulate) {
        // Simulation mode: log payloads instead of making API calls.
        console.log(
          "Simulation Mode - Booking Request Update Payload:",
          BookingAcceptData
        );
        console.log(
          "Simulation Mode - Trainer Schedule AddParticipant Payload:",
          SessionData
        );

        Swal.fire({
          icon: "success",
          title: "Accepted!",
          text: "Booking accepted (simulation) and participant updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch(); // Refresh the data if needed
        return;
      }

      // Update the booking request status.
      const bookingResponse = await axiosPublic.patch(
        `/Trainers_Booking_Request/${booking._id}`,
        BookingAcceptData
      );

      if (bookingResponse.data?.message) {
        // Update the trainer's schedule with participant info.
        const participantResponse = await axiosPublic.put(
          "/Trainers_Schedule/AddParticipant",
          SessionData
        );

        if (
          participantResponse.data?.message ||
          participantResponse.data === "Participants added successfully."
        ) {
          Swal.fire({
            icon: "success",
            title: "Accepted!",
            text: "Booking has been accepted and participant updated successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
          refetch(); // Refresh the UI if needed
        } else {
          throw new Error("Failed to add participant to schedule.");
        }
      } else {
        throw new Error("Failed to update booking.");
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while accepting the booking.",
      });
    }
  };

  // Function: Handles rejection of a booking with SweetAlert2 modals for reason input
  const handleReject = async (booking) => {
    // Step 1: Confirm rejection action via modal
    const confirmReject = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject it",
      cancelButtonText: "No, Keep it",
    });

    // Exit if action is cancelled
    if (!confirmReject.isConfirmed) return;

    // Step 2: Ask for rejection reason with an input box (using Tailwind classes)
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
        // Get the trimmed input value
        const input = document.getElementById("reasonInput").value.trim();

        // Show error if empty
        if (!input) {
          Swal.showValidationMessage("Please provide a reason.");
        }

        // Return the reason
        return input;
      },
    });

    // Exit if no reason is provided or cancelled
    if (!reason) return;

    // Step 3: Send update to backend to update the booking status and add reason
    try {
      const response = await axiosPublic.patch(
        `/Trainers_Booking_Request/${booking._id}`,
        {
          status: "Rejected",
          reason: reason,
        }
      );

      // Optionally refetch data after update
      refetch();

      // Step 4: Show final confirmation success message
      await Swal.fire({
        title: "Booking Rejected",
        text: `Reason: ${reason}`,
        icon: "success",
      });
      console.log("Booking updated:", response.data);
    } catch (error) {
      console.error("Error rejecting booking:", error);
      Swal.fire({
        title: "Update Failed",
        text: "Something went wrong while rejecting the booking.",
        icon: "error",
      });
    }
  };

  // Function: Dummy function to handle deletion of expired bookings
  const DeleteExpired = async (booking) => {
    console.log("Expired Delete:", booking); // Log deletion action

    const confirmReject = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Delete this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it",
      cancelButtonText: "No, Keep it",
    });

    if (confirmReject.isConfirmed) {
      try {
        const deleteResponse = await axiosPublic.delete(
          `/Trainers_Booking_Request/${booking._id}`
        );

        if (deleteResponse.data?.message) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Booking deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
          });

          // Refresh the data
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
    }
  };

  // Function: Cancel accepted booking and remove participant
  const cancelAcceptedBooking = async (booking, simulate = false) => {
    const confirmCancel = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it",
      cancelButtonText: "No, Keep it",
    });

    if (!confirmCancel.isConfirmed) return;

    // Prepare cancellation data for booking
    const bookingCancelData = {
      status: "Cancelled",
      acceptedAt: "",
      cancelAt: getFormattedStartDate(),
      paid: false,
    };

    // Prepare data to remove the participant from trainer schedule
    const removeParticipantData = {
      trainerName: booking.trainer, // e.g., "Thomas King"
      ids: booking.sessions, // Array of session IDs
      bookerEmail: booking.bookerEmail, // Email to identify participant
    };

    try {
      if (simulate) {
        // Simulate mode: just log the actions
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
        refetch();
        return;
      }

      // Step 1: Update booking request status to "Cancelled"
      const bookingResponse = await axiosPublic.patch(
        `/Trainers_Booking_Request/${booking._id}`,
        bookingCancelData
      );

      if (
        bookingResponse.data?.message ||
        bookingResponse.data === "Booking updated successfully."
      ) {
        // Step 2: Remove the participant from the trainer's session(s)
        const removeResponse = await axiosPublic.put(
          "/Trainers_Schedule/RemoveParticipant",
          removeParticipantData
        );

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
          refetch();
        } else {
          throw new Error("Failed to remove participant.");
        }
      } else {
        throw new Error("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while cancelling the booking.",
      });
    }
  };

  return (
    <>
      {!isBookingValid ? (
        <>
          <button
            id={`delete-btn-${booking._id}`}
            className="border-2 border-red-600 bg-red-200 rounded-full p-2 text-sm text-red-800 cursor-pointer"
            onClick={() => DeleteExpired(booking)}
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
          {/* For Expired bookings: Show Delete button, disabled until 12 days have passed */}
          {booking.status === "Expired" && (
            <>
              <button
                id={`delete-btn-${booking._id}`}
                className="border-2 border-red-600 bg-red-200 rounded-full p-2 text-sm text-red-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canDeleteExpired(booking.bookedAt)}
                onClick={() => DeleteExpired(booking)}
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
                onClick={() => cancelAcceptedBooking(booking)}
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
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  isBookingValid: PropTypes.bool.isRequired,
};

export default TrainerBookingRequestButton;
