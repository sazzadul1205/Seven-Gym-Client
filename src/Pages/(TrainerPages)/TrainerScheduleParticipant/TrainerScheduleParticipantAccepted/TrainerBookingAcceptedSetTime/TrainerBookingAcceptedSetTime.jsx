/* eslint-disable react/prop-types */
import { useState } from "react";
import { ImCross } from "react-icons/im";

// Modal for assigning a start date to an accepted trainer booking
const TrainerBookingAcceptedSetTime = ({ selectedAcceptedBooking }) => {
  console.log(selectedAcceptedBooking);

  // State for selected start date and auto-calculated end date
  const [selectedDate, setSelectedDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Extract number of weeks for the session, default to 0 if missing
  const durationWeeks = selectedAcceptedBooking?.durationWeeks || 0;

  // Helper to convert 'yyyy-mm-dd' to 'dd-mm-yyyy' for display
  const formatDate = (dateString) => {
    if (!dateString) return "--/--/----";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // Calculate end date based on start date + duration
  const calculateEndDate = (start) => {
    const startDateObj = new Date(start);
    const resultDate = new Date(startDateObj);
    resultDate.setDate(startDateObj.getDate() + durationWeeks * 7);
    return resultDate.toISOString().split("T")[0]; // keep in yyyy-mm-dd for consistency
  };

  // When user selects a new start date
  const handleDateChange = (e) => {
    const start = e.target.value;
    setSelectedDate(start);
    setEndDate(start && durationWeeks > 0 ? calculateEndDate(start) : "");
  };

  // Reset both date fields
  const handleReset = () => {
    setSelectedDate("");
    setEndDate("");
  };

  // Close modal and clear state
  const handleClose = () => {
    handleReset();
    document.getElementById("User_Trainer_Accepted_Time_Set").close();
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
        {/* Session duration display */}
        <div>
          <p className="font-semibold">
            Duration:{" "}
            <span className="font-medium text-blue-700">
              {durationWeeks > 0
                ? `${durationWeeks} week${durationWeeks > 1 ? "s" : ""}`
                : "Not specified"}
            </span>
          </p>
        </div>

        {/* Date picker input */}
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

        {/* Display start and end date after selection */}
        {selectedDate && (
          <div className="flex justify-between text-sm text-gray-800 bg-gray-50 rounded-md px-4 py-3 border">
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {formatDate(selectedDate)}
            </p>
            <p>
              <span className="font-semibold">End Date:</span>{" "}
              <span className="text-green-600 font-medium">
                {endDate ? formatDate(endDate) : "--/--/----"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerBookingAcceptedSetTime;
