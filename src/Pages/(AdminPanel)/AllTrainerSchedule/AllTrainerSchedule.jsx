const timeStringToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};
const AllTrainerSchedule = ({ TrainersScheduleData }) => {
  console.log(TrainersScheduleData);

  // Summarize a trainer's schedule details for easy filtering/display
  const summarizeTrainer = (trainer) => {
    const schedule = trainer.trainerSchedule;

    let totalSessions = 0;
    let totalParticipants = 0;
    let totalParticipantLimit = 0;
    let unlimitedParticipants = 0;
    const daysActive = [];
    const classTypeCount = {};

    // Track start and end times across all sessions
    let earliestStart = null;
    let latestEnd = null;

    for (const [day, times] of Object.entries(schedule)) {
      let dayHasSession = false;

      // eslint-disable-next-line no-unused-vars
      for (const [timeKey, session] of Object.entries(times)) {
        if (session.classType && session.classType.trim() !== "") {
          dayHasSession = true;
          totalSessions++;

          // Count actual participants
          const participantsCount = Array.isArray(session.participant)
            ? session.participant.length
            : 0;
          totalParticipants += participantsCount;

          // Track participant limits
          if (session.participantLimit && session.participantLimit > 0) {
            totalParticipantLimit += session.participantLimit;
          } else {
            unlimitedParticipants += participantsCount;
          }

          // Count how often each class type appears
          classTypeCount[session.classType] =
            (classTypeCount[session.classType] || 0) + 1;

          // Compare start and end times
          const startMinutes = timeStringToMinutes(session.start);
          const endMinutes = timeStringToMinutes(session.end);
          if (
            earliestStart === null ||
            startMinutes < timeStringToMinutes(earliestStart)
          ) {
            earliestStart = session.start;
          }
          if (
            latestEnd === null ||
            endMinutes > timeStringToMinutes(latestEnd)
          ) {
            latestEnd = session.end;
          }
        }
      }

      if (dayHasSession) {
        daysActive.push(day);
      }
    }

    // Determine most frequently occurring class type
    const mostCommonClassType = Object.entries(classTypeCount).reduce(
      (maxPair, currPair) => (currPair[1] > maxPair[1] ? currPair : maxPair),
      ["N/A", 0]
    )[0];

    // Calculate total active hours between earliest start and latest end
    let activeHours = 0;
    if (earliestStart && latestEnd) {
      const diffMinutes =
        timeStringToMinutes(latestEnd) - timeStringToMinutes(earliestStart);
      activeHours = Math.round((diffMinutes / 60) * 10) / 10;
    }

    return {
      totalSessions,
      totalParticipants,
      totalParticipantLimit,
      unlimitedParticipants,
      daysActive: daysActive.join(", "),
      mostCommonClassType,
      earliestStart: earliestStart || "N/A",
      latestEnd: latestEnd || "N/A",
      activeHours,
    };
  };

  return (
    <div className="text-black pb-5">
      {/* Page Header */}
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          All Trainer Schedule
        </h3>
      </div>
    </div>
  );
};

export default AllTrainerSchedule;
