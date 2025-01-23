/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Swal from "sweetalert2";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { useForm } from "react-hook-form";
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const AddWorkoutModal = ({ refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [loading, setLoading] = useState(false);

  // React Hook Form configuration
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true);

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const workoutDateTime = `${formattedDate}T${data.time}`;

    // Function to generate a 16-character alphanumeric ID
    const generateRandomId = () => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let randomId = "";
      for (let i = 0; i < 16; i++) {
        randomId += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return randomId;
    };

    // Generate a unique workout ID using user email, date, and random string
    const uniqueId = `${user.email}-${formattedDate}-${generateRandomId()}`;

    // Prepare workout data payload
    const workoutData = {
      workoutId: uniqueId, // Unique workout ID
      ...data, // Spread form data into workoutData
      date: workoutDateTime, // Combine date and time
    };

    try {
      // Make API POST request to save workout
      const response = await axiosPublic.post("/Users/Add_Workout", {
        email: user.email,
        workout: workoutData,
      });

      // Show success notification
      Swal.fire({
        icon: "success",
        title: "Workout Added",
        text: "Your workout has been successfully added!",
      });

      refetch();
      reset();
      document.getElementById("Add_Workout_Modal").close();
    } catch (error) {
      // Show error notification
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // JSX for the modal
  return (
    <div className="modal-box min-w-[1000px] p-0 rounded-xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b pb-2 p-5">
        <h3 className="font-bold text-lg">Add Workout</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Add_Workout_Modal").close()}
        />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="py-4 px-5">
        <div className="flex justify-between gap-5">
          {/* Left Column for Inputs */}
          <div>
            {/* Input for Workout Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Workout Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Workout name is required" })}
                className="input input-bordered rounded-2xl w-[460px]"
                placeholder="Enter workout name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Input for Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input
                type="text"
                {...register("duration", { required: "Duration is required" })}
                className="input input-bordered rounded-2xl w-[460px]"
                placeholder="e.g., 45 minutes"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.duration.message}
                </p>
              )}
            </div>

            {/* Input for Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                {...register("time", { required: "Time is required" })}
                className="input input-bordered rounded-2xl w-[460px]"
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>

            {/* Input for Calories Burned */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Calories Burned
              </label>
              <input
                type="number"
                {...register("calories", {
                  required: "Calories burned is required",
                })}
                className="input input-bordered rounded-2xl w-[460px]"
                placeholder="e.g., 400"
              />
              {errors.calories && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.calories.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column for Inputs */}
          <div>
            {/* Input for Location */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className="input input-bordered rounded-2xl w-[460px]"
                placeholder="e.g., Central Park"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Input for Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <input
                type="text"
                {...register("type", { required: "Type is required" })}
                className="input input-bordered rounded-2xl w-[460px]"
                placeholder="e.g., Cardio"
              />
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Dropdown for Intensity */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Intensity
              </label>
              <select
                {...register("intensity", {
                  required: "Intensity is required",
                })}
                className="select select-bordered rounded-2xl w-[460px]"
              >
                <option value="">Select Intensity</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
              {errors.intensity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.intensity.message}
                </p>
              )}
            </div>

            {/* Textarea for Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                {...register("notes")}
                className="textarea textarea-bordered rounded-2xl w-[460px]"
                placeholder="Optional notes about the workout"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-action">
          <button
            type="submit"
            className={`py-3 mt-3 px-10 ${
              loading ? "bg-gray-400" : "bg-emerald-400 hover:bg-emerald-500"
            } font-semibold rounded-xl`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex gap-3">
                <span className="loading loading-spinner loading-sm"></span>
              </div>
            ) : (
              "Add Workout"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkoutModal;
