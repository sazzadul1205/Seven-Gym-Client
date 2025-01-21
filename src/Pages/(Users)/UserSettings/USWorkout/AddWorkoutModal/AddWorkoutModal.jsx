import React from "react";
import { ImCross } from "react-icons/im"; // Icon for closing the modal
import { useForm } from "react-hook-form"; // React Hook Form for managing form inputs and validation

const AddWorkoutModal = ({ onAddWorkout }) => {
  // Initializing the useForm hook for form management
  const {
    register, // Registers an input field for validation and tracking
    handleSubmit, // Handles form submission
    reset, // Resets form fields
    formState: { errors }, // Contains validation errors
  } = useForm();

  // Function executed when the form is successfully submitted
  const onSubmit = (data) => {
    onAddWorkout(data); // Callback to pass the new workout data to the parent component
    reset(); // Clears the form fields
    document.getElementById("Add_Workout_Modal").close(); // Closes the modal dialog
  };

  return (
    <div className="modal-box min-w-[1000px] p-0 rounded-xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b pb-2 p-5">
        <h3 className="font-bold text-lg">Add Workout</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Add_Workout_Modal").close()} // Close modal when the close icon is clicked
        />
      </div>

      {/* Form for adding a new workout */}
      <form onSubmit={handleSubmit(onSubmit)} className="py-4 px-5">
        <div className="flex justify-between gap-5">
          {/* Left Column of Form Inputs */}
          <div>
            {/* Workout Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Workout Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Workout name is required" })} // Register input with validation
                className="input input-bordered rounded-2xl w-[460px]"
                placeholder="Enter workout name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p> // Display error if validation fails
              )}
            </div>

            {/* Duration Input */}
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

            {/* Date Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="datetime-local"
                {...register("date", { required: "Date is required" })}
                className="input input-bordered rounded-2xl w-[460px]"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Calories Burned Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Calories Burned
              </label>
              <input
                type="text"
                {...register("calories", {
                  required: "Calories burned is required",
                })}
                className="input input-bordered rounded-2xl w-[460px]"
                placeholder="e.g., 400 kcal"
              />
              {errors.calories && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.calories.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column of Form Inputs */}
          <div>
            {/* Location Input */}
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

            {/* Type Input */}
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

            {/* Intensity Dropdown */}
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

            {/* Notes Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium  mb-1">Notes</label>
              <textarea
                {...register("notes")}
                className="textarea textarea-bordered rounded-2xl w-[460px]"
                placeholder="Optional notes about the workout"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="modal-action">
          <button type="submit" className="btn btn-primary">
            Add Workout
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => document.getElementById("Add_Workout_Modal").close()}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkoutModal;
