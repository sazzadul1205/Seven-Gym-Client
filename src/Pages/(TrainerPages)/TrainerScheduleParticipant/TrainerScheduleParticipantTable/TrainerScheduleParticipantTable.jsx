// Import necessary dependencies
import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Import Icons
import { GoDotFill } from "react-icons/go";
import { FaUserCheck } from "react-icons/fa";

// Import Utility
import { formatTime } from "../../../../Utility/formatTime";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// import Modal
import TrainerScheduleParticipantTableMoreModal from "./TrainerScheduleParticipantTableMoreModal/TrainerScheduleParticipantTableMoreModal";

// Fetch and display participant name using their email
const ParticipantName = ({ email }) => {
  const axiosPublic = useAxiosPublic();

  const { data, isLoading, error } = useQuery({
    queryKey: ["UserBasicInfo", email],
    queryFn: () =>
      axiosPublic
        .get(`/Users/BasicProfile?email=${email}`)
        .then((res) => res.data),
    enabled: !!email,
  });

  if (isLoading)
    return <span className="text-xs text-gray-500">Loading...</span>;
  if (error || !data) return <span className="text-xs">{email}</span>;

  return <>{data.fullName || email}</>;
};

// Prop validation for safety
ParticipantName.propTypes = {
  email: PropTypes.string.isRequired,
};

// Main table component displaying the schedule and participants
const TrainerScheduleParticipantTable = ({ days, sortedTimes, schedule }) => {
  // State to hold selected participants (used later for modal)
  const [selectedCellParticipants, setSelectedCellParticipants] = useState([]);

  // Handler to store selected participants into state
  const handleMoreClick = (participants) => {
    document
      .getElementById("Trainer_Schedule_Participant_Table_More_Modal")
      .showModal();
    setSelectedCellParticipants(participants);
  };

  return (
    <>
      {/* Daily Schedule Table : Desktop View */}
      <div className="hidden md:block overflow-x-auto text-black px-1 py-5">
        <table className="min-w-full table-auto border border-gray-300 text-sm text-left shadow-lg rounded overflow-hidden">
          {/* Table Header */}
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border px-4 py-3 text-center text-sm font-semibold tracking-wide">
                Time / Day
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border px-4 py-3 text-center text-sm font-semibold tracking-wide"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedTimes.map((time) => {
              let sessionWithTime = null;
              for (const day of days) {
                if (schedule[day]?.[time]) {
                  sessionWithTime = schedule[day][time];
                  break;
                }
              }

              const displayTime = sessionWithTime?.start
                ? `${formatTime(sessionWithTime.start)} - ${formatTime(
                    sessionWithTime.end
                  )}`
                : formatTime(time);

              return (
                <tr
                  key={time}
                  className="border-t bg-white hover:bg-gray-50 transition"
                >
                  {/* Time Column */}
                  <td className="border border-gray-300 text-center px-4 py-2 font-medium w-[200px] bg-gray-100">
                    {displayTime}
                  </td>

                  {/* Day Columns */}
                  {days.map((day) => {
                    const session = schedule[day]?.[time];
                    const isFull =
                      session?.participant.length === session?.participantLimit;
                    const bgColor = isFull ? "bg-red-100" : "bg-white";
                    const headerColor = isFull
                      ? "bg-red-500/40"
                      : "bg-gray-200";

                    return (
                      <td
                        key={`${time}-${day}`}
                        className={`border border-gray-300 align-top ${bgColor}`}
                      >
                        {session ? (
                          <div className="h-full">
                            {/* Header */}
                            <div
                              className={`flex items-center justify-center gap-2 text-xs font-medium py-1 ${headerColor}`}
                            >
                              <span>Limit:</span>
                              <span className="font-bold">
                                {session.participant.length || 0}/
                                {session.participantLimit}
                              </span>
                              <FaUserCheck size={14} />
                            </div>

                            {/* Participants */}
                            <div className="flex flex-col gap-1 max-h-[250px] px-2 py-2 overflow-y-auto">
                              {session.participant.length > 0 ? (
                                <>
                                  {session.participant
                                    .slice(0, 2)
                                    .map((participant, idx) => (
                                      <span
                                        key={idx}
                                        className={`flex items-center gap-2 px-3 py-2 text-xs rounded-full shadow-sm cursor-default ${
                                          participant.paid
                                            ? "bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-400 to-blue-600 text-white"
                                            : "bg-gradient-to-bl hover:bg-gradient-to-tr from-red-400 to-red-600 text-white "
                                        }`}
                                      >
                                        <GoDotFill size={12} />
                                        <ParticipantName
                                          email={participant.bookerEmail}
                                        />
                                      </span>
                                    ))}

                                  {session.participant.length > 2 && (
                                    <button
                                      onClick={() =>
                                        handleMoreClick(session.participant)
                                      }
                                      className="text-blue-600 hover:underline text-xs font-semibold text-left mt-1 cursor-pointer"
                                    >
                                      + {session.participant.length - 2} more
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span className="italic text-gray-500 text-xs text-center bg-gray-100 py-2 rounded">
                                  No participants yet
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-center italic text-gray-400 py-3">
                            —
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Card Layout */}
      <div className="block md:hidden p-3 space-y-5">
        {sortedTimes.map((time) => (
          <div key={time}>
            <h3 className="text-sm font-bold text-gray-700 border-b pb-1 mb-2">
              {formatTime(time)}
            </h3>
            {days.map((day) => {
              const session = schedule[day]?.[time];
              if (!session) return null;

              const isFull =
                session.participant.length === session.participantLimit;
              const bgColor = isFull ? "bg-red-200/50" : "bg-white";

              return (
                <div
                  key={`${day}-${time}`}
                  className={`rounded-xl shadow border ${bgColor} p-3 mb-3`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-gray-800">
                      {day}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <FaUserCheck />
                      {session.participant.length}/{session.participantLimit}
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex flex-col gap-1">
                    {session.participant.length > 0 ? (
                      <>
                        {session.participant
                          .slice(0, 2)
                          .map((participant, index) => (
                            <span
                              key={index}
                              className={`flex items-center gap-2 px-2 py-1 text-xs rounded shadow ${
                                participant.paid
                                  ? "bg-blue-600 text-white"
                                  : "bg-gradient-to-br from-red-500 to-red-700 text-white"
                              }`}
                            >
                              <GoDotFill className="text-[10px]" />
                              <ParticipantName
                                email={participant.bookerEmail}
                              />
                            </span>
                          ))}
                        {session.participant.length > 2 && (
                          <button
                            onClick={() => handleMoreClick(session.participant)}
                            className="text-blue-700 text-xs underline mt-1 text-left"
                          >
                            + {session.participant.length - 2} more
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="italic text-gray-500 text-xs">
                        No participants yet
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <dialog
        id="Trainer_Schedule_Participant_Table_More_Modal"
        className="modal"
      >
        <TrainerScheduleParticipantTableMoreModal
          selectedCellParticipants={selectedCellParticipants}
        />
      </dialog>
    </>
  );
};

// Prop validation for safety
TrainerScheduleParticipantTable.propTypes = {
  days: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortedTimes: PropTypes.arrayOf(PropTypes.string).isRequired,
  schedule: PropTypes.object.isRequired,
};
export default TrainerScheduleParticipantTable;
