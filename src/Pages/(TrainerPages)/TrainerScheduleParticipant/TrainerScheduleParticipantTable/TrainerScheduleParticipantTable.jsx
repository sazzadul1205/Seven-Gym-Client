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
    setSelectedCellParticipants(participants);
    // Optionally trigger a modal here
  };

  console.log("Selected Cell Participants :", selectedCellParticipants);

  return (
    <>
      {/* Daily Schedule Table : Desktop View  */}
      <div className="overflow-x-auto text-black p-5">
        <table className="min-w-full table-auto border border-gray-600 text-sm text-left">
          {/* Table Header */}
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="border text-center px-4 py-2">Time / Day</th>
              {days.map((day) => (
                <th key={day} className="border px-4 py-2 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="space-y-2">
            {sortedTimes.map((time) => {
              // Find the first session that matches the time for display purposes
              let sessionWithTime = null;
              for (const day of days) {
                if (schedule[day]?.[time]) {
                  sessionWithTime = schedule[day][time];
                  break;
                }
              }

              // Format time range if session exists, otherwise just format time
              const displayTime = sessionWithTime?.start
                ? `${formatTime(sessionWithTime.start)} - ${formatTime(
                    sessionWithTime.end
                  )}`
                : formatTime(time);

              return (
                <tr key={time} className="border-t bg-white">
                  {/* Time Column */}
                  <td className="border border-black w-[200px] text-center px-5 font-semibold">
                    {displayTime}
                  </td>

                  {/* Day Columns */}
                  {days.map((day) => {
                    const session = schedule[day]?.[time];
                    const isFull =
                      session?.participant.length === session?.participantLimit;
                    const bgColor = isFull ? "bg-red-200/50" : "";
                    const bgSuperColor = isFull
                      ? "bg-red-500/50"
                      : "bg-gray-300";

                    return (
                      <td
                        key={`${time}-${day}`}
                        className={`border border-black ${bgColor}`}
                      >
                        {session ? (
                          <div>
                            {/* Participant Limit Info Header */}
                            <div
                              className={`text-center ${bgSuperColor} flex justify-center items-center gap-5 py-1`}
                            >
                              <p className="font-semibold">Limit:</p>
                              <p className="w-[20px]">
                                {session.participantLimit}
                              </p>
                              <FaUserCheck />
                            </div>

                            {/* Participant List */}
                            <div className="flex flex-col gap-2 h-[250px] px-5 py-2">
                              {session.participant.length > 0 ? (
                                <>
                                  {/* Show up to 5 participants */}
                                  {session.participant
                                    .slice(0, 5)
                                    .map((participant, index) => (
                                      <span
                                        key={index}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition duration-200 ${
                                          participant.paid
                                            ? "bg-blue-600 text-white"
                                            : "bg-linear-to-bl hover:bg-linear-to-tr from-red-400 to-red-600 text-white cursor-default"
                                        }`}
                                      >
                                        <GoDotFill />
                                        <ParticipantName
                                          email={participant.bookerEmail}
                                        />
                                      </span>
                                    ))}

                                  {/* Show "+ more" button if more than 5 */}
                                  {session.participant.length > 5 && (
                                    <button
                                      onClick={() =>
                                        handleMoreClick(session.participant)
                                      }
                                      className="text-blue-700 hover:underline text-xs font-medium text-left cursor-pointer"
                                    >
                                      + {session.participant.length - 5} more
                                    </button>
                                  )}
                                </>
                              ) : (
                                // If no participants yet
                                <span className="text-gray-800 font-semibold text-center italic">
                                  No participants yet
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          // If no session for this time/day
                          <p className="text-gray-400 italic text-center">—</p>
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
    </>
  );
};

// Prop validation for safety
TrainerScheduleParticipantTable.propTypes = {
  days: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortedTimes: PropTypes.arrayOf(PropTypes.string).isRequired,
  schedule: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired,
};

export default TrainerScheduleParticipantTable;
