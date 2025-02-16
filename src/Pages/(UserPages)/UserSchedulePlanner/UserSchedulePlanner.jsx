import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import TodaysSchedule from "./TodaysSchedule/TodaysSchedule";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loading from "../../../Shared/Loading/Loading";
import TodaysNotes from "./TodaysNotes/TodaysNotes";
import NoDefault from "./NoDefault/NoDefault";

const UserSchedulePlanner = () => {
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();

  // Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetching Schedule Data
  const {
    data: schedulesData,
    isLoading: scheduleDataIsLoading,
    error: scheduleDataError,
    refetch,
  } = useQuery({
    queryKey: ["ScheduleData"],
    queryFn: () => axiosPublic.get(`/Schedule`).then((res) => res.data),
  });

  // Define the full week
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Set default selected day to today
  useEffect(() => {
    const todayName = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    setSelectedDay(todayName); // Always set selectedDay
  }, []);

  if (scheduleDataIsLoading) return <Loading />;

  if (scheduleDataError || !schedulesData?.length) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Find the schedule for the provided email
  const userSchedule = schedulesData.find((sch) => sch.email === email);

  if (!userSchedule) {
    return <NoDefault refetch={refetch} />;
  }

  // Extract available schedule days from the data
  const availableDays = Object.keys(userSchedule.schedule);

  // Get selected day's schedule
  const selectedSchedule = userSchedule.schedule[selectedDay] || null;

  // Format date
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* Title */}
      <div className="text-center">
        <p className="text-3xl font-semibold py-2 underline underline-offset-4">
          DAILY SCHEDULE PLANNER
        </p>
        <p className="text-2xl font-bold text-gray-500">{formattedTime}</p>
      </div>

      {/* Week & Date Selector */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-300">
        {/* Today's Date */}
        <div className="flex gap-2 items-center md:items-start">
          <p className="text-lg font-semibold text-gray-800">Date:</p>
          <p className="text-lg text-gray-600 font-semibold underline underline-offset-4">
            {formattedDate}
          </p>
        </div>

        {/* Week Selector (All 7 days) */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {weekDays.map((day, index) => {
            const isAvailable = availableDays.includes(day);
            const isSelected = selectedDay === day;

            return (
              <p
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`rounded-full border border-black w-10 h-10 flex items-center justify-center text-lg font-medium cursor-pointer
                  ${isSelected ? "bg-blue-500 text-white font-bold" : ""}
                  ${
                    isAvailable
                      ? "hover:bg-gray-400"
                      : "opacity-50 cursor-not-allowed"
                  }`}
              >
                {day[0]}
              </p>
            );
          })}
        </div>
      </div>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto flex gap-5">
        {/* Selected Day's Schedule */}
        <div className="w-1/2">
          {selectedSchedule ? (
            <TodaysSchedule
              scheduleData={selectedSchedule.schedule}
              refetch={refetch}
            />
          ) : (
            <p className="text-center text-gray-500 text-xl">
              No schedule available for {selectedDay}.
            </p>
          )}
        </div>

        {/* Notes Section */}
        <div className="w-1/2">
          {selectedSchedule ? (
            <TodaysNotes notesData={selectedSchedule.schedule.notes} />
          ) : (
            <p className="text-center text-gray-500 text-xl">
              No notes available.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserSchedulePlanner;
