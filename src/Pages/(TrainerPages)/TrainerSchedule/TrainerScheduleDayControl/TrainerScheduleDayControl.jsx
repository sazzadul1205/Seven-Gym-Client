// Import Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// List of all week days
const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Maximum number of days a trainer can have schedule for
const MAX_DAYS = 5;

const TrainerScheduleDayControl = ({
  tempSchedule,
  selectedCount,
  setChangesMade,
  setTempSchedule,
  defaultTimeSlots,
  TrainerProfileData,
}) => {
  // Handle adding a new day to the temp schedule
  const handleAddDay = (day) => {
    // Prevent adding if day is already in schedule or max days reached
    if (tempSchedule[day] || Object.keys(tempSchedule).length >= MAX_DAYS)
      return;

    // Add new day with empty slots
    setTempSchedule((prev) => {
      const clone = { ...prev, [day]: {} };

      // Create time slots for the added day
      defaultTimeSlots.forEach((time) => {
        clone[day][time] = {
          day,
          time,
          // Generate a unique ID using trainer name, day, and time
          id: `${TrainerProfileData.name.replace(/\s+/g, "_")}-${day}-${time}`,
          classType: "",
          participant: {}, // Start with empty participant list
          participantLimit: "",
          classPrice: "",
          start: time,
          // Set 'end' time to 59 minutes after start
          end: time.replace(
            /(\d{2}):(\d{2})/,
            (_, h, m) => `${h}:${("0" + (parseInt(m) + 59)).slice(-2)}`
          ),
        };
      });

      return clone;
    });

    // Flag that changes have been made
    setChangesMade(true);
  };

  //  Handle removing a day from the temp schedule
  const handleRemoveDay = (day) => {
    const slots = tempSchedule[day] || {};

    // Check if any slot for this day has participants
    const hasParticipants = Object.values(slots).some(
      (s) => s.participant && Object.keys(s.participant).length > 0
    );

    // Show alert and prevent deletion if any participants exist
    if (hasParticipants) {
      Swal.fire({
        title: "Cannot remove",
        text: "Some sessions have participants. Clear participants first.",
        icon: "warning",
      });
      return;
    }

    // Safe to remove the day from schedule
    setTempSchedule((prev) => {
      const clone = { ...prev };
      delete clone[day];
      return clone;
    });

    // Flag changes
    setChangesMade(true);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Render buttons for all 7 days */}
      {ALL_DAYS.map((day) => {
        const isAdded = !!tempSchedule[day];
        const canAddMore = selectedCount < MAX_DAYS;
        const isDisabled = !isAdded && !canAddMore;

        return (
          <button
            key={day}
            onClick={() => (isAdded ? handleRemoveDay(day) : handleAddDay(day))}
            disabled={isDisabled}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-150 ${
              isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isAdded
                ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            }`}
          >
            {isAdded ? `− ${day}` : `+ ${day}`}
          </button>
        );
      })}
    </div>
  );
};

// PropTypes validation
TrainerScheduleDayControl.propTypes = {
  tempSchedule: PropTypes.object,
  selectedCount: PropTypes.number,
  setChangesMade: PropTypes.func,
  setTempSchedule: PropTypes.func,
  defaultTimeSlots: PropTypes.arrayOf(PropTypes.string),
  TrainerProfileData: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default TrainerScheduleDayControl;
