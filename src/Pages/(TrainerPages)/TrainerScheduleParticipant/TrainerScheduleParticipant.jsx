// Import Prop Type
import PropTypes from "prop-types";

// Import Component
import TrainerScheduleParticipantTable from "./TrainerScheduleParticipantTable/TrainerScheduleParticipantTable";
import TrainerScheduleParticipantReserved from "./TrainerScheduleParticipantReserved/TrainerScheduleParticipantReserved";
import TrainerScheduleParticipantAccepted from "./TrainerScheduleParticipantAccepted/TrainerScheduleParticipantAccepted";

const TrainerScheduleParticipant = ({
  refetch,
  TrainerBookingRequestData,
  TrainerBookingAcceptedData,
  TrainerProfileScheduleData,
}) => {
  const schedule = TrainerProfileScheduleData?.trainerSchedule;
  if (!schedule) return null;

  const days = Object.keys(schedule);
  const allTimes = new Set();

  // Collect all unique time slots
  days.forEach((day) => {
    const times = Object.keys(schedule[day] || {});
    times.forEach((t) => allTimes.add(t));
  });

  const sortedTimes = Array.from(allTimes).sort((a, b) => a.localeCompare(b));

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Section heading */}
      <div className="text-center py-3">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Trainer Session Participants
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          View participant data across scheduled, reserved, and accepted
          sessions
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto bg-white w-1/3 p-[1px]" />

      {/* Daily Schedule Data Table */}
      <TrainerScheduleParticipantTable
        days={days}
        schedule={schedule}
        sortedTimes={sortedTimes}
      />

      {/* Reserved Not Paid and Accepted Sessions */}
      <TrainerScheduleParticipantReserved
        refetch={refetch}
        TrainerBookingRequestData={TrainerBookingRequestData}
      />

      {/* Accepted Paid and Accepted Session */}
      <TrainerScheduleParticipantAccepted
        refetch={refetch}
        TrainerBookingAcceptedData={TrainerBookingAcceptedData}
      />
    </div>
  );
};

// Prop validation for TrainerScheduleParticipant component
TrainerScheduleParticipant.propTypes = {
  refetch: PropTypes.func.isRequired,
  TrainerBookingRequestData: PropTypes.array.isRequired,
  TrainerBookingAcceptedData: PropTypes.array.isRequired,
  TrainerProfileScheduleData: PropTypes.shape({
    trainerSchedule: PropTypes.object,
  }),
};

export default TrainerScheduleParticipant;
