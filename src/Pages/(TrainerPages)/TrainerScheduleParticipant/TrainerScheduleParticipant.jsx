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
import TrainerScheduleParticipantAccepted from "./TrainerScheduleParticipantAccepted/TrainerScheduleParticipantAccepted";

const TrainerScheduleParticipant = ({
  refetch,
  // TrainerProfileData,
  TrainerBookingRequestData,
  TrainerBookingAcceptedData,
  TrainerProfileScheduleData,
}) => {
  const axiosPublic = useAxiosPublic();

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

      {/* Daily Schedule Component */}
      <div>
        {/* Table View for Screens sm and up */}
        <div className="overflow-x-auto text-black p-5 hidden sm:block">
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
              {/* Loop through all sorted times to create rows */}
              {sortedTimes.map((time) => {
                // Find the first available session at this time from any day
                let sessionWithTime = null;
                for (const day of days) {
                  if (schedule[day]?.[time]) {
                    sessionWithTime = schedule[day][time];
                    break; // Stop at the first match
                  }
                }

                // Format the display time based on session's start and end time if available
                const displayTime = sessionWithTime?.start
                  ? `${formatTime(sessionWithTime.start)} - ${formatTime(
                      sessionWithTime.end
                    )}`
                  : formatTime(time); // Fallback if no start-end pair

                return (
                  <tr key={time} className="border-t bg-white">
                    {/* Time column on the left */}
                    <td className="border border-black w-[200px] text-center my-auto px-5 font-semibold">
                      {displayTime}
                    </td>

                    {/* Loop through each day to create session cells */}
                    {days.map((day) => {
                      const session = schedule[day]?.[time]; // Get session for current day and time
                      const isFull =
                        session?.participant.length ===
                        session?.participantLimit; // Check if the session is full
                      const bgColor = isFull ? "bg-red-200/50" : ""; // Light red background if full
                      const bgSuperColor = isFull
                        ? "bg-red-500/50" // Darker red if full
                        : "bg-gray-300"; // Default gray background

                      return (
                        <td
                          key={`${time}-${day}`}
                          className={`border border-black ${bgColor}`} // Main session cell
                        >
                          {/* If a session exists for this time and day */}
                          {session ? (
                            <div>
                              {/* Session limit section with icon */}
                              <div
                                className={`text-center ${bgSuperColor} flex justify-center items-center gap-5 py-1`}
                              >
                                <p className="font-semibold">Limit:</p>
                                <p className="w-[20px]">
                                  {session.participantLimit}
                                </p>
                                <FaUserCheck />
                              </div>

                              {/* Participants section */}
                              <div className="flex justify-center gap-2">
                                {/* If participants exist */}
                                {session.participant.length > 0 ? (
                                  session.participant.map(
                                    (participant, index) => {
                                      const userName = getUserNameByEmail(
                                        participant.bookerEmail
                                      ); // Get name from email

                                      return (
                                        <span
                                          key={index}
                                          className={`inline-block text-sm px-3 py-1 my-2 rounded-full shadow-md transition duration-200 ${
                                            participant.paid
                                              ? "bg-blue-600 text-white" // Paid = Blue
                                              : "bg-red-600 text-white" // Unpaid = Red
                                          }`}
                                          style={{ fontSize: "0.875rem" }}
                                        >
                                          {userName}
                                        </span>
                                      );
                                    }
                                  )
                                ) : (
                                  // No participants fallback
                                  <span className="text-gray-400 italic my-3">
                                    No participants yet
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            // Fallback for no session
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

        {/* Mobile Card View for extra small screens */}
        <div className="sm:hidden p-5 text-black">
          {/* Loop through sorted time slots */}
          {sortedTimes.map((time) => {
            // Find first session for this time across days (used for displayTime)
            let sessionWithTime = null;
            for (const day of days) {
              if (schedule[day]?.[time]) {
                sessionWithTime = schedule[day][time];
                break;
              }
            }

            // Format time range or fallback to base time
            const displayTime = sessionWithTime?.start
              ? `${formatTime(sessionWithTime.start)} - ${formatTime(
                  sessionWithTime.end
                )}`
              : formatTime(time);

            return (
              // Card container for each time slot
              <div
                key={time}
                className="bg-white border border-gray-600 rounded-lg mb-4 p-4 shadow-sm"
              >
                {/* Time display as header */}
                <h3 className="text-lg font-bold text-center mb-3">
                  {displayTime}
                </h3>

                {/* Loop through each day to display session */}
                {days.map((day) => {
                  const session = schedule[day]?.[time]; // Get session for current day & time
                  const isFull =
                    session?.participant.length === session?.participantLimit; // Full check
                  const bgColor = isFull ? "bg-red-200/50" : ""; // Light red for full sessions
                  const bgSuperColor = isFull ? "bg-red-500/50" : "bg-gray-300"; // Header background

                  return (
                    // Each day's session block
                    <div
                      key={`${time}-${day}`}
                      className={`border border-black rounded mb-3 p-2 ${bgColor}`}
                    >
                      {/* Day title */}
                      <h4 className="font-semibold text-center mb-2">{day}</h4>

                      {session ? (
                        <>
                          {/* Limit info section with icon */}
                          <div
                            className={`text-center ${bgSuperColor} flex justify-center items-center gap-5 py-1 mb-2`}
                          >
                            <p className="font-semibold">Limit:</p>
                            <p className="w-[20px]">
                              {session.participantLimit}
                            </p>
                            <FaUserCheck />
                          </div>

                          {/* Participants list */}
                          <div className="flex flex-wrap justify-center gap-2">
                            {session.participant.length > 0 ? (
                              session.participant.map((participant, index) => {
                                const userName = getUserNameByEmail(
                                  participant.bookerEmail
                                ); // Get name by email
                                return (
                                  <span
                                    key={index}
                                    className={`inline-block text-sm px-3 py-1 rounded-full shadow-md transition duration-200 ${
                                      participant.paid
                                        ? "bg-blue-600 text-white" // Paid = blue
                                        : "bg-red-600 text-white" // Unpaid = red
                                    }`}
                                    style={{ fontSize: "0.875rem" }}
                                  >
                                    {userName}
                                  </span>
                                );
                              })
                            ) : (
                              // No participants fallback
                              <span className="text-gray-400 italic">
                                No participants yet
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        // No session fallback
                        <p className="text-gray-400 italic text-center">—</p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reserved Not Paid and Accepted Sessions */}
      <TrainerScheduleParticipantReserved
        TrainerBookingRequestData={TrainerBookingRequestData}
        refetch={refetch}
      />

      {/* Accepted Paid and Accepted Session */}
      <TrainerScheduleParticipantAccepted
        TrainerBookingAcceptedData={TrainerBookingAcceptedData}
      />
    </div>
  );
};

export default TrainerScheduleParticipant;
