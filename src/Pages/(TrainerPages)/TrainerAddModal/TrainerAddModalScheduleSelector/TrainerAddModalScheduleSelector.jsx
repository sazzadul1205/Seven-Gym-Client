// Import Component
import { useState } from "react";
import ScheduleDaySelector from "./ScheduleDaySelector/ScheduleDaySelector";
import ScheduleTimeSelector from "./ScheduleTimeSelector/ScheduleTimeSelector";

const TrainerAddModalScheduleSelector = () => {
  // Local state to store selected days (initially empty)
  const [selectedDays, setSelectedDays] = useState([]);

  const [ranges, setRanges] = useState([]);

  console.log("selectedDays : ", selectedDays);
  console.log("ranges : ", ranges);

  return (
    <div className="p-2">
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Trainer Schedule Selector
      </h3>

      <div>
        {/* Multi-select Days */}
        <ScheduleDaySelector
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
        />

        {/* Time Slots */}
        <ScheduleTimeSelector ranges={ranges} setRanges={setRanges} />
      </div>
    </div>
  );
};

export default TrainerAddModalScheduleSelector;
