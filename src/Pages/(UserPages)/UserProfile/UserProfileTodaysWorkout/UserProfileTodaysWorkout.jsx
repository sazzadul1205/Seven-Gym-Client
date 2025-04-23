import React, { useState } from "react";

// Import Package
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { FcViewDetails } from "react-icons/fc";
import { FaClock, FaFire } from "react-icons/fa";
import {
  MdNotificationImportant,
  MdOutlineLibraryAdd,
  MdOutlineRecentActors,
} from "react-icons/md";

// Import Components
import ViewAllTodaysWorkoutModal from "./ViewAllTodaysWorkoutModal/ViewAllTodaysWorkoutModal";
import SelectedWorkoutDetailsModal from "./SelectedWorkoutDetailsModal/SelectedWorkoutDetailsModal";
import AddWorkoutModal from "../../UserSettings/UserSettingsWorkout/AddWorkoutModal/AddWorkoutModal";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

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
          <button
            className="border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105"
            data-tooltip-id="Add_Modal_Button_Tooltip_Workout"
            onClick={() =>
              document.getElementById("Add_Workout_Modal").showModal()
            }
          >
            <MdOutlineLibraryAdd className="text-red-500 text-xl" />
          </button>
          <Tooltip
            id="Add_Modal_Button_Tooltip_Workout"
            place="top"
            content="Add Workout"
          />
          {/* Show All Recent Workouts Button */}
          <button
            className="border-2 border-blue-500 bg-blue-100 rounded-full p-2 cursor-pointer hover:scale-105"
            data-tooltip-id="view_Modal_Button_Tooltip_All_Workout"
            onClick={() =>
              document
                .getElementById("View_All_Recent_Workout_Modal")
                .showModal()
            }
          >
            <FcViewDetails className="text-xl" />
          </button>
          <Tooltip
            id="view_Modal_Button_Tooltip_All_Workout"
            place="top"
            content="View All Workout"
          />
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
          <div className="flex flex-col items-center justify-center bg-linear-to-bl from-gray-200 to-gray-400 border border-gray-300 py-2">
            <p className="text-black italic text-center text-sm sm:text-base font-semibold mb-5">
              No Today&apos;s workouts to display.
            </p>

            {/* Button to Add Workout */}
            <CommonButton
              text="+ Add Workout"
              bgColor="green"
              px="px-10"
              py="py-2"
              borderRadius="rounded-xl"
              textColor="text-white"
              clickEvent={() =>
                document.getElementById("Add_Workout_Modal").showModal()
              }
            />
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
