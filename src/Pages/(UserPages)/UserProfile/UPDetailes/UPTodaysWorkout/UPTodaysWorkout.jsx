import React, { useState } from "react";
import PropTypes from "prop-types";

import { formatDistanceToNowStrict } from "date-fns";

// Import Icons
import { FcViewDetails } from "react-icons/fc";
import { MdOutlineLibraryAdd, MdOutlineRecentActors } from "react-icons/md";
import { FaClock, FaFire, FaWeight } from "react-icons/fa";

// Import Modal
import AddWorkoutModal from "../../../UserSettings/USWorkout/AddWorkoutModal/AddWorkoutModal";
import ViewAllTodaysWorkoutModal from "../../UserProfileTodaysWorkout/ViewAllTodaysWorkoutModal/ViewAllTodaysWorkoutModal";
import SelectedWorkoutDetailsModal from "../../UserProfileTodaysWorkout/SelectedWorkoutDetailsModal/SelectedWorkoutDetailsModal";

// Reusable component for workout details
const WorkoutDetailItem = ({ icon, label, value, iconColor }) => (
  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
    {React.cloneElement(icon, { className: `text-lg ${iconColor}` })}
    <span className="font-medium">{label}:</span>
    <span>{String(value ?? "N/A")}</span>
  </li>
);

// PropTypes for WorkoutDetailItem
WorkoutDetailItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconColor: PropTypes.string.isRequired,
};

const UPTodaysWorkout = ({ usersData, refetch }) => {
  // State to store the selected workout for displaying details in a modal
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Function to safely parse a date string into a Date object
  const safeParseDate = (dateStr) => {
    if (!dateStr) return null;
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Filter recent workouts to include only today's workouts, limit to 5
  const todaysWorkouts = usersData?.recentWorkouts
    ?.filter((workout) => {
      const workoutDate = safeParseDate(workout.date);
      if (!workoutDate) return false;
      return workoutDate.toISOString().split("T")[0] === getTodayDate();
    })
    .slice(0, 5);

  // Function to handle workout selection and open the details modal
  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
    document.getElementById("Selected_Workout_Details_Modal").showModal();
  };

  return (
    <div className="bg-linear-to-bl from-gray-200 to-gray-400 p-5 shadow-xl rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-400 pb-2">
        {/* Title */}
        <div className="flex items-center gap-3">
          <MdOutlineRecentActors className="text-[#ffcc00] text-3xl sm:text-3xl" />
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Today&apos;s Workouts
          </h2>
        </div>

        {/* Icons */}
        <div className="flex gap-4">
          <MdOutlineLibraryAdd
            className="text-2xl sm:text-3xl text-red-500 hover:text-red-300 transition-all duration-300 hover:scale-110 cursor-pointer"
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
                .getElementById("View_All_Todays_Workout_Modal")
                .showModal()
            }
          />
        </div>
      </div>

      {/* Workout List */}
      <div className="space-y-3 pt-2">
        {todaysWorkouts && todaysWorkouts.length > 0 ? (
          todaysWorkouts.map((workout, index) => {
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
                className="cursor-pointer items-center justify-between bg-linear-to-bl hover:bg-linear-to-tr from-gray-50 to-gray-200  px-3 py-3 rounded-lg shadow-md  transition-all duration-300 text-black"
                role="button"
                tabIndex={0}
                aria-label={`View details of ${workout.name}`}
              >
                {/* Workout Name */}
                <div className="py-1">
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    {workout.name}
                  </p>
                </div>

                {/* Workout Details */}
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
            <p className="text-black italic text-center text-sm sm:text-base font-semibold mb-5">
              No Today&apos;s workouts to display.
            </p>
            <button
              className="bg-linear-to-bl hover:bg-linear-to-tr from-green-400 to-green-600 rounded-xl shadow-xl hover:shadow-2xl text-white font-semibold py-2 px-10 cursor-pointer "
              onClick={() =>
                document.getElementById("Add_Workout_Modal").showModal()
              }
            >
              + Add Workout
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <dialog id="Selected_Workout_Details_Modal" className="modal">
        <SelectedWorkoutDetailsModal selectedWorkout={selectedWorkout} />
      </dialog>

      <dialog id="Add_Workout_Modal" className="modal">
        <AddWorkoutModal refetch={refetch} />
      </dialog>

      <dialog id="View_All_Todays_Workout_Modal" className="modal">
        <ViewAllTodaysWorkoutModal usersData={usersData} refetch={refetch} />
      </dialog>
    </div>
  );
};

// PropTypes for UPTodaysWorkout
UPTodaysWorkout.propTypes = {
  usersData: PropTypes.shape({
    recentWorkouts: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        date: PropTypes.string,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        calories: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  }),
  refetch: PropTypes.func.isRequired,
};

export default UPTodaysWorkout;
