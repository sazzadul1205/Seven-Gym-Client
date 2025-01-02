/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FaClock,
  FaFire,
  FaWeight,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaStickyNote,
} from "react-icons/fa";
import { formatDistanceToNowStrict, parse } from "date-fns";
import { MdOutlineRecentActors } from "react-icons/md";

const UPRecentWorkout = ({ usersData }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null); // State for modal data
  const recentWorkouts = usersData?.recentWorkouts?.slice(0, 5); // Get the 5 most recent workouts

  // Function to format the date
  const formatDate = (dateStr) => {
    const date = parse(dateStr, "dd/MM/yyyy h:mm a", new Date());
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="space-y-8 mt-8 bg-white p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b">
        <MdOutlineRecentActors className="text-[#EFBF04]" />
        <h2 className="text-xl font-semibold text-black">Recent Workouts</h2>
      </div>

      {/* Workout List */}
      <div className="space-y-4">
        {recentWorkouts?.map((workout, index) => {
          // Parse the workout date and calculate the time ago
          const workoutDate = parse(
            workout.date,
            "dd/MM/yyyy h:mm a",
            new Date()
          );
          const timeAgo = formatDistanceToNowStrict(workoutDate, {
            addSuffix: true,
          });

          return (
            <div
              key={index}
              onClick={() => setSelectedWorkout(workout)} // Open modal on click
              className="cursor-pointer flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-5 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
            >
              {/* Workout Name */}
              <p className="text-lg font-semibold text-gray-800">
                {workout.name}
              </p>

              {/* Workout Details */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mt-3 sm:mt-0">
                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-blue-500" />
                  <span>{workout.duration}</span>
                </div>

                {/* Calories */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaFire className="text-red-500" />
                  <span>{workout.calories}</span>
                </div>

                {/* Time Ago */}
                <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                  <FaWeight className="text-green-500" />
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* If No Workouts Available */}
        {!recentWorkouts?.length && (
          <p className="text-gray-500 italic text-center">
            No recent workouts to display.
          </p>
        )}
      </div>

      {/* Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          {/* Modal Container */}
          <div className="relative bg-white rounded-lg p-8 max-w-md w-full shadow-xl transition-transform transform scale-100">
            {/* Close Button */}
            <button
              onClick={() => setSelectedWorkout(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-transform transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Workout Title */}
            <h3 className="text-3xl font-bold text-center text-purple-700 mb-6">
              {selectedWorkout.name}
            </h3>

            {/* Workout Details */}
            <ul className="space-y-4 text-gray-700">
              {/* Duration */}
              <li className="flex items-center gap-3">
                <FaClock className="text-blue-500 text-lg" />
                <span className="font-medium">Duration:</span>
                <span>{selectedWorkout.duration}</span>
              </li>

              {/* Calories */}
              <li className="flex items-center gap-3">
                <FaFire className="text-red-500 text-lg" />
                <span className="font-medium">Calories:</span>
                <span>{selectedWorkout.calories}</span>
              </li>

              {/* Location */}
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-purple-500 text-lg" />
                <span className="font-medium">Location:</span>
                <span>{selectedWorkout.location}</span>
              </li>

              {/* Type */}
              <li className="flex items-center gap-3">
                <FaHeartbeat className="text-green-500 text-lg" />
                <span className="font-medium">Type:</span>
                <span>{selectedWorkout.type}</span>
              </li>

              {/* Intensity */}
              <li className="flex items-center gap-3">
                <FaWeight className="text-orange-500 text-lg" />
                <span className="font-medium">Intensity:</span>
                <span>{selectedWorkout.intensity}</span>
              </li>

              {/* Notes */}
              <li className="flex items-center gap-3">
                <FaStickyNote className="text-yellow-500 text-lg" />
                <span className="font-medium">Notes:</span>
                <span>{selectedWorkout.notes}</span>
              </li>

              {/* Date */}
              <li className="flex items-center gap-3">
                <FaClock className="text-gray-500 text-lg" />
                <span className="font-medium">Date:</span>
                <span>{formatDate(selectedWorkout.date)}</span>
              </li>
            </ul>

            {/* Close Modal Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setSelectedWorkout(null)}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-500 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UPRecentWorkout;
