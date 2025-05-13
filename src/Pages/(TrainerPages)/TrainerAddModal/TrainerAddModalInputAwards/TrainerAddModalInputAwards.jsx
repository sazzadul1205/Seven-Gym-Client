import { useEffect } from "react";

// Import Packages
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// import Icons
import { FaArrowRight } from "react-icons/fa";

// Import Input Form
import DynamicFieldArrayInputList from "../../../../Shared/DynamicFieldArrayInputList/DynamicFieldArrayInputList";

// Import Buttons
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const TrainerAddModalInputAwards = ({ onNextStep }) => {
  // useForm hook from react-hook-form for handling form state and validation
  const { control, handleSubmit, setValue } = useForm({});

  // Preload awards from localStorage
  useEffect(() => {
    const existingData =
      JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};

    if (existingData.awards) {
      setValue("awards", existingData.awards);
    }
  }, [setValue]);

  const onSubmit = (data) => {
    try {
      // Get existing data
      const storedInfo =
        JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};

      // Merge new partnerships into existing data
      const updatedInfo = {
        ...storedInfo,
        awards: data.awards || [],
      };

      // Save updated data
      localStorage.setItem("trainerBasicInfo", JSON.stringify(updatedInfo));

      // Move to next modal step if provided
      if (onNextStep) onNextStep();
    } catch (error) {
      console.error("Error updating trainer info in localStorage:", error);
    }
  };

  return (
    <div className="p-2">
      {/* Title */}
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Trainer Awards
      </h3>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-2">
        {/* Enter Award Data */}
        <DynamicFieldArrayInputList
          control={control}
          name="awards"
          label="Awards"
          placeholder="Enter award title"
          fields={["title", "organization", "year"]}
          multiFieldLayoutClass="flex gap-1"
        />

        {/* Submit Button */}
        <div className="flex justify-center items-center w-full">
          <CommonButton
            type="submit"
            text="Next Step"
            icon={<FaArrowRight />}
            iconSize="text-lg"
            bgColor="blue"
            px="px-10"
            py="py-3"
            borderRadius="rounded-lg"
            width="auto"
            isLoading={false}
            textColor="text-white"
            iconPosition="after"
          />
        </div>
      </form>
    </div>
  );
};

// Prop validation
TrainerAddModalInputAwards.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalInputAwards;
