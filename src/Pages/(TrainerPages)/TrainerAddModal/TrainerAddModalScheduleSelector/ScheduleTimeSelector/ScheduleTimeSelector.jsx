import { useState } from "react";

// Import Package
import PropTypes from "prop-types";

// Import Common Button component for reusability
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Constants
const HOURS_COUNT = 6; // Fixed number of time slots (6 in this case)

// Generate all hourly times from 00:00 to 23:00 in a 24-hour format
const generateAllHourlyTimes = () => {
  const times = [];
  // Loop through 24 hours
  for (let i = 0; i < 24; i++) {
    // Format hours to ensure two digits (e.g., "07" for 7)
    const hour = i.toString().padStart(2, "0");

    // Add the full hour time (e.g., "07:00")
    times.push(`${hour}:00`);
  }
  return times; // Return all available hours as an array
};

// Convert 24-hour time to 12-hour format with AM/PM suffix
const to12Hr = (time) => {
  // Split hours and minutes
  const [h, m] = time.split(":").map(Number);

  // Determine AM or PM based on hour
  const suffix = h >= 12 ? "PM" : "AM";

  // Convert to 12-hour format, where 12:00 is "12" not "0"
  const hour = h % 12 || 12;

  // Return formatted time
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
};

// Generate full-hour time blocks based on a starting hour
// For example, if starting at "7:00", it will generate blocks like 7:00–7:59, 8:00–8:59, etc.
const generateFullHourBlocks = (startTime, count) => {
  const blocks = [];

  // Extract hour from start time (e.g., "7" from "7:00")
  const startHour = parseInt(startTime.split(":")[0], 10);

  // Loop to generate the required number of time blocks
  for (let i = 0; i < count; i++) {
    // Calculate the current hour, ensure it wraps around after 23 (24-hour clock)
    const hour = (startHour + i) % 24;

    // Start time of the block (e.g., "7:00")
    const start = `${hour.toString().padStart(2, "0")}:00`;

    // End time of the block (e.g., "7:59")
    const end = `${hour.toString().padStart(2, "0")}:59`;

    // Add the block to the list
    blocks.push({ start, end });
  }

  return blocks; // Return the list of time blocks
};

const ScheduleTimeSelector = ({ ranges, setRanges }) => {
  // Get all available hourly times
  const timeOptions = generateAllHourlyTimes();

  // Set the default selected start time as the first option
  const [fromTime, setFromTime] = useState(timeOptions[0]);

  // Handle the application of time range when the user clicks "Apply Range"
  const handleApplyRange = () => {
    // Generate time blocks based on selected start time and number of slots
    const newRanges = generateFullHourBlocks(fromTime, HOURS_COUNT);

    // Update the state with the generated time blocks
    setRanges(newRanges);
  };

  return (
    <div className="mt-6">
      {/* Label for time slot selection */}
      <label className="block font-medium text-gray-700 mb-2">
        Select {HOURS_COUNT} Time Slots
      </label>

      {/* Time selector for choosing the starting hour */}

      <div className="flex gap-3 items-center">
        <label className="font-bold ">Select Starting Hour :</label>
        {/* Dropdown for selecting the start time from available hourly times */}
        <select
          className="border border-gray-300 bg-white rounded-md px-4 py-2 text-sm shadow-sm w-[500px]"
          value={fromTime}
          onChange={(e) => setFromTime(e.target.value)}
        >
          {/* Map through the available times and create option elements */}
          {timeOptions.map((t) => (
            <option key={t} value={t}>
              {to12Hr(t)} {/* Display the time in 12-hour format */}
            </option>
          ))}
        </select>
        {/* Button to apply the selected range */}
        <div className="w-full sm:w-auto">
          <CommonButton
            clickEvent={handleApplyRange}
            text="Apply Range"
            disabled={!fromTime}
            bgColor="blue"
            py="py-2"
          />
        </div>
      </div>

      {/* Preview of the generated time blocks */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Generated Time Blocks Preview
        </h3>
        <div className="flex flex-wrap gap-2">
          {/* Display generated time blocks or a message if none have been generated */}
          {ranges.length > 0 ? (
            ranges.map(({ start, end }, idx) => (
              <p
                key={idx}
                className="flex gap-2 items-center bg-gray-100 rounded-2xl border py-2 px-4 text-gray-800 shadow-sm"
              >
                {/* Display each generated time block */}
                <span className="text-blue-700">Class {idx + 1}:</span>
                {to12Hr(start)} – {to12Hr(end)}{" "}
                {/* Display start and end times in 12-hour format */}
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No time blocks generated yet.
            </p> // Message shown if no time blocks have been generated
          )}
        </div>
      </div>
    </div>
  );
};

// Prop Validation
ScheduleTimeSelector.propTypes = {
  ranges: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    })
  ).isRequired,
  setRanges: PropTypes.func.isRequired,
};

export default ScheduleTimeSelector;
