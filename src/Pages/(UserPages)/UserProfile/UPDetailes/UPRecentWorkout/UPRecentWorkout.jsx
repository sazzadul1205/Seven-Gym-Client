/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FcViewDetails } from "react-icons/fc";
import { formatDistanceToNowStrict } from "date-fns";
import { FaClock, FaFire, FaWeight } from "react-icons/fa";
import { MdOutlineLibraryAdd, MdOutlineRecentActors } from "react-icons/md";

import RecentWorkoutDetailsModal from "./SelectedWorkoutDetailsModal/SelectedWorkoutDetailsModal";
import AddWorkoutModal from "../../../UserSettings/USWorkout/AddWorkoutModal/AddWorkoutModal";
import ViewAllRecentWorkoutModal from "./ViewAllRecentWorkoutModal/ViewAllRecentWorkoutModal";

const WorkoutDetailItem = ({ icon, label, value, iconColor }) => (
  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
    {React.cloneElement(icon, { className: `text-lg ${iconColor}` })}
    <span className="font-medium">{label}:</span>
    <span>{String(value ?? "N/A")}</span>
  </li>
);

const UPRecentWorkout = ({ usersData, refetch }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const recentWorkouts = usersData?.recentWorkouts?.slice(0, 5) || [];

  const safeParseDate = (dateStr) => {
    if (!dateStr) return null;
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
    document.getElementById("Recent_Workout_Details_Modal").showModal();
  };

  return (
    <div className="mt-6 bg-white p-4 sm:p-6 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between border-b-2 border-gray-400 pb-2">
        <div className="flex items-center gap-3">
          <MdOutlineRecentActors className="text-[#EFBF04] text-2xl sm:text-3xl" />
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Recent Workouts
          </h2>
        </div>
        <div className="flex gap-4">
          <MdOutlineLibraryAdd
            className="text-2xl sm:text-3xl transition-all duration-300 hover:scale-110 cursor-pointer"
            title="Add New Workout"
            onClick={() =>
              document.getElementById("Add_Workout_Modal").showModal()
            }
          />
          <FcViewDetails
            className="text-2xl sm:text-3xl transition-all duration-300 hover:scale-110 cursor-pointer"
            title="Show All"
            onClick={() =>
              document
                .getElementById("View_All_Recent_Workout_Modal")
                .showModal()
            }
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {recentWorkouts.length > 0 ? (
          recentWorkouts.map((workout, index) => {
            const workoutDate = safeParseDate(workout.date);
            let timeAgo = workoutDate
              ? formatDistanceToNowStrict(workoutDate, { addSuffix: false })
              : "Unknown Date";

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
                className="cursor-pointer bg-gray-100 px-3 py-3 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                role="button"
                tabIndex={0}
                aria-label={`View details of ${workout.name}`}
              >
                <div className="py-1">
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    {workout.name}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
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
            <p className="text-gray-500 italic text-center text-sm sm:text-base">
              No Recent workouts to display.
            </p>
            <button
              className="bg-green-400 hover:bg-green-300 font-bold text-gray-600 hover:text-gray-500 px-8 py-2 rounded-lg mt-4 text-sm sm:text-base"
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
