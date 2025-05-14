import { useState, useEffect, useRef } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Components
import ScheduleDaySelector from "./ScheduleDaySelector/ScheduleDaySelector";
import ScheduleTimeSelector from "./ScheduleTimeSelector/ScheduleTimeSelector";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Icons
import { FaArrowRight } from "react-icons/fa";

// Constants for keys and expiration
const SESSION_KEY = "trainer_schedule_selection";
const LOCAL_STORAGE_KEY = "Trainer_Schedule";
const EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

const TrainerAddModalScheduleSelector = ({ onNextStep }) => {
  // Selected days (e.g., Mon, Tue)
  const [selectedDays, setSelectedDays] = useState([]);

  // Time ranges [{start: "", end: ""}]
  const [ranges, setRanges] = useState([]);

  // Apply button state
  const [isApplyDisabled, setIsApplyDisabled] = useState(false);

  // Final schedule
  const [generatedSchedule, setGeneratedSchedule] = useState(null);

  // Button loading state
  const [isLoading, setIsLoading] = useState(false);

  // Track last trainer name used for generation
  const lastGeneratedNameRef = useRef(null);

  // Helper to fetch trainer name from localStorage
  const getTrainerName = () => {
    try {
      return (
        JSON.parse(localStorage.trainerBasicInfo)?.name || "Unknown_Trainer"
      );
    } catch {
      return "Unknown_Trainer";
    }
  };

  // On mount: Load previous selections from sessionStorage (if still valid)
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        if (now - parsed.timestamp < EXPIRY_MS) {
          // Restore selections
          setSelectedDays(parsed.days || []);
          setRanges(parsed.timeRanges || []);
        } else {
          // Remove expired
          sessionStorage.removeItem(SESSION_KEY);
        }
      } catch {
        // Malformed data fallback
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  // Save current state to sessionStorage on updates
  useEffect(() => {
    const data = {
      days: selectedDays,
      timeRanges: ranges,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }, [selectedDays, ranges]);

  // On mount: Load schedule from localStorage if available
  useEffect(() => {
    const savedSchedule = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSchedule) {
      const parsedSchedule = JSON.parse(savedSchedule);
      if (parsedSchedule?.trainerSchedule) {
        setGeneratedSchedule(parsedSchedule);

        // Populate selected days and time ranges from saved schedule
        setSelectedDays(Object.keys(parsedSchedule.trainerSchedule));
        const timeRanges = [];
        Object.values(parsedSchedule.trainerSchedule).forEach((day) => {
          Object.keys(day).forEach((range) => {
            if (!timeRanges.some((item) => item.start === range)) {
              timeRanges.push({ start: range, end: day[range].end });
            }
          });
        });
        setRanges(timeRanges);

        setIsApplyDisabled(true); // Already applied
      }
    }
  }, []);

  // Handle Apply button click
  const handleApply = () => {
    // Start loading state to disable the button and show spinner
    setIsLoading(true);

    // Get trainer's name from localStorage
    const trainerName = getTrainerName();

    // Store the name in a ref to track who last applied the schedule
    lastGeneratedNameRef.current = trainerName;

    // Create an empty object to store the final schedule
    const schedule = {};

    // Loop through each selected day
    selectedDays.forEach((day) => {
      // Initialize an empty object for this day
      schedule[day] = {};

      // Loop through each selected time range
      ranges.forEach((range) => {
        const timeKey = range.start;

        // Add a session entry for this time slot on the given day
        schedule[day][timeKey] = {
          id: `${trainerName.replace(/\s+/g, "_")}-${day}-${timeKey}`, // Unique ID
          classType: "N/A", // Default value
          participant: {}, // Initially empty
          participantLimit: 0, // No participants allowed by default
          classPrice: 0.0, // Free by default
          start: range.start,
          end: range.end,
        };
      });
    });

    // Final object that contains trainer name and their schedule
    const result = {
      trainerName,
      trainerSchedule: schedule,
    };

    // Update state to store the newly generated schedule
    setGeneratedSchedule(result);

    // Save the schedule to localStorage for persistence
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));

    // ✅ Also update trainerBasicInfo in localStorage with availableDays (i.e., selectedDays)
    try {
      // Parse the existing trainerBasicInfo from localStorage
      const basicInfo =
        JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};

      // Merge existing info with new field: availableDays
      const updatedInfo = {
        ...basicInfo,
        availableDays: selectedDays,
      };

      // Save the updated info back to localStorage
      localStorage.setItem("trainerBasicInfo", JSON.stringify(updatedInfo));
    } catch (error) {
      // If something goes wrong (e.g., malformed JSON), log the error
      console.error(
        "Failed to update trainerBasicInfo with availableDays:",
        error
      );
    }

    // Disable the Apply button to prevent re-submission
    setIsApplyDisabled(true);

    // End loading state
    setIsLoading(false);
  };

  // Enable/disable Apply button based on logic
  useEffect(() => {
    const checkIfShouldEnable = () => {
      const hasSelections = selectedDays.length >= 5 && ranges.length >= 6;
      const currentName = getTrainerName();
      const lastName = lastGeneratedNameRef.current;
      const nameChanged = currentName !== lastName;

      // Enable only if enough selections and trainer changed
      setIsApplyDisabled(!(hasSelections && nameChanged));
    };

    // Initial check
    checkIfShouldEnable();

    // Re-check every second
    const interval = setInterval(checkIfShouldEnable, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [selectedDays, ranges]);

  return (
    <div className="p-4">
      {/* Title */}
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Trainer Schedule Selector
      </h3>

      {/* Day & Time range selectors */}
      <div>
        {/* Schedule Day Selector */}
        <ScheduleDaySelector
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
        />

        {/* Schedule Time Selector */}
        <ScheduleTimeSelector ranges={ranges} setRanges={setRanges} />
      </div>

      {/* Divider */}
      <hr className="bg-gray-300 p-[1px] my-5" />

      {/* Apply Button */}
      <div className="flex justify-center mt-4">
        <CommonButton
          clickEvent={handleApply}
          disabled={isApplyDisabled}
          isLoading={isLoading}
          loadingText="Processing..."
          text="Apply"
          bgColor="blue"
          px="px-20"
          py="py-2"
          borderRadius="rounded-lg"
          width="auto"
        />
      </div>

      {/* Render the generated schedule table only if it's available */}
      {generatedSchedule && (
        <div className="mt-6">
          {/* Header showing the trainer name */}
          <h4 className="text-2xl font-bold mb-4 text-center text-green-700">
            ✅ Schedule for {generatedSchedule.trainerName}
          </h4>

          {/* Responsive table container with styling */}
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table head with day/time labels */}
              <thead className="bg-green-100 sticky top-0 z-10">
                <tr>
                  {/* First column header for days */}
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                    Day / Time
                  </th>

                  {/* Dynamically generate a column for each selected time range */}
                  {ranges.map((range) => (
                    <th
                      key={range.start}
                      className="text-center px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap"
                    >
                      {range.start} - {range.end}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table body: each row represents a selected day */}
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedDays.map((day, index) => (
                  <tr
                    key={day}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"} // Alternate row color
                  >
                    {/* First cell shows the name of the day */}
                    <td className="px-4 py-2 text-sm font-semibold text-gray-800 text-center">
                      {day}
                    </td>

                    {/* For each time range, render a cell indicating if a session exists */}
                    {ranges.map((range) => {
                      // Check if the schedule has a slot for this day and time range
                      const hasSlot =
                        generatedSchedule.trainerSchedule?.[day]?.[range.start];

                      return (
                        <td
                          key={range.start}
                          className={`px-4 py-2 text-center text-lg ${
                            hasSlot
                              ? "text-green-600 font-bold" // If scheduled, show green checkmark
                              : "text-gray-300" // If not scheduled, show grey dash
                          }`}
                        >
                          {hasSlot ? "✅" : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Proceed to next step */}
      <div className="flex justify-center items-center w-full my-5">
        <CommonButton
          type="submit"
          text="Next Step"
          icon={<FaArrowRight />}
          clickEvent={() => onNextStep()}
          iconSize="text-lg"
          bgColor="blue"
          px="px-10"
          py="py-3"
          borderRadius="rounded-lg"
          width="auto"
          isLoading={false}
          textColor="text-white"
          iconPosition="after"
          disabled={!generatedSchedule}
        />
      </div>
    </div>
  );
};

// Prop validation
TrainerAddModalScheduleSelector.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalScheduleSelector;
