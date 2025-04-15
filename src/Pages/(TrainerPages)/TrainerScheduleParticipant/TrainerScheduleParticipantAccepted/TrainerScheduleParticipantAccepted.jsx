/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";

// Import Icons
import { ImCross } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { FaInfo, FaRegClock } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Import Utility
import { calculateEndAt } from "./calculateEndAt";
import { formatDate } from "../../../../Utility/formatDate";
import { formatDateWithTextMonth } from "./formatDateWithTextMonth ";

// import Component & Modal
import TrainerBookingAcceptedSetTime from "./TrainerBookingAcceptedSetTime/TrainerBookingAcceptedSetTime";
import TrainerBookingInfoModal from "../../TrainerBookingRequest/TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";
import TrainerBookingRequestUserBasicInfo from "../../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";
import { getRejectionReason } from "../../TrainerBookingRequest/TrainerBookingRequestButton/getRejectionReasonPrompt";

const TrainerScheduleParticipantAccepted = ({
  refetch,
  TrainerBookingAcceptedData,
}) => {
  const axiosPublic = useAxiosPublic();

  // Ref to control modal visibility using native <dialog> element
  const modalRef = useRef(null);

  // State to track which booking is selected for modal view
  const [selectedBooking, setSelectedBooking] = useState(null);

  // State to track which booking is selected for modal view
  const [selectedAcceptedBooking, setSelectedAcceptedBooking] = useState(null);

  // Modal close handler
  const closeModal = () => {
    modalRef.current?.close();
    setSelectedBooking(null);
  };

  // Delete the Bookings that have Ended
  const handleClearEndedBooking = async (booking) => {
    const id = booking?._id;
    if (!id) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will clear the booking permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      // Step 1: Remove _id before sending to history
      const { _id, ...bookingDataForHistory } = booking;

      await axiosPublic.post("/Trainer_Booking_History", bookingDataForHistory);

      // Step 2: Delete from accepted
      await axiosPublic.delete(`/Trainer_Booking_Accepted/Delete/${id}`);

      // Step 3: Success alert
      Swal.fire({
        title: "Cleared!",
        text: "The booking has been cleared.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Optional: Refresh
      // refetchBookings(); or update your local state
    } catch (error) {
      console.error("Error clearing ended booking:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to clear the booking. Try again.",
        icon: "error",
      });
    }
  };

  const handleDropSession = async (booking) => {
    const id = booking?._id;
    if (!id) return;

    // Step 1: Confirm Deletion
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will clear the booking permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear it!",
    });

    if (!confirm.isConfirmed) return;

    // Step 2: Ask for Drop Reason
    const reason = await getRejectionReason();
    if (!reason) return;

    // Step 3: Ask for Refund Percentage
    const refundPercentages = [0, 25, 50, 75, 100];
    const totalPrice = booking?.totalPrice || 0;

    const { value: selectedRefund } = await Swal.fire({
      title: "Select Refund Percentage",
      html: `
      <div class="space-y-4 text-left text-sm font-medium text-gray-700">
        <div>
          <label class="block text-gray-800 font-semibold mb-1">Drop Reason:</label>
          <p class="bg-gray-100 p-2 rounded text-gray-900">${reason}</p>
        </div>
    
        <div>
          <label class="block text-gray-800 font-semibold mb-1">Total Price:</label>
          <p class="bg-gray-100 p-2 rounded text-gray-900">$${Number(
            totalPrice
          ).toFixed(2)}</p>
        </div>
    
        <div>
          <label class="block text-gray-800 font-semibold mb-1">Select Refund Percentage:</label>
          <div class="flex flex-wrap gap-2">
            ${refundPercentages
              .map(
                (percent) => `
                <button type="button" 
                  class="refund-btn px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Refund ${percent}%" 
                  onclick="document.getElementById('refundPreview').textContent = 
                    '${percent}% refund = $${(
                  (percent / 100) *
                  totalPrice
                ).toFixed(2)}';
                    document.getElementById('selectedRefundInput').value = ${percent}">
                  ${percent}%
                </button>`
              )
              .join("")}
          </div>
        </div>
    
        <input type="hidden" id="selectedRefundInput" />
        <div id="refundPreview" class="mt-2 p-2 rounded bg-green-100 text-green-800 font-semibold">
          Select a percentage to preview refund
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      preConfirm: () => {
        const percent = document.getElementById("selectedRefundInput").value;
        if (!percent) {
          Swal.showValidationMessage("Please select a refund percentage.");
        }
        return Number(percent);
      },
      didOpen: () => {
        // Style buttons if needed
        const btns = Swal.getPopup().querySelectorAll(".refund-btn");
        btns.forEach((btn) => {
          btn.classList.add(
            "hover:bg-gray-100",
            "transition",
            "cursor-pointer"
          );
        });
      },
    });

    if (selectedRefund === undefined) return;

    // Step 4: Submit to History and Delete
    try {
      const { _id, ...bookingDataForHistory } = booking;
      bookingDataForHistory.dropReason = reason;
      bookingDataForHistory.refundPercentage = selectedRefund;
      bookingDataForHistory.estimatedRefund = (
        (selectedRefund / 100) *
        totalPrice
      ).toFixed(2);

      // await axiosPublic.post("/Trainer_Booking_History", bookingDataForHistory);
      // await axiosPublic.delete(`/Trainer_Booking_Accepted/Delete/${id}`);
      console.log(bookingDataForHistory);

      Swal.fire({
        title: "Cleared!",
        text: `Booking archived with ${selectedRefund}% refund.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Optionally refresh state
      // refetchBookings();
    } catch (error) {
      console.error("Error during drop:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to clear the booking. Try again.",
        icon: "error",
      });
    }
  };

  return (
    <div className="px-5 pb-5">
      {/* Section Title */}
      <h3 className="text-xl font-semibold text-black border-b-2 border-gray-700 pb-2">
        Accepted Class Participant
      </h3>

      {/* Accepted Bookings Data */}
      {TrainerBookingAcceptedData.length > 0 ? (
        <>
          {/* Accepted Bookings : Desktop View */}
          <div className="hidden md:block">
            <table className="min-w-full bg-white text-black">
              {/* Accepted Bookings Header */}
              <thead className="bg-gray-800 text-white text-sm uppercase">
                <tr>
                  {[
                    "Booker",
                    "Accepted At",
                    "Total Price",
                    "Duration",
                    "Status",
                    "Start At",
                    "End At",
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
                {TrainerBookingAcceptedData.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`transition-colors duration-200 hover:bg-gray-100 border-b border-gray-500 ${
                      !booking.startAt ? "bg-green-100 hover:bg-green-50" : ""
                    }`}
                  >
                    {/* Booker Info */}
                    <td className="px-4 py-3 font-medium">
                      <TrainerBookingRequestUserBasicInfo
                        email={booking.bookerEmail}
                      />
                    </td>

                    {/* Accepted At */}
                    <td className="px-4 py-3">
                      {formatDate(booking.acceptedAt)}
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

                    {/* Start At */}
                    <td className="px-4 py-3">
                      {booking.startAt
                        ? formatDateWithTextMonth(booking.startAt)
                        : "--/--"}
                    </td>

                    {/* End At */}
                    <td className="px-4 py-3">
                      {booking.status === "Ended" ? (
                        <span className="font-bold text-red-600">Ended</span>
                      ) : booking.endAt ? (
                        formatDateWithTextMonth(booking.endAt)
                      ) : booking.startAt ? (
                        formatDateWithTextMonth(
                          calculateEndAt(booking.startAt, booking.durationWeeks)
                        )
                      ) : (
                        "--/--"
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* View Info Button */}
                        <button
                          id={`view-details-btn-${booking._id}`}
                          className="border-2 border-yellow-500 bg-yellow-100 hover:bg-yellow-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
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

                        {/* Show only if not started and not ended */}
                        {!booking.startAt && booking.status !== "Ended" && (
                          <>
                            <button
                              id={`clock-details-btn-${booking._id}`}
                              className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                              onClick={() => {
                                document
                                  .getElementById(
                                    "User_Trainer_Accepted_Time_Set"
                                  )
                                  .showModal();
                                setSelectedAcceptedBooking(booking);
                              }}
                            >
                              <FaRegClock className="text-green-500" />
                            </button>
                            <Tooltip
                              anchorSelect={`#clock-details-btn-${booking._id}`}
                              content="Set Start Time"
                            />
                          </>
                        )}

                        {/* Show delete (actually set to ended) if started and not ended */}
                        {booking.startAt && booking.status !== "Ended" && (
                          <>
                            <button
                              id={`drop-details-btn-${booking._id}`}
                              className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                              onClick={() => {
                                handleDropSession(booking);
                              }}
                            >
                              <MdDelete className="text-red-500" />
                            </button>
                            <Tooltip
                              anchorSelect={`#drop-details-btn-${booking._id}`}
                              content="Drop Class"
                            />
                          </>
                        )}

                        {/* Show clear if status is ended */}
                        {booking.status === "Ended" && (
                          <>
                            <button
                              id={`clear-details-btn-${booking._id}`}
                              className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                              onClick={() => {
                                handleClearEndedBooking(booking);
                              }}
                            >
                              <ImCross className="text-red-500" />
                            </button>
                            <Tooltip
                              anchorSelect={`#clear-details-btn-${booking._id}`}
                              content="Clear Booking"
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Accepted Bookings : Mobile View */}
          <div className="md:hidden space-y-4 text-black">
            {TrainerBookingAcceptedData.map((booking) => (
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
                  {/* Accept */}
                  <div className="flex justify-between">
                    <strong>Accept At:</strong> {formatDate(booking.acceptedAt)}
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

                  {/* Start At */}
                  <p className="flex justify-between">
                    <strong>Start At:</strong>{" "}
                    {booking.startAt
                      ? formatDateWithTextMonth(booking.startAt)
                      : "--/--"}
                  </p>

                  {/* End At */}
                  <p className="flex justify-between">
                    <strong>End At:</strong>{" "}
                    {booking.status === "Ended" ? (
                      <span className="font-bold text-red-600">Ended</span>
                    ) : booking.endAt ? (
                      formatDateWithTextMonth(booking.endAt)
                    ) : booking.startAt ? (
                      formatDateWithTextMonth(
                        calculateEndAt(booking.startAt, booking.durationWeeks)
                      )
                    ) : (
                      "--/--"
                    )}
                  </p>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex justify-end mt-3 gap-2">
                  <div className="flex items-center gap-2">
                    {/* View Info Button */}
                    <button
                      id={`view-details-btn-${booking._id}`}
                      className="border-2 border-yellow-500 bg-yellow-100 hover:bg-yellow-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
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

                    {/* Show only if not started and not ended */}
                    {!booking.startAt && booking.status !== "Ended" && (
                      <>
                        <button
                          id={`clock-details-btn-${booking._id}`}
                          className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => {
                            document
                              .getElementById("User_Trainer_Accepted_Time_Set")
                              .showModal();
                            setSelectedAcceptedBooking(booking);
                          }}
                        >
                          <FaRegClock className="text-green-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#clock-details-btn-${booking._id}`}
                          content="Set Start Time"
                        />
                      </>
                    )}

                    {/* Show delete (actually set to ended) if started and not ended */}
                    {booking.startAt && booking.status !== "Ended" && (
                      <>
                        <button
                          id={`drop-details-btn-${booking._id}`}
                          className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => {
                            document
                              .getElementById("User_Trainer_Accepted_Time_Set")
                              .showModal();
                            setSelectedAcceptedBooking(booking);
                          }}
                        >
                          <MdDelete className="text-red-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#drop-details-btn-${booking._id}`}
                          content="Mark as Ended"
                        />
                      </>
                    )}

                    {/* Show clear if status is ended */}
                    {booking.status === "Ended" && (
                      <>
                        <button
                          id={`clear-details-btn-${booking._id}`}
                          className="border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => {
                            handleClearEndedBooking(booking);
                          }}
                        >
                          <ImCross className="text-red-500" />
                        </button>
                        <Tooltip
                          anchorSelect={`#clear-details-btn-${booking._id}`}
                          content="Clear Booking"
                        />
                      </>
                    )}
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

      {/* Booking Details Time Set */}
      <dialog id="User_Trainer_Accepted_Time_Set" className="modal">
        <TrainerBookingAcceptedSetTime
          refetch={refetch}
          selectedAcceptedBooking={selectedAcceptedBooking}
        />
      </dialog>
    </div>
  );
};

// Prop Type Validation
TrainerScheduleParticipantAccepted.propTypes = {
  TrainerBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      acceptedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      durationWeeks: PropTypes.number.isRequired,
      paid: PropTypes.bool.isRequired,
      startAt: PropTypes.string,
      endAt: PropTypes.string,
    })
  ).isRequired,
  refetch: PropTypes.func,
};

export default TrainerScheduleParticipantAccepted;
