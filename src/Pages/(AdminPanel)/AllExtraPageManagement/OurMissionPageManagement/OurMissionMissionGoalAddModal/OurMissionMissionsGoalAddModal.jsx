import { useState } from "react";

// Import Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const OurMissionMissionGoalAddModal = ({ Refetch }) => {
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [modalError, setModalError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    // Construct payload with form data and image URL
    const payload = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      ...data,
    };
    try {
      await axiosPublic.patch(`/Our_Missions/AddMissionGoal`, payload);

      // Reset form and state
      reset();
      Refetch();

      document.getElementById("Our_Mission_Goal_Add_Modal").close();

      Swal.fire({
        icon: "success",
        title: "Goal Added Successfully",
        text: "Your new Goal has been successfully Saved.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Submission failed:", error);
      setModalError("Something went wrong while saving the data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-2xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-500 px-5 py-4">
        <h3 className="font-bold text-lg">Add New Mission Goal</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Our_Mission_Goal_Add_Modal").close()
          }
        />
      </div>

      {/* Error messages */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {errors.goal && <div>Goal is required.</div>}
          {errors.progress && <div>Progress status is required.</div>}
          {modalError && <div>{modalError}</div>}
        </div>
      )}

      {/* Modal Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
        {/* Goal */}
        <div>
          <label className="block text-sm font-medium mb-1">Goal</label>
          <input
            type="text"
            {...register("goal", { required: "Goal is required" })}
            placeholder="Enter mission goal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.goal && (
            <p className="text-red-500 text-xs mt-1">{errors.goal.message}</p>
          )}
        </div>

        {/* Progress */}
        <div>
          <label className="block text-sm font-medium mb-1">Progress</label>
          <select
            {...register("progress", { required: "Progress is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select progress status</option>
            <option value="On Track">On Track</option>
            <option value="In Progress">In Progress</option>
            <option value="Initiated">Initiated</option>
            <option value="Planned">Planned</option>
          </select>
          {errors.progress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.progress.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Goal"
            bgColor="green"
            isLoading={loading}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

// Prop Validation
OurMissionMissionGoalAddModal.propTypes = {
  Refetch: PropTypes.func.isRequired,
};

export default OurMissionMissionGoalAddModal;
