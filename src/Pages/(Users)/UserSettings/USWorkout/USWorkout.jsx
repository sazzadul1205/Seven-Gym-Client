/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdOutlineWorkOutline } from "react-icons/md";
import AddWorkoutModal from "./AddWorkoutModal/AddWorkoutModal";

const USWorkout = ({ UsersData, refetch }) => {
  const { recentWorkouts = [] } = UsersData || [];
  const [sortedWorkouts, setSortedWorkouts] = useState(recentWorkouts);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Function to format date
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Sorting function
  const handleSort = (key) => {
    const newDirection =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction: newDirection });

    const sortedData = [...recentWorkouts].sort((a, b) => {
      if (key === "date") {
        // Sort dates
        return newDirection === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      if (key === "intensity") {
        // Sort intensity (Low, Moderate, High)
        const intensityOrder = { Low: 1, Moderate: 2, High: 3 };
        return newDirection === "asc"
          ? intensityOrder[a[key]] - intensityOrder[b[key]]
          : intensityOrder[b[key]] - intensityOrder[a[key]];
      }
      if (key === "calories" || key === "duration") {
        // Sort numbers
        return newDirection === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
      // Default: Sort strings alphabetically
      return newDirection === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    setSortedWorkouts(sortedData);
  };

  return (
    <div className="w-full bg-gray-200 min-h-screen">
      {/* Header */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <MdOutlineWorkOutline /> User Workout Settings
        </p>
      </header>

      {/* Add Workout Button */}
      <div className="flex py-5 px-5">
        <button
          className="flex gap-3 items-center bg-gradient-to-br hover:bg-gradient-to-tr from-green-500 to-green-300 text-gray-100 hover:text-gray-500 font-semibold px-16 py-3 rounded-lg"
          onClick={() =>
            document.getElementById("Add_Workout_Modal").showModal()
          }
        >
          + Add Workout
        </button>
      </div>

      {/* Workout Table */}
      <div className="px-5 pb-5">
        <p className="text-xl font-semibold mb-4">Recent Workouts</p>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-400 text-white">
                <th className="px-4 py-2 border border-gray-300">#</th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                </th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("duration")}
                >
                  Duration
                </th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                </th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("calories")}
                >
                  Calories
                </th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("location")}
                >
                  Location
                </th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  Type
                </th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => handleSort("intensity")}
                >
                  Intensity
                </th>
                <th className="px-4 py-2 border border-gray-300">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sortedWorkouts.map((workout, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200`}
                >
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {workout.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 w-[120px]">
                    {workout.duration}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {formatDate(workout.date)}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {workout.calories} Kcal
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {workout.location}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {workout.type}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {workout.intensity}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 italic">
                    {workout.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="Add_Workout_Modal" className="modal">
        <AddWorkoutModal refetch={refetch} />
      </dialog>
    </div>
  );
};

export default USWorkout;
