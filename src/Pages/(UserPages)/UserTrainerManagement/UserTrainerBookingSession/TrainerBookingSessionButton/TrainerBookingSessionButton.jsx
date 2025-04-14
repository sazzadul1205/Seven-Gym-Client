// Import Icons
import { FaArrowUp, FaRegTrashAlt } from "react-icons/fa";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { Link } from "react-router";

const TrainerBookingSessionButton = ({ booking, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Utility: Format current date as "dd-mm-yyyyThh:mm"
  const getFormattedDate = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(now.getDate())}-${pad(
      now.getMonth() + 1
    )}-${now.getFullYear()}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  // Archive the booking into history, then delete from request table
  const handleDeleteBooking = async (booking) => {
    if (!booking || !booking.status) return;

    // eslint-disable-next-line no-unused-vars
    const { _id, ...rest } = booking;
    let updatedBooking = { ...rest };

    // If pending, mark as deleted and add timestamp
    if (booking.status === "Pending") {
      updatedBooking = {
        ...rest,
        status: "Deleted",
        deletedAt: getFormattedDate(),
      };
    }

    // Status-based confirmation messages
    const statusLabels = {
      Pending: {
        message: "This will cancel the booking permanently.",
        button: "Yes, cancel it!",
        successTitle: "Canceled!",
        successText: "Booking canceled successfully.",
      },
      default: {
        message: "This will delete the booking permanently.",
        button: "Yes, delete it!",
        successTitle: "Deleted!",
        successText: "Booking deleted successfully.",
      },
    };

    const label = statusLabels[booking.status] || statusLabels.default;

    // Show confirmation alert
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: label.message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: label.button,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      // Step 1: Archive booking into history
      await axiosPublic.post("/Trainer_Booking_History", updatedBooking);

      // Step 2: Delete booking from active request table
      const deleteResponse = await axiosPublic.delete(
        `/Trainers_Booking_Request?${booking._id}`
      );

      // Handle success
      if (deleteResponse.data?.message) {
        Swal.fire({
          icon: "success",
          title: label.successTitle,
          text: label.successText,
          timer: 1500,
          showConfirmButton: false,
        });

        refetch(); // Refresh the data
      } else {
        throw new Error("API did not return success message.");
      }
    } catch (error) {
      console.error("Delete process failed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    }
  };

  // Cancel booking directly without archiving
  const handleCancelBooking = async (booking) => {
    if (!booking || !booking._id) {
      Swal.fire({
        icon: "error",
        title: "Invalid Booking",
        text: "Booking information is missing or incorrect.",
      });
      return;
    }

    // Confirm cancel action
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will cancel the booking permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      // Delete booking from active request table
      const { data } = await axiosPublic.delete(
        `/Trainers_Booking_Request?${booking._id}`
      );

      // Handle success
      const isSuccess = data?.success;

      if (isSuccess) {
        Swal.fire({
          icon: "success",
          title: "Booking Cancelled",
          text: "The booking was successfully cancelled.",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch(); // Refresh the data
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Cancel",
          text:
            data?.message ||
            "The booking could not be cancelled. It may already be deleted.",
        });
      }
    } catch (error) {
      console.error("Booking cancel error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while cancelling the booking.",
      });
    }
  };

  // Generate a unique ID for tooltip targeting
  const getButtonId = () => `booking-btn-${booking._id}-${booking.status}`;

  return (
    <>
      {/* Accepted Booking: Show 'Register Session' Button */}
      {booking.status === "Accepted" && (
        <>
          <Link to={`/User/UserTrainerSessionPayment/${booking?._id}`}>
            <button
              id={getButtonId()}
              className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
            >
              <FaArrowUp className="text-blue-500" />
            </button>
          </Link>
          <Tooltip anchorSelect={`#${getButtonId()}`} content="Pay Session" />
        </>
      )}

      {/* Expired, Cancelled, or Pending: Show Cancel Button */}
      {["Expired", "Pending"].includes(booking.status) && (
        <>
          <button
            id={getButtonId()}
            className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
            onClick={() => handleCancelBooking(booking)}
          >
            <FaRegTrashAlt className="text-red-500" />
          </button>
          <Tooltip
            anchorSelect={`#${getButtonId()}`}
            content="Cancel Booking"
          />
        </>
      )}

      {/* Rejected & Cancelled Bookings: Show Permanent Delete Button */}
      {["Rejected", "Cancelled"].includes(booking.status) && (
        <>
          <button
            id={getButtonId()}
            className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
            onClick={() => handleDeleteBooking(booking)}
          >
            <FaRegTrashAlt className="text-red-500" />
          </button>
          <Tooltip
            anchorSelect={`#${getButtonId()}`}
            content="Delete Booking"
          />
        </>
      )}
    </>
  );
};

TrainerBookingSessionButton.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default TrainerBookingSessionButton;
