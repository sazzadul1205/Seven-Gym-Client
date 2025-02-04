/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FaClock, FaFire, FaWeight } from "react-icons/fa";
import { formatDistanceToNowStrict } from "date-fns";
import { MdOutlineLibraryAdd, MdOutlineRecentActors } from "react-icons/md";
import RecentWorkoutDetailsModal from "./RecentWorkoutDetailsModal/RecentWorkoutDetailsModal";
import AddWorkoutModal from "../../../UserSettings/USWorkout/AddWorkoutModal/AddWorkoutModal";
import ViewAllRecentWorkoutModal from "./ViewAllRecentWorkoutModal/ViewAllRecentWorkoutModal";
import { FcViewDetails } from "react-icons/fc";

// Reusable component for workout details
const WorkoutDetailItem = ({ icon, label, value, iconColor }) => (
  <li className="flex items-center gap-3">
    {React.cloneElement(icon, { className: `text-lg ${iconColor}` })}
    <span className="font-medium">{label}:</span>
    <span>{String(value ?? "N/A")}</span>
  </li>
);

const UPRecentWorkout = ({ usersData, refetch }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Get the 5 most recent workouts
  const recentWorkouts = usersData?.recentWorkouts?.slice(0, 5) || [];

  // Function to safely parse dates
  const safeParseDate = (dateStr) => {
    if (!dateStr) return null; // Handle missing values
    const parsedDate = new Date(dateStr); // Direct parsing
    return isNaN(parsedDate.getTime()) ? null : parsedDate; // Validate date
  };

  // Function to handle when a workout is clicked
  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
    console.log("Selected Workout:", workout);
    document.getElementById("Recent_Workout_Details_Modal").showModal();
  };

  return (
    <div className="mt-8 bg-slate-50 p-6 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between space-x-2 border-b-2 border-gray-400 pb-2">
        <div className="flex items-center gap-3">
          <MdOutlineRecentActors className="text-[#EFBF04] text-2xl" />
          <h2 className="text-xl font-semibold text-black">Recent Workouts</h2>
        </div>
        <div className="flex justify-between gap-5">
          <MdOutlineLibraryAdd
            className="text-2xl hover:scale-105"
            title="Add New Workout"
            onClick={() =>
              document.getElementById("Add_Workout_Modal").showModal()
            }
          />
          <FcViewDetails
            className="text-2xl hover:scale-125"
            title="Show All"
            onClick={() =>
              document
                .getElementById("View_All_Recent_Workout_Modal")
                .showModal()
            }
          />
        </div>
      </div>

      {/* Workout List */}
      <div className="space-y-3 pt-2">
        {recentWorkouts.length > 0 ? (
          recentWorkouts.map((workout, index) => {
            const workoutDate = safeParseDate(workout.date);
            let timeAgo = workoutDate
              ? formatDistanceToNowStrict(workoutDate, { addSuffix: false })
              : "Unknown Date";

            // Replace words with shorter versions
            timeAgo = timeAgo
              .replace(" minutes", " min")
              .replace(" minute", " min")
              .replace(" hours", " hr")
              .replace(" hour", " hr")
              .replace(" days", " days")
              .replace(" day", " day");

            return (
              <div
                key={index}
                onClick={() => handleWorkoutClick(workout)}
                className="cursor-pointer items-center justify-between bg-gray-100 px-3 py-3 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                role="button"
                tabIndex={0}
                aria-label={`View details of ${workout.name}`}
              >
                {/* Workout Name */}
                <div className="py-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {workout.name}
                  </p>
                </div>

                {/* Workout Details */}
                <div className="grid grid-cols-3">
                  <WorkoutDetailItem
                    icon={<FaClock />}
                    label="Duration"
                    value={String(workout.duration ?? "")
                      .replace(" minutes", " min")
                      .replace(" minute", " min")
                      .replace(" hours", " hr")
                      .replace(" hour", " hr")}
                    iconColor="text-blue-500"
                  />
                  <WorkoutDetailItem
                    icon={<FaFire />}
                    label="Calories"
                    value={workout.calories}
                    iconColor="text-red-500"
                  />
                  <WorkoutDetailItem
                    icon={<FaWeight />}
                    label="Time"
                    value={`${timeAgo} ago`}
                    iconColor="text-green-500"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500 italic text-center">
              No Recent workouts to display.
            </p>
            <button
              className="bg-green-400 hover:bg-green-300 font-bold text-gray-600 hover:text-gray-500 px-10 py-2 rounded-lg mt-4"
              onClick={() =>
                document.getElementById("Add_Workout_Modal").showModal()
              }
            >
              + Add Workout
            </button>
          </div>
        )}
      </div>

      <dialog id="Recent_Workout_Details_Modal" className="modal">
        <RecentWorkoutDetailsModal selectedWorkout={selectedWorkout} />
      </dialog>

      <dialog id="Add_Workout_Modal" className="modal">
        <AddWorkoutModal refetch={refetch} />
      </dialog>

      <dialog id="View_All_Recent_Workout_Modal" className="modal">
        <ViewAllRecentWorkoutModal usersData={usersData} refetch={refetch} />
      </dialog>
    </div>
  );
};

export default UPRecentWorkout;
