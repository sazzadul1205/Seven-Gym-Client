/* eslint-disable no-unused-vars */
// Import Icons
import { FaArrowUp, FaRegTrashAlt } from "react-icons/fa";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { Link } from "react-router";
import { ImCross } from "react-icons/im";

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

    const { _id, ...rest } = booking;
    let updatedBooking = { ...rest };

    const archiveStatuses = ["Pending", "Rejected", "Cancelled", "Unavailable"];

    // Modify booking data if it's Pending
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
      Rejected: {
        message: "This will delete the rejected booking.",
        button: "Yes, delete it!",
        successTitle: "Deleted!",
        successText: "Rejected booking deleted.",
      },
      Cancelled: {
        message: "This will delete the cancelled booking.",
        button: "Yes, delete it!",
        successTitle: "Deleted!",
        successText: "Cancelled booking deleted.",
      },
      Unavailable: {
        message: "This will delete the unavailable booking.",
        button: "Yes, delete it!",
        successTitle: "Deleted!",
        successText: "Unavailable booking deleted.",
      },
      default: {
        message: "This will delete the booking permanently.",
        button: "Yes, delete it!",
        successTitle: "Deleted!",
        successText: "Booking deleted successfully.",
      },
    };

    const label = statusLabels[booking.status] || statusLabels.default;

    // Confirmation popup
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
      // Archive if in our target list
      if (archiveStatuses.includes(booking.status)) {
        await axiosPublic.post("/Trainer_Booking_History", updatedBooking);
      }

      // Delete from main request table
      const deleteResponse = await axiosPublic.delete(
        `/Trainer_Booking_Request?id=${booking._id}`
      );

      if (deleteResponse.data?.message) {
        Swal.fire({
          icon: "success",
          title: label.successTitle,
          text: label.successText,
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
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
    if (!booking || !booking._id || !booking.status) {
      Swal.fire({
        icon: "error",
        title: "Invalid Booking",
        text: "Booking information is missing or incorrect.",
      });
      return;
    }

    const isPending = booking.status === "Pending";
    const isExpired = booking.status === "Expired";

    if (!isPending && !isExpired) {
      Swal.fire({
        icon: "info",
        title: "Not Cancellable",
        text: "Only 'Pending' or 'Expired' bookings can be cancelled directly.",
      });
      return;
    }

    // Set dynamic text based on status
    const statusText = isPending
      ? "This will cancel your pending booking permanently."
      : "This will remove the expired booking.";

    const confirmBtnText = isPending ? "Yes, cancel it" : "Yes, delete it";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: statusText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmBtnText,
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    // Delete the booking
    const { data } = await axiosPublic.delete(
      `/Trainer_Booking_Request?id=${booking._id}`
    );

    if (data?.success || data?.message) {
      Swal.fire({
        icon: "success",
        title: isPending ? "Booking Cancelled" : "Expired Booking Removed",
        text: isPending
          ? "The pending booking was cancelled successfully."
          : "The expired booking was removed.",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: data?.message || "Could not process the request.",
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
            <ImCross className="text-red-500" />
          </button>
          <Tooltip
            anchorSelect={`#${getButtonId()}`}
            content="Cancel Booking"
          />
        </>
      )}

      {/* Rejected & Cancelled Bookings: Show Permanent Delete Button */}
      {["Rejected", "Cancelled", "Unavailable"].includes(booking.status) && (
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
