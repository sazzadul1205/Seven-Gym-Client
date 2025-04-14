import { useState } from "react";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Import
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const TrainerBookingAcceptedSetTime = ({
  selectedAcceptedBooking,
  refetch,
}) => {
  const axiosPublic = useAxiosPublic();
  const [selectedDate, setSelectedDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const durationWeeks = selectedAcceptedBooking?.durationWeeks || 0;

  const handleDateChange = (e) => {
    const start = e.target.value;
    setSelectedDate(start);
    setEndDate(start && durationWeeks > 0 ? calculateEndDate(start) : "");
  };

  const calculateEndDate = (start) => {
    const startDateObj = new Date(start);
    const resultDate = new Date(startDateObj);
    resultDate.setDate(startDateObj.getDate() + durationWeeks * 7);
    return resultDate.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      return Swal.fire("Error", "Please select a start date", "error");
    }

    const payload = {
      startAt: selectedDate,
    };

    try {
      // 1. Update booking accepted record
      const response = await axiosPublic.put(
        `/Trainer_Booking_Accepted/Update/${selectedAcceptedBooking._id}`,
        payload
      );

      // 2. Then update the participant in trainer schedule
      if (response.status === 200) {
        const participantPayload = {
          startAt: selectedDate,
          stripePaymentID: selectedAcceptedBooking.stripePaymentID,
        };

        const participantResponse = await axiosPublic.post(
          "/Trainers_Schedule/UpdateParticipant",
          participantPayload
        );

        if (participantResponse.status === 200) {
          Swal.fire("Success", "Start date set successfully!", "success");
          handleClose();
          refetch();
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
    }
  };

  const handleClose = () => {
    setSelectedDate("");
    setEndDate("");
    document.getElementById("User_Trainer_Accepted_Time_Set").close();
  };

  return (
    <div className="modal-box max-w-lg w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-5 py-4">
        <h3 className="font-bold text-lg">Booked Sessions Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={handleClose}
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        <p className="font-semibold">
          Duration:{" "}
          <span className="font-medium text-blue-700">
            {durationWeeks > 0
              ? `${durationWeeks} week${durationWeeks > 1 ? "s" : ""}`
              : "Not specified"}
          </span>
        </p>

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
        <button
          onClick={handleSubmit}
          className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          Set Start Time
        </button>
      </div>
    </div>
  );
};

// Prop Types
TrainerBookingAcceptedSetTime.propTypes = {
  selectedAcceptedBooking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    durationWeeks: PropTypes.number,
    stripePaymentID: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default TrainerBookingAcceptedSetTime;
