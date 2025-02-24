import React from "react";
import { FaRegStickyNote } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const DailyScheduleSection = ({ MySchedule }) => {
  // Check if MySchedule exists, return message if no schedule is found
  if (!MySchedule) return <div>No Schedule Available</div>;

  // Get today's date in the same format (yyyy-mm-dd)
  const today = new Date().toISOString().split("T")[0]; // Gets the date as 'yyyy-mm-dd'

  // Function to check if the day is in the past, today, or in the future
  const getDayStatus = (dayDate) => {
    if (dayDate < today) return "passed"; // The day has passed
    if (dayDate === today) return "today"; // The day is today
    return "future"; // The day is in the future
  };

  return (
    <div className="bg-gray-100 shadow-md mx-2 p-4">
      {/* Title of the section */}
      <div className="bg-gray-300 border border-gray-300 px-2 py-2 rounded-md">
        <p className="text-xl font-semibold ">The Whole Week Schedule</p>
        <div>
            
        </div>
      </div>

      {/* Loop through each day of the schedule */}
      {Object.keys(MySchedule).map((day) => {
        const dayStatus = getDayStatus(MySchedule[day].date); // Get status for each day (passed, today, or future)

        return (
          <div key={MySchedule[day].id} className="mb-4">
            {/* Collapsible section for each day */}
            <div
              className={`collapse bg-base-200 ${
                dayStatus === "passed"
                  ? "pointer-events-none bg-opacity-50"
                  : ""
              }`}
            >
              {/* Checkbox to toggle open/close */}
              <input
                type="checkbox"
                className="peer"
                disabled={dayStatus === "passed"}
              />

              {/* Title of the collapsible section (Day & Date) */}
              <div className="flex items-center collapse-title text-lg font-bold">
                <p
                  className={`w-28 ${
                    dayStatus === "passed"
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  {MySchedule[day].dayName}
                </p>
                <p>-</p>
                <p
                  className={`w-36 text-right ${
                    dayStatus === "passed"
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  {MySchedule[day].date}
                </p>

                {/* If the day is passed, show a warning and prevent opening */}
                <div className="p-0">
                  {dayStatus === "passed" && (
                    <div className="flex items-center gap-4 ml-7">
                      <p className="text-red-500 font-semibold">
                        Day has passed. Generate new day.
                      </p>
                      <button className="text-sm text-white bg-gradient-to-br hover:bg-gradient-to-tl from-red-400 to-red-500 rounded-lg pointer-events-auto px-5 py-2">
                        Generate
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible content that will display the schedule */}
              <div className="collapse-content">
                <div className="space-y-2">
                  {/* Loop through each scheduled event in the day */}
                  {Object.entries(MySchedule[day].schedule).map(
                    ([time, event]) => (
                      <div key={event.id} className="flex gap-5 p-3 border-b">
                        {/* Display time and event title */}
                        <p className="font-semibold flex gap-4 w-1/4">
                          {time} - {event.title || "No Title"}
                        </p>

                        {/* Display notes with an icon if available */}
                        {event.notes && (
                          <p className="font-medium flex gap-4 w-1/4">
                            <FaRegStickyNote className="text-yellow-500 font-bold text-xl" />
                            {event.notes}
                          </p>
                        )}

                        {/* Display location with an icon if available */}
                        {event.location && (
                          <p className="font-medium flex gap-4 w-1/4">
                            <FaLocationDot className="text-red-500 font-bold text-xl" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyScheduleSection;
