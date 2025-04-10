/* eslint-disable react/prop-types */

// Import Package
import { useQuery } from "@tanstack/react-query";

// Import Icon
import { FaUserCheck } from "react-icons/fa";

// Import Utility
import { formatTime } from "../../../Utility/formatTime";

// Import Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Component
import TrainerScheduleParticipantReserved from "./TrainerScheduleParticipantReserved/TrainerScheduleParticipantReserved";

const TrainerScheduleParticipant = ({
  TrainerProfileScheduleData,
  TrainerBookingRequestData,
}) => {
  const axiosPublic = useAxiosPublic();

  console.log(TrainerProfileScheduleData);

  const schedule = TrainerProfileScheduleData?.trainerSchedule;
  if (!schedule) return null;

  const days = Object.keys(schedule);
  const allTimes = new Set();

  // Collect all unique time slots
  days.forEach((day) => {
    const times = Object.keys(schedule[day] || {});
    times.forEach((t) => allTimes.add(t));
  });

  const acceptedBookings = TrainerBookingRequestData?.filter(
    (booking) => booking.status === "Accepted"
  );

  const sortedTimes = Array.from(allTimes).sort((a, b) => a.localeCompare(b));

  // Helper function to fetch the user's name by email (This should ideally be an API call or a lookup from your data source)
  const getUserNameByEmail = (email) => {
    // Initialize Axios instance

    // Fetch user basic info using email
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading, error } = useQuery({
      queryKey: ["UserBasicInfo", email],
      queryFn: () =>
        axiosPublic
          .get(`/Users/BasicProfile?email=${email}`)
          .then((res) => res.data),
      enabled: !!email,
    });

    // Show loading state
    if (isLoading)
      return <span className="text-xs text-gray-500">Loading...</span>;

    // Handle error or missing data
    if (error || !data) return <span className="text-xs">{email}</span>;

    return data?.fullName || email;
  };

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

      {/* Schedule Table */}
      <div className="overflow-x-auto text-black p-5">
        <table className="min-w-full table-auto border border-gray-600 text-sm text-left">
          {/* Table Head */}
          <thead className="bg-gray-700 text-white">
            <tr>
              {/* Time and Date Title */}
              <th className="border text-center px-4 py-2">Time / Day</th>

              {/* Day Name */}
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
              // Find a session with start & end for this time
              let sessionWithTime = null;
              for (const day of days) {
                if (schedule[day]?.[time]) {
                  sessionWithTime = schedule[day][time];
                  break;
                }
              }

              // Get Display Time by Start and End
              const displayTime = sessionWithTime?.start
                ? `${formatTime(sessionWithTime.start)} - ${formatTime(
                    sessionWithTime.end
                  )}`
                : formatTime(time);

              return (
                <tr key={time} className="border-t bg-white">
                  {/* Display Time */}
                  <td className="border border-black w-[200px] text-center my-auto px-5 font-semibold">
                    {displayTime}
                  </td>

                  {days.map((day) => {
                    const session = schedule[day]?.[time];
                    const isFull =
                      session?.participant.length === session?.participantLimit;
                    const bgColor = isFull ? "bg-red-200/50" : ""; // Light background for full session
                    const bgSuperColor = isFull
                      ? "bg-red-500/50"
                      : "bg-gray-300"; // Light background for full session

                    return (
                      <td
                        key={`${time}-${day}`}
                        className={`border border-black ${bgColor}`} // Conditionally apply background color
                      >
                        {session ? (
                          <div>
                            {/* Limit Info */}
                            <div
                              className={`text-center ${bgSuperColor} flex justify-center items-center gap-5 py-1`}
                            >
                              <p className="font-semibold">Limit:</p>
                              <p className="w-[20px]">
                                {session.participantLimit}
                              </p>
                              <FaUserCheck />
                            </div>

                            {/* Participant Names (instead of emails) */}
                            <div className="flex justify-center gap-2">
                              {session.participant.length > 0 ? (
                                session.participant.map(
                                  (participant, index) => {
                                    const userName = getUserNameByEmail(
                                      participant.bookerEmail
                                    ); // Fetch name by email
                                    return (
                                      <span
                                        key={index}
                                        className={`inline-block text-sm px-3 py-1 my-2 rounded-full shadow-md transition duration-200 ${
                                          participant.paid
                                            ? "bg-blue-600 text-white"
                                            : "bg-red-600 text-white"
                                        }`}
                                        style={{ fontSize: "0.875rem" }} // Slightly smaller font size
                                      >
                                        {userName}
                                      </span>
                                    );
                                  }
                                )
                              ) : (
                                <span className="text-gray-400 italic my-3">
                                  No participants yet
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-400 italic">—</p>
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

      {/* Reserved Not Paid Sessions */}
      <TrainerScheduleParticipantReserved acceptedBookings={acceptedBookings} />
    </div>
  );
};

export default TrainerScheduleParticipant;
