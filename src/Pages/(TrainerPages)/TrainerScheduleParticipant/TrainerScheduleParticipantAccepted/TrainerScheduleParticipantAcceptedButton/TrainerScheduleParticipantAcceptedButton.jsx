import { useRef, useState } from "react";

// Import Icons
import { ImCross } from "react-icons/im";
import { FaInfo, FaRegClock, FaRegTrashAlt } from "react-icons/fa";

// Import Packages
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Import Swal Modal
import { getSelectedRefundPercentage } from "./getSelectedRefundPercentage";
import { getRejectionReason } from "../../../TrainerBookingRequest/TrainerBookingRequestButton/getRejectionReasonPrompt";

// Import Modal
import TrainerBookingAcceptedSetTime from "../TrainerBookingAcceptedSetTime/TrainerBookingAcceptedSetTime";
import TrainerBookingInfoModal from "../../../TrainerBookingRequest/TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";

// Generate a unique Refund ID using user email, current date, and random digits.
const generateRefundID = (userEmail) => {
  const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits.
  const currentDate = new Date()
    .toLocaleDateString("en-GB") // Format: DD/MM/YYYY.
    .split("/")
    .join(""); // Convert to DDMMYYYY format.
  return `SR${currentDate}${userEmail}${randomDigits}`;
};

