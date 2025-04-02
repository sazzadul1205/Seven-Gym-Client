import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { ImCross } from "react-icons/im";

// Import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// input Input Field
import InputField from "../../../../../Shared/InputField/InputField";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useState } from "react";

const TrainerProfileAboutUpdateModal = ({ TrainerDetails, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: TrainerDetails?.bio || "",
      experience: TrainerDetails?.experience || "",
      age: TrainerDetails?.age || "",
    },
  });

  // Submit Hook
  const onSubmit = async (data) => {
    try {
      // Set isSubmitting to true before the API call
      setIsSubmitting(true);

      // API call to update trainer details
      const response = await axiosPublic.put(
        `/Trainers/UpdateTrainerAboutInfo/${TrainerDetails?._id}`,
        data
      );

      // Check for successful response
      if (response.status === 200) {
        // Success alert
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Trainer profile updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        // Refetch data after update
        refetch();

        // Close the modal
        document.getElementById("Trainer_Profile_About_Update_Modal")?.close();
      } else {
        throw new Error("Failed to update trainer profile");
      }
    } catch (error) {
      console.error("Error updating trainer profile:", error.message);
      // Error alert
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating the trainer profile.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      // Set isSubmitting to false after the API call is finished
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Update Trainer Profile About</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document
              .getElementById("Trainer_Profile_About_Update_Modal")
              ?.close()
          }
        />
      </div>

      {/* Content Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <InputField
          label="Bio"
          id="bio"
          type="textarea"
          placeholder="Enter trainer bio"
          register={register}
          errors={errors}
        />
        <InputField
          label="Experience (years)"
          id="experience"
          type="number"
          placeholder="Enter experience in years"
          register={register}
          errors={errors}
        />
        <InputField
          label="Age"
          id="age"
          type="number"
          placeholder="Enter age"
          register={register}
          errors={errors}
        />

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <CommonButton
            onClick={handleSubmit(onSubmit)} // Use onClick here directly
            text="Save Changes"
            bgColor="green"
            isLoading={isSubmitting}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

// Prop Type Validation
TrainerProfileAboutUpdateModal.propTypes = {
  TrainerDetails: PropTypes.shape({
    _id: PropTypes.string,
    bio: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default TrainerProfileAboutUpdateModal;
