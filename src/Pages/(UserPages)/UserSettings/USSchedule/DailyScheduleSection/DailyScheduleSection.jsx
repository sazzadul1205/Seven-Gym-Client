import React, { useState } from "react";
import { FaRegStickyNote } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const DailyScheduleSection = ({ MySchedule }) => {
  if (!MySchedule) return <div>No Schedule Available</div>;

  const today = new Date().toISOString().split("T")[0];

  const getDayStatus = (dayDate) => {
    const dateWithoutTime = dayDate.split("T")[0];
    if (dateWithoutTime < today) return "passed";
    if (dateWithoutTime === today) return "today";
    return "future";
  };

  const [selectedEvents, setSelectedEvents] = useState(new Set());
  const [openSections, setOpenSections] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const toggleSection = (dayId) => {
    setOpenSections((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  // Select or Deselect all events in a day
  const handleDayCheckboxChange = (schedule) => {
    const scheduleIds = Object.values(schedule).map((event) => event.id);
    const allSelected = scheduleIds.every((id) => selectedEvents.has(id));

    setSelectedEvents((prev) => {
      const newSelection = new Set(prev);
      if (allSelected) {
        scheduleIds.forEach((id) => newSelection.delete(id));
      } else {
        scheduleIds.forEach((id) => newSelection.add(id));
      }
      return newSelection;
    });
  };

  // Select or Deselect an individual event
  const handleEventCheckboxChange = (eventId) => {
    setSelectedEvents((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(eventId)) {
        newSelection.delete(eventId);
      } else {
        newSelection.add(eventId);
      }
      return newSelection;
    });
  };

  // Select or Deselect all events in the entire schedule
  const handleSelectAll = () => {
    if (selectAll) {
      // If already selected all, deselect all
      setSelectedEvents(new Set());
    } else {
      // Otherwise, select every event
      const allEventIds = new Set();
      Object.values(MySchedule).forEach(({ schedule }) => {
        Object.values(schedule).forEach((event) => allEventIds.add(event.id));
      });
      setSelectedEvents(allEventIds);
    }
    setSelectAll(!selectAll);
  };

  // Check if all events are selected globally
  const allEvents = Object.values(MySchedule).flatMap(({ schedule }) =>
    Object.values(schedule).map((event) => event.id)
  );
  const isAllSelected =
    allEvents.length > 0 && allEvents.every((id) => selectedEvents.has(id));

  // Weekday sorting order
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Sort schedule based on weekday order
  const sortedSchedule = Object.keys(MySchedule)
    .map((key) => MySchedule[key])
    .sort((a, b) => weekDays.indexOf(a.dayName) - weekDays.indexOf(b.dayName));

  return (
    <div className="bg-gray-100 shadow-md mx-2 p-4">
      <div className="bg-gray-300 border border-gray-300 px-2 py-2 rounded-md">
        <p className="text-xl font-semibold border-b-2 border-black pb-2">
          The Whole Week Schedule
        </p>
        <p className="mt-2 font-semibold text-gray-600">
          Selected Events: {Array.from(selectedEvents).length}
        </p>
        <div className="flex pt-2">
          {/* Select All Checkbox */}
          <div className="flex items-center gap-2 border-r-2 border-black pr-2">
            <input
              type="checkbox"
              className="checkbox-sm cursor-pointer"
              onChange={handleSelectAll}
              checked={isAllSelected}
              aria-label="Select all events"
            />
            <label>Select All</label>
          </div>

          {/* Generate all passed date schedule */}
        </div>
      </div>

      {sortedSchedule.map(({ id, date, dayName, schedule }) => {
        const dayStatus = getDayStatus(date);
        const isOpen = openSections[id];

        // Check if all events in this day are selected
        const scheduleIds = Object.values(schedule).map((event) => event.id);
        const allSelected = scheduleIds.every((eventId) =>
          selectedEvents.has(eventId)
        );

        return (
          <div key={id} className="mb-4 mt-2">
            <div
              className={`border rounded-lg overflow-hidden transition-all duration-300  ${
                dayStatus === "passed"
                  ? "bg:opacity-50 pointer-events-none"
                  : dayStatus === "today"
                  ? "bg-yellow-100 border-yellow-500 shadow-lg"
                  : "bg-base-200"
              }`}
            >
              <div
                className="flex items-center text-lg font-bold p-3 cursor-pointer"
                onClick={() => toggleSection(id)}
              >
                <div className="mr-2 border-r border-gray-500 pr-5 pt-2">
                  {/* Checkbox for selecting all events in this day */}
                  <input
                    type="checkbox"
                    className="checkbox-md cursor-pointer"
                    onClick={(e) => e.stopPropagation()} // Prevents toggle when clicking checkbox
                    onChange={() => handleDayCheckboxChange(schedule)}
                    checked={allSelected}
                    aria-label={`Select all events for ${dayName}`}
                  />
                </div>

                <div
                  className={`flex ${
                    dayStatus === "passed"
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  <p className={`w-28`}>{dayName}</p>
                  <p>-</p>
                  <p className={`w-36 text-right`}>{date}</p>
                </div>

                <div>
                  {dayStatus === "passed" && (
                    <div className="flex items-center gap-4 ml-7">
                      <p className="text-red-500 font-semibold">
                        Day has passed. Generate new day.
                      </p>
                      <button className="text-sm text-white bg-gradient-to-br hover:bg-gradient-to-tl from-red-400 to-red-500 rounded-lg px-5 py-2">
                        Generate
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-3 space-y-2">
                  {Object.entries(schedule).map(([time, event]) => (
                    <div key={event.id} className="flex gap-5 p-3 border-b">
                      {/* Checkbox for selecting individual events */}
                      <input
                        type="checkbox"
                        className="checkbox-md cursor-pointer"
                        onChange={() => handleEventCheckboxChange(event.id)}
                        checked={selectedEvents.has(event.id)}
                        aria-label={`Select event ${event.title || "No Title"}`}
                      />

                      <p className="font-semibold flex gap-4 w-1/4">
                        {time} - {event.title || "No Title"}
                      </p>

                      {event.notes && (
                        <p className="font-medium flex gap-4 w-1/4">
                          <FaRegStickyNote className="text-yellow-500 font-bold text-xl" />
                          {event.notes}
                        </p>
                      )}

                      {event.location && (
                        <p className="font-medium flex gap-4 w-1/4">
                          <FaLocationDot className="text-red-500 font-bold text-xl" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  ))}
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
