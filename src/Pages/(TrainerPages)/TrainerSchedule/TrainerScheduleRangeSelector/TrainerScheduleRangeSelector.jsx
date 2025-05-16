import { useEffect, useState } from "react";

// Import Package
import PropTypes from "prop-types";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Convert "HH:MM" to total minutes
const parseToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Format total minutes into "HH:MM" (24-hour format)
const formatHHMM = (mins) => {
  const m = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
};

// Convert 24-hour "HH:MM" to 12-hour AM/PM format
const to12Hr = (time) => {
  let [h, m] = time.split(":").map(Number);
  const amps = h >= 12 ? "PM" : "AM";
  h = h % 12 === 0 ? 12 : h % 12;
  return `${h}:${m.toString().padStart(2, "0")} ${amps}`;
};

// Generate hourly time blocks based on a starting time and number of hours
const generateRanges = (startTime, count) => {
  const startMins = parseToMinutes(startTime);
  return Array.from({ length: count }, (_, i) => {
    const blockStart = startMins + i * 60;
    const blockEnd = blockStart + 59;
    return {
      start: formatHHMM(blockStart),
      end: formatHHMM(blockEnd),
    };
  });
};

// Generate all 24 hourly time options as "HH:00"
const generateAllHourlyTimes = () => {
  return Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );
};

const TrainerScheduleRangeSelector = ({
  hoursCount,
  onRangeChange,
  timeRangeSlots,
  handleApplyRanges,
  TrainerProfileScheduleData,
}) => {
  // Build dropdown time options
  const timeOptions = generateAllHourlyTimes();

  // Extract weekly schedule
  const schedule = TrainerProfileScheduleData.trainerSchedule;

  // Find first day with available sessions and get the first session's time
  const firstDayWithSessions = Object.values(schedule).find(
    (day) => Object.keys(day).length > 0
  );

  const defaultStartTime = firstDayWithSessions
    ? Object.keys(firstDayWithSessions)[0]
    : "00:00";

  const [fromTime, setFromTime] = useState(defaultStartTime);
  // Selected start time

  // Generated time ranges
  const [ranges, setRanges] = useState([]);

  // Regenerate ranges when `fromTime` or `hoursCount` changes
  useEffect(() => {
    // Create new range blocks
    const newRanges = generateRanges(fromTime, hoursCount);

    // Update internal state
    setRanges(newRanges);

    // Notify parent if provided
    onRangeChange?.(newRanges);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromTime, hoursCount]);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Time Selector Section */}
      <div className="flex flex-col sm:flex-row text-black items-start sm:items-end gap-4 sm:gap-6">
        {/* Dropdown container - full width on mobile, half width on larger screens */}
        <div className="flex flex-col w-full sm:w-1/2">
          {/* Label for the time dropdown */}
          <label className="text-sm font-medium text-gray-700 mb-1">
            Select Starting Hour
          </label>

          {/* Dropdown input to select start time */}
          <select
            className="border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fromTime} // Controlled input bound to state
            onChange={(e) => setFromTime(e.target.value)} // Update state on change
          >
            {/* Render each time option from `timeOptions` */}
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {to12Hr(t)} {/* Display in 12-hour format */}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Button container - full width on mobile, auto on larger screens */}
        <div className="w-full sm:w-auto flex justify-end sm:justify-start">
          <CommonButton
            clickEvent={handleApplyRanges}
            text="Apply Range"
            py="py-2"
            disabled={!timeRangeSlots.length}
            bgColor="blue"
            className="w-full sm:w-fit mt-2 sm:mt-0"
          />
        </div>
      </div>

      {/* Section for displaying the generated time blocks */}
      <div className="border-t pt-4">
        {/* Title for the time blocks preview */}
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Generated Time Blocks Preview
        </h3>

        {/* Display list of generated time ranges */}
        <div className=" flex flex-wrap gap-2 text-sm text-gray-800">
          {ranges.map(({ start, end }, index) => (
            <p
              key={index} // Unique key for each item
              className="flex gap-2 items-center bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-2xl border border-gray-400 py-2 px-4 text-sm font-medium text-gray-800 shadow-sm cursor-default"
            >
              {/* Label for the block (e.g., Class 1) */}
              <span className="text-blue-700">Class {index + 1}:</span>
              {/* Time range displayed in 12-hour format */}
              {to12Hr(start)} - {to12Hr(end)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

// PropTypes Validation
TrainerScheduleRangeSelector.propTypes = {
  hoursCount: PropTypes.number,
  onRangeChange: PropTypes.func,
  handleApplyRanges: PropTypes.func,
  timeRangeSlots: PropTypes.array.isRequired,
  TrainerProfileScheduleData: PropTypes.object.isRequired,
};

export default TrainerScheduleRangeSelector;
