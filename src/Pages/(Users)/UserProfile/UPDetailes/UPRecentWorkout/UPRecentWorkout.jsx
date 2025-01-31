/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FaClock, FaFire, FaWeight } from "react-icons/fa";
import { formatDistanceToNowStrict } from "date-fns";
import { MdOutlineRecentActors } from "react-icons/md";
import RecentWorkoutDetailsModal from "./RecentWorkoutDetailsModal/RecentWorkoutDetailsModal";

// Reusable component for workout details
const WorkoutDetailItem = ({ icon, label, value, iconColor }) => (
  <li className="flex items-center gap-3">
    {React.cloneElement(icon, { className: `text-lg ${iconColor}` })}
    <span className="font-medium">{label}:</span>
    <span>{String(value ?? "N/A")}</span>
  </li>
);

const UPRecentWorkout = ({ usersData }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the 5 most recent workouts
  const recentWorkouts = usersData?.recentWorkouts?.slice(0, 5) || [];

  // Function to safely parse dates
  const safeParseDate = (dateStr) => {
    if (!dateStr) return null; // Handle missing values
    const parsedDate = new Date(dateStr); // Direct parsing
    return isNaN(parsedDate.getTime()) ? null : parsedDate; // Validate date
  };

  // Handle workout click to open modal
  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWorkout(null);
  };

  return (
    <div className="mt-8 bg-slate-50 p-6 rounded-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b">
        <MdOutlineRecentActors className="text-[#EFBF04]" />
        <h2 className="text-xl font-semibold text-black">Recent Workouts</h2>
      </div>

      {/* Workout List */}
      <div className="space-y-3 pt-2">
        {recentWorkouts.length > 0 ? (
          recentWorkouts.map((workout, index) => {
            const workoutDate = safeParseDate(workout.date);
            const timeAgo = workoutDate
              ? formatDistanceToNowStrict(workoutDate, { addSuffix: true })
              : "Unknown Date";

            return (
              <div
                key={index}
                onClick={() => handleWorkoutClick(workout)}
                className="cursor-pointer items-center justify-between bg-gray-100 px-5 py-3 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                role="button"
                tabIndex={0}
                aria-label={`View details of ${workout.name}`}
              >
                {/* Workout Name */}
                <div className="py-2">
                  <p className="text-lg font-semibold text-gray-800">
                    {workout.name}
                  </p>
                </div>

                {/* Workout Details */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mt-3 sm:mt-0">
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
                    label="Time ago"
                    value={timeAgo}
                    iconColor="text-green-500"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 italic text-center">
            No recent workouts to display.
          </p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <RecentWorkoutDetailsModal
          selectedWorkout={selectedWorkout}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default UPRecentWorkout;
