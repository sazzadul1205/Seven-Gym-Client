/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useRef, useState } from "react";

// Import Icons
import { FaInfo, FaSearch } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// import Shared
import Loading from "../../../Shared/Loading/Loading";
import BookedTrainerBasicInfo from "../../../Shared/Component/BookedTrainerBasicInfo";

// import Modals & Components
import AllTrainerScheduleModal from "./AllTrainerScheduleModal/AllTrainerScheduleModal";

// Import Utility
import { formatTimeTo12Hour } from "../../../Utility/formatTimeTo12Hour";

// Utility to convert HH:mm time to minutes
const timeStringToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const AllTrainerSchedule = ({ TrainersScheduleData }) => {
  if (!TrainersScheduleData || TrainersScheduleData.length === 0) {
    // Show loading component if no trainer data available yet
    return <Loading />;
  }

  // Reference to the modal for trainer schedule details
  const modalTrainerScheduleRef = useRef(null);

  // State to hold the currently selected trainer schedule for modal display
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // State for filters: day, time, trainer name, and class type
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [trainerSearchTerm, setTrainerSearchTerm] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("");

  // Pagination states: current page and items per page count
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique days from all trainers' schedules for filter options
  const dayOptions = useMemo(() => {
    const set = new Set();
    TrainersScheduleData.forEach((trainer) => {
      Object.keys(trainer.trainerSchedule || {}).forEach((day) => set.add(day));
    });
    return Array.from(set);
  }, [TrainersScheduleData]);

  // Extract unique class types from all sessions for filter options
  const classTypeOptions = useMemo(() => {
    const set = new Set();
    TrainersScheduleData.forEach((trainer) => {
      Object.values(trainer.trainerSchedule || {}).forEach((daySessions) => {
        Object.values(daySessions).forEach((session) => {
          if (session.classType) set.add(session.classType);
        });
      });
    });
    return Array.from(set);
  }, [TrainersScheduleData]);

  // Extract unique start times from all sessions, sorted by time
  const uniqueTimes = useMemo(() => {
    const set = new Set();
    TrainersScheduleData.forEach((trainer) => {
      Object.values(trainer.trainerSchedule || {}).forEach((daySessions) => {
        Object.values(daySessions).forEach((session) => {
          if (session.start) set.add(session.start);
        });
      });
    });
    return Array.from(set).sort(
      (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b)
    );
  }, [TrainersScheduleData]);

  // Filter and summarize trainers based on search and filter criteria
  const summarizeData = TrainersScheduleData.filter((trainer) => {
    // Filter by trainer name search term
    const trainerName = trainer?.trainerName?.toLowerCase() || "";
    if (
      trainerSearchTerm &&
      !trainerName.includes(trainerSearchTerm.toLowerCase())
    )
      return false;

    const schedule = trainer.trainerSchedule || {};

    // Filter by selected day
    if (selectedDay && !Object.keys(schedule).includes(selectedDay))
      return false;

    // Filter by selected class type and/or time
    if (selectedClassType || selectedTime) {
      let hasMatch = false;
      Object.values(schedule).forEach((daySessions) => {
        Object.values(daySessions).forEach((session) => {
          const classTypeMatch = selectedClassType
            ? session.classType === selectedClassType
            : true;
          const timeMatch = selectedTime
            ? session.start === selectedTime
            : true;
          if (classTypeMatch && timeMatch) hasMatch = true;
        });
      });
      if (!hasMatch) return false;
    }

    return true;
  })
    // Add summarized schedule info to each trainer object
    .map((trainer) => ({
      ...trainer,
      summary: summarizeTrainer(trainer),
    }));

  // Calculate total number of pages for pagination
  const totalPages = Math.ceil(summarizeData.length / itemsPerPage);

  // Get the subset of trainers to display on the current page
  const currentData = summarizeData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to close the modal and clear the selected schedule
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

        {/* Filter by Time */}
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
                {formatTimeTo12Hour(time)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {currentData?.length > 0 ? (
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
              {currentData?.map((trainer, index) => {
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
                            {formatTimeTo12Hour(summary?.earliestStart)} -
                            {formatTimeTo12Hour(summary?.latestEnd)}
                          </p>
                          <p>( {summary?.activeHours} hrs )</p>
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="border px-4 py-2">
                      <button
                        id={`view-details-btn-${trainer._id}`}
                        className="border-2 border-yellow-500 bg-yellow-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => {
                          setSelectedSchedule(trainer);
                          modalTrainerScheduleRef.current?.showModal();
                        }}
                      >
                        <FaInfo className="text-yellow-500" />
                      </button>
                      <Tooltip
                        anchorSelect={`#view-details-btn-${trainer._id}`}
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
            participantLimit: PropTypes.oneOfType([
              PropTypes.number,
              PropTypes.string,
            ]),
            participant: PropTypes.oneOfType([
              PropTypes.arrayOf(PropTypes.object),
              PropTypes.object,
            ]),
          })
        )
      ).isRequired,
    })
  ),
};

export default AllTrainerSchedule;

const summarizeTrainer = (trainer) => {
  const schedule = trainer.trainerSchedule || {};

  // Initialize summary variables
  let totalSessions = 0;
  let totalParticipants = 0;
  let totalParticipantLimit = 0;
  let unlimitedParticipants = 0;
  const daysActive = [];
  const classTypeCount = {};
  let earliestStart = null;
  let latestEnd = null;

  // Loop through each day and its sessions
  for (const [day, times] of Object.entries(schedule)) {
    let dayHasSession = false;

    for (const session of Object.values(times)) {
      if (session.classType?.trim()) {
        dayHasSession = true;
        totalSessions++;

        // Count participants
        const participantsCount = Array.isArray(session.participant)
          ? session.participant.length
          : 0;
        totalParticipants += participantsCount;

        // Track limited and unlimited participant slots
        if (session.participantLimit && session.participantLimit > 0) {
          totalParticipantLimit += session.participantLimit;
        } else {
          unlimitedParticipants += participantsCount;
        }

        // Count frequency of each class type
        classTypeCount[session.classType] =
          (classTypeCount[session.classType] || 0) + 1;

        // Track earliest start and latest end times
        const startMinutes = timeStringToMinutes(session.start);
        const endMinutes = timeStringToMinutes(session.end);

        if (
          !earliestStart ||
          startMinutes < timeStringToMinutes(earliestStart)
        ) {
          earliestStart = session.start;
        }
        if (!latestEnd || endMinutes > timeStringToMinutes(latestEnd)) {
          latestEnd = session.end;
        }
      }
    }

    // Add active day if it had sessions
    if (dayHasSession) {
      daysActive.push(day);
    }
  }

  // Determine the most common class type
  const mostCommonClassType = Object.entries(classTypeCount).reduce(
    (maxPair, currPair) => (currPair[1] > maxPair[1] ? currPair : maxPair),
    ["N/A", 0]
  )[0];

  // Calculate total active hours based on earliest start and latest end
  let activeHours = 0;
  if (earliestStart && latestEnd) {
    const diffMinutes =
      timeStringToMinutes(latestEnd) - timeStringToMinutes(earliestStart);
    activeHours = Math.round((diffMinutes / 60) * 10) / 10;
  }

  // Return the summarized trainer schedule stats
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
