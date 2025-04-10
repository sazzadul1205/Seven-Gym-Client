/* eslint-disable react/prop-types */

import { FaUserCheck } from "react-icons/fa";
import TrainerBookingRequestUserBasicInfo from "../TrainerBookingRequest/TrainerBookingRequestUserBasicInfo/TrainerBookingRequestUserBasicInfo";

// Format time "HH:mm" -> "h:mm AM/PM"
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hour, minute] = timeStr.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

// Parse custom date string (Format: "06-04-2025T11:12")
const parseCustomDate = (input) => {
  if (!input) return null;
  const [datePart, timePart] = input.split("T");
  const [day, month, year] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
};

// Formats date to "06 Apr 2025, 11:12 AM"
const formatDate = (input) => {
  const dateObj = parseCustomDate(input);
  if (!dateObj) return "";

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return dateObj.toLocaleString("en-US", options);
};

const TrainerScheduleParticipant = ({
  TrainerProfileScheduleData,
  TrainerBookingRequestData,
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

  const acceptedBookings = TrainerBookingRequestData?.filter(
    (booking) => booking.status === "Accepted"
  );

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

                  {/*  */}
                  {days.map((day) => {
                    const session = schedule[day]?.[time];
                    return (
                      <td
                        key={`${time}-${day}`}
                        className="border border-black"
                      >
                        {session ? (
                          <div className="">
                            {/* Limit Info */}
                            <div className="text-center bg-gray-200 flex justify-center items-center gap-5 py-1">
                              <p className="font-semibold">Limit:</p>
                              <p className="w-[20px]">
                                {session.participantLimit}
                              </p>
                              <FaUserCheck />
                            </div>

                            {/* User */}
                            <div className="min-h-5"></div>
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

      {/* Reserved Not Paid Sessions */}
      <div className="px-5">
        <p className="text-xl font-semibold text-black border-b-2 border-gray-700 pb-2">
          Reserved Class Participant
        </p>

        <table className="min-w-full bg-white text-black">
          <thead className="bg-gray-800 text-white text-sm uppercase">
            <tr>
              {[
                "Booker",
                "Booked At",
                "Total Price",
                "Duration",
                "Status",
                "Accepted At",
                "Booker Code",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 border-b border-gray-600 text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {acceptedBookings?.map((booking) => (
              <tr
                key={booking._id}
                className="transition-colors duration-200 hover:bg-gray-100 border-b border-gray-500"
              >
                {/* Booker Info */}
                <td className="px-4 py-3 font-medium">
                  <TrainerBookingRequestUserBasicInfo
                    email={booking.bookerEmail}
                  />
                </td>

                {/* Booked At */}
                <td className="px-4 py-3">{formatDate(booking.bookedAt)}</td>
                <td className="px-4 py-3">$ {booking.totalPrice}</td>
                <td className="px-4 py-3">{booking.durationWeeks} Weeks</td>
                <td className="px-4 py-3 font-bold capitalize">
                  {booking.paid ? "Paid" : "Not Paid"}
                </td>
                <td className="px-4 py-3">{formatDate(booking.acceptedAt)}</td>
                <td className="px-4 py-3">P2234</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainerScheduleParticipant;
