import { useState } from "react";

// Icons
import { ImCross } from "react-icons/im";

// Dependencies
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Custom Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const TrainerBookingAcceptedSetTime = ({
  selectedAcceptedBooking,
  closeClockModal,
  refetch,
}) => {
  const axiosPublic = useAxiosPublic();

  // State to manage selected start date and calculated end date
  const [selectedDate, setSelectedDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Extract duration in weeks; default to 0 if not available
  const durationWeeks = selectedAcceptedBooking?.durationWeeks || 0;

  // Handle date input change and auto-calculate end date
  const handleDateChange = (e) => {
    const start = e.target.value;
    setSelectedDate(start);
    setEndDate(start && durationWeeks > 0 ? calculateEndDate(start) : "");
  };

  // Calculate the end date based on the selected start date and duration
  const calculateEndDate = (start) => {
    const startDateObj = new Date(start);
    const resultDate = new Date(startDateObj);
    resultDate.setDate(startDateObj.getDate() + durationWeeks * 7);
    return resultDate.toISOString().split("T")[0]; // Format: yyyy-mm-dd
  };

  // Submit selected start date and update both records
  const handleSubmit = async () => {
    if (!selectedDate) {
      return Swal.fire("Error", "Please select a start date", "error");
    }

    const payload = {
      startAt: selectedDate,
    };

    setLoading(true);

    try {
      // 1. Update the main accepted booking with start date
      const response = await axiosPublic.put(
        `/Trainer_Booking_Accepted/Update/${selectedAcceptedBooking._id}`,
        payload
      );

      // 2. Update the participant's schedule as well
      if (response.status === 200) {
        const participantPayload = {
          startAt: selectedDate,
          stripePaymentID:
            selectedAcceptedBooking?.stripePaymentID ||
            selectedAcceptedBooking?.paymentID,
        };

        const participantResponse = await axiosPublic.post(
          "/Trainers_Schedule/UpdateParticipant",
          participantPayload
        );

        if (participantResponse.status === 200) {
          Swal.fire("Success", "Start date set successfully!", "success");
          handleClose();
          refetch(); // Refetch parent data to reflect changes
        } else {
          Swal.fire(
            "Warning",
            "Start date updated, but participant not found.",
            "warning"
          );
        }
      }
    } catch (error) {
      console.error("Failed to update booking or participant:", error);
      Swal.fire("Error", "Failed to update booking or participant", "error");
    } finally {
      setLoading(false);
    }
  };

  // Close modal and reset state
  const handleClose = async () => {
    setSelectedDate("");
    setEndDate("");
    await closeClockModal();
  };

  return (
    <div className="modal-box max-w-lg w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black rounded-lg shadow-lg">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b px-5 py-4">
        <h3 className="font-bold text-lg">Booked Sessions Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={handleClose}
        />
      </div>

      {/* Modal Content */}
      <div className="p-5 space-y-5">
        {/* Duration Info */}
        <p className="font-semibold">
          Duration:{" "}
          <span className="font-medium text-blue-700">
            {durationWeeks > 0
              ? `${durationWeeks} week${durationWeeks > 1 ? "s" : ""}`
              : "Not specified"}
          </span>
        </p>

        {/* Date Picker */}
        <div className="flex flex-col gap-2">
          <label htmlFor="start-date" className="font-semibold">
            Select Start Date:
          </label>
          <input
            type="date"
            id="start-date"
            className="border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        {/* Display Selected Dates */}
        {selectedDate && (
          <div className="flex justify-between text-sm text-gray-800 bg-gray-50 rounded-md px-4 py-3 border">
            <p>
              <span className="font-semibold">Start Date:</span> {selectedDate}
            </p>
            <p>
              <span className="font-semibold">End Date:</span>{" "}
              <span className="text-green-600 font-medium">
                {endDate || "--/--/----"}
              </span>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <CommonButton
          clickEvent={handleSubmit}
          text={loading ? "Setting..." : "Set Start Time"}
          width="full"
          py="py-2"
          px="px-4"
          bgColor="blue"
          borderRadius="rounded-md"
          disabled={loading}
        />
      </div>
    </div>
  );
};

// Prop Type Validation
TrainerBookingAcceptedSetTime.propTypes = {
  selectedAcceptedBooking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    durationWeeks: PropTypes.number,
    stripePaymentID: PropTypes.string,
    paymentID: PropTypes.string,
  }),
  refetch: PropTypes.func.isRequired,
  closeClockModal: PropTypes.func,
};

export default TrainerBookingAcceptedSetTime;
