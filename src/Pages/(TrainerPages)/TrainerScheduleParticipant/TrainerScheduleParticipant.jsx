// Import Prop Type
import PropTypes from "prop-types";

// Import Component
import TrainerScheduleParticipantReserved from "./TrainerScheduleParticipantReserved/TrainerScheduleParticipantReserved";
import TrainerScheduleParticipantAccepted from "./TrainerScheduleParticipantAccepted/TrainerScheduleParticipantAccepted";
import TrainerScheduleParticipantTable from "./TrainerScheduleParticipantTable/TrainerScheduleParticipantTable";

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
      {/* Title */}
      <div className="text-center space-y-1 py-4">
        <h3 className="text-center font-semibold text-white text-xl">
          Participant Control & Information
        </h3>
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
        TrainerBookingAcceptedData={TrainerBookingAcceptedData}
      />
    </div>
  );
};

// Prop validation for TrainerScheduleParticipant component
TrainerScheduleParticipant.propTypes = {
  refetch: PropTypes.func.isRequired,
  TrainerBookingRequestData: PropTypes.object.isRequired,
  TrainerBookingAcceptedData: PropTypes.object.isRequired,
  TrainerProfileScheduleData: PropTypes.shape({
    trainerSchedule: PropTypes.object.isRequired,
  }).isRequired,
};

export default TrainerScheduleParticipant;
