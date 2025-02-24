import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import TodaysSchedule from "./TodaysSchedule/TodaysSchedule";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loading from "../../../Shared/Loading/Loading";
import NoDefault from "./NoDefault/NoDefault";
import ExtraList from "./ExtraLists/ExtraLists";
import useAuth from "../../../Hooks/useAuth";
import WrongUser from "./WrongUser/WrongUser";

const UserSchedulePlanner = () => {
  const { email } = useParams();
  const { user } = useAuth();
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
    data: mySchedulesData = [], // Default to an empty array to prevent undefined issues
    isLoading: scheduleDataIsLoading,
    error: scheduleDataError,
    refetch,
  } = useQuery({
    queryKey: ["ScheduleData"],
    queryFn: () =>
      axiosPublic.get(`/Schedule?email=${email}`).then((res) => res.data),
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
    setSelectedDay(todayName);
  }, []);

  // Check if the email from the params matches the user's email
  if (user?.email !== email) {
    return <WrongUser />;
  }

  // Ensure mySchedulesData is not empty before accessing mySchedulesData[0]
  if (scheduleDataIsLoading) return <Loading />;

  if (scheduleDataError || !mySchedulesData || mySchedulesData.length === 0) {
    return <NoDefault refetch={refetch} />;
  }

  const userSchedule = mySchedulesData[0]; // Safe access after checking

  if (!userSchedule) {
    return <NoDefault refetch={refetch} />;
  }

  // Extract available schedule days from the data
  const availableDays = Object.keys(userSchedule.schedule || {});

  // Get selected day's schedule
  const selectedSchedule = userSchedule.schedule?.[selectedDay] || null;

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
    <div className="bg-[#f6eee3] min-h-screen">
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
        <div className="flex gap-2 items-center md:items-start text-md md:text-lg">
          <p className="font-semibold text-gray-800">Date:</p>
          <p className="text-gray-600 font-semibold underline underline-offset-4">
            {formattedDate}
          </p>
        </div>

        {/* Week Selector (All 7 days) */}
        <div className="flex gap-2 mt-4 md:mt-0 flex-wrap justify-center">
          {weekDays.map((day, index) => {
            const isAvailable = availableDays.includes(day);
            const isSelected = selectedDay === day;

            return (
              <p
                key={index}
                onClick={() => isAvailable && setSelectedDay(day)}
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
      <main className="max-w-7xl flex flex-col md:flex-row mx-auto gap-5 p-1 md:p-4">
        {/* Selected Day's Schedule */}
        <div className="w-full md:w-1/2">
          {selectedSchedule ? (
            <TodaysSchedule
              scheduleData={selectedSchedule.schedule}
              scheduleInfo={selectedSchedule}
              refetch={refetch}
            />
          ) : (
            <p className="text-center text-gray-500 text-xl">
              No schedule available for {selectedDay}.
            </p>
          )}
        </div>

        {/* Notes Section */}
        <div className="w-full md:w-1/2">
          {userSchedule ? (
            <ExtraList
              priority={userSchedule.priority}
              notes={userSchedule.notes}
              todo={userSchedule.todo}
              refetch={refetch}
            />
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
