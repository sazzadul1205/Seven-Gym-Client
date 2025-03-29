// Import Package
import PropTypes from "prop-types";

// Import Icons
import { GrSchedules } from "react-icons/gr";

// Import Component
import ScheduleSettings from "./ScheduleSettings/ScheduleSettings";
import SchedulePrioritySettings from "./SchedulePrioritySettings/SchedulePrioritySettings";
import ScheduleToDoSettings from "./ScheduleToDoSettings/ScheduleToDoSettings";
import ScheduleNoteSettings from "./ScheduleNoteSettings/ScheduleNoteSettings";

const UserSettingsSchedule = ({ userSchedule, refetch }) => {
  // User Schedule Data
  const UserScheduleData = userSchedule?.schedule;

  // User Priority Data
  const UserPriorityData = userSchedule?.priority;

  // User To Do Data
  const UserToDoData = userSchedule?.todo;

  // User Note Data
  const UserNoteData = userSchedule?.notes;

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
        {/* Schedule Settings */}
        <ScheduleSettings
          UserScheduleData={UserScheduleData}
          refetch={refetch}
        />

        {/* Schedule Priority Settings */}
        <SchedulePrioritySettings
          UserPriorityData={UserPriorityData}
          refetch={refetch}
        />

        {/* Schedule To Do Settings */}
        <ScheduleToDoSettings UserToDoData={UserToDoData} refetch={refetch} />

        {/* Schedule Note Settings */}
        <ScheduleNoteSettings UserNoteData={UserNoteData} refetch={refetch} />
      </div>
    </div>
  );
};

// Prop type management
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
    priority: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        level: PropTypes.string.isRequired, // Example: "High", "Medium", "Low"
        description: PropTypes.string,
      })
    ),
    todo: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        task: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
      })
    ),
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        dateCreated: PropTypes.string.isRequired, // Format: "DD-MM-YYYY"
      })
    ),
  }),
  refetch: PropTypes.func.isRequired,
};

export default UserSettingsSchedule;
