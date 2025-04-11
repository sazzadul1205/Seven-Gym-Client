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

  // Handle Delete Bookings
  const handleDeleteBooking = async (booking) => {
    if (!booking) return;

    const { _id, ...rest } = booking;
    let updatedBooking = { ...rest };

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
        await axiosPublic.post("/Trainer_Booking_History", updatedBooking);

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

      if (data?.deletedCount && data.deletedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Booking Cancelled",
          text: "The booking was successfully cancelled.",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Cancel",
          text: "The booking could not be cancelled. It may already be deleted.",
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

  const getButtonId = () => `booking-btn-${booking._id}-${booking.status}`;

  return (
    <>
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
