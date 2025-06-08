import { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import BookedTrainerBasicInfo from "../../../Shared/Component/BookedTrainerBasicInfo";

// Utility to convert "HH:MM" → total minutes
const timeStringToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const convertTo12HourFormat = (time24) => {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const amps = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minuteStr} ${amps}`;
};

const timeInRange = (selected, start, end) => {
  if (!start || !end || start === "N/A" || end === "N/A") return false;
  const selectedMins = timeStringToMinutes(selected);
  const startMins = timeStringToMinutes(start);
  const endMins = timeStringToMinutes(end);
  return selectedMins >= startMins && selectedMins <= endMins;
};

const AllTrainerSchedule = ({ TrainersScheduleData }) => {
  const [trainerSearchTerm, setTrainerSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const summarizeTrainer = (trainer) => {
    const schedule = trainer.trainerSchedule;

    let totalSessions = 0;
    let totalParticipants = 0;
    let totalParticipantLimit = 0;
    let unlimitedParticipants = 0;
    const daysActive = [];
    const classTypeCount = {};

    // Time‐range tracking
    let earliestStart = null;
    let latestEnd = null;

    for (const [day, times] of Object.entries(schedule)) {
      let dayHasSession = false;

      for (const [timeKey, session] of Object.entries(times)) {
        if (session.classType && session.classType.trim() !== "") {
          dayHasSession = true;
          totalSessions++;

          // Track participants
          const participantsCount = Array.isArray(session.participant)
            ? session.participant.length
            : 0;
          totalParticipants += participantsCount;

          if (session.participantLimit && session.participantLimit > 0) {
            totalParticipantLimit += session.participantLimit;
          } else {
            unlimitedParticipants += participantsCount;
          }

          // Count class types
          classTypeCount[session.classType] =
            (classTypeCount[session.classType] || 0) + 1;

          // Update earliestStart / latestEnd
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

    // Determine most common class type
    const mostCommonClassType = Object.entries(classTypeCount).reduce(
      (maxPair, currPair) => (currPair[1] > maxPair[1] ? currPair : maxPair),
      ["N/A", 0]
    )[0];

    // Calculate active hours difference (in hours)
    let activeHours = 0;
    if (earliestStart && latestEnd) {
      const diffMinutes =
        timeStringToMinutes(latestEnd) - timeStringToMinutes(earliestStart);
      // Round to one decimal place if needed
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

  // Pre‐calculate summaries for each trainer
  const trainersWithSummary = useMemo(() => {
    return TrainersScheduleData.map((trainer) => ({
      ...trainer,
      summary: summarizeTrainer(trainer),
    }));
  }, [TrainersScheduleData]);

  const classTypeOptions = useMemo(() => {
    const set = new Set();
    trainersWithSummary.forEach((t) => {
      if (t.summary.mostCommonClassType !== "N/A") {
        set.add(t.summary.mostCommonClassType);
      }
    });
    return Array.from(set).sort();
  }, [trainersWithSummary]);

  const dayOptions = useMemo(() => {
    const days = new Set();
    trainersWithSummary.forEach((t) => {
      t.summary.daysActive.split(", ").forEach((day) => {
        if (day) days.add(day);
      });
    });
    return Array.from(days).sort(); // e.g., ["Friday", "Monday", ...]
  }, [trainersWithSummary]);

  const uniqueTimes = useMemo(() => {
    const timeSet = new Set();

    TrainersScheduleData.forEach((trainer) => {
      const schedule = trainer.trainerSchedule;
      Object.values(schedule).forEach((daySessions) => {
        Object.values(daySessions).forEach((session) => {
          if (session.start) timeSet.add(session.start);
          if (session.end) timeSet.add(session.end);
        });
      });
    });

    // Return sorted list in "HH:MM" format
    return Array.from(timeSet).sort(
      (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b)
    );
  }, [TrainersScheduleData]);

  // Final filtered trainers
  const filteredTrainers = trainersWithSummary.filter((trainer) => {
    const { trainerName } = trainer;
    const { daysActive, mostCommonClassType, earliestStart, latestEnd } =
      trainer.summary;

    const nameMatch = trainerName
      .toLowerCase()
      .includes(trainerSearchTerm.toLowerCase());

    const dayMatch = selectedDay
      ? daysActive.split(", ").includes(selectedDay)
      : true;

    const classMatch = selectedClassType
      ? mostCommonClassType === selectedClassType
      : true;

    const timeMatch = selectedTime
      ? timeInRange(selectedTime, earliestStart, latestEnd)
      : true;

    return nameMatch && dayMatch && classMatch && timeMatch;
  });

  return (
    <div className="text-black">
      <div className="bg-gray-400 py-2">
        <h3 className="font-semibold text-white text-center text-lg">
          All Trainer Schedule
        </h3>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 w-full p-4 bg-gray-400 border border-t-white">
        {/* Search by Trainer Name */}
        <div className="flex flex-col flex-1 max-w-[300px]">
          <label className="text-sm font-semibold text-white mb-1">
            Search by Trainer Name
          </label>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
            <FaSearch className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search trainer..."
              value={trainerSearchTerm}
              onChange={(e) => setTrainerSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Filter by Day Active */}
        <div className="flex flex-col flex-1 max-w-[200px]">
          <label className="text-sm font-semibold text-white mb-1">
            Filter by Day Active
          </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
          >
            <option value="">All Days</option>
            {dayOptions.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Main Class Type */}
        <div className="flex flex-col flex-1 max-w-[200px]">
          <label className="text-sm font-semibold text-white mb-1">
            Filter by Main Class Type
          </label>
          <select
            value={selectedClassType}
            onChange={(e) => setSelectedClassType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
          >
            <option value="">All Types</option>
            {classTypeOptions.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col flex-1 max-w-[200px]">
          <label className="text-sm font-semibold text-white mb-1">
            Filter by Time
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white text-gray-700 outline-none shadow-sm"
          >
            <option value="">All Times</option>
            {uniqueTimes.map((time) => (
              <option key={time} value={time}>
                {convertTo12HourFormat(time)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Trainer Name</th>
            <th className="px-4 py-2">Total Sessions</th>
            <th className="px-4 py-2">Booked Sessions</th>
            <th className="px-4 py-2">Days Active</th>
            <th className="px-4 py-2">Main Class Type</th>
            <th className="px-4 py-2">No Limit Sessions</th>
            <th className="px-4 py-2">Time Range</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrainers.map((trainer, idx) => {
            const { summary } = trainer;
            return (
              <tr key={trainer._id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">
                  <BookedTrainerBasicInfo
                    trainerID={trainer?.trainerId}
                    py={1}
                  />
                </td>
                <td className="border text-center px-4 py-2">
                  {summary?.totalSessions}
                </td>
                <td className="border text-center px-4 py-2">
                  {summary?.totalParticipants} /{" "}
                  {summary?.totalParticipantLimit}
                </td>
                <td className="border text-center px-4 py-2">
                  {summary?.daysActive}
                </td>
                <td className="border text-center px-4 py-2">
                  {summary?.mostCommonClassType}
                </td>
                <td className="border text-center px-4 py-2">
                  {summary?.unlimitedParticipants}
                </td>
                <td className="border text-center px-4 py-2 w-[170px] ">
                  {summary?.earliestStart === "N/A" &&
                  summary?.latestEnd === "N/A" ? (
                    "N/A"
                  ) : (
                    <div className="text-sm block">
                      <p>
                        {convertTo12HourFormat(summary?.earliestStart)} -
                        {convertTo12HourFormat(summary?.latestEnd)}
                      </p>
                      <p>( {summary?.activeHours} hrs )</p>
                    </div>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() =>
                      alert(`Show details for ${trainer.trainerName}`)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AllTrainerSchedule;
