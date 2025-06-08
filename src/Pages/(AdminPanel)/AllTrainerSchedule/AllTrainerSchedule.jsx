import { useMemo, useRef, useState } from "react";

// Import Icons
import { FaInfo, FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Shared
import BookedTrainerBasicInfo from "../../../Shared/Component/BookedTrainerBasicInfo";

// import Modals & Components
import AllTrainerScheduleModal from "./AllTrainerScheduleModal/AllTrainerScheduleModal";

// Converts "HH:MM" time string into total minutes since midnight
const timeStringToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

// Converts 24-hour time (e.g. "13:45") into 12-hour format with AM/PM (e.g. "1:45 PM")
const convertTo12HourFormat = (time24) => {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const amps = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minuteStr} ${amps}`;
};

// Checks if a selected time (in "HH:MM") falls within a given start and end time range
const timeInRange = (selected, start, end) => {
  if (!start || !end || start === "N/A" || end === "N/A") return false;
  const selectedMins = timeStringToMinutes(selected);
  const startMins = timeStringToMinutes(start);
  const endMins = timeStringToMinutes(end);
  return selectedMins >= startMins && selectedMins <= endMins;
};

const AllTrainerSchedule = ({ TrainersScheduleData }) => {
  // Reference to the trainer schedule modal
  const modalTrainerScheduleRef = useRef(null);

  // Store the currently selected schedule for modal view
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Filter states
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("");
  const [trainerSearchTerm, setTrainerSearchTerm] = useState("");

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Memoized summary list of all trainers for performance
  const trainersWithSummary = useMemo(() => {
    return TrainersScheduleData.map((trainer) => ({
      ...trainer,
      summary: summarizeTrainer(trainer),
    }));
  }, [TrainersScheduleData]);

  // Extract all unique class types from trainer summaries
  const classTypeOptions = useMemo(() => {
    const set = new Set();
    trainersWithSummary.forEach((t) => {
      if (t.summary.mostCommonClassType !== "N/A") {
        set.add(t.summary.mostCommonClassType);
      }
    });
    return Array.from(set).sort();
  }, [trainersWithSummary]);

  // Extract all active days across trainers
  const dayOptions = useMemo(() => {
    const days = new Set();
    trainersWithSummary.forEach((t) => {
      t.summary.daysActive.split(", ").forEach((day) => {
        if (day) days.add(day);
      });
    });
    return Array.from(days).sort();
  }, [trainersWithSummary]);

  // Get all unique session start and end times
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

    return Array.from(timeSet).sort(
      (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b)
    );
  }, [TrainersScheduleData]);

  // Filtered trainers based on search, day, class type, and time range
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

  // Total pages for paginated table
  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);

  // Current page's trainers for display
  const currentData = filteredTrainers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close the trainer schedule modal and clear selected state
  const closeTrainerScheduleModal = () => {
    modalTrainerScheduleRef.current?.close();
    setSelectedSchedule(null);
  };

  return (
    <div className="text-black pb-5">
      {/* Page Header */}
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
      {currentData.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Data Table */}
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            {/* Table Header */}
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

            {/* Table Body */}
            <tbody>
              {currentData.map((trainer, index) => {
                const { summary } = trainer;
                return (
                  <tr key={trainer._id} className="hover:bg-gray-100">
                    {/* Serial Number */}
                    <td className="border px-4 py-2">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    {/* Trainer Information */}
                    <td className="border px-4 py-2">
                      <BookedTrainerBasicInfo
                        trainerID={trainer?.trainerId}
                        py={1}
                      />
                    </td>

                    {/* TotAL Sessions */}
                    <td className="border text-center px-4 py-2">
                      {summary?.totalSessions}
                    </td>

                    {/* Participants / Limit */}
                    <td className="border text-center px-4 py-2">
                      {summary?.totalParticipants} /{" "}
                      {summary?.totalParticipantLimit}
                    </td>

                    {/* Active Days */}
                    <td className="border text-center px-4 py-2">
                      {summary?.daysActive}
                    </td>

                    {/* Common Class Types */}
                    <td className="border text-center px-4 py-2">
                      {summary?.mostCommonClassType}
                    </td>

                    {/* Unlimited class Participants */}
                    <td className="border text-center px-4 py-2">
                      {summary?.unlimitedParticipants}
                    </td>

                    {/* Class Start, End & Duration Time */}
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

                    {/* Action */}
                    <td className="border px-4 py-2">
                      <button
                        id={`view-details-btn-${summary._id}`}
                        className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => {
                          setSelectedSchedule(summary);
                          modalTrainerScheduleRef.current?.showModal();
                        }}
                      >
                        <FaInfo className="text-yellow-500" />
                      </button>
                      <Tooltip
                        anchorSelect={`#view-details-btn-${summary._id}`}
                        content="View Detailed Schedule Info"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="join">
              {/* Previous Page Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === 1
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesLeft />
              </button>

              {/* Page Info */}
              <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
                Page {currentPage} / {totalPages}
              </span>

              {/* Next Page Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-blue-100 text-blue-600"
                }`}
              >
                <FaAnglesRight />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-200 p-4">
          <p className="text-center font-semibold text-black">
            No Booking History Available.
          </p>
        </div>
      )}

      {/* Trainer Schedule Modal */}
      <dialog ref={modalTrainerScheduleRef} className="modal">
        <AllTrainerScheduleModal
          closeModal={closeTrainerScheduleModal}
          selectedSchedule={selectedSchedule}
        />
      </dialog>
    </div>
  );
};

// Prop Validation
AllTrainerSchedule.propTypes = {
  TrainersScheduleData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      trainerId: PropTypes.string.isRequired,
      trainerName: PropTypes.string.isRequired,
      trainerSchedule: PropTypes.objectOf(
        PropTypes.objectOf(
          PropTypes.shape({
            classType: PropTypes.string,
            start: PropTypes.string,
            end: PropTypes.string,
            participantLimit: PropTypes.number,
            participant: PropTypes.arrayOf(PropTypes.object), // Adjust if you have a specific structure for participant objects
          })
        )
      ).isRequired,
    })
  ).isRequired,
};

export default AllTrainerSchedule;
