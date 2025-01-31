/* eslint-disable react/prop-types */
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import AddWorkoutModal from "./AddWorkoutModal/AddWorkoutModal";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const USWorkout = ({ UsersData, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { recentWorkouts = [] } = UsersData || [];

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

  return (
    <div className="w-full bg-gray-200 min-h-screen">
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <MdOutlineWorkOutline /> User Workout Settings
        </p>
      </header>

      <div className="flex py-5 px-5">
        <button
          className="bg-green-500 hover:bg-green-400 text-white font-semibold px-16 py-3 rounded-lg"
          onClick={() =>
            document.getElementById("Add_Workout_Modal").showModal()
          }
        >
          + Add Workout
        </button>
      </div>

      <div className="px-5 pb-5">
        <p className="text-xl font-semibold mb-4">Recent Workouts</p>
        <div className="overflow-x-auto">
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
              {recentWorkouts.map((workout, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{workout.name}</td>
                  <td className="px-4 py-2 border">{workout.duration}</td>
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
      </div>

      <dialog id="Add_Workout_Modal" className="modal">
        <AddWorkoutModal refetch={refetch} />
      </dialog>
    </div>
  );
};

export default USWorkout;
