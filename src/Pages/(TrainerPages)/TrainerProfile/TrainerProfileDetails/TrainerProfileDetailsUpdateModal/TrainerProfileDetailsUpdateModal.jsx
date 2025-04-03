// Import Package
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Import Icons
import { ImCross } from "react-icons/im";

// import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Input Field
import DynamicFieldArrayInputList from "../../../../../Shared/DynamicFieldArrayInputList/DynamicFieldArrayInputList";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useState } from "react";
import Swal from "sweetalert2";

const TrainerProfileDetailsUpdateModal = ({ TrainerDetails, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Control
  const { control, handleSubmit } = useForm({
    defaultValues: {
      certifications: TrainerDetails?.certifications,
      focusAreas: TrainerDetails?.preferences?.focusAreas,
      classTypes: TrainerDetails?.preferences?.classTypes,
      additionalServices: TrainerDetails?.additionalServices,
      equipmentUsed: TrainerDetails?.equipmentUsed,
      languagesSpoken: TrainerDetails?.languagesSpoken,
      awards: TrainerDetails?.awards,
      partnerships: TrainerDetails?.partnerships,
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Format the data as required
    const formattedData = {
      certifications: data.certifications,
      awards: data.awards.map((award) => ({
        title: award.title,
        year: award.year,
        organization: award.organization,
      })),
      preferences: {
        focusAreas: data.focusAreas,
        classTypes: TrainerDetails?.preferences?.classTypes,
      },
      languagesSpoken: data.languagesSpoken,
      additionalServices: data.additionalServices,
      equipmentUsed: data.equipmentUsed,
      partnerships: data.partnerships.map((partnership) => ({
        partnerName: partnership.partnerName,
        website: partnership.website,
      })),
    };

    try {
      // Post the formatted data to your server
      await axiosPublic.put(
        `/Trainers/UpdateTrainerDetailsInfo/${TrainerDetails._id}`,
        formattedData
      );

      // On success, show a success alert
      Swal.fire({
        title: "Success",
        text: "Trainer profile updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Optionally trigger a refetch or additional actions here
      refetch();
      document.getElementById("Trainer_Profile_Details_Update_Modal")?.close();
    } catch (error) {
      // On error, show an error alert with a meaningful message
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.error ||
          "An error occurred while updating the trainer profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Update Trainer Profile Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document
              .getElementById("Trainer_Profile_Details_Update_Modal")
              ?.close()
          }
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <DynamicFieldArrayInputList
          control={control}
          name="certifications"
          label="Certifications"
          placeholder="Enter certification"
          fields={["name"]}
        />

        {/* Awards */}
        <DynamicFieldArrayInputList
          control={control}
          name="awards"
          label="Awards"
          placeholder="Enter award title"
          fields={["title", "organization", "year"]}
        />

        {/* Partnerships */}
        <DynamicFieldArrayInputList
          control={control}
          name="partnerships"
          label="Partnerships"
          placeholder="Enter partner name"
          fields={["partnerName", "website"]}
        />

        {/* Focus Areas */}
        <DynamicFieldArrayInputList
          control={control}
          name="focusAreas"
          label="Focus Areas"
          placeholder="Enter focus area"
          fields={["name"]}
        />

        {/* Additional Services */}
        <DynamicFieldArrayInputList
          control={control}
          name="additionalServices"
          label="Additional Services"
          placeholder="Enter service"
          fields={["name"]}
        />

        {/* Equipment Used */}
        <DynamicFieldArrayInputList
          control={control}
          name="equipmentUsed"
          label="Equipment Used"
          placeholder="Enter equipment"
          fields={["name"]}
        />

        {/* Languages Spoken */}
        <DynamicFieldArrayInputList
          control={control}
          name="languagesSpoken"
          label="Languages Spoken"
          placeholder="Enter language"
          fields={["name"]}
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

// Prop Validation
TrainerProfileDetailsUpdateModal.propTypes = {
  TrainerDetails: PropTypes.shape({
    _id: PropTypes.string,
    certifications: PropTypes.arrayOf(PropTypes.string),
    preferences: PropTypes.shape({
      focusAreas: PropTypes.arrayOf(PropTypes.string),
      classTypes: PropTypes.arrayOf(PropTypes.string),
    }),
    additionalServices: PropTypes.arrayOf(PropTypes.string),
    equipmentUsed: PropTypes.arrayOf(PropTypes.string),
    languagesSpoken: PropTypes.arrayOf(PropTypes.string),
    awards: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Accepts both string and number
        organization: PropTypes.string.isRequired,
      })
    ),
    partnerships: PropTypes.arrayOf(
      PropTypes.shape({
        partnerName: PropTypes.string,
        website: PropTypes.string,
      })
    ),
  }),
  refetch: PropTypes.func.isRequired,
};

export default TrainerProfileDetailsUpdateModal;
