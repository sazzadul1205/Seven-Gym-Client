import { GrSchedules } from "react-icons/gr";
import ScheduleSettings from "./ScheduleSettings/ScheduleSettings";

const UserSettingsSchedule = ({ userSchedule, refetch }) => {

  const UserScheduleData = userSchedule?.schedule;

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <GrSchedules /> User Schedule Settings
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        <ScheduleSettings
          UserScheduleData={UserScheduleData}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default UserSettingsSchedule;
