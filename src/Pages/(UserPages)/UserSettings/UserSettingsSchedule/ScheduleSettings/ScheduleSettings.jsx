/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaRegClock, FaRegTrashAlt } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const formatTime = (timeString) => {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0);

  const originalTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  date.setMinutes(date.getMinutes() + 59);

  const updatedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { originalTime, updatedTime };
};

const ScheduleSettings = ({ UserScheduleData, refetch }) => {
  // State Management
  const [selectedSchedules, setSelectedSchedules] = useState(new Set());
  const [expandedDays, setExpandedDays] = useState(new Set());

  const handleScheduleCheckboxChange = (scheduleId) => {
    setSelectedSchedules((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(scheduleId)) {
        newSelection.delete(scheduleId);
      } else {
        newSelection.add(scheduleId);
      }
      return newSelection;
    });
  };

  const toggleCollapse = (day) => {
    setExpandedDays((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(day)) {
        newExpanded.delete(day);
      } else {
        newExpanded.add(day);
      }
      return newExpanded;
    });
  };

  console.log(selectedSchedules);

  return (
    <div>
      {/* Top part */}
      <div className="bg-gray-400/50 p-3">
        <h3 className="text-xl font-semibold text-black py-1">
          Schedule for the Whole Week
        </h3>
        <div className="bg-white p-[2px] w-1/2"></div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-2">
          <button className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 rounded-lg text-xl font-semibold gap-3 px-8 py-3 cursor-pointer">
            Delete <FaRegTrashAlt />
          </button>

          <button
            className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-600 rounded-lg text-xl font-bold gap-3 px-5 py-3 cursor-pointer"
            data-tooltip-id="ReGenerateToolTip"
          >
            <FiRefreshCcw />
          </button>
          <Tooltip
            id="ReGenerateToolTip"
            place="top"
            content="Generate All 'Passed' Schedules"
          />

          <button
            className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 rounded-lg text-xl font-bold gap-3 px-5 py-3 cursor-pointer"
            data-tooltip-id="manageTimeToolTip"
          >
            <FaRegClock />
          </button>
          <Tooltip id="manageTimeToolTip" place="top" content="Time Change" />
        </div>
      </div>

      {/* List of days as accordion items */}
      {/* Week Schedule */}
      <div className="bg-gray-400/50 p-3 mt-4">
        <h3 className="text-black font-semibold text-lg pb-3">
          Schedule for this Week
        </h3>
        <div className="space-y-4">
          {Object.keys(UserScheduleData).map((day) => {
            const dayData = UserScheduleData[day];
            const isExpanded = expandedDays.has(day);

            return (
              <div
                key={day}
                className="bg-gray-100 border border-gray-300 rounded-lg"
              >
                {/* Header */}
                <div
                  className="font-semibold text-black flex items-center gap-3 p-3 cursor-pointer"
                  onClick={() => toggleCollapse(day)}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    className="checkbox checkbox-error border-black"
                    onClick={(e) => e.stopPropagation()} // Prevent toggling collapse
                  />

                  {/* Date and Day */}
                  <div className="flex items-center gap-5 border-l-2 border-black pl-2">
                    <p className="w-[80px]">{dayData.dayName}</p>
                    <p>[ {dayData.date} ]</p>
                  </div>
                </div>

                {/* Collapse Content with Smooth Animation */}
                <div
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-3">
                    <div className="space-y-4">
                      {Object.keys(dayData.schedule).map((time) => {
                        const schedule = dayData.schedule[time];
                        const { originalTime, updatedTime } = formatTime(time);
                        return (
                          <div
                            key={schedule.id}
                            className="flex justify-between items-center p-3 bg-white border border-gray-300 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              {/* Checkbox */}
                              <input
                                type="checkbox"
                                className="checkbox checkbox-error border-black"
                                checked={selectedSchedules.has(schedule.id)}
                                onChange={() =>
                                  handleScheduleCheckboxChange(schedule.id)
                                }
                                onClick={(e) => e.stopPropagation()} // Prevent unwanted collapse toggling
                              />

                              {/* From and To Time */}
                              <div className="flex justify-between font-semibold text-black gap-5 w-[220px] border-l-2 border-gray-500 pl-5">
                                <p>{originalTime}</p>
                                <p>-</p>
                                <p>{updatedTime}</p>
                              </div>

                              {/* Schedule Information */}
                              <div className="border-l-2 border-gray-500 pl-5">
                                {schedule.title ? (
                                  <div className="text-xs text-gray-600 mt-1">
                                    <p>
                                      <strong>Title:</strong> {schedule.title}
                                    </p>
                                    {schedule.notes && (
                                      <p>
                                        <strong>Notes:</strong> {schedule.notes}
                                      </p>
                                    )}
                                    {schedule.location && (
                                      <p>
                                        <strong>Location:</strong>{" "}
                                        {schedule.location}
                                      </p>
                                    )}
                                    {schedule.status && (
                                      <p>
                                        <strong>Status:</strong>{" "}
                                        {schedule.status}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    Nothing scheduled yet
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSettings;
