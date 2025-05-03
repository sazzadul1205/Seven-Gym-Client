import { useEffect, useRef, useState } from "react";

// Import Modal
import TrainerBookingInfoModal from "../TrainerBookingRequest/TrainerBookingRequestButton/trainerBookingInfoModal/trainerBookingInfoModal";

// Import Button
import TrainerScheduleHistoryCompleted from "./TrainerScheduleHistoryCompleted/TrainerScheduleHistoryCompleted";
import TrainerScheduleHistoryPending from "./TrainerScheduleHistoryPending/TrainerScheduleHistoryPending";
import TrainerScheduleHistoryCanceled from "./TrainerScheduleHistoryCanceled/TrainerScheduleHistoryCanceled";

// Import Prop
import PropTypes from "prop-types";

// Status background color
const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 hover:bg-green-200";
    case "Rejected":
      return "bg-red-100 hover:bg-red-200";
    case "Expired":
      return "bg-gray-200 hover:bg-gray-300";
    default:
      return "bg-white";
  }
};

const TrainerScheduleHistory = ({
  TrainerBookingHistoryData,
  TrainerBookingAcceptedData,
}) => {
  // State to hold the current time, updated every minute
  const [setNow] = useState(new Date());

  // State to keep track of the currently selected booking (for modal view)
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Ref for controlling the modal programmatically
  const modalRef = useRef(null);

  // useEffect to update the current time every 60 seconds (1 minute)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date()); // Update time to trigger re-renders or freshness checks
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [setNow]);

  // Function to close the modal and reset selected booking state
  const closeModal = () => {
    modalRef.current?.close(); // Safely close modal if ref is defined
    setSelectedBooking(null); // Clear selected booking
  };

  // Function to safely parse a date string formatted as "dd-mm-yyyyTHH:MM" into a JS Date object
  const parseCustomDate = (dateStr) => {
    const [datePart, timePart] = dateStr.split("T");
    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  // Create a new sorted array of booking history based on most recent 'bookedAt' first
  const sortedHistory = [...TrainerBookingHistoryData].sort(
    (a, b) => parseCustomDate(b.bookedAt) - parseCustomDate(a.bookedAt)
  );

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400  min-h-screen">
      {/* Section heading */}
      <div className="text-center py-3">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Trainer Session History
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          View your past and upcoming sessions with clients
        </p>
      </div>
      {/* Divider */}
      <div className="mx-auto bg-white w-1/3 p-[1px]" />

      {/* Accepted Pending Classes */}
      <TrainerScheduleHistoryPending
        modalRef={modalRef}
        setSelectedBooking={setSelectedBooking}
        TrainerBookingAcceptedData={TrainerBookingAcceptedData}
      />

      {/* Completed Class */}
      <TrainerScheduleHistoryCompleted
        modalRef={modalRef}
        sortedHistory={sortedHistory}
        setSelectedBooking={setSelectedBooking}
        getStatusBackgroundColor={getStatusBackgroundColor}
        TrainerBookingHistoryData={TrainerBookingHistoryData}
      />

      {/* Canceled Classes */}
      <TrainerScheduleHistoryCanceled
        modalRef={modalRef}
        sortedHistory={sortedHistory}
        setSelectedBooking={setSelectedBooking}
        getStatusBackgroundColor={getStatusBackgroundColor}
      />

      {/* Modal */}
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
    </div>
  );
};
// Prop Validation
TrainerScheduleHistory.propTypes = {
  TrainerBookingHistoryData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired, // Expecting "dd-mm-yyyyTHH:MM"
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      durationWeeks: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      reason: PropTypes.string,
    })
  ).isRequired,

  TrainerBookingAcceptedData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      bookerEmail: PropTypes.string.isRequired,
      bookedAt: PropTypes.string.isRequired,
      totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      durationWeeks: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TrainerScheduleHistory;
