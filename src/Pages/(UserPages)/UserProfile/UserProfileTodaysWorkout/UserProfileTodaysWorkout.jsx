import React, { useState } from "react";
import PropTypes from "prop-types";
import { formatDistanceToNowStrict } from "date-fns";

// Import Icons
import { FcViewDetails } from "react-icons/fc";
import { FaClock, FaFire, FaWeight } from "react-icons/fa";
import { MdOutlineLibraryAdd, MdOutlineRecentActors } from "react-icons/md";

// Import Components
import AddWorkoutModal from "../../UserSettings/USWorkout/AddWorkoutModal/AddWorkoutModal";
import ViewAllTodaysWorkoutModal from "./ViewAllTodaysWorkoutModal/ViewAllTodaysWorkoutModal";
import SelectedWorkoutDetailsModal from "./SelectedWorkoutDetailsModal/SelectedWorkoutDetailsModal";

// Reusable component for workout details
const WorkoutDetailItem = ({ icon, label, value, iconColor }) => (
  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
    {React.cloneElement(icon, { className: `text-lg ${iconColor}` })}
    <span className="font-medium">{label}:</span>
    <span>{String(value ?? "N/A")}</span>
  </li>
);

// Prop types for WorkoutDetailItem component
WorkoutDetailItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconColor: PropTypes.string.isRequired,
};

const UserProfileTodaysWorkout = ({ recentWorkouts, refetch }) => {
  // State for selected workout details
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Function to safely parse date strings in "dd-mm-yyyy" format
  const safeParseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-");
    // Create a date in ISO format ("yyyy-mm-dd") assuming time 00:00:00 UTC
    const parsedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  // Get today's date in "YYYY-MM-DD" format
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Filter workouts to include only those whose date (converted to ISO format)
  // matches today's date, and limit to 5 workouts.
  const todaysWorkouts = recentWorkouts
    ?.filter((workout) => {
      if (!workout.date) return false;
      const workoutDate = safeParseDate(workout.date);
      return (
        workoutDate &&
        workoutDate.toISOString().split("T")[0] === getTodayDate()
      );
    })
    .slice(0, 5);

  // Open workout details modal
  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
    document.getElementById("Todays_Workout_Details_Modal").showModal();
  };

  // Close workout details modal
  const handleCloseModal = () => {
    setSelectedWorkout(null);
    document.getElementById("Todays_Workout_Details_Modal").close();
  };

  return (
    <div className="bg-linear-to-bl from-gray-200 to-gray-400 p-5 shadow-xl rounded-xl">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b-2 border-gray-400 pb-2">
        <div className="flex items-center gap-3">
          <MdOutlineRecentActors className="text-[#ffcc00] text-3xl sm:text-3xl" />
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Today&apos;s Workouts
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
          {/* View All Workouts Button */}
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

      {/* Workout List Section */}
      <div className="space-y-3 pt-2">
        {todaysWorkouts && todaysWorkouts.length > 0 ? (
          todaysWorkouts.map((workout, index) => {
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
          // No Workouts Message
          <div className="flex flex-col items-center justify-center">
            <p className="text-black italic text-center text-sm sm:text-base font-semibold mb-5">
              No Today&apos;s workouts to display.
            </p>
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

      {/* Uncomment if you want to enable the modal */}
      <dialog id="Todays_Workout_Details_Modal" className="modal">
        <SelectedWorkoutDetailsModal
          selectedWorkout={selectedWorkout}
          handleCloseModal={handleCloseModal}
        />
      </dialog>

      {/* Add Workout Modal */}
      <dialog id="Add_Workout_Modal" className="modal">
        <AddWorkoutModal refetch={refetch} />
      </dialog>

      {/* View All Today's Workout Modal */}
      <dialog id="View_All_Todays_Workout_Modal" className="modal">
        <ViewAllTodaysWorkoutModal
          todaysWorkouts={todaysWorkouts}
          refetch={refetch}
        />
      </dialog>
    </div>
  );
};

// Prop Types validation (expect recentWorkouts as an array)
UserProfileTodaysWorkout.propTypes = {
  recentWorkouts: PropTypes.arrayOf(
    PropTypes.shape({
      workoutId: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      intensity: PropTypes.string,
      location: PropTypes.string,
      date: PropTypes.string,
      registeredDateAndTime: PropTypes.string,
      duration: PropTypes.string,
      calories: PropTypes.string,
      notes: PropTypes.string,
    })
  ),
  refetch: PropTypes.func.isRequired,
};

export default UserProfileTodaysWorkout;
