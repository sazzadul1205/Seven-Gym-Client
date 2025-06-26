import { useEffect, useState } from "react";

// import Packages
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// import Icons
import { ImCross } from "react-icons/im";

// Shared Components
import DynamicFieldArrayInputList from "../../../../../Shared/DynamicFieldArrayInputList/DynamicFieldArrayInputList";

// Import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const ClassDetailsMoreDetailsEditModal = ({ selectedClass, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  const [modalError, setModalError] = useState(null);
  const [loading, setLoading] = useState(false);

  // React Hook Form setup
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      classGoals: [],
      fitnessBenefits: [],
      feedbackMechanism: [],
      classMilestones: [],
    },
  });

  // Populate form on mount
  useEffect(() => {
    if (selectedClass) {
      reset({
        classGoals: selectedClass?.classGoals || [""],
        fitnessBenefits: selectedClass?.fitnessBenefits || [""],
        feedbackMechanism: selectedClass?.feedbackMechanism || [""],
        classMilestones: selectedClass?.classMilestones || [""],
      });
    }
  }, [selectedClass, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setModalError(null);
    setLoading(true);

    try {
      // Remove empty strings from each array field
      const cleaned = Object.fromEntries(
        Object.entries(data).map(([key, arr]) => [
          key,
          arr.filter((item) => typeof item === "string" && item.trim() !== ""),
        ])
      );

      // Exclude _id from selectedClass and merge with cleaned data
      const { _id, ...rest } = selectedClass;
      const updatedData = {
        ...rest,
        ...cleaned,
      };

      // Send update request
      await axiosPublic.put(`/Class_Details/${_id}`, updatedData);

      // Refresh data and close modal
      Refetch?.();
      document.getElementById("Class_More_Details_Edit_Modal")?.close();
    } catch (err) {
      // Handle error
      console.error("Failed to update:", err);
      setModalError("Failed to update class details. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Close modal
  const handleClose = () => {
    reset();
    setModalError(null);
    document.getElementById("Class_More_Details_Edit_Modal")?.close();
  };

  return (
    <div
      id="Class_More_Details_Edit_Modal"
      className="modal-box max-w-3xl p-0 bg-gradient-to-b from-white to-gray-300 text-black"
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit : {selectedClass?.module} Class Key Features
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={handleClose}
        />
      </div>

      {/* Error Display */}
      {modalError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm m-5">
          {modalError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6 ">
        {/* Class Goals Inputs */}
        <DynamicFieldArrayInputList
          control={control}
          name="classGoals"
          label="Class Goals"
          fields={["value"]}
        />

        {/* Fitness Benefits Inputs */}
        <DynamicFieldArrayInputList
          control={control}
          name="fitnessBenefits"
          label="Fitness Benefits"
          fields={["value"]}
        />

        {/* Feedback Mechanism Inputs */}
        <DynamicFieldArrayInputList
          control={control}
          name="feedbackMechanism"
          label="Feedback Mechanism"
          fields={["value"]}
        />

        {/* Class Milestones Inputs */}
        <DynamicFieldArrayInputList
          control={control}
          name="classMilestones"
          label="Class Milestones"
          fields={["value"]}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <CommonButton
            type="submit"
            text={loading ? "Saving..." : "Save Changes"}
            bgColor="green"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

// PropTypes
ClassDetailsMoreDetailsEditModal.propTypes = {
  selectedClass: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    module: PropTypes.string,
    classGoals: PropTypes.array,
    fitnessBenefits: PropTypes.array,
    feedbackMechanism: PropTypes.array,
    classMilestones: PropTypes.array,
  }),
  Refetch: PropTypes.func,
};

export default ClassDetailsMoreDetailsEditModal;
