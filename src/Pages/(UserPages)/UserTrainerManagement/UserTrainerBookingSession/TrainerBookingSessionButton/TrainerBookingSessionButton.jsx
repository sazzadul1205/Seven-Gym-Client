// Import Ico9ns
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

    // eslint-disable-next-line no-unused-vars
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

    // Step 1: Confirm Deletion (Conditional message based on status)
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

    // If result is confirmed, start both processes
    if (confirmResult.isConfirmed) {
      try {
        // Step 2: Post to Trainer_Booking_History (without showing the success alert)
        await axiosPublic.post("/Trainer_Booking_History", updatedBooking);

        // Step 3: Proceed with Deletion
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

          // Step 4: Refresh or perform any necessary actions after deletion
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

  return (
    <>
      {/* Payment Button  */}
      {booking.status === "Accepted" && (
        <button
          id={`go-btn-${booking._id}`}
          className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
          onClick={() => {
            // setSelectedBooking(booking);
            // document
            //   .getElementById("User_Trainer_Booking_Accept_Modal")
            //   .showModal();
          }}
        >
          <FaArrowUp className="text-blue-500" />
        </button>
      )}

      {/*  Delete Expired Button */}
      {booking.status === "Expired" && (
        <button
          id={`delete-btn-${booking._id}`}
          className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
          onClick={() => handleDeleteBooking(booking)}
        >
          <FaRegTrashAlt className="text-red-500" />
        </button>
      )}

      {/* Delete Rejected Button */}
      {booking.status === "Rejected" && (
        <button
          id={`delete-btn-${booking._id}`}
          className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
          onClick={() => handleDeleteBooking(booking)}
        >
          <FaRegTrashAlt className="text-red-500" />
        </button>
      )}

      {/* Delete Cancelled Button */}
      {booking.status === "Cancelled" && (
        <button
          id={`delete-btn-${booking._id}`}
          className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
          onClick={() => handleDeleteBooking(booking)}
        >
          <FaRegTrashAlt className="text-red-500" />
        </button>
      )}

      {/* Default Button */}
      {booking.status !== "Expired" &&
        booking.status !== "Accepted" &&
        booking.status !== "Rejected" &&
        booking.status !== "Cancelled" && (
          <>
            <button
              id={`cancel-btn-${booking._id}`}
              className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
              onClick={() => handleDeleteBooking(booking)}
            >
              <FaRegTrashAlt className="text-red-500" />
            </button>
          </>
        )}

      {/* Tooltips */}
      <Tooltip
        anchorSelect={`#go-btn-${booking._id}`}
        content="Register Session"
      />
      <Tooltip
        anchorSelect={`#cancel-btn-${booking._id}`}
        content="Cancel Booking"
      />
      <Tooltip
        anchorSelect={`#delete-btn-${booking._id}`}
        content="Delete Booking"
      />
    </>
  );
};

// Prop Type
TrainerBookingSessionButton.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    // You can add more fields if needed
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default TrainerBookingSessionButton;