// Get current date and time in "DD-MM-YYYY HH:MM:SS" format.
const getCurrentDateTime = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based.
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const TrainerScheduleParticipantAcceptedButton = ({ booking, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Ref to control modal visibility using native <dialog> element
  const modalRef = useRef(null);

  const modalRefClock = useRef(null);

  // State to track which booking is selected for modal view
  const [selectedBooking, setSelectedBooking] = useState(null);

  // State to track which booking is selected for modal view
  const [selectedAcceptedBooking, setSelectedAcceptedBooking] = useState(null);

  // Processing Sate
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal close handler
  const closeModal = () => {
    modalRef.current?.close();
    setSelectedBooking(null);
  };

  // Modal close handler
  const closeClockModal = () => {
    modalRefClock.current?.close();
    setSelectedAcceptedBooking(null);
  };

  // 🔹 Function: Clear a Booking that has already ended
  const handleClearEndedBooking = async (booking) => {
    const id = booking?._id;
    if (!id) return;

    // Step 1: Confirm deletion
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
      setIsProcessing(true);
      // Step 2: Remove _id from object before sending to history
      // eslint-disable-next-line no-unused-vars
      const { _id, ...bookingDataForHistory } = booking;

      // Step 3: Archive booking in history
      await axiosPublic.post("/Trainer_Booking_History", bookingDataForHistory);

      // Step 4: Delete from accepted bookings
      await axiosPublic.delete(`/Trainer_Booking_Accepted/Delete/${id}`);

      // Step 5: Show success UI
      Swal.fire({
        title: "Cleared!",
        text: "The booking has been cleared.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Optional: Refetch state or update local UI
      // refetchBookings?.();
    } catch (error) {
      console.error("Error clearing ended booking:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to clear the booking. Try again.",
        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 🔹 Function: Drop a currently running session with refund + history tracking
  const handleDropSession = async (booking) => {
    const id = booking?._id;
    if (!id) return console.warn("No booking ID found.");

    try {
      setIsProcessing(true);
      // ===========================
      // 🔸 STEP 1: Confirm Drop Intent
      // ===========================
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

      // ================================
      // 🔸 STEP 2: Prompt for Drop Reason
      // ================================
      const reason = await getRejectionReason(); // Should return string
      if (!reason) return;

      // =========================================
      // 🔸 STEP 3: Prompt for Refund Percentage
      // =========================================
      const totalPrice = booking?.totalPrice || 0;

      // Passing reason and price to refund selector modal
      const selectedRefundPercentage = await getSelectedRefundPercentage({
        reason,
        totalPrice,
      });

      // console.log(selectedRefundPercentage);

      if (selectedRefundPercentage === undefined) return;

      // ====================================
      // 🔸 STEP 4: Prepare Data for Insertion
      // ====================================
      const refundAmount = Number(
        ((selectedRefundPercentage / 100) * totalPrice).toFixed(2)
      );
      const refundID = generateRefundID(booking?.bookerEmail);
      const todayDateTime = getCurrentDateTime(); // Ex: "15-04-2025T12:34"

      // eslint-disable-next-line no-unused-vars
      const { _id, ...bookingDataForHistory } = booking;

      // ✅ Enrich booking data for archiving
      bookingDataForHistory.droppedAt = todayDateTime;
      bookingDataForHistory.status = "Dropped";
      bookingDataForHistory.reason = reason;
      bookingDataForHistory.RefundAmount = refundAmount;
      bookingDataForHistory.RefundPercentage = `${selectedRefundPercentage}%`;

      // ✅ Refund transaction details
      const PaymentRefund = {
        stripePaymentID: booking?.paymentID,
        refundAmount,
      };

      // ✅ Session refund metadata
      const SessionRefundData = {
        bookingDataForHistory,
        refundedAt: todayDateTime,
        PaymentRefund,
        refundID,
      };

      // ✅ Reset trainer schedule (remove participant)
      const ResetSessionPayload = {
        trainerName: booking?.trainer,
        ids: booking?.sessions,
        bookerEmail: booking?.bookerEmail,
      };

      // ==================================
      // 🔸 STEP 5: Fire All Requests Together
      // ==================================
      await Promise.all([
        // 1. Archive booking
        axiosPublic.post("/Trainer_Booking_History", bookingDataForHistory),

        // 2. Remove from active bookings
        axiosPublic.delete(`/Trainer_Booking_Accepted/Delete/${id}`),

        // 3. Initiate Stripe refund
        axiosPublic.post("/Stripe_Refund_Intent", PaymentRefund),

        // 4. Log refund metadata in DB
        axiosPublic.post("/Trainer_Session_Refund", SessionRefundData),

        // 5. Update trainer schedule to free up spots
        axiosPublic.put(
          "/Trainers_Schedule/RemoveParticipant",
          ResetSessionPayload
        ),
      ]);

      // ========================
      // 🔸 STEP 6: Show Success UI
      // ========================
      Swal.fire({
        title: "Cleared!",
        text: `Booking archived with ${selectedRefundPercentage}% refund ($${refundAmount}).`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Optional: Refetch UI/State
      refetch?.();
    } catch (error) {
      // 🔻 Error Catch Block
      console.error("Error during drop:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to clear the booking. Try again.",
        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* View Info Button */}
      <>
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
      </>

      {/* Show only if not started and not ended */}
      {!booking.startAt && booking.status !== "Ended" && (
        <>
          <button
            id={`clock-details-btn-${booking._id}`}
            className="border-2 border-green-500 bg-green-100 hover:bg-green-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => {
              modalRefClock.current?.showModal();
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
            disabled={isProcessing}
            id={`drop-details-btn-${booking._id}`}
            className={`border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              handleDropSession(booking);
            }}
          >
            <FaRegTrashAlt className="text-red-500" />
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
            disabled={isProcessing}
            id={`clear-details-btn-${booking._id}`}
            className={`border-2 border-red-500 bg-red-100 hover:bg-red-200 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              handleClearEndedBooking(booking);
            }}
          >
            <ImCross className="text-red-500" />
          </button>
        </>
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
      <dialog
        ref={modalRefClock}
        id="User_Trainer_Accepted_Time_Set"
        className="modal"
      >
        <TrainerBookingAcceptedSetTime
          refetch={refetch}
          closeClockModal={closeClockModal}
          selectedAcceptedBooking={selectedAcceptedBooking}
        />
      </dialog>
    </div>
  );
};
import PropTypes from "prop-types";

TrainerScheduleParticipantAcceptedButton.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    bookerEmail: PropTypes.string.isRequired,
    trainer: PropTypes.string,
    sessions: PropTypes.arrayOf(PropTypes.string),
    startAt: PropTypes.string, // could be null or undefined if not set
    status: PropTypes.string, // e.g., "Accepted", "Started", "Ended", "Dropped"
    totalPrice: PropTypes.string,
    paymentID: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func,
};

export default TrainerScheduleParticipantAcceptedButton;
