import React, { useState } from "react";
import PropTypes from "prop-types";
import { formatDistanceToNowStrict } from "date-fns";

// Import Icons
import { FcViewDetails } from "react-icons/fc";
import { FaClock, FaFire, FaWeight } from "react-icons/fa";
import { MdOutlineLibraryAdd, MdOutlineRecentActors } from "react-icons/md";

// Import Modals
import AddWorkoutModal from "../../UserSettings/USWorkout/AddWorkoutModal/AddWorkoutModal";
import ViewAllRecentWorkoutModal from "./ViewAllRecentWorkoutModal/ViewAllRecentWorkoutModal";
import SelectedWorkoutDetailsModal from "../UserProfileTodaysWorkout/SelectedWorkoutDetailsModal/SelectedWorkoutDetailsModal";

// Reusable component for displaying workout details
const WorkoutDetailItem = ({ icon, label, value, iconColor }) => (
  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
    {React.cloneElement(icon, { className: `text-lg ${iconColor}` })}
    <span className="font-medium">{label}:</span>
    <span>{String(value ?? "N/A")}</span>
  </li>
);

WorkoutDetailItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconColor: PropTypes.string.isRequired,
};

const UserProfileRecentWorkout = ({ recentWorkouts, refetch }) => {
  // State for selected workout details
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Get the last 5 recent workouts
  const slicedRecentWorkouts = recentWorkouts.slice(0, 5);

  // Function to safely parse date strings in "dd-mm-yyyy" format
  const safeParseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-");
    // Create a date in ISO format ("yyyy-mm-dd") assuming time 00:00:00 UTC
    const parsedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  // Handle clicking on a workout
  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
    document.getElementById("Recent_Workout_Details_Modal").showModal();
  };

  // Close modal function
  const handleCloseModal = () => {
    setSelectedWorkout(null);
    document.getElementById("Recent_Workout_Details_Modal").close();
  };

  return (
    <div className="bg-linear-to-bl from-gray-200 to-gray-400 p-5 shadow-xl rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-400 pb-2">
        <div className="flex items-center gap-3">
          <MdOutlineRecentActors className="text-[#ffcc00] text-3xl sm:text-3xl" />
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Recent Workouts
          </h2>
        </div>
        <div className="flex gap-4">
          {/* Add New Workout Button */}
          <MdOutlineLibraryAdd
            className="text-2xl sm:text-3xl text-red-500 hover:text-red-300 transition-all duration-300 hover:scale-110 cursor-pointer"
            title="Add New Workout"
            onClick={() =>
              document.getElementById("Add_Workout_Modal").showModal()
            }
          />
          {/* Show All Recent Workouts Button */}
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

      {/* Workout List */}
      <div className="space-y-3 pt-2">
        {slicedRecentWorkouts.length > 0 ? (
          slicedRecentWorkouts.map((workout, index) => {
            // Parse the workout date from "dd-mm-yyyy"
            const workoutDate = safeParseDate(workout.date);
            let timeAgo = workoutDate
              ? formatDistanceToNowStrict(workoutDate, { addSuffix: false })
              : "Unknown Date";

            // Shorten the time ago string
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
                className="cursor-pointer items-center justify-between bg-linear-to-bl hover:bg-linear-to-tr from-gray-50 to-gray-200 px-3 py-3 rounded-lg shadow-md transition-all duration-300 text-black"
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

                {/* Workout Details (Duration, Calories, Time) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                  <WorkoutDetailItem
                    icon={<FaClock />}
                    label="Duration"
                    // Replace "minute" with "min" for display
                    value={String(workout.duration ?? "")
                      .replace(" minutes", " min")
                      .replace(" minute", " min")}
                    iconColor="text-blue-500"
                  />
                  <WorkoutDetailItem
                    icon={<FaFire />}
                    label="Calories"
                    value={
                      workout.calories ? `${workout.calories} kcal` : "N/A"
                    }
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
              No Recent workouts to display.
            </p>
            {/* Button to Add Workout */}
            <button
              className="bg-linear-to-bl hover:bg-linear-to-tr from-green-400 to-green-600 rounded-xl shadow-xl hover:shadow-2xl text-white font-semibold py-2 px-10 cursor-pointer"
              onClick={() =>
                document.getElementById("Add_Workout_Modal").showModal()
              }
            >
              + Add Workout
            </button>
          </div>
        )}
      </div>

      {/* Workout Details Modal */}
      <dialog id="Recent_Workout_Details_Modal" className="modal">
        <SelectedWorkoutDetailsModal
          selectedWorkout={selectedWorkout}
          handleCloseModal={handleCloseModal}
        />
      </dialog>

      {/* Add Workout Modal */}
      <dialog id="Add_Workout_Modal" className="modal">
        <AddWorkoutModal refetch={refetch} />
      </dialog>

      {/* View All Recent Workouts Modal */}
      <dialog id="View_All_Recent_Workout_Modal" className="modal">
        <ViewAllRecentWorkoutModal
          recentWorkouts={recentWorkouts}
          refetch={refetch}
        />
      </dialog>
    </div>
  );
};

UserProfileRecentWorkout.propTypes = {
  recentWorkouts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      date: PropTypes.string,
      duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      calories: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  refetch: PropTypes.func.isRequired,
};

export default UserProfileRecentWorkout;
