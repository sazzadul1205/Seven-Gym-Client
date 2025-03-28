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

// Import Modals
import ViewAllRecentWorkoutModal from "./ViewAllRecentWorkoutModal/ViewAllRecentWorkoutModal";
import SelectedWorkoutDetailsModal from "../UserProfileTodaysWorkout/SelectedWorkoutDetailsModal/SelectedWorkoutDetailsModal";
import AddWorkoutModal from "../../UserSettings/UserSettingsWorkout/AddWorkoutModal/AddWorkoutModal";

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
        {/* Title */}
        <div className="flex items-center gap-3">
          <MdOutlineRecentActors className="text-yellow-300 text-3xl sm:text-3xl" />
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Recent Workout&apos;s
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

      {/* Workout List */}
      <div className="space-y-3 pt-2">
        {slicedRecentWorkouts.length > 0 ? (
          slicedRecentWorkouts.map((workout, index) => {
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
