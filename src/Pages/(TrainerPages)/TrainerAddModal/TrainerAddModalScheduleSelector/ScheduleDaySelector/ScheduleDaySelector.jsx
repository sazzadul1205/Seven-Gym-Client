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
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      }
      if (prevDays.length < 5) {
        return [...prevDays, day];
      }
      return prevDays;
    });
  };

  return (
    <div className="w-full">
      {/* Label */}
      <label className="block font-medium text-gray-700 mb-2">
        Day Selection (Select up to 5 days)
      </label>

      {/* Responsive grid for days */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 w-full">
        {DAYS.map((day) => {
          const active = isSelected(day);
          const disabled = !active && selectedDays.length >= 5;

          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              disabled={disabled}
              className={`text-xs sm:text-sm px-2 py-2 sm:py-3 rounded border transition-all duration-200
                ${
                  disabled
                    ? "opacity-50 cursor-not-allowed bg-gray-300"
                    : "cursor-pointer"
                }
                ${
                  active
                    ? "bg-gradient-to-tr hover:bg-gradient-to-bl from-blue-300 to-blue-600 text-white"
                    : "bg-gradient-to-tr hover:bg-gradient-to-bl from-gray-200 to-gray-400"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <div className="mt-4 text-sm text-gray-600">
        Selected: {selectedDays.join(", ") || "None"}
      </div>
    </div>
  );
};

ScheduleDaySelector.propTypes = {
  selectedDays: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedDays: PropTypes.func.isRequired,
};

export default ScheduleDaySelector;
