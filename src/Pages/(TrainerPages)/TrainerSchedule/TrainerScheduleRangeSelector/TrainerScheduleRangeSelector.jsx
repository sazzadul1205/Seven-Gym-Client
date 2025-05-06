import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Utility functions
const parseToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const formatHHMM = (mins) => {
  const m = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
};

const to12Hr = (time) => {
  let [h, m] = time.split(":").map(Number);
  const amps = h >= 12 ? "PM" : "AM";
  h = h % 12 === 0 ? 12 : h % 12;
  return `${h}:${m.toString().padStart(2, "0")} ${amps}`;
};

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

const generateAllHourlyTimes = () => {
  return Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );
};

const TrainerScheduleRangeSelector = ({
  hoursCount = 6,
  onRangeChange,
  handleApplyRanges,
  timeRangeSlots,
}) => {
  const timeOptions = generateAllHourlyTimes();
  const [fromTime, setFromTime] = useState("00:00");
  const [ranges, setRanges] = useState([]);

  useEffect(() => {
    const newRanges = generateRanges(fromTime, hoursCount);
    setRanges(newRanges);
    onRangeChange?.(newRanges);
  }, [fromTime, hoursCount, onRangeChange]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Time Selector */}
      <div className="flex flex-col sm:flex-row text-black items-start sm:items-end gap-4 sm:gap-6">
        <div className="flex flex-col w-full sm:w-1/2">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Select Starting Hour
          </label>
          <select
            className="border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {to12Hr(t)}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto flex justify-end sm:justify-start">
          <CommonButton
            clickEvent={handleApplyRanges}
            text="Apply Range"
            disabled={!timeRangeSlots.length}
            bgColor="blue"
            className="w-full sm:w-fit mt-2 sm:mt-0"
          />
        </div>
      </div>

      {/* Display Selected Time Ranges */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Generated Time Blocks Preview
        </h3>
        <div className="flex gap-2 text-sm text-gray-800">
          {ranges.map(({ start, end }, index) => (
            <p
              key={index}
              className="flex gap-2 items-center bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 rounded-2xl border border-gray-400 py-2 px-5 text-sm font-medium text-gray-800 shadow-sm cursor-default"
            >
              <span className=" text-blue-700">
                Class {index + 1} :
              </span>
              {to12Hr(start)} - {to12Hr(end)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

TrainerScheduleRangeSelector.propTypes = {
  hoursCount: PropTypes.number,
  onRangeChange: PropTypes.func,
  handleApplyRanges: PropTypes.func,
  timeRangeSlots: PropTypes.array.isRequired,
};

export default TrainerScheduleRangeSelector;
