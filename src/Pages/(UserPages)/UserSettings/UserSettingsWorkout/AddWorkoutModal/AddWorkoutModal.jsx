import { useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Utility
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import InputField from "../../../../../Shared/InputField/InputField";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const AddWorkoutModal = ({ refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Loading State
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
    <div className="modal-box w-full max-w-4xl bg-gray-100 p-0 rounded-xl">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Workout Name"
            id="name"
            type="text"
            register={register}
            errors={errors}
            placeholder="Enter workout name"
          />
          <InputField
            label="Location"
            id="location"
            type="text"
            register={register}
            errors={errors}
            placeholder="e.g., Central Park"
          />
          <InputField
            label="Type"
            id="type"
            type="text"
            register={register}
            errors={errors}
            placeholder="e.g., Cardio"
          />
          <InputField
            label="Intensity"
            id="intensity"
            type="select"
            register={register}
            errors={errors}
            options={["Low", "Moderate", "High"]}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <div className="flex gap-2">
              <input
                type="number"
                {...register("durationValue", {
                  required: "Duration is required",
                })}
                className="input input-bordered bg-white border-gray-600 w-2/3"
                placeholder="Enter value number"
              />
              <select
                {...register("durationUnit", { required: "Unit is required" })}
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
          <InputField
            label="Start Time"
            id="time"
            type="time"
            register={register}
            errors={errors}
          />
          <InputField
            label="Calories Burned"
            id="calories"
            type="number"
            register={register}
            errors={errors}
            placeholder="e.g., 400"
          />
          <InputField
            label="Notes"
            id="notes"
            type="textarea"
            register={register}
            errors={errors}
            placeholder="Optional notes about the workout"
          />
        </div>

        {/* Action Buttons */}
        <div className="modal-action flex justify-end">
          <CommonButton
            type="submit"
            text="Add Workout"
            isLoading={loading}
            loadingText="Adding..."
            bgColor="green"
            bgFromColor="green-300"
            bgToColor="green-600"
          />
        </div>
      </form>
    </div>
  );
};

AddWorkoutModal.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AddWorkoutModal;
