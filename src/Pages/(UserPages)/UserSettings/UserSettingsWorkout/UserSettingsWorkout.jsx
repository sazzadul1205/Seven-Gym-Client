import { useEffect, useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import icons
import { IoMdAdd } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsExclamationCircle } from "react-icons/bs";
import { MdOutlineWorkOutline } from "react-icons/md";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Modal
import AddWorkoutModal from "./AddWorkoutModal/AddWorkoutModal";

// Import Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loading from "../../../../Shared/Loading/Loading";

const UserSettingsWorkout = ({ UsersData, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [UserWorkout, setUserWorkout] = useState([]);

  // Update UserWorkout whenever UsersData changes
  useEffect(() => {
    setUserWorkout(UsersData.recentWorkouts || []);
  }, [UsersData]);

  // Call refetch and update state after adding a workout
  const handleWorkoutAdded = async () => {
    await refetch(); // Fetch new data
    setUserWorkout(UsersData.recentWorkouts || []);
  };

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
  const todaysWorkouts = UserWorkout.filter(
    (workout) =>
      formatRegisteredDate(workout.registeredDateAndTime) === todayDate
  );

  // Filter out today's workouts from the all workouts list to prevent duplicates
  const filteredUserWorkout = UserWorkout.filter(
    (workout) =>
      !todaysWorkouts.some(
        (todaysWorkout) => todaysWorkout.workoutId === workout.workoutId
      )
  );

  // Function to delete a workout
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

        if (response.status === 200) {
          refetch(); // Fetch latest data
        } else {
          Swal.fire(
            "Error",
            response.data?.message || "Failed to delete the Workout.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting Workout:", error);
        Swal.fire(
          "Error",
          "Failed to delete the Workout. Please try again.",
          "error"
        );
      }
    }

    setUserWorkout(
      UserWorkout.filter((workout) => workout.workoutId !== workoutId)
    );
  };

  // Loading state
  if (!UsersData) {
    return <Loading />; // Or some other loading indicator
  }

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-gray-400 px-5 py-2">
        <p className="flex gap-2 items-center text-xl font-semibold italic text-white">
          <MdOutlineWorkOutline /> User Workout Settings
        </p>
      </div>
      {/* Add Workout Button */}
      <div className="flex items-center justify-between bg-gray-400/50 p-3">
        <CommonButton
          text="Add New Workout"
          bgColor="green"
          px="px-10"
          icon={<IoMdAdd />}
          iconSize="text-xl"
          clickEvent={() =>
            document.getElementById("Add_Workout_Modal").showModal()
          }
        />
      </div>
      {/* Today's Workouts Table */}
      <div className="bg-gray-400/50 text-black p-3 mt-2 overflow-x-auto">
        <h3 className="text-black font-semibold text-lg mb-3">
          Today&apos;s Workouts ({todayDate})
        </h3>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300">
            {/* Table Header */}
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="p-3 text-left">Workout Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Intensity</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Calories</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-left">Delete</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {todaysWorkouts.length > 0 ? (
                todaysWorkouts.map((workout, index) => (
                  <tr
                    key={workout.workoutId}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 font-semibold">{workout.name}</td>
                    <td className="p-3">{workout.type}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md text-white ${
                          workout.intensity === "High"
                            ? "bg-red-500"
                            : workout.intensity === "Moderate"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {workout.intensity}
                      </span>
                    </td>
                    <td className="p-3">{workout.location}</td>
                    <td className="p-3">
                      {formatRegisteredDate(workout.registeredDateAndTime)}
                    </td>
                    <td className="p-3">{workout.duration}</td>
                    <td className="p-3">{workout.calories}</td>
                    <td className="p-3">{workout.notes}</td>
                    <td className="p-3">
                      <button
                        className="px-4 bg-gradient-to-bl hover:bg-gradient-to-tr from-red-400 to-red-600 py-3 text-white text-xl rounded-xl cursor-pointer"
                        onClick={() => deleteWorkout(workout.workoutId)}
                      >
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="p-3 text-center text-black font-semibold bg-white"
                  >
                    <div className="justify-center flex items-center gap-2">
                      <BsExclamationCircle className="text-red-500" />
                      No workouts recorded&apos;s
                      <BsExclamationCircle className="text-red-500" />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* All Workouts Table */}
      <div className="bg-gray-400/50 text-black p-3 mt-6 overflow-x-auto">
        <h3 className="text-black font-semibold text-lg mb-3">All Workouts</h3>
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border border-gray-300">
            {/* Table Header */}
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="p-3 text-left">Workout Name</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Intensity</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Calories</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-left">Delete</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredUserWorkout.length > 0 ? (
                filteredUserWorkout.map((workout, index) => (
                  <tr
                    key={workout.workoutId}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 font-semibold">{workout.name}</td>
                    <td className="p-3">{workout.type}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md text-white ${
                          workout.intensity === "High"
                            ? "bg-red-500"
                            : workout.intensity === "Moderate"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {workout.intensity}
                      </span>
                    </td>
                    <td className="p-3">{workout.location}</td>
                    <td className="p-3">
                      {formatRegisteredDate(workout.registeredDateAndTime)}
                    </td>
                    <td className="p-3">{workout.duration}</td>
                    <td className="p-3">{workout.calories}</td>
                    <td className="p-3">{workout.notes}</td>
                    <td className="p-3">
                      <button
                        className="px-4 bg-gradient-to-bl hover:bg-gradient-to-tr from-red-400 to-red-600 py-3 text-white text-xl rounded-xl cursor-pointer"
                        onClick={() => deleteWorkout(workout.workoutId)}
                      >
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="p-3 text-center text-black font-semibold bg-white"
                  >
                    <div className="justify-center flex items-center gap-2">
                      <BsExclamationCircle className="text-red-500" />
                      No workouts recorded&apos;s
                      <BsExclamationCircle className="text-red-500" />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {/* Pass handleWorkoutAdded to the modal */}
      <dialog id="Add_Workout_Modal" className="modal">
        <AddWorkoutModal refetch={handleWorkoutAdded} />
      </dialog>
    </div>
  );
};

UserSettingsWorkout.propTypes = {
  UsersData: PropTypes.shape({
    email: PropTypes.string.isRequired,
    recentWorkouts: PropTypes.arrayOf(
      PropTypes.shape({
        workoutId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        intensity: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        registeredDateAndTime: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        calories: PropTypes.string.isRequired,
        notes: PropTypes.string.isRequired,
      })
    ),
  }),
  refetch: PropTypes.func.isRequired,
};

export default UserSettingsWorkout;
