import { useEffect, useMemo, useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Components
import TrainerScheduleDisplay from "./TrainerScheduleDisplay/TrainerScheduleDisplay";
import TrainerScheduleClassSelector from "./TrainerScheduleClassSelector/TrainerScheduleClassSelector";

// import Icons
import timeEfficiency from "../../../assets/TrainerSchedule/time-efficiency.png";
import CommonButton from "../../../Shared/Buttons/CommonButton";
import TrainerScheduleDayControl from "./TrainerScheduleDayControl/TrainerScheduleDayControl";
import TrainerScheduleRangeSelector from "./TrainerScheduleRangeSelector/TrainerScheduleRangeSelector";

// Helper function to remove "edited" flags
const removeEditedFlags = (schedule) => {
  const cleaned = {};
  for (const day in schedule) {
    cleaned[day] = {};
    for (const time in schedule[day]) {
      const { edited, ...rest } = schedule[day][time];
      cleaned[day][time] = rest;
    }
  }
  return cleaned;
};

// Maximum selectable days
const MAX_DAYS = 5;

const TrainerSchedule = ({
  refetch,
  TrainerProfileData,
  AvailableClassTypesData,
  TrainerProfileScheduleData,
}) => {
  const axiosPublic = useAxiosPublic();
  const [tempSchedule, setTempSchedule] = useState({});
  const [changesMade, setChangesMade] = useState(false);
  const [originalSchedule, setOriginalSchedule] = useState({});
  const [defaultTimeSlots, setDefaultTimeSlots] = useState([]);
  const [timeRangeSlots, setTimeRangeSlots] = useState([]);

  const TrainersClassType = TrainerProfileData?.preferences?.classTypes || [];
  const initialSchedule = useMemo(
    () => TrainerProfileScheduleData?.trainerSchedule || {},
    [TrainerProfileScheduleData]
  );

  useEffect(() => {
    const cleaned = removeEditedFlags(initialSchedule);
    setTempSchedule(cleaned);
    setOriginalSchedule(JSON.parse(JSON.stringify(cleaned)));
    setChangesMade(false);
    const days = Object.keys(cleaned);
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

  const handleReset = () => {
    setTempSchedule(JSON.parse(JSON.stringify(originalSchedule)));
    setChangesMade(false);
  };

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

  const isValidClassType = (type) => AvailableClassTypesData?.includes(type);

  const handleUpdate = (updated) => {
    const slot = tempSchedule[updated.day]?.[updated.time];
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
    setTempSchedule((prev) => ({
      ...prev,
      [updated.day]: {
        ...prev[updated.day],
        [updated.time]: { ...updated, edited: true },
      },
    }));
    setChangesMade(true);
  };

  const handleSave = async () => {
    if (Object.keys(tempSchedule).length < MAX_DAYS) {
      Swal.fire({
        title: "Error!",
        text: `Select ${MAX_DAYS} days.`,
        icon: "error",
      });
      return;
    }
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
        setTempSchedule((prev) => removeEditedFlags(prev));
        setChangesMade(false);
      } catch {
        Swal.fire({ title: "Error!", text: "Save failed.", icon: "error" });
      }
    }
  };

  const onRangeChange = (ranges) => setTimeRangeSlots(ranges);

  // New logic: zip existing slots with new ranges by index, preserving other fields
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

  const selectedCount = Object.keys(tempSchedule).length;

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      <div className="text-center py-1">
        <h3 className="text-2xl font-bold text-gray-800">
          Manage Trainer Schedule
        </h3>
        <p className="text-gray-600">
          Customize availability & session details
        </p>
      </div>
      <div className="mx-auto p-4">
        <TrainerScheduleClassSelector
          refetch={refetch}
          trainerClassTypes={TrainersClassType}
          availableClassTypes={AvailableClassTypesData}
        />
        <div className="bg-white p-4 mt-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <img src={timeEfficiency} alt="icon" className="w-8 h-8" />
              <span>
                Days ({selectedCount}/{MAX_DAYS})
              </span>
            </div>
            <div className="flex gap-2">
              <CommonButton
                clickEvent={handleReset}
                text="Reset"
                disabled={!changesMade}
                bgColor="yellow"
              />
              <CommonButton
                clickEvent={handleSave}
                text="Save"
                disabled={selectedCount < MAX_DAYS || !changesMade}
                bgColor="green"
              />
            </div>
          </div>
          <TrainerScheduleDayControl
            tempSchedule={tempSchedule}
            selectedCount={selectedCount}
            setChangesMade={setChangesMade}
            setTempSchedule={setTempSchedule}
            defaultTimeSlots={defaultTimeSlots}
            TrainerProfileData={TrainerProfileData}
          />
          <TrainerScheduleRangeSelector
            defaultTimeSlots={defaultTimeSlots}
            hoursCount={timeRangeSlots.length || 6}
            onRangeChange={onRangeChange}
            handleApplyRanges={handleApplyRanges}
            timeRangeSlots={timeRangeSlots}
          />
        </div>
        <TrainerScheduleDisplay
          handleClear={handleClear}
          tempSchedule={tempSchedule}
          handleUpdate={handleUpdate}
          isValidClassType={isValidClassType}
          TrainersClassType={TrainersClassType}
        />
      </div>
    </div>
  );
};

TrainerSchedule.propTypes = {
  refetch: PropTypes.func,
  TrainerProfileData: PropTypes.shape({
    name: PropTypes.string,
    preferences: PropTypes.shape({
      classTypes: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  AvailableClassTypesData: PropTypes.arrayOf(PropTypes.string),
  TrainerProfileScheduleData: PropTypes.shape({
    trainerSchedule: PropTypes.object,
  }).isRequired,
};

export default TrainerSchedule;
