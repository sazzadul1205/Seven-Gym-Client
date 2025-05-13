import { useEffect } from "react";

// import Packages
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { FaArrowRight } from "react-icons/fa";

// Import Input Form
import DynamicFieldArrayInputList from "../../../../Shared/DynamicFieldArrayInputList/DynamicFieldArrayInputList";

// Import Buttons
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const TrainerAddModalInputTrainingDetails = ({ onNextStep }) => {
  // useForm hook from react-hook-form for handling form state and validation
  const { control, handleSubmit, setValue } = useForm({});

  useEffect(() => {
    // Fetch data from localStorage if exists
    const existingData =
      JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};

    // Set the fetched data into the form using setValue
    if (existingData) {
      // Set focusAreas under preferences
      if (existingData.preferences && existingData.preferences.focusAreas) {
        setValue("focusAreas", existingData.preferences.focusAreas);
      }

      // Set other fields
      Object.keys(existingData).forEach((key) => {
        if (key !== "preferences") {
          setValue(key, existingData[key]);
        }
      });
    }
  }, [setValue]);

  const onSubmit = (data) => {
    // Modify the data by moving focusAreas under preferences
    const modifiedData = {
      ...data,
      preferences: {
        ...data.preferences,
        focusAreas: data.focusAreas, // Move focusAreas under preferences
      },
    };

    // Remove focusAreas from the root of the data to avoid duplication
    delete modifiedData.focusAreas;

    // Get existing data from localStorage (if any)
    const existingData =
      JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};

    // Merge existing data with the modified data
    const updatedData = {
      ...existingData,
      ...modifiedData,
    };

    // Save the updated data back to localStorage
    localStorage.setItem("trainerBasicInfo", JSON.stringify(updatedData));

    onNextStep();
  };

  return (
    <div className="p-2">
      {/* Title */}
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Trainer Details
      </h3>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-2">
        {/* Single Field Data */}
        <div className="grid grid-cols-2 gap-2">
          {/* Certifications */}
          <DynamicFieldArrayInputList
            control={control}
            name="certifications"
            label="Certifications"
            placeholder="Enter certification"
            fields={["name"]}
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
        </div>

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
TrainerAddModalInputTrainingDetails.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};

export default TrainerAddModalInputTrainingDetails;
