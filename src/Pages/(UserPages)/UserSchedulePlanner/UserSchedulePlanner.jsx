import { useState, useEffect } from "react";
import TodaysSchedule from "./TodaysSchedule/TodaysSchedule";
import TodaysNotes from "./TodaysNotes/TodaysNotes";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import NoDefault from "./NoDefault/NoDefault";
import { useParams } from "react-router";

const UserSchedulePlanner = () => {
  const { email } = useParams();
  const axiosPublic = useAxiosPublic();

  // Live Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetching Schedule Data
  const {
    data: schedules,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ScheduleData"],
    queryFn: () => axiosPublic.get(`/Schedule`).then((res) => res.data),
  });

  if (isLoading) return <Loading />;

  if (error || !schedules?.length) {
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
  const userSchedule = schedules.find((sch) => sch.email === email);

  // If No Schedule Matches the Email
  if (!userSchedule) {
    return <NoDefault refetch={refetch} />;
  }

  // Get today's full date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get current time as HH:MM:SS AM/PM
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Weekday labels
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

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

        {/* Week Selector */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {weekdays.map((day, index) => {
            const isPastDay = index < today.getDay();
            const isToday = index === today.getDay();

            return (
              <p
                key={index}
                className={`rounded-full border border-black w-10 h-10 flex items-center justify-center text-lg font-medium
                  ${isPastDay ? "bg-red-400 text-white" : ""}
                  ${isToday ? "bg-blue-400 text-white font-bold" : ""}
                  hover:bg-gray-400 cursor-pointer`}
              >
                {day}
              </p>
            );
          })}
        </div>
      </div>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto flex gap-5">
        {/* Today's Schedule */}
        <div className="w-1/2">
          <TodaysSchedule scheduleData={userSchedule.schedule} />
        </div>

        {/* Priority, To-Do, Notes */}
        <div className="w-1/2">
          <TodaysNotes notesData={userSchedule.schedule.notes} />
        </div>
      </main>
    </div>
  );
};

export default UserSchedulePlanner;
