import { useEffect, useMemo, useState } from "react";

// External packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Custom hook for Axios instance
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Component imports
import TrainerScheduleDisplay from "./TrainerScheduleDisplay/TrainerScheduleDisplay";
import TrainerScheduleDayControl from "./TrainerScheduleDayControl/TrainerScheduleDayControl";
import TrainerScheduleClassSelector from "./TrainerScheduleClassSelector/TrainerScheduleClassSelector";
import TrainerScheduleRangeSelector from "./TrainerScheduleRangeSelector/TrainerScheduleRangeSelector";

// Import Button
import CommonButton from "../../../Shared/Buttons/CommonButton";

// Asset imports
import timeEfficiency from "../../../assets/TrainerSchedule/time-efficiency.png";

// Utility to remove 'edited' flags before sending to server
const removeEditedFlags = (schedule) => {
  const cleaned = {};
  for (const day in schedule) {
    cleaned[day] = {};
    for (const time in schedule[day]) {
      // eslint-disable-next-line no-unused-vars
      const { edited, ...rest } = schedule[day][time];
      cleaned[day][time] = rest;
    }
  }
  return cleaned;
};

// Max number of days allowed in schedule
const MAX_DAYS = 5;

const TrainerSchedule = ({
  refetch,
  ClassTypesData,
  TrainerProfileData,
  TrainerProfileScheduleData,
}) => {
  const axiosPublic = useAxiosPublic();

  // Local state
  const [tempSchedule, setTempSchedule] = useState({});
  const [changesMade, setChangesMade] = useState(false);
  const [timeRangeSlots, setTimeRangeSlots] = useState([]);
  const [originalSchedule, setOriginalSchedule] = useState({});
  const [defaultTimeSlots, setDefaultTimeSlots] = useState([]);

  // Extract trainer's preferred class types
  const TrainersClassType = TrainerProfileData?.preferences?.classTypes || [];

  // Memoize schedule from props to prevent re-computation
  const initialSchedule = useMemo(
    () => TrainerProfileScheduleData?.trainerSchedule || {},
    [TrainerProfileScheduleData]
  );

  // On load or when schedule data changes
  useEffect(() => {
    // Clean up any flags
    const cleaned = removeEditedFlags(initialSchedule);

    // Use cleaned schedule for editing
    setTempSchedule(cleaned);

    // Deep copy for reset
    setOriginalSchedule(JSON.parse(JSON.stringify(cleaned)));

    // No changes yet
    setChangesMade(false);

    // Determine which days are in schedule
    const days = Object.keys(cleaned);

    // Set default slots (used in UI components)
    if (days.length) setDefaultTimeSlots(Object.keys(cleaned[days[0]]));
    else
      setDefaultTimeSlots([
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
      ]);
  }, [initialSchedule]);

  // ==================== Handles ===================

  // Reset schedule to original
  const handleReset = () => {
    setTempSchedule(JSON.parse(JSON.stringify(originalSchedule)));
    setChangesMade(false);
  };

  // Clear a session slot (only if no participants)
  const handleClear = (day, time) => {
    const slot = tempSchedule[day]?.[time];
    if (slot?.participant && Object.keys(slot.participant).length) {
      Swal.fire({
        title: "Cannot clear",
        text: "Session has participants.",
        icon: "warning",
      });
      return;
    }

    // Reset session slot values
    setTempSchedule((prev) => {
      const clone = { ...prev };
      clone[day][time] = {
        ...clone[day][time],
        classType: "",
        participantLimit: "",
        classPrice: "",
      };
      return clone;
    });
    setChangesMade(true);
  };

  // Update a time slot
  const handleUpdate = (updated) => {
    const slot = tempSchedule[updated.day]?.[updated.time];

    // Block updates if participants are enrolled and class type changes
    if (
      slot?.participant &&
      Object.keys(slot.participant).length &&
      slot.classType !== updated.classType
    ) {
      Swal.fire({
        title: "Cannot change class",
        text: "Session has participants.",
        icon: "warning",
      });
      return;
    }

    // Mark slot as edited and update
    setTempSchedule((prev) => ({
      ...prev,
      [updated.day]: {
        ...prev[updated.day],
        [updated.time]: { ...updated, edited: true },
      },
    }));
    setChangesMade(true);
  };

  // Save schedule to server
  const handleSave = async () => {
    if (Object.keys(tempSchedule).length < MAX_DAYS) {
      Swal.fire({
        title: "Error!",
        text: `Select ${MAX_DAYS} days.`,
        icon: "error",
      });
      return;
    }

    // Confirm before saving
    const result = await Swal.fire({
      title: "Save changes?",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosPublic.put("/Trainers_Schedule/Update", {
          trainerName: TrainerProfileData?.name,
          trainerSchedule: tempSchedule,
        });

        Swal.fire({
          icon: "success",
          title: "Saved!",
          timer: 1500,
          showConfirmButton: false,
        });

        // Clean up and finalize state
        setTempSchedule((prev) => removeEditedFlags(prev));
        setChangesMade(false);
      } catch {
        Swal.fire({ title: "Error!", text: "Save failed.", icon: "error" });
      }
    }
  };

  // Range input changes (e.g., "08:00 to 09:00")
  const onRangeChange = (ranges) => setTimeRangeSlots(ranges);

  // Apply selected ranges to schedule
  const handleApplyRanges = () => {
    setTempSchedule((prev) => {
      const updated = {};
      for (const day of Object.keys(prev)) {
        const oldSlots = Object.values(prev[day]);
        updated[day] = {};
        oldSlots.forEach((slot, idx) => {
          const range = timeRangeSlots[idx];
          if (!range) return;
          updated[day][range.start] = {
            ...slot,
            time: range.start,
            start: range.start,
            end: range.end,
            id: `${TrainerProfileData.name.replace(/\s+/g, "_")}-${day}-${
              range.start
            }`,
          };
        });
      }
      return updated;
    });
    setChangesMade(true);
  };

  // Number of selected days
  const selectedCount = Object.keys(tempSchedule).length;

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Header */}
      <div className="text-center py-1">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800">
          Manage Trainer Schedule
        </h3>

        {/* Subtitle */}
        <p className="text-gray-600">
          Customize availability & session details
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto py-4 px-1 ">
        {/* Trainer's Class Type Management */}
        <TrainerScheduleClassSelector
          refetch={refetch}
          ClassTypesData={ClassTypesData}
          trainerClassTypes={TrainersClassType}
        />
      </div>

      {/* Schedule Editing Panel */}
      <div className="bg-white text-black p-4 mt-4 rounded shadow">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          {/* Title and Icon */}
          <div className="flex items-center gap-2">
            {/* Icon for time efficiency */}
            <img src={timeEfficiency} alt="icon" className="w-8 h-8" />

            {/* Title with dynamic count */}
            <span className="font-bold text-base md:text-lg">
              Sessions Management ({selectedCount}/{MAX_DAYS})
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <CommonButton
              clickEvent={handleReset}
              text="Reset"
              px="px-10"
              py="py-2"
              disabled={!changesMade}
              bgColor="yellow"
              className="w-full sm:w-auto"
            />

            <CommonButton
              clickEvent={handleSave}
              text="Update Class Schedule"
              px="px-10"
              py="py-2"
              disabled={selectedCount < MAX_DAYS || !changesMade}
              bgColor="green"
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Day Selector and Time Slots */}
        <TrainerScheduleDayControl
          tempSchedule={tempSchedule}
          selectedCount={selectedCount}
          setChangesMade={setChangesMade}
          setTempSchedule={setTempSchedule}
          defaultTimeSlots={defaultTimeSlots}
          TrainerProfileData={TrainerProfileData}
        />

        {/* Time Range Customize */}
        <TrainerScheduleRangeSelector
          onRangeChange={onRangeChange}
          timeRangeSlots={timeRangeSlots}
          defaultTimeSlots={defaultTimeSlots}
          handleApplyRanges={handleApplyRanges}
          hoursCount={timeRangeSlots.length || 6}
          TrainerProfileScheduleData={TrainerProfileScheduleData}
        />
      </div>

      {/* Display and Edit Current Schedule */}
      <TrainerScheduleDisplay
        handleClear={handleClear}
        tempSchedule={tempSchedule}
        handleUpdate={handleUpdate}
        ClassTypesData={ClassTypesData}
        TrainersClassType={TrainersClassType}
      />
    </div>
  );
};

// Runtime prop validation
TrainerSchedule.propTypes = {
  refetch: PropTypes.func.isRequired,
  ClassTypesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  TrainerProfileData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    preferences: PropTypes.shape({
      classTypes: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  TrainerProfileScheduleData: PropTypes.shape({
    trainerSchedule: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.shape({
          classType: PropTypes.string,
          participantLimit: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          participant: PropTypes.arrayOf(PropTypes.object),
          time: PropTypes.string,
          start: PropTypes.string,
          end: PropTypes.string,
          id: PropTypes.string,
          edited: PropTypes.bool,
        })
      )
    ),
  }),
};

export default TrainerSchedule;
