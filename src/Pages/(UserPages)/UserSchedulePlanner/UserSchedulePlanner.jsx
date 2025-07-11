import { Link, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";

// Import Package
import { IoSettings } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";

// Import Utility
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Component
import ExtraList from "./ExtraLists/ExtraLists";
import TodaysSchedule from "./TodaysSchedule/TodaysSchedule";

// Import Example JSON
import ExampleSchedule from "../../../JSON/ExampleSchedule.json";

// Import Modal
import GenerateUserScheduleModal from "./GenerateUserScheduleModal/GenerateUserScheduleModal";

const UserSchedulePlanner = () => {
  const axiosPublic = useAxiosPublic();
  const { email } = useParams();
  const { user } = useAuth();

  // The References
  const unauthorizedModalRef = useRef(null);
  const generateModalRef = useRef(null);

  // Determine if the current user owns the schedule
  const isOwnSchedule = user?.email === email;

  // Conditionally fetch schedule data if the user is authorized
  const {
    data: mySchedulesData,
    isLoading: UserScheduleIsLoading,
    error: UserScheduleError,
    refetch,
  } = useQuery({
    queryKey: ["UserScheduleData", email],
    queryFn: async () => {
      if (!email) return []; // Prevent API call if email is missing
      try {
        const response = await axiosPublic.get(`/User_Schedule?email=${email}`);
        return response.data;
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!email && isOwnSchedule, // Only run query if email exists and user owns the schedule
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });

  // If the user is not the owner, use ExampleSchedule instead
  const scheduleData = isOwnSchedule ? mySchedulesData : ExampleSchedule;

  // State to manage live clock and selected day
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" })
  );

  // Days of the week
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Update the live clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, []);

  // Open modal if the logged-in user does not match the URL email
  useEffect(() => {
    if (!user?.email) return; // Wait for user to be available

    if (!isOwnSchedule && unauthorizedModalRef.current) {
      unauthorizedModalRef.current.showModal();
    }
  }, [isOwnSchedule, user]); // Re-run when the user data or isOwnSchedule changes

  // If authorized but no schedule data, open the "generate schedule" modal
  useEffect(() => {
    if (
      isOwnSchedule &&
      mySchedulesData &&
      mySchedulesData.length === 0 &&
      generateModalRef.current
    ) {
      generateModalRef.current.showModal();
    }
  }, [isOwnSchedule, mySchedulesData]);

  // Handle loading and error only when the user is supposed to fetch data
  if (isOwnSchedule && UserScheduleIsLoading) return <Loading />;
  if (isOwnSchedule && UserScheduleError) return <FetchingError />;

  // Extract schedule details from the data
  const userSchedule = (scheduleData && scheduleData[0]) || {};
  const availableDays = Object.keys(userSchedule.schedule || {});
  const selectedSchedule = userSchedule.schedule?.[selectedDay] || null;

  // Format date and time for display
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
    <div className="bg-gradient-to-b from-gray-200 to-gray-500 min-h-screen">
      <div className="pb-5 relative">
        {/* Settings Icon */}
        <div className="absolute top-2 right-2 p-2 md:p-3 rounded-full z-10">
          <Link to="/User/UserSettings?tab=User_Schedule_Settings">
            <IoSettings className="text-red-500 hover:text-red-400 text-3xl md:text-4xl transition-transform duration-500 hover:rotate-180" />
          </Link>
        </div>

        {/* Title & Clock */}
        <div className="md:text-center pt-5 px-2">
          <p className="text-xl md:text-3xl italic text-black font-semibold py-2">
            DAILY SCHEDULE PLANNER
          </p>
          <div className="p-[2px] bg-white w-1/2 md:w-1/3 mx-auto mb-2"></div>
          <p className="text-center text-lg md:text-2xl font-bold text-gray-800">
            ({formattedTime})
          </p>
        </div>

        {/* Date + Day Selector */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center p-3 border-b border-gray-300 bg-white/70 rounded-t-xl mt-3 gap-4 md:gap-0">
          {/* Today's Date */}
          <div className="flex gap-2 items-center text-sm md:text-lg">
            <p className="font-semibold text-gray-800">Today&apos;s Date:</p>
            <p className="font-semibold text-black">{formattedDate}</p>
          </div>

          {/* Day Selector */}
          <div className="flex gap-2 flex-wrap justify-center">
            {weekDays.map((day) => {
              const isAvailable = availableDays.includes(day);
              const isSelected = selectedDay === day;

              return (
                <p
                  key={day}
                  onClick={() => isAvailable && setSelectedDay(day)}
                  className={`rounded-full border-2 border-black text-black w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-base font-medium
                ${
                  isSelected
                    ? "bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-300 to-blue-600 text-white font-bold"
                    : "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-400"
                }
                ${
                  isAvailable
                    ? "cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
                >
                  {day[0]}
                </p>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 bg-white/80 rounded-b-xl px-2 py-5">
          {/* Schedule Section */}
          <section className="w-full md:w-1/2">
            <TodaysSchedule
              scheduleData={selectedSchedule?.schedule}
              scheduleInfo={selectedSchedule}
              refetch={refetch}
            />
          </section>

          {/* Notes + Todo Section */}
          <section className="w-full md:w-1/2">
            <ExtraList
              priority={userSchedule.priority}
              note={userSchedule.notes}
              todo={userSchedule.todo}
              refetch={refetch}
            />
          </section>
        </div>
      </div>

      {/* Unauthorized Modal */}
      <dialog
        ref={unauthorizedModalRef}
        id="Not_My_Schedule"
        className="modal bg-gray-500/20"
      >
        <div className="modal-box bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
          <h3 className="font-bold text-xl text-red-500">
            This is not your schedule
          </h3>
          <p className="py-4 text-gray-700">
            Please go back and check your own schedule.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-bl hover:bg-gradient-to-tr from-red-400 to-red-600 text-white font-semibold rounded-lg px-8 py-3"
            >
              Back to Previous Page
            </button>
          </div>
        </div>
      </dialog>

      {/* Generate Schedule Modal */}
      <dialog
        ref={generateModalRef}
        id="Generate_Schedule_Modal"
        className="modal bg-gray-500/20"
      >
        <GenerateUserScheduleModal refetch={refetch} />
      </dialog>
    </div>
  );
};

export default UserSchedulePlanner;
