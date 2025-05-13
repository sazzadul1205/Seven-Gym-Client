import PropTypes from "prop-types";

// Define a constant array of all days in a week
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Main component for selecting days
const ScheduleDaySelector = ({ selectedDays, setSelectedDays }) => {
  // Helper function to check if a day is already selected
  const isSelected = (day) => selectedDays.includes(day);

  // Toggle function to add/remove a day from the selected list
  const toggleDay = (day) => {
    setSelectedDays((prevDays) => {
      // If the day is already selected, remove it from the list
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      }

      // If the day is not selected and under the 5-day limit, add it
      if (prevDays.length < 5) {
        return [...prevDays, day];
      }

      // If limit is reached and day is not selected, do nothing
      return prevDays;
    });
  };

  return (
    <div>
      {/* Label above the day selector grid */}
      <label className="block font-medium text-gray-700 mb-1">
        Day Selection (Select up to 5 days)
      </label>

      {/* Grid layout for day buttons, 7 columns for 7 days */}
      <div className="grid grid-cols-7 gap-[2px] w-full">
        {DAYS.map((day) => {
          // Is this day selected?
          const active = isSelected(day);

          // Disable unselected buttons if limit is reached
          const disabled = !active && selectedDays.length >= 5;

          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)} // Toggle this day on click
              disabled={disabled} // Disable if needed
              className={`${
                disabled
                  ? "opacity-50 cursor-not-allowed bg-gray-300" // Style for disabled buttons
                  : "cursor-pointer" // Normal cursor for enabled
              } ${
                active
                  ? "bg-gradient-to-tr hover:bg-gradient-to-bl from-blue-300 to-blue-600 text-white" // Highlight active selection
                  : "bg-gradient-to-tr hover:bg-gradient-to-bl from-gray-200 to-gray-400" // Style for unselected
              } w-full px-2 py-3 rounded text-sm border transition-all duration-200`}
            >
              {day} {/* Day label */}
            </button>
          );
        })}
      </div>

      {/* Optional preview showing the selected days */}
      <div className="mt-4 text-sm text-gray-600">
        Selected: {selectedDays.join(", ") || "None"}
      </div>
    </div>
  );
};

// Prop type validation for the component props
ScheduleDaySelector.propTypes = {
  selectedDays: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedDays: PropTypes.func.isRequired,
};

export default ScheduleDaySelector;
