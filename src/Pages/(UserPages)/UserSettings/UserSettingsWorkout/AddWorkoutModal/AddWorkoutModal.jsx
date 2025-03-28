import { useState } from "react";

import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Utility
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const AddWorkoutModal = ({ refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Loading Sate
  const [loading, setLoading] = useState(false);

  // React Hook Form configuration
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // A Function for Submitting Form
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const today = new Date();

      // Helper function to format the date as "dd-mm-yy"
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
        const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
        return `${day}-${month}-${year}`;
      };

      const formattedDate = formatDate(today);

      // Validate time input
      if (!data.time || !/^\d{2}:\d{2}$/.test(data.time)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Time",
          text: "Please enter a valid time in hh:mm format.",
        });
        return;
      }

      // Format workout date and time as "dd-mm-yyThh:mm"
      const workoutDateTime = `${formattedDate}T${data.time}`;

      // Generate a unique 5-digit random workout ID
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const uniqueId = `${user?.email}-${formattedDate}-${randomCode}`;

      // Prepare workout data payload
      const workoutData = {
        workoutId: uniqueId,
        name: data.name,
        type: data.type,
        intensity: data.intensity,
        location: data.location,
        date: formattedDate,
        registeredDateAndTime: workoutDateTime,
        duration: `${data.durationValue} ${data.durationUnit}`,
        calories: data.calories,
        notes: data.notes,
      };

      // Make API POST request to save workout
      await axiosPublic.post("/Users/Add_Workout", {
        email: user?.email,
        workout: workoutData,
      });

      // Show success notification
      Swal.fire({
        icon: "success",
        title: "Workout Added",
        text: "Your workout has been successfully added!",
        showConfirmButton: false,
        timer: 1500,
      });

      refetch();
      reset();
      document.getElementById("Add_Workout_Modal")?.close();
    } catch (error) {
      console.error("Workout Submission Error:", error);

      // Show error notification
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box min-w-[1000px] bg-gray-100 p-0 rounded-xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-black text-black pb-2 p-5">
        <h3 className="font-bold text-lg">Add Workout</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Add_Workout_Modal").close()}
        />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="text-black py-4 px-5">
        <div className="flex justify-between gap-5">
          {/* Left Column for Inputs */}
          <div className="space-y-4">
            {/* Input for Workout Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Workout Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Workout name is required" })}
                className="input input-bordered rounded-2xl bg-white border-gray-600 w-[460px]"
                placeholder="Enter workout name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Duration Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Duration</label>
              <div className="flex">
                {/* Number Input */}
                <input
                  type="number"
                  {...register("durationValue", {
                    required: "Duration is required",
                  })}
                  className="input input-bordered bg-white border-gray-600 w-2/3"
                  placeholder="Enter value"
                />
                {/* Time Selector */}
                <select
                  {...register("durationUnit", {
                    required: "Unit is required",
                  })}
                  className="select select-bordered bg-white border-gray-600 w-1/3"
                >
                  <option value="minute">Minute</option>
                  <option value="hour">Hour</option>
                </select>
              </div>
              {errors.durationValue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.durationValue.message}
                </p>
              )}
              {errors.durationUnit && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.durationUnit.message}
                </p>
              )}
            </div>

            {/* Input for Time */}
            <div className="mb-4 ">
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                {...register("time", { required: "Time is required" })}
                className="input input-bordered rounded-2xl border-gray-600 w-[460px] bg-white text-black"
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
                className="input input-bordered  bg-white border-gray-600 w-[460px]"
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
                className="input input-bordered rounded-2xl bg-white border-gray-600 w-[460px]"
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
                className="input input-bordered rounded-2xl bg-white border-gray-600 w-[460px]"
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
                className="select select-bordered border-gray-600 w-[460px] bg-white text-black"
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
                className="textarea textarea-bordered rounded-2xl bg-white border-gray-600 w-[460px]"
                placeholder="Optional notes about the workout"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-action">
          <button
            type="submit"
            className={`py-3 mt-3 px-10 cursor-pointer text-white ${
              loading
                ? "bg-gray-400"
                : "bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600"
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

AddWorkoutModal.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AddWorkoutModal;
