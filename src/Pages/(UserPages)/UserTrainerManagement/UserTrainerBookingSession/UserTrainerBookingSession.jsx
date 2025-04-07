import { useEffect, useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import icons
import { FaArrowUp, FaInfo, FaRegTrashAlt } from "react-icons/fa";

// Import Modal
import UserTrainerBookingInfoModal from "./UserTrainerBookingInfoModal/UserTrainerBookingInfoModal";

// import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import UserTrainerBookingAcceptModal from "./UserTrainerBookingAcceptModal/UserTrainerBookingAcceptModal";

// Format: "06-04-2025T11:12"
const parseCustomDate = (input) => {
  if (!input) return null;
  const [datePart, timePart] = input.split("T");
  const [day, month, year] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
};

//  Formats the input date string into a custom date format.
const formatDate = (input) => {
  const dateObj = parseCustomDate(input);
  if (!dateObj) return "";

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return dateObj.toLocaleString("en-US", options);
};

// Calculates the remaining time between the input date and the current date.
const getRemainingTime = (input, now) => {
  const startDate = parseCustomDate(input);
  if (!startDate) return "Invalid date";

  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + 7); // 1 week later

  const diff = expiry - now;
  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m left`;
};

const UserTrainerBookingSession = ({ TrainersBookingRequestData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Now State
  const [now, setNow] = useState(new Date());

  // Initializes a state variable for the selected booking.
  const [selectedBooking, setSelectedBooking] = useState(null);

  // useEffect hook that updates the current time every 60 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

  // Function to determine background color based on status
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-linear-to-bl from-green-400 to-green-200";
      case "Rejected":
        return "bg-linear-to-bl from-red-400 to-red-200";
      case "Expired":
        return "bg-linear-to-bl from-gray-400 to-gray-200";
      default:
        return "bg-white"; // Default background (for Pending)
    }
  };

  // Return Null if data is none
  if (!TrainersBookingRequestData) return null;

  return (
    <div>
      {/* Header */}
      <div className="text-center py-1">
        {/* Title */}
        <h3 className="text-center text-xl font-semibold">Booked Sessions</h3>

        {/* Warnings */}
        <p className="text-sm text-red-600 italic">
          Note: Booking requests will automatically expire and be removed after
          one week from the time of booking.
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-black w-1/3 p-[1px]" />

      {/* Bookings List */}
      <div className="py-4">
        {/* Desktop View */}
        <div className="hidden md:block">
          {TrainersBookingRequestData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-white border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#A1662F] text-white">
                    <th className="px-4 py-2 text-left">Trainer</th>
                    <th className="px-4 py-2 text-left">Booked At</th>
                    <th className="px-4 py-2 text-left">Total Price</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-center">Expires In</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {TrainersBookingRequestData.map((booking) => (
                    <tr
                      key={booking._id}
                      className={`border-b hover:bg-gray-100 ${getStatusBackgroundColor(
                        booking.status
                      )}`}
                    >
                      {/* Table : Trainer */}
                      <td className="px-4 py-2">{booking.trainer}</td>
                      {/* Table : Booked At */}
                      <td className="px-4 py-2">
                        {formatDate(booking.bookedAt)}
                      </td>
                      {/* Table : Total Price */}
                      <td className="px-4 py-2">$ {booking.totalPrice}</td>
                      {/* Table : Duration Weeks */}
                      <td className="px-4 py-2">
                        {booking.durationWeeks} Weeks
                      </td>
                      {/* Table : Status */}
                      <td className="px-4 py-2">{booking.status}</td>
                      {/* Table : Remaining Time */}
                      <td className="px-4 py-2 font-semibold text-sm text-center">
                        {
                          booking.status === "Pending"
                            ? getRemainingTime(booking.bookedAt, now) // Show remaining time if Pending
                            : "-- / --" // Show Expired if not Pending
                        }
                      </td>

                      {/* Table : Buttons */}
                      <td className="flex px-4 py-2 gap-2">
                        {/* Conditional Buttons */}
                        {booking.status === "Accepted" && (
                          // "Go" Button for Accepted Status
                          <button
                            id={`go-btn-${booking._id}`} // Unique ID for each button
                            className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
                            onClick={() => {
                              setSelectedBooking(booking);
                              document
                                .getElementById(
                                  "User_Trainer_Booking_Accept_Modal"
                                )
                                .showModal();
                            }}
                          >
                            <FaArrowUp className="text-blue-500" />{" "}
                            {/* Go Icon */}
                          </button>
                        )}

                        {booking.status === "Expired" && (
                          // Only Delete Button for Expired Status
                          <button
                            id={`delete-btn-${booking._id}`} // Unique ID for each button
                            className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                            onClick={() => handleDeleteBooking(booking)}
                          >
                            <FaRegTrashAlt className="text-red-500" />{" "}
                            {/* Delete Icon */}
                          </button>
                        )}

                        {booking.status === "Rejected" && (
                          // Only Delete Button for Rejected Status
                          <button
                            id={`delete-btn-${booking._id}`} // Unique ID for each button
                            className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                            onClick={() => handleDeleteBooking(booking)}
                          >
                            <FaRegTrashAlt className="text-red-500" />{" "}
                            {/* Delete Icon */}
                          </button>
                        )}

                        {booking.status !== "Expired" &&
                          booking.status !== "Accepted" &&
                          booking.status !== "Rejected" && (
                            // Original Buttons for other statuses
                            <>
                              <button
                                id={`view-details-btn-${booking._id}`} // Unique ID for each button
                                className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  document
                                    .getElementById(
                                      "User_Trainer_Booking_Info_Modal"
                                    )
                                    .showModal();
                                }}
                              >
                                <FaInfo className="text-green-500" />{" "}
                                {/* Info Icon */}
                              </button>

                              <button
                                id={`cancel-btn-${booking._id}`} // Unique ID for each button
                                className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                                onClick={() => handleDeleteBooking(booking)}
                              >
                                <FaRegTrashAlt className="text-red-500" />{" "}
                                {/* Delete Icon */}
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
                          anchorSelect={`#view-details-btn-${booking._id}`}
                          content="View Detailed Booking Data"
                        />
                        <Tooltip
                          anchorSelect={`#delete-btn-${booking._id}`}
                          content="Delete Booking"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No bookings available.</p>
          )}
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden flex-col space-y-4 mb-6">
          {TrainersBookingRequestData.map((booking) => (
            <div
              key={booking._id}
              className={`text-black text-center ${getStatusBackgroundColor(
                booking.status
              )} mb-4 p-4 border-b`}
            >
              <div className="flex flex-col space-y-2">
                {/* Trainer */}
                <div className="font-semibold">Trainer: {booking.trainer}</div>

                {/* Booked At */}
                <div className="flex justify-between items-center pt-2">
                  <p className="font-bold">Booked At:</p>
                  <span>{formatDate(booking.bookedAt)}</span>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center">
                  <p className="font-bold">Total Price:</p>
                  <span>$ {booking.totalPrice}</span>
                </div>

                {/* Duration */}
                <div className="flex justify-between items-center">
                  <p className="font-bold">Duration:</p>
                  <span>{booking.durationWeeks} Weeks</span>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center">
                  <p className="font-bold">Status:</p>
                  <span>{booking.status}</span>
                </div>

                {/* Remaining Time */}
                <div className="flex justify-between items-center font-semibold text-sm">
                  <p className="font-bold">Expires In:</p>
                  <span>
                    {
                      booking.status === "Pending"
                        ? getRemainingTime(booking.bookedAt, now) // Show remaining time if Pending
                        : "-- / --" // Show Expired if not Pending
                    }
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex justify-between gap-4 pt-4">
                  {/* Conditional Buttons */}
                  {booking.status === "Accepted" && (
                    // "Go" Button for Accepted Status
                    <button
                      id={`go-btn-${booking._id}`} // Unique ID for each button
                      className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      onClick={() => {
                        setSelectedBooking(booking);
                        document
                          .getElementById("User_Trainer_Booking_Accept_Modal")
                          .showModal();
                      }}
                    >
                      <FaArrowUp className="text-blue-500" /> {/* Go Icon */}
                    </button>
                  )}

                  {booking.status === "Expired" && (
                    // Only Delete Button for Expired Status
                    <button
                      id={`cancel-btn-${booking._id}`} // Unique ID for each button
                      className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      onClick={() => handleDeleteBooking(booking)}
                    >
                      <FaRegTrashAlt className="text-red-500" />{" "}
                      {/* Delete Icon */}
                    </button>
                  )}

                  {booking.status === "Rejected" && (
                    // Only Delete Button for Rejected Status
                    <button
                      id={`cancel-btn-${booking._id}`} // Unique ID for each button
                      className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                      onClick={() => handleDeleteBooking(booking)}
                    >
                      <FaRegTrashAlt className="text-red-500" />{" "}
                      {/* Delete Icon */}
                    </button>
                  )}

                  {booking.status !== "Expired" &&
                    booking.status !== "Accepted" &&
                    booking.status !== "Rejected" && (
                      // Original Buttons for other statuses
                      <>
                        <button
                          id={`view-details-btn-${booking._id}`} // Unique ID for each button
                          className="border-2 border-green-500 bg-green-100 rounded-full p-2 cursor-pointer hover:scale-105"
                          onClick={() => {
                            setSelectedBooking(booking);
                            document
                              .getElementById("User_Trainer_Booking_Info_Modal")
                              .showModal();
                          }}
                        >
                          <FaInfo className="text-green-500" />{" "}
                          {/* Info Icon */}
                        </button>

                        <button
                          id={`cancel-btn-${booking._id}`} // Unique ID for each button
                          className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
                          onClick={() => handleDeleteBooking(booking)}
                        >
                          <FaRegTrashAlt className="text-red-500" />{" "}
                          {/* Delete Icon */}
                        </button>
                      </>
                    )}

                  {/* Tooltips */}
                  <Tooltip
                    anchorSelect={`#go-btn-${booking._id}`}
                    content="Go to My Session"
                  />
                  <Tooltip
                    anchorSelect={`#cancel-btn-${booking._id}`}
                    content="Cancel Booking"
                  />
                  <Tooltip
                    anchorSelect={`#view-details-btn-${booking._id}`}
                    content="View Detailed Booking Data"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Trainer Booking Info Modal */}
      <dialog id="User_Trainer_Booking_Info_Modal" className="modal">
        <UserTrainerBookingInfoModal selectedBooking={selectedBooking} />
      </dialog>

      {/* User Trainer Booking Info Modal */}
      <dialog id="User_Trainer_Booking_Accept_Modal" className="modal">
        <UserTrainerBookingAcceptModal selectedBooking={selectedBooking} />
      </dialog>
    </div>
  );
};

UserTrainerBookingSession.propTypes = {
  TrainersBookingRequestData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trainer: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.string,
      durationWeeks: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      sessions: PropTypes.arrayOf(PropTypes.string),
      bookerEmail: PropTypes.string,
    })
  ),
  refetch: PropTypes.func,
};

export default UserTrainerBookingSession;
