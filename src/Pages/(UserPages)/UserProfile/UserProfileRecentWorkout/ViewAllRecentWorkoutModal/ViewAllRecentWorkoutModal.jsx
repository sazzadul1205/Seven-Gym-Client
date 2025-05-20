import { useState } from "react";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import Icons
import { ImCross } from "react-icons/im";
import { FaRegTrashAlt } from "react-icons/fa";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";

const ViewAllRecentWorkoutModal = ({ recentWorkouts, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // State for delete confirmation and success message
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust the format as needed
  };

  // Function to handle workout deletion
  const deleteWorkout = async (workoutId) => {
    // Set the delete confirmation message
    setDeleteConfirmation(
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center">
        {/* Warning Icon & Message */}
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-red-600 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.516 11.607c.75 1.337-.213 3.004-1.742 3.004H3.483c-1.529 0-2.492-1.667-1.742-3.004L8.257 3.1zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-.25-3.25a.75.75 0 00-1.5 0V10a.75.75 0 001.5 0v-.25z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">
            Are you sure you want to{" "}
            <span className="text-red-600">delete</span> this workout?
          </span>
        </div>
        {/* Confirmation Buttons */}
        <div className="flex mt-3 sm:mt-0">
          <button
            className="bg-linear-to-bl hover:bg-linear-to-tr from-red-400 to-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition duration-200 ease-in-out mr-2 cursor-pointer"
            onClick={() => confirmDelete(workoutId)}
          >
            Yes, Delete
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-md hover:bg-gray-300 transition duration-200 ease-in-out cursor-pointer"
            onClick={() => setDeleteConfirmation(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Function to confirm deletion
  const confirmDelete = async (workoutId) => {
    try {
      const response = await axiosPublic.delete("/Users/delete-workout", {
        data: { email: user.email, workoutId },
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
    <div className="modal-box max-w-6xl bg-gray-100 rounded-xl shadow-xl w-full relative">
      {/* Modal Header */}
      <div className="flex justify-between items-center text-black mb-4 border-b-2 border-black pb-2 px-2">
        <h3 className="font-bold text-lg flex items-center">
          View All Recent Workouts
        </h3>
        <button
          onClick={() =>
            document.getElementById("View_All_Recent_Workout_Modal").close()
          }
        >
          <ImCross className="hover:text-red-500 text-xl cursor-pointer" />
        </button>
      </div>

      {/* Delete Confirmation Message */}
      {deleteConfirmation}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500 text-white p-3 mb-4">{successMessage}</div>
      )}

      {/* Table to display all workouts */}
      <div className="overflow-x-auto bg-white text-black shadow-lg rounded-lg">
        {recentWorkouts.length > 0 ? (
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead className="bg-blue-100">
              <tr>
                {[
                  "#",
                  "Name",
                  "Duration",
                  "Date",
                  "Calories",
                  "Location",
                  "Type",
                  "Intensity",
                  "Notes",
                  "Action",
                ].map((header, index) => (
                  <th key={index} className="p-3 border border-gray-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentWorkouts.map((workout, index) => (
                <tr
                  key={workout.workoutId}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{workout.name}</td>
                  <td className="px-4 py-2 border">
                    {workout.duration
                      .replace(" minutes", " min")
                      .replace(" minute", " min")}
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
                      className="bg-red-500 hover:bg-red-400 p-3 rounded-md cursor-pointer"
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

ViewAllRecentWorkoutModal.propTypes = {
  recentWorkouts: PropTypes.arrayOf(
    PropTypes.shape({
      workoutId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      calories: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      intensity: PropTypes.string.isRequired,
      notes: PropTypes.string,
    })
  ).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ViewAllRecentWorkoutModal;
