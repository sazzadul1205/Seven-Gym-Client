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

const TrainerAddModalInputPartnerships = ({ onNextStep }) => {
  // useForm hook from react-hook-form for handling form state and validation
  const { control, handleSubmit, setValue } = useForm({});

  // Preload partnerships from localStorage
  useEffect(() => {
    const existingData =
      JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};

    if (existingData.partnerships) {
      setValue("partnerships", existingData.partnerships);
    }
  }, [setValue]);

  const onSubmit = (data) => {
    try {
      // Get existing data
      const existingData =
        JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};

      // Merge new partnerships into existing data
      const updatedData = {
        ...existingData,
        partnerships: data.partnerships || [],
      };

      // Save updated data
      localStorage.setItem("trainerBasicInfo", JSON.stringify(updatedData));

      // Move to next modal step if provided
      if (onNextStep) onNextStep();
    } catch (error) {
      console.error("Failed to save partnerships:", error);
    }
  };

  return (
    <div className="p-2">
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Trainer Partnerships
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="p-2">
        <DynamicFieldArrayInputList
          control={control}
          name="partnerships"
          label="Partnerships"
          placeholder="Enter partner name"
          fields={["partnerName", "website"]}
          multiFieldLayoutClass="flex gap-2"
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
TrainerAddModalInputPartnerships.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalInputPartnerships;
