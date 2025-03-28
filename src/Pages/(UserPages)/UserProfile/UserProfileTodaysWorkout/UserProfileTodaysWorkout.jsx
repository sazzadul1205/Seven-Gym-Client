import React, { useState } from "react";
import PropTypes from "prop-types";

// Import Icons
import { FcViewDetails } from "react-icons/fc";
import { FaClock, FaFire } from "react-icons/fa";
import {
  MdNotificationImportant,
  MdOutlineLibraryAdd,
  MdOutlineRecentActors,
} from "react-icons/md";

// Import Components
import AddWorkoutModal from "../../UserSettings/USWorkout/AddWorkoutModal/AddWorkoutModal";
import ViewAllTodaysWorkoutModal from "./ViewAllTodaysWorkoutModal/ViewAllTodaysWorkoutModal";
import SelectedWorkoutDetailsModal from "./SelectedWorkoutDetailsModal/SelectedWorkoutDetailsModal";
import { Tooltip } from "react-tooltip";

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

  // Get today's date in 'dd mm yyyy' format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-GB").replace(/\//g, " ");
  };

  const todayDate = getCurrentDate();

  // Function to extract and format date from 'registeredDateAndTime'
  const formatRegisteredDate = (isoDate) => {
    const [datePart] = isoDate.split("T"); // Extracts 'dd-mm-yy' part
    const [day, month, year] = datePart.split("-"); // Splits into components
    return `${day} ${month} 20${year}`; // Converts 'dd-mm-yy' to 'dd mm yyyy'
  };

  // Filter workouts for today's workouts based on registeredDateAndTime
  const todaysWorkouts = recentWorkouts
    .filter(
      (workout) =>
        formatRegisteredDate(workout.registeredDateAndTime) === todayDate
    )
    .slice(0, 5); // Only show the most recent 5 workouts

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

  console.log(todaysWorkouts);

  return (
    <div className="bg-linear-to-bl from-gray-200 to-gray-400 p-5 shadow-xl rounded-xl">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b-2 border-gray-400 pb-2">
        {/* Title */}
        <div className="flex items-center gap-3">
          <MdOutlineRecentActors className="text-yellow-300 text-3xl sm:text-3xl" />
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Today&apos;s Workouts
          </h2>
        </div>

        {/* More Btns */}
        <div className="flex gap-4">
          {/* Add New Workout Button */}
          <div className="bg-white p-1 rounded-full">
            <MdOutlineLibraryAdd
              className="text-3xl text-red-500 hover:text-red-400 transition-all duration-300 hover:scale-105 cursor-pointer"
              data-tooltip-id="Add_Modal_Button_Tooltip_Workout"
              onClick={() =>
                document.getElementById("Add_Workout_Modal").showModal()
              }
            />
            <Tooltip
              id="Add_Modal_Button_Tooltip_Workout"
              place="top"
              content="Add Workout"
            />
          </div>
          {/* Show All Recent Workouts Button */}
          <div className="bg-white p-1 rounded-full">
            <FcViewDetails
              className="text-3xl transition-all duration-300 hover:scale-105 cursor-pointer"
              data-tooltip-id="view_Modal_Button_Tooltip_All_Workout"
              onClick={() =>
                document
                  .getElementById("View_All_Recent_Workout_Modal")
                  .showModal()
              }
            />
            <Tooltip
              id="view_Modal_Button_Tooltip_All_Workout"
              place="top"
              content="view All Workout"
            />
          </div>
        </div>
      </div>

      {/* Workout List Section */}
      <div className="space-y-3 pt-2">
        {todaysWorkouts && todaysWorkouts.length > 0 ? (
          todaysWorkouts.map((workout, index) => {
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
                    icon={<MdNotificationImportant />}
                    label="Intensity"
                    value={workout.intensity ?? "N/A"}
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
