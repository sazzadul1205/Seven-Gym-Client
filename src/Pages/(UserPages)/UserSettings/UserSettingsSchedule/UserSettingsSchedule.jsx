// Import Package
import PropTypes from "prop-types";

// Import Icons
import { GrSchedules } from "react-icons/gr";

// Import Component
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

UserSettingsSchedule.propTypes = {
  userSchedule: PropTypes.shape({
    schedule: PropTypes.objectOf(
      PropTypes.shape({
        dayName: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired, // Format: "DD-MM-YYYY"
        schedule: PropTypes.objectOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string,
            notes: PropTypes.string,
            location: PropTypes.string,
            status: PropTypes.string,
          })
        ).isRequired,
      })
    ),
  }),
  refetch: PropTypes.func.isRequired,
};

export default UserSettingsSchedule;
