import { useState } from "react";
import {
  FaFileExport,
  FaFileImport,
  FaRegStickyNote,
  FaRegTrashAlt,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";

// eslint-disable-next-line react/prop-types
const DailyScheduleSection = ({ MySchedule }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [selectedEvents, setSelectedEvents] = useState(new Set());
  const [openSections, setOpenSections] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  if (!MySchedule) return <div>No Schedule Available</div>;

  const today = new Date().toISOString().split("T")[0];

  const getDayStatus = (dayDate) => {
    const dateWithoutTime = dayDate.split("T")[0];
    if (dateWithoutTime < today) return "passed";
    if (dateWithoutTime === today) return "today";
    return "future";
  };

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

  const hasPassedDates = Object.values(MySchedule).some(
    ({ date }) => getDayStatus(date) === "passed"
  );

  const handleGeneratePassedSchedules = ({ id }) => {
    console.log("Generating new schedules for all passed dates...");
    // Logic to regenerate schedules for past dates
    console.log(id);
  };

  const handleDeleteSelected = () => {
    console.log("Deleting selected events:", Array.from(selectedEvents));
    // Implement logic to delete selected events from the schedule
  };

  const handleExportSelected = () => {
    if (selectedEvents.size === 0) {
      alert("No events selected to export!");
      return;
    }
    const selectedData = Object.values(MySchedule).flatMap(({ schedule }) =>
      Object.values(schedule).filter((event) => selectedEvents.has(event.id))
    );
    const json = JSON.stringify(selectedData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "selected_events.json";
    link.click();
  };

  const handleImportSchedule = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        console.log("Imported Schedule:", importedData);
        // Implement logic to merge or replace schedule with importedData
      } catch (error) {
        alert("Invalid JSON file!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-gray-100 shadow-md mx-2 p-4">
      {/* Top Section */}
      <div className="bg-gray-300 border border-gray-300 px-4 py-4 rounded-md">
        <p className="text-xl font-semibold border-b-2 border-black pb-2">
          The Whole Week Schedule
        </p>
        <p className="mt-2 font-semibold text-gray-600">
          Selected Events: {Array.from(selectedEvents).length}
        </p>

        <div className="flex justify-between items-center gap-4 pt-2">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            {/* Select All Checkbox */}
            <div className="flex items-center gap-2 border-r-2 border-black pr-4">
              <input
                type="checkbox"
                className="checkbox-sm cursor-pointer"
                onChange={handleSelectAll}
                checked={isAllSelected}
                aria-label="Select all events"
              />
              <label>Select All</label>
            </div>

            {/* Delete Selected Events Button */}
            <button
              className={`text-lg text-white px-4 py-2 rounded-lg ${
                selectedEvents.size > 0
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-red-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={selectedEvents.size === 0}
              onClick={handleDeleteSelected}
              data-tooltip-id="deleteTooltip"
            >
              <FaRegTrashAlt />
            </button>
            <Tooltip
              id="deleteTooltip"
              place="top"
              content="Delete Selected Events"
            />
          </div>

          {/* Generate All Passed Dates Button */}
          <button
            className={`text-sm px-4 py-2 rounded-lg ${
              hasPassedDates
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!hasPassedDates}
            onClick={handleGeneratePassedSchedules}
          >
            Generate Passed Schedules
          </button>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Export Selected Events Button */}
            <button
              className="text-lg px-4 py-2 border border-red-500 hover:border-red-600 bg-red-300 hover:bg-red-400 text-white rounded-xl hover:shadow-xl"
              onClick={handleExportSelected}
              data-tooltip-id="exportTooltip"
            >
              <FaFileExport />
            </button>
            <Tooltip
              id="exportTooltip"
              place="top"
              content="Export Selected Events"
            />

            {/* Import Schedule from JSON */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportSchedule}
              />
              <button
                className="text-lg px-4 py-2 border border-green-500 hover:border-green-600 bg-green-300 hover:bg-green-400 text-white rounded-xl hover:shadow-xl"
                data-tooltip-id="importTooltip"
              >
                <FaFileImport />
              </button>
            </label>
            <Tooltip id="importTooltip" place="top" content="Import Schedule" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div>
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
                        <button
                          className="text-sm text-white bg-gradient-to-br hover:bg-gradient-to-tl from-red-400 to-red-500 rounded-lg px-5 py-2 pointer-events-auto"
                          onClick={handleGeneratePassedSchedules(id)}
                        >
                          Generate
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    dayStatus === "passed" ? "hidden" : ""
                  } ${
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
                          aria-label={`Select event ${
                            event.title || "No Title"
                          }`}
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
    </div>
  );
};

export default DailyScheduleSection;
