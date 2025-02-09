import { useState, useEffect } from "react";
import TodaysSchedule from "./TodaysSchedule/TodaysSchedule";
import TodaysNotes from "./TodaysNotes/TodaysNotes";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import NoDefault from "./NoDefault/NoDefault";

const UserSchedulePlanner = () => {
  const axiosPublic = useAxiosPublic();

  // State for live clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetching Schedule Data
  const {
    data: ScheduleData,
    isLoading: ScheduleDataIsLoading,
    error: ScheduleDataError,
  } = useQuery({
    queryKey: ["ScheduleData"],
    queryFn: () => axiosPublic.get(`/Schedule`).then((res) => res.data[0]), // Access the first object
  });

  // Loading and error states (render below hooks)
  if (ScheduleDataIsLoading) {
    return <Loading />;
  }

  if (ScheduleDataError) {
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

  // return (
  //   <div className="bg-white">
  //     {/* Header */}
  //     <div className="bg-[#F72C5B] py-12"></div>

  //     {/* Title */}
  //     <div className="text-center">
  //       <p className="text-3xl font-semibold py-2 underline underline-offset-4">
  //         DAILY SCHEDULE PLANNER
  //       </p>
  //       <p className="text-2xl font-bold text-gray-500">{formattedTime}</p>
  //     </div>

  //     {/* Week & Date Selector */}
  //     <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-300">
  //       {/* Today's Date */}
  //       <div className="flex gap-2 items-center md:items-start">
  //         <p className="text-lg font-semibold text-gray-800">Date:</p>
  //         <p className="text-lg text-gray-600 font-semibold underline underline-offset-4">
  //           {formattedDate}
  //         </p>
  //       </div>

  //       {/* Week Selector */}
  //       <div className="flex gap-2 mt-4 md:mt-0">
  //         {weekdays.map((day, index) => {
  //           const isPastDay = index < today.getDay(); // Check if day has passed
  //           const isToday = index === today.getDay(); // Check if today

  //           return (
  //             <p
  //               key={index}
  //               className={`rounded-full border border-black w-10 h-10 flex items-center justify-center text-lg font-medium
  //                 ${isPastDay ? "bg-red-400 text-white" : ""}
  //                 ${isToday ? "bg-blue-400 text-white font-bold" : ""}
  //                 hover:bg-gray-400 cursor-pointer`}
  //             >
  //               {day}
  //             </p>
  //           );
  //         })}
  //       </div>
  //     </div>

  //     {/* Main Section */}
  //     <main className="max-w-7xl mx-auto flex gap-5">
  //       {/* Todays schedule */}
  //       <div className="w-1/2">
  //         <TodaysSchedule />
  //       </div>

  //       {/* Priority, To-Do, Notes  */}
  //       <div className="w-1/2">
  //         <TodaysNotes />
  //       </div>
  //     </main>
  //   </div>
  // );

  return (
    <div className="bg-white min-h-screen relative">
      <NoDefault />

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
        <dialog id="my_modal_1" className="modal" open>
          <div className="modal-box bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">
              Press ESC key or click the button below to close
            </p>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default UserSchedulePlanner;
