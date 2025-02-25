import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

// Component Imports
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

  // States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // Weekday Names
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Auto-update the live clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user's schedule
  const {
    data: mySchedulesData = [],
    isLoading: scheduleDataIsLoading,
    error: scheduleDataError,
    refetch,
  } = useQuery({
    queryKey: ["ScheduleData", email],
    queryFn: async () => {
      if (!email) return []; // Prevent API call if email is missing
      try {
        const response = await axiosPublic.get(`/Schedule?email=${email}`);
        return response.data;
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!email, // Only run query if email exists
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });

  // Set default selected day to today's name
  useEffect(() => {
    setSelectedDay(new Date().toLocaleDateString("en-US", { weekday: "long" }));
  }, []);

  // Check if the logged-in user is allowed to view this page
  if (user?.email !== email) return <WrongUser />;

  // Handle loading and error states
  if (scheduleDataIsLoading) return <Loading />;
  if (scheduleDataError || mySchedulesData.length === 0)
    return <NoDefault refetch={refetch} />;

  // Extract the user’s schedule
  const userSchedule = mySchedulesData[0];
  if (!userSchedule) return <NoDefault refetch={refetch} />;

  // Extract available schedule days
  const availableDays = Object.keys(userSchedule.schedule || {});

  // Get the selected day's schedule
  const selectedSchedule = userSchedule.schedule?.[selectedDay] || null;

  // Format date and time
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-[#f6eee3] min-h-screen">
      {/* HEADER */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* TITLE & LIVE CLOCK */}
      <div className="text-center">
        <p className="text-3xl font-semibold py-2 underline underline-offset-4">
          DAILY SCHEDULE PLANNER
        </p>
        <p className="text-2xl font-bold text-gray-500">{formattedTime}</p>
      </div>

      {/* WEEK SELECTOR & DATE */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-300">
        {/* Display Today's Date */}
        <div className="flex gap-2 items-center md:items-start text-md md:text-lg">
          <p className="font-semibold text-gray-800">Date:</p>
          <p className="text-gray-600 font-semibold underline underline-offset-4">
            {formattedDate}
          </p>
        </div>

        {/* Weekday Selector */}
        <div className="flex gap-2 mt-4 md:mt-0 flex-wrap justify-center">
          {weekDays.map((day) => {
            const isAvailable = availableDays.includes(day);
            const isSelected = selectedDay === day;

            return (
              <p
                key={day}
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

      {/* MAIN CONTENT SECTION */}
      <main className="max-w-7xl flex flex-col md:flex-row mx-auto gap-5 p-1 md:p-4">
        {/* SCHEDULE DISPLAY */}
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

        {/* NOTES & EXTRAS SECTION */}
        <div className="w-full md:w-1/2">
          <ExtraList
            priority={userSchedule.priority}
            notes={userSchedule.notes}
            todo={userSchedule.todo}
            refetch={refetch}
          />
        </div>
      </main>
    </div>
  );
};

export default UserSchedulePlanner;
