/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import AddWorkoutModal from "./AddWorkoutModal/AddWorkoutModal";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { CiViewTable } from "react-icons/ci";
import { IoGridOutline } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  FaClock,
  FaFire,
  FaMapMarkerAlt,
  FaThLarge,
  FaTachometerAlt,
} from "react-icons/fa";

const USWorkout = ({ UsersData, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { recentWorkouts = [] } = UsersData || [];

  const [viewMode, setViewMode] = useState("table"); // View mode (table or grid)
  const [isSpinning, setIsSpinning] = useState(false); // Spinner state for refreshing

  // Format date
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

  // Delete Workout Function
  const deleteWorkout = async (workoutId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosPublic.delete("/Users/delete-workout", {
          data: { email: UsersData.email, workoutId },
        });
        if (response.status === 200) refetch();
        else throw new Error("Failed to delete workout.");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  // Handle refresh button click (for spinner animation)
  const handleClick = () => {
    setIsSpinning(true);
    refetch(); // Call the refetch function to update data

    // Stop spinning after the animation duration (e.g., 0.5s)
    setTimeout(() => setIsSpinning(false), 500);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <MdOutlineWorkOutline /> User Workout Settings
        </p>
      </header>

      {/* Main Content */}
      <main className="p-5">
        <div className="flex justify-between items-center mb-5">
          {/* Button to show Add Workout modal */}
          <button
            className="flex gap-3 items-center bg-green-500 hover:bg-green-400 text-white font-semibold px-16 py-3 rounded-lg"
            onClick={() =>
              document.getElementById("Add_Workout_Modal").showModal()
            }
          >
            + Add Workout
          </button>

          {/* View mode and refresh controls */}
          <div className="flex items-center bg-blue-100 gap-5 px-3 py-2">
            {/* View mode toggle */}
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                checked={viewMode === "grid"}
                onChange={() =>
                  setViewMode(viewMode === "table" ? "grid" : "table")
                }
              />
              <CiViewTable className="swap-off h-8 w-8 text-blue-700" />
              <IoGridOutline className="swap-on h-8 w-8 text-blue-600" />
            </label>

            {/* Refresh button */}
            <button onClick={handleClick}>
              <HiOutlineRefresh
                className={`h-8 w-8 transition-transform duration-500 ${
                  isSpinning ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Workout Display */}
        <div>
          {/* Table or Grid view based on selected view mode */}
          {viewMode === "table" ? (
            <div className="overflow-x-auto bg-white shadow-lg hover:shadow-2xl">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="p-3 border border-slate-200">#</th>
                    <th className="p-3 border border-slate-200">Name</th>
                    <th className="p-3 border border-slate-200">Duration</th>
                    <th className="p-3 border border-slate-200">Date</th>
                    <th className="p-3 border border-slate-200">Calories</th>
                    <th className="p-3 border border-slate-200">Location</th>
                    <th className="p-3 border border-slate-200">Type</th>
                    <th className="p-3 border border-slate-200">Intensity</th>
                    <th className="p-3 border border-slate-200">Notes</th>
                    <th className="p-3 border border-slate-200">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentWorkouts.map((workout, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      <td className="px-4 py-2 border text-center">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border">{workout.name}</td>
                      <td className="px-4 py-2 border">{workout.duration}</td>
                      <td className="px-4 py-2 border">
                        {formatDate(workout.date)}
                      </td>
                      <td className="px-4 py-2 border">
                        {workout.calories} Kcal
                      </td>
                      <td className="px-4 py-2 border">{workout.location}</td>
                      <td className="px-4 py-2 border">{workout.type}</td>
                      <td className="px-4 py-2 border">{workout.intensity}</td>
                      <td className="px-4 py-2 border italic">
                        {workout.notes}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          className="bg-red-500 hover:bg-red-400 p-4 rounded-xl"
                          onClick={() => deleteWorkout(workout.workoutId)}
                        >
                          <FaRegTrashAlt className="text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWorkouts.map((workout, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg hover:shadow-2xl rounded-xl p-6 flex flex-col transition-transform transform hover:scale-105"
                >
                  {/* Workout Name */}
                  <h2 className="text-xl font-semibold text-gray-800">
                    {workout.name}
                  </h2>

                  {/* Workout Duration */}
                  <div className="flex items-center mt-2 text-gray-600">
                    <FaClock className="mr-2 text-gray-500" />
                    <p>{workout.duration}</p>
                  </div>

                  {/* Calories Burned */}
                  <div className="flex items-center mt-2 text-gray-600">
                    <FaFire className="mr-2 text-red-500" />
                    <p>{workout.calories} Kcal</p>
                  </div>

                  {/* Workout Location */}
                  <div className="flex items-center mt-2 text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    <p>{workout.location}</p>
                  </div>

                  {/* Workout Type */}
                  <div className="flex items-center mt-2 text-gray-600">
                    <FaThLarge className="mr-2 text-green-500" />
                    <p>{workout.type}</p>
                  </div>

                  {/* Intensity */}
                  <div className="flex items-center mt-2 text-gray-600">
                    <FaTachometerAlt className="mr-2 text-yellow-500" />
                    <p>{workout.intensity}</p>
                  </div>

                  {/* Notes */}
                  <p className="italic text-gray-500 mt-2">{workout.notes}</p>

                  {/* Delete Button */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="bg-red-500 hover:bg-red-400 p-3 rounded-lg transition-all duration-300"
                      onClick={() => deleteWorkout(workout.workoutId)}
                    >
                      <FaRegTrashAlt className="text-white text-xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <dialog id="Add_Workout_Modal" className="modal">
        <AddWorkoutModal refetch={refetch} />
      </dialog>
    </div>
  );
};

export default USWorkout;
