/* eslint-disable react/prop-types */
import { MdOutlineWorkOutline } from "react-icons/md";
import AddWorkoutModal from "./AddWorkoutModal/AddWorkoutModal";

const USWorkout = ({ UsersData, refetch }) => {
  const { recentWorkouts = [] } = UsersData || {}; // Default to an empty array if `recentWorkouts` is undefined.

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
                <th className="px-4 py-2 border border-gray-300">Name</th>
                <th className="px-4 py-2 border border-gray-300">Duration</th>
                <th className="px-4 py-2 border border-gray-300">Date</th>
                <th className="px-4 py-2 border border-gray-300">Calories</th>
                <th className="px-4 py-2 border border-gray-300">Location</th>
                <th className="px-4 py-2 border border-gray-300">Type</th>
                <th className="px-4 py-2 border border-gray-300">Intensity</th>
                <th className="px-4 py-2 border border-gray-300">Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentWorkouts.map((workout, index) => (
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
                    {workout.date}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {workout.calories}
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
        <AddWorkoutModal />
      </dialog>
    </div>
  );
};

export default USWorkout;
