import { GrSchedules } from "react-icons/gr";

import DailyScheduleSection from "./DailyScheduleSection/DailyScheduleSection";

const USSchedule = ({ userSchedule }) => {
  if (!userSchedule || !userSchedule.schedule) {
    return (
      <p className="text-center text-gray-500 mt-5">No schedule available.</p>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen p-5">
      {/* Header */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <GrSchedules /> User Workout Schedule
        </p>
      </header>

      {/* Schedule Container */}
      <DailyScheduleSection userSchedule={userSchedule} />
    </div>
  );
};

export default USSchedule;
