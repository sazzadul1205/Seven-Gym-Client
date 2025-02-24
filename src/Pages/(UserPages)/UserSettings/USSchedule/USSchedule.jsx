import { GrSchedules } from "react-icons/gr";

import DailyScheduleSection from "./DailyScheduleSection/DailyScheduleSection";

const USSchedule = ({ userSchedule }) => {
  console.log(userSchedule);

  // Schedule Content
  const MySchedule = userSchedule?.schedule;

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <GrSchedules /> User Workout Schedule
        </p>
      </header>

      {/* Schedule Container */}
      <DailyScheduleSection MySchedule={MySchedule} />
    </div>
  );
};

export default USSchedule;
