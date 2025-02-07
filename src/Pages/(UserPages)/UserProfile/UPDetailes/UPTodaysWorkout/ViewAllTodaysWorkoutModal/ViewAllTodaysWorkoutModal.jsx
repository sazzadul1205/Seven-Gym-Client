/* eslint-disable react/prop-types */
import { useState } from "react";
import Swal from "sweetalert2";
import { ImCross } from "react-icons/im";
import { FaRegTrashAlt } from "react-icons/fa";
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

const ViewAllTodaysWorkoutModal = ({ usersData, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // State for delete confirmation message
  const [successMessage, setSuccessMessage] = useState(null); // State for success message

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Filter workouts to only include today's workouts
  const todaysWorkouts = usersData.recentWorkouts.filter((workout) => {
    const workoutDate = workout.date.split("T")[0];
    return workoutDate === today;
  });

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust the format as needed
  };

  // Function to handle workout deletion
  const deleteWorkout = async (workoutId) => {
    // Set the delete confirmation message
    setDeleteConfirmation(
      <div className="bg-red-500 text-white p-3 mb-4 flex justify-between items-center">
        <span>Are you sure you want to delete this workout?</span>
        <div>
          <button
            className="bg-white text-red-500 px-4 py-1 rounded-lg mr-2 hover:bg-gray-100"
            onClick={() => confirmDelete(workoutId)}
          >
            Yes
          </button>
          <button
            className="bg-white text-red-500 px-4 py-1 rounded-lg hover:bg-gray-100"
            onClick={() => setDeleteConfirmation(null)}
          >
            No
          </button>
        </div>
      </div>
    );
  };

  // Function to confirm deletion
  const confirmDelete = async (workoutId) => {
    try {
      const response = await axiosPublic.delete("/Users/delete-workout", {
        data: { email: usersData.email, workoutId },
      });
      if (response.status === 200) {
        setDeleteConfirmation(null); // Clear the confirmation message
        setSuccessMessage("Workout deleted successfully!"); // Set success message
        refetch(); // Refetch data
        setTimeout(() => setSuccessMessage(null), 5000); // Clear success message after 5 seconds
      } else {
        throw new Error("Failed to delete workout.");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="modal-box max-w-[1200px] p-0">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-400 mb-2 px-5 py-3">
        <h2 className="text-2xl font-bold text-gray-800">
          View All Today&apos;s Workouts
        </h2>
        <button
          onClick={() =>
            document.getElementById("View_All_Todays_Workout_Modal").close()
          }
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
        >
          <ImCross className="text-xl text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* Delete Confirmation Message */}
      {deleteConfirmation}

      {/* Success Message */}
      <div>
        {successMessage && (
          <div className="bg-green-500 text-white p-3 mb-4">
            {successMessage}
          </div>
        )}
      </div>

      {/* Table to display today's workouts */}
      <div className="p-2">
        {todaysWorkouts.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-400 text-white">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Calories</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Intensity</th>
                <th className="px-4 py-2 border">Notes</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {todaysWorkouts.map((workout, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{workout.name}</td>
                  <td className="px-4 py-2 border">
                    {workout.durationValue} {workout.durationUnit}
                  </td>
                  <td className="px-4 py-2 border">
                    {formatDate(workout.date)}
                  </td>
                  <td className="px-4 py-2 border">{workout.calories} Kcal</td>
                  <td className="px-4 py-2 border">{workout.location}</td>
                  <td className="px-4 py-2 border">{workout.type}</td>
                  <td className="px-4 py-2 border">{workout.intensity}</td>
                  <td className="px-4 py-2 border italic">{workout.notes}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-red-500 hover:bg-red-400 p-2 rounded-xl"
                      onClick={() => deleteWorkout(workout.workoutId)}
                    >
                      <FaRegTrashAlt className="text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 py-4">
            No workouts for today.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewAllTodaysWorkoutModal;
