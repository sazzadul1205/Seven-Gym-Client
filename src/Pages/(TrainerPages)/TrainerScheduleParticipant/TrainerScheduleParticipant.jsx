/* eslint-disable react/prop-types */
import React from "react";
import { FaUserCheck } from "react-icons/fa";

// Format time "HH:mm" -> "h:mm AM/PM"
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hour, minute] = timeStr.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

const TrainerScheduleParticipant = ({ TrainerProfileScheduleData }) => {
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
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen p-4">
      {/* Title */}
      <h3 className="text-center font-semibold text-black text-lg py-4">
        Participant Control & Information
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-black mx-auto w-1/2 mb-6" />

      {/* Schedule Table */}
      <div className="overflow-x-auto text-black">
        <table className="min-w-full table-auto border border-gray-600 text-sm text-left">
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

              const displayTime = sessionWithTime?.start
                ? `${formatTime(sessionWithTime.start)} - ${formatTime(
                    sessionWithTime.end
                  )}`
                : formatTime(time);

              return (
                <tr key={time} className="border-t bg-white">
                  <td className="border border-black w-[200px] text-center my-auto px-5 font-semibold">
                    {displayTime}
                  </td>
                  {days.map((day) => {
                    const session = schedule[day]?.[time];
                    return (
                      <td
                        key={`${time}-${day}`}
                        className="border border-black"
                      >
                        {session ? (
                          <div className="" >
                            {/* Limit Info */}
                            <div className="text-center bg-gray-200 flex justify-center items-center gap-5 py-1">
                              <p className="font-semibold" >Limit:</p>
                              <p className="w-[20px]" >{session.participantLimit}</p>
                              <FaUserCheck />
                            </div>

                            {/* User */}
                            <div className="min-h-5">

                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
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
    </div>
  );
};

export default TrainerScheduleParticipant;
