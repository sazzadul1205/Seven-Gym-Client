import { useState } from "react";

// Import icons
import { FiRefreshCcw } from "react-icons/fi";
import { FaRegClock, FaRegTrashAlt } from "react-icons/fa";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Modal
import TodaysScheduleAddModal from "../../../UserSchedulePlanner/TodaysSchedule/TodaysScheduleAddModal/TodaysScheduleAddModal";

// Function to format time strings
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

// Function to determine if a day is passed, today, or future
const getDayStatus = (dayDate) => {
  const today = new Date(); // Current date
  // Convert provided date (assumed format "DD-MM-YYYY") to a Date object
  const providedDate = new Date(dayDate.split("-").reverse().join("-"));
  const isToday = today.toDateString() === providedDate.toDateString();
  const isPast = providedDate < today && !isToday;
  if (isPast) {
    return "passed";
  }
  if (isToday) {
    return "today";
  }
  return "future";
};

const ScheduleSettings = ({ UserScheduleData, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State: expanded days, selected schedule IDs, and selectedID for modal
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [selectedSchedules, setSelectedSchedules] = useState(new Set());
  const [selectedID, setSelectedID] = useState(null);

  // Toggle individual schedule checkbox selection
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

  // Toggle day checkbox to select/deselect all schedules for that day
  const handleDayCheckboxChange = (dayData) => (e) => {
    const checked = e.target.checked;
    setSelectedSchedules((prev) => {
      const newSelection = new Set(prev);
      // Loop through each schedule in the day and update selection
      Object.keys(dayData.schedule).forEach((time) => {
        const schedule = dayData.schedule[time];
        if (checked) {
          newSelection.add(schedule.id);
        } else {
          newSelection.delete(schedule.id);
        }
      });
      return newSelection;
    });
  };

  // Toggle collapse/expand for a day panel (disabled if day is passed)
  const toggleCollapse = (day, dayStatus) => {
    if (dayStatus === "passed") return; // Do nothing if the day has passed
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

  // Handle All Schedule regeneration for available date
  const handleGenerateAllPassedSchedules = async () => {
    const passedDays = Object.values(UserScheduleData).filter(
      ({ date }) => getDayStatus(date) === "passed"
    );

    for (const { dayName, schedule } of passedDays) {
      await handleRegenerateClick(dayName, schedule);
    }
  };

  // Handle schedule regeneration for a day
  const handleRegenerateClick = async (dayName, scheduleData) => {
    // Calculate next occurrence of the day
    const getNextOccurrence = (day) => {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const today = new Date();
      const todayIndex = today.getDay();
      const targetIndex = daysOfWeek.indexOf(day);

      // Calculate Days to Add
      let daysToAdd = (targetIndex - todayIndex + 7) % 7;
      if (daysToAdd === 0) daysToAdd = 7; // Move to next week if same day

      const nextDate = new Date();
      nextDate.setDate(today.getDate() + daysToAdd);

      // Convert date to DD-MM-YYYY format
      const formattedDate = nextDate
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");
      return {
        nextDayName: daysOfWeek[nextDate.getDay()],
        nextDate: formattedDate,
      };
    };

    // Get the next occurrence details
    const { nextDayName, nextDate } = getNextOccurrence(dayName);

    const updatedScheduleID = `${nextDayName}-${nextDate
      .split(" ")
      .reverse()
      .join("-")}`;

    // Build a new empty schedule for the day
    const updatedScheduleData = {};
    Object.keys(scheduleData).forEach((time) => {
      updatedScheduleData[time] = {
        id: `schedule-${updatedScheduleID}-${time}`,
        title: "",
        notes: "",
        location: "",
        status: "",
      };
    });

    const formattedDate = nextDate.split(" ").join("-");

    // New regenerated schedule object
    const regeneratedSchedule = {
      id: updatedScheduleID,
      dayName: nextDayName,
      date: formattedDate,
      schedule: updatedScheduleData,
    };

    try {
      // API call to update the schedule on the server
      await axiosPublic.put("/User_Schedule/RegenerateNewDaySchedule", {
        email: user.email,
        dayName: nextDayName,
        scheduleData: regeneratedSchedule,
      });

      // Success alert
      Swal.fire({
        title: "Success!",
        text: "Schedule has been updated successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch(); // Refresh schedule data
    } catch (error) {
      console.error("Error updating schedule:", error);
      // Error alert
      Swal.fire({
        title: "Error!",
        text: "There was an issue updating the schedule. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (!user?.email || selectedSchedules.size === 0) return;

    // Show confirmation alert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover these schedules!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (!result.isConfirmed) return; // Stop if user cancels

    try {
      await axiosPublic.put("/User_Schedule/DeleteSchedules", {
        email: user.email,
        scheduleIDs: Array.from(selectedSchedules),
      });

      // Show success alert
      Swal.fire({
        title: "Deleted!",
        text: "The selected schedules have been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setSelectedSchedules(new Set()); // Clear selection
      refetch(); // Refresh schedule data
    } catch (error) {
      console.error("Error deleting schedules:", error);
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to delete schedules. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <div>
      {/* Top Part: Title and Control Buttons */}
      <div className="bg-gray-400/50 p-3">
        {/* Title */}
        <h3 className="text-xl font-semibold text-black py-1">
          Schedule for the Whole Week
        </h3>

        {/* Divider */}
        <div className="bg-white p-[2px] w-1/2"></div>

        {/* Button */}
        <div className="flex justify-between items-center pt-2">
          {/* Delete Button */}
          <button
            disabled={selectedSchedules.size === 0}
            onClick={handleDeleteSelected}
            className={`flex items-center rounded-lg text-xl font-semibold gap-3 px-8 py-3 ${
              selectedSchedules.size === 0
                ? "bg-red-300 opacity-50 cursor-not-allowed"
                : "bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 cursor-pointer"
            }`}
          >
            Delete <FaRegTrashAlt />
            <span className="ml-2 text-white">({selectedSchedules.size})</span>
          </button>

          {/* Regenerate Button */}
          <div>
            <button
              className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-600 rounded-lg text-xl font-bold gap-3 px-5 py-3 cursor-pointer"
              onClick={handleGenerateAllPassedSchedules}
              data-tooltip-id="ReGenerateToolTip"
            >
              <FiRefreshCcw />
            </button>
            <Tooltip
              id="ReGenerateToolTip"
              place="top"
              content="Generate All 'Passed' Schedules"
            />
          </div>

          {/* Time Change Button */}
          <div>
            <button
              className="flex items-center bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 rounded-lg text-xl font-bold gap-3 px-5 py-3 cursor-pointer"
              data-tooltip-id="manageTimeToolTip"
            >
              <FaRegClock />
            </button>
            <Tooltip id="manageTimeToolTip" place="top" content="Time Change" />
          </div>
        </div>
      </div>

      {/* Week Schedule Accordion */}
      <div className="bg-gray-400/50 p-3 mt-4">
        {/* Title */}
        <h3 className="text-black font-semibold text-lg pb-3">
          Schedule for this Week
        </h3>

        {/* Schedule */}
        <div className="space-y-4">
          {Object.keys(UserScheduleData).map((day) => {
            // Use dayData.date for day status
            const dayData = UserScheduleData[day];
            const dayStatus = getDayStatus(dayData.date);
            const isExpanded = expandedDays.has(day);

            // Get all schedule IDs for the day and check if all are selected
            const dayScheduleIds = Object.keys(dayData.schedule).map(
              (time) => dayData.schedule[time].id
            );
            const allSelected =
              dayScheduleIds.length > 0 &&
              dayScheduleIds.every((id) => selectedSchedules.has(id));

            return (
              <div
                key={day}
                className="bg-gray-100 border border-gray-300 rounded-lg"
              >
                {/* Day Header */}
                <div
                  className="font-semibold text-black flex items-center gap-3 p-3 cursor-pointer"
                  onClick={() => toggleCollapse(day, dayStatus)}
                >
                  {/* Day Checkbox: disabled & grayed if the day has passed */}
                  <input
                    type="checkbox"
                    className="checkbox checkbox-error border-black"
                    checked={allSelected}
                    onChange={handleDayCheckboxChange(dayData)}
                    onClick={(e) => e.stopPropagation()} // Prevent collapse toggle
                    disabled={dayStatus === "passed"}
                  />
                  {/* Day Information */}
                  <div
                    className={`flex items-center gap-5 border-l-2 pl-2 ${
                      dayStatus === "passed"
                        ? "border-gray-400 text-gray-400"
                        : "border-black text-black"
                    }`}
                  >
                    <p className="w-[80px]">{dayData.dayName}</p>
                    <p>[ {dayData.date} ]</p>
                  </div>
                  {/* Regenerate option for passed day */}
                  {dayStatus === "passed" && (
                    <div className="flex items-center gap-4 ml-7">
                      <p className="text-red-500 font-semibold">
                        Day has passed. Generate new day.
                      </p>

                      {/* Generate Button */}
                      <CommonButton
                        text="Generate"
                        bgColor="red"
                        py="py-2"
                        clickEvent={() =>
                          handleRegenerateClick(
                            dayData.dayName,
                            dayData.schedule
                          )
                        }
                      />
                      <p className="text-red-500 font-semibold">
                        {/* for [{updated date}] */}
                      </p>
                    </div>
                  )}
                </div>

                {/* Collapse Content: Schedule Items */}
                <div
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden  ${
                    dayStatus === "passed"
                      ? "max-h-0 opacity-0" // Force closed if passed
                      : isExpanded
                      ? "min-h-screen  opacity-100"
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
                            // Schedule item: light red background if selected; white otherwise
                            className={`flex justify-between items-center p-3 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md ${
                              selectedSchedules.has(schedule.id)
                                ? "bg-red-100"
                                : "bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Schedule Checkbox */}
                              <input
                                type="checkbox"
                                className="checkbox checkbox-error border-black"
                                checked={selectedSchedules.has(schedule.id)}
                                onChange={() =>
                                  handleScheduleCheckboxChange(schedule.id)
                                }
                                onClick={(e) => e.stopPropagation()} // Prevent collapse toggle
                              />
                              {/* Time Range */}
                              <div className="flex justify-between font-semibold text-black gap-5 w-[220px] border-l-2 border-gray-500 pl-5">
                                <p>{originalTime}</p>
                                <p>-</p>
                                <p>{updatedTime}</p>
                              </div>
                              {/* Schedule Details */}
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
                                  <div className="flex justify-between items-center text-black text-sm">
                                    <p className="mr-5">
                                      Nothing scheduled yet
                                    </p>
                                    <CommonButton
                                      text="Add Schedule"
                                      py="py-2"
                                      px="px-10"
                                      bgColor="green"
                                      clickEvent={() => {
                                        setSelectedID(schedule.id);
                                        // Open the dialog modal
                                        document
                                          .getElementById(
                                            "Todays_Schedule_Add_Modal"
                                          )
                                          .showModal();
                                      }}
                                    />
                                  </div>
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

      <dialog id="Todays_Schedule_Add_Modal" className="modal">
        <TodaysScheduleAddModal selectedID={selectedID} refetch={refetch} />
      </dialog>
    </div>
  );
};

ScheduleSettings.propTypes = {
  UserScheduleData: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ScheduleSettings;
