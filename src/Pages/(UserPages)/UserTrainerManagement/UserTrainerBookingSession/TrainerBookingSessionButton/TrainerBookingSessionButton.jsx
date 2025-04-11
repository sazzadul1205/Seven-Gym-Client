// Import Icons
import { FaArrowUp, FaRegTrashAlt } from "react-icons/fa";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const TrainerBookingSessionButton = ({ booking, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Archive booking into history, then delete from request table
  const handleDeleteBooking = async (booking) => {
    if (!booking) return;

    // // Destructure ID from booking
    // eslint-disable-next-line no-unused-vars
    const { _id, ...rest } = booking;
    let updatedBooking = { ...rest };

    // If booking is still Pending, add a timestamp & mark as "Deleted"
    if (booking.status === "Pending") {
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, "0");

      const deletedAt = `${pad(now.getDate())}-${pad(
        now.getMonth() + 1
      )}-${now.getFullYear()}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

      updatedBooking = {
        ...rest,
        status: "Deleted",
        deletedAt,
      };
    }

    // Custom message based on booking status
    const confirmMessage =
      booking.status === "Pending"
        ? "This will cancel the booking permanently."
        : "This will delete the booking permanently.";

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText:
        booking.status === "Pending" ? "Yes, cancel it!" : "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        // Step 1: Archive to history collection
        await axiosPublic.post("/Trainer_Booking_History", updatedBooking);

        // Step 2: Delete original booking request
        const deleteResponse = await axiosPublic.delete(
          `/Trainers_Booking_Request/${booking._id}`
        );

        if (deleteResponse.data?.message) {
          Swal.fire({
            icon: "success",
            title: booking.status === "Pending" ? "Canceled!" : "Deleted!",
            text:
              booking.status === "Pending"
                ? "Booking canceled successfully."
                : "Booking deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
          });

          // Refetch all
          refetch();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while deleting the booking.",
          });
        }
      } catch (error) {
        console.error("Error in process:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Please try again.",
        });
      }
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
      const { data } = await axiosPublic.delete(
        `/Trainers_Booking_Request/${booking._id}`
      );

      // Check for success instead of deletedCount
      const isSuccess = data?.success;

      if (isSuccess) {
        Swal.fire({
          icon: "success",
          title: "Booking Cancelled",
          text: "The booking was successfully cancelled.",
          timer: 1500,
          showConfirmButton: false,
        });

        // Refetch all
        refetch();
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
          <button
            id={getButtonId()}
            className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
            onClick={() => {
              // TODO: Add modal logic here
            }}
          >
            <FaArrowUp className="text-blue-500" />
          </button>
          <Tooltip
            anchorSelect={`#${getButtonId()}`}
            content="Register Session"
          />
        </>
      )}

      {/* Expired, Cancelled, or Pending: Show Cancel Button */}
      {["Expired", "Cancelled", "Pending"].includes(booking.status) && (
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

      {/* Rejected Bookings: Show Permanent Delete Button */}
      {booking.status === "Rejected" && (
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
