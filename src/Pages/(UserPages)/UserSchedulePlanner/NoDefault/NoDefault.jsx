/* eslint-disable react/prop-types */
import { useState } from "react";
import Swal from "sweetalert2";
import { IoIosCreate } from "react-icons/io";
import { FcHighPriority } from "react-icons/fc";
import { RiCalendarTodoLine } from "react-icons/ri";

import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const NoDefault = ({ refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // UseState
  const [endTime, setEndTime] = useState("");
  const [startTime, setStartTime] = useState("");

  const generateSchedule = async () => {
    if (!startTime || !endTime) {
      Swal.fire({
        icon: "warning",
        title: "Missing Time Selection",
        text: "Please select both start and end times.",
      });
      return;
    }

    const today = new Date();
    const currentDayIndex = today.getDay();
    const userEmail = user?.email;

    const fullWeekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Generate schedules from today until Saturday
    let daysToGenerate = fullWeekdays.slice(currentDayIndex);

    const convertTimeTo24Hour = (time) => {
      const [hours] = time.split(":").map(Number);
      return hours;
    };

    const startHour = convertTimeTo24Hour(startTime);
    const endHour = convertTimeTo24Hour(endTime);

    const generateTimeSlots = (start, end, dayId) => {
      let timeSlots = {};
      for (let hour = start; hour <= end; hour++) {
        const formattedTime = `${String(hour).padStart(2, "0")}:00`; // Ensure "08:00" format
        timeSlots[formattedTime] = {
          id: `sche-${dayId}-${formattedTime}`,
          title: "",
          notes: "",
          location: "",
          status: "",
        };
      }
      return timeSlots;
    };

    let schedule = {
      email: userEmail,
      schedule: {},
      reminder: {},
      notes: {},
      todo: {},
    };

    daysToGenerate.forEach((day, index) => {
      let currentDate = new Date();
      currentDate.setDate(today.getDate() + index); // Move forward in days

      const formattedDate = currentDate
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-"); // Format DD-MM-YYYY
      const dayId = `${day}-${formattedDate}`;

      schedule.schedule[day] = {
        id: dayId,
        dayName: day,
        date: formattedDate,
        schedule: generateTimeSlots(startHour, endHour, dayId),
      };
    });

    // console.log(schedule);
    // Posting the schedule data to your backend
    try {
      await axiosPublic.post("/Schedule", schedule);
      refetch();
      Swal.fire({
        icon: "success",
        title: "Schedule Created!",
        text: "Your schedule has been successfully saved.",
        timer: 2000,
        showConfirmButton: false,
      });

      document.getElementById("New_Schedule_Time_Picker").close();
    } catch (error) {
      console.error("Error posting schedule:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text: "There was an error saving your schedule. Please try again.",
      });
    }
  };

  // Generate time slots from 12:00 AM to 11:00 PM in 12-hour format
  const timeSlots = Array.from({ length: 24 }, (_, index) => {
    const hour = index % 12 || 12; // Convert 0 to 12 for AM format
    const period = index < 12 ? "AM" : "PM";
    return `${hour}:00 ${period}`;
  });

  // Weekday labels
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const defaultEvents = ["No Event", "No Event", "No Event"];

  return (
    <div className="bg-white min-h-screen relative">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* Title */}
      <div className="text-center">
        <p className="text-3xl font-semibold py-2 underline underline-offset-4">
          DAILY SCHEDULE PLANNER
        </p>
        <p className="text-2xl font-bold text-gray-500">03:14:33 PM</p>
      </div>

      {/* Week & Date Selector */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-300">
        {/* Today's Date */}
        <div className="flex gap-2 items-center md:items-start">
          <p className="text-lg font-semibold text-gray-800">Date:</p>
          <p className="text-lg text-gray-600 font-semibold underline underline-offset-4">
            Sunday, February 9, 2025
          </p>
        </div>

        {/* Week Selector */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {weekdays.map((day, index) => {
            return (
              <p
                key={index}
                className={`rounded-full border border-black w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-400 cursor-pointer`}
              >
                {day}
              </p>
            );
          })}
        </div>
      </div>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto flex gap-5">
        {/* Todays schedule */}
        <div className="w-1/2">
          <div className="p-4">
            {/* Title */}
            <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
              TODAY&apos;S SCHEDULE
            </p>

            {/* Schedule List */}
            <div className="pt-4 space-y-3">
              {timeSlots.map((time, index) => (
                <div key={index} className="flex items-center gap-3 w-full">
                  {/* Time Label */}
                  <p className="font-semibold text-gray-700 w-20 text-right">
                    {time}
                  </p>

                  {/* Event Placeholder (Can be dynamic) */}
                  <p className="bg-blue-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105">
                    No Event
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority, To-Do, Notes  */}
        <div className="w-1/2">
          <div className="p-4 space-y-6">
            {/* Top Priority */}
            <div className="space-y-3">
              <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
                TOP PRIORITY
              </p>

              {defaultEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 w-full">
                  <FcHighPriority className="text-3xl" />
                  <p className="bg-blue-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105 transition">
                    {event}
                  </p>
                </div>
              ))}
            </div>

            {/* To-Do List */}
            <div className="space-y-3">
              <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
                TO-DO LIST
              </p>

              {defaultEvents.map((task, index) => (
                <div key={index} className="flex items-center gap-3 w-full">
                  <RiCalendarTodoLine className="text-3xl text-green-500" />
                  <p className="bg-blue-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105 transition">
                    {task}
                  </p>
                </div>
              ))}
            </div>

            {/* Notes / Reminders */}
            <div className="space-y-3">
              <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
                NOTES / REMINDERS
              </p>

              <div className="p-4 bg-gray-200 rounded-xl shadow-md min-h-[250px] flex flex-col gap-3">
                {defaultEvents.map((note, index) => (
                  <div key={index} className="flex items-center gap-3 w-full">
                    <IoIosCreate className="text-2xl text-purple-500" />
                    <p className="bg-white text-gray-800 px-4 py-2 w-full rounded-lg shadow-md border">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
        {/* First Modal - New Schedule Question */}
        <dialog id="New_Schedule_Question" className="modal" open>
          <div className="modal-box bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="font-bold text-lg">Create Schedule</h3>
            <p className="py-4">Create a New Schedule</p>
            <button
              className="bg-gradient-to-tr from-red-400 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl py-3 px-10 transition-all duration-300"
              onClick={() => {
                document.getElementById("New_Schedule_Question").close();
                document.getElementById("New_Schedule_Time_Picker").showModal();
              }}
            >
              Create Schedule
            </button>
          </div>
        </dialog>

        {/* Second Modal - Time Picker */}
        <dialog id="New_Schedule_Time_Picker" className="modal">
          <div className="modal-box bg-white p-6 rounded-lg shadow-lg text-center">
            {/* Header */}
            <div>
              <h3 className="font-bold text-lg mb-2">Select Time Range</h3>
              <p className="text-gray-500 mb-4">
                Choose a start and end time for your schedule
              </p>
            </div>

            {/* Time Picker Inputs */}
            <div className="flex justify-center gap-4 items-center mb-6">
              {/* Start Time */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  step="3600" // Only allows selecting full hours
                  value={startTime}
                  onChange={(e) => {
                    const hour = e.target.value.split(":")[0]; // Extract only the hour
                    setStartTime(`${hour}:00`); // Force minutes to be "00"
                  }}
                  className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <span className="text-lg font-bold text-gray-600">-</span>

              {/* End Time */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  step="3600" // Only allows selecting full hours
                  value={endTime}
                  onChange={(e) => {
                    const hour = e.target.value.split(":")[0]; // Extract only the hour
                    setEndTime(`${hour}:00`); // Force minutes to be "00"
                  }}
                  className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>

            {/* Confirm Button */}
            <button
              className="bg-gradient-to-tr from-red-400 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl py-3 px-10 transition-all duration-300"
              onClick={generateSchedule}
            >
              Confirm Time
            </button>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default NoDefault;
