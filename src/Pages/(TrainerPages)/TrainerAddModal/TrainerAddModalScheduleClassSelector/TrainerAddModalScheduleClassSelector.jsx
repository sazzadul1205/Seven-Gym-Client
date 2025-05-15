import { useState, useEffect } from "react";

// Import JSON
import ClassInformation from "../../../../JSON/ClassInformation.json";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Icons
import { FaArrowRight } from "react-icons/fa";

// Import Packages
import PropTypes from "prop-types";

const TrainerAddModalScheduleClassSelector = ({ onNextStep }) => {
  // State to store selected class types
  const [selectedClasses, setSelectedClasses] = useState([]);

  // useEffect: On mount, load previously selected classes from localStorage
  useEffect(() => {
    // Retrieve saved trainer data
    const storedData = JSON.parse(localStorage.getItem("trainerBasicInfo"));

    // Get saved class types from preferences
    const saved = storedData?.preferences?.classTypes;

    // If valid, set to state
    if (Array.isArray(saved)) setSelectedClasses(saved);
  }, []);

  // Function: Toggle class type selection
  const handleCheckboxChange = (classType) => {
    setSelectedClasses((prev) =>
      prev.includes(classType)
        ? prev.filter((type) => type !== classType)
        : [...prev, classType]
    );
  };

  // Function: Save current selection to localStorage
  const handleSubmit = () => {
    const storedData =
      JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};
    const updatedData = {
      ...storedData,
      preferences: {
        ...storedData.preferences,
        classTypes: selectedClasses,
      },
    };

    // Save back to localStorage
    localStorage.setItem("trainerBasicInfo", JSON.stringify(updatedData));

    onNextStep();
  };

  return (
    <div>
      {/* Page Title */}
      <h3 className="text-xl font-semibold text-center text-gray-800 bg-white py-2 border border-b-black">
        Trainer Schedule Class Selector
      </h3>

      {/* =================== Class Selection Section =================== */}

      {/* Desktop/Table View: Hidden on screens smaller than `sm` */}
      <div className="hidden sm:block overflow-x-auto rounded-md border border-gray-300 shadow-sm p-2">
        {/* Table for class selection */}
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table header row */}
          <thead className="bg-gray-100">
            <tr>
              {/* Render header labels dynamically */}
              {[
                "Select",
                "Class Type",
                "Description",
                "Participant Limit",
                "Price Range",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table body containing class information rows */}
          <tbody className="bg-white divide-y divide-gray-200">
            {ClassInformation.map((classInfo, index) => (
              <tr
                key={index}
                className={`transition-colors ${
                  selectedClasses.includes(classInfo.classType)
                    ? "bg-green-100" // Highlight selected row
                    : ""
                }`}
              >
                {/* Checkbox to select class */}
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(classInfo.classType)}
                    onChange={() => handleCheckboxChange(classInfo.classType)}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                </td>

                {/* Class type */}
                <td className="px-4 py-2 text-sm font-medium text-gray-800">
                  {classInfo.classType}
                </td>

                {/* Class description */}
                <td className="px-4 py-2 text-sm text-gray-600">
                  {classInfo.description}
                </td>

                {/* Participant limit */}
                <td className="px-4 py-2 text-sm text-gray-600">
                  {classInfo.participantLimit}
                </td>

                {/* Price range */}
                <td className="px-4 py-2 text-sm text-gray-600">
                  {classInfo.priceRange}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =================== Mobile/Card View: Hidden on screens `sm` and above =================== */}
      <div className="sm:hidden p-2">
        {/* Loop through class information for card rendering */}
        {ClassInformation.map((classInfo, index) => (
          <div
            key={index}
            className={`border border-gray-300 rounded-md p-4 shadow-sm ${
              selectedClasses.includes(classInfo.classType)
                ? "bg-green-50" // Highlight selected card
                : "bg-white"
            }`}
          >
            {/* Card header: class type and checkbox */}
            <div className="flex items-center justify-between mb-2">
              {/* Class type title */}
              <h5 className="text-base font-semibold text-green-700">
                {classInfo.classType}
              </h5>

              {/* Checkbox for selection */}
              <input
                type="checkbox"
                checked={selectedClasses.includes(classInfo.classType)}
                onChange={() => handleCheckboxChange(classInfo.classType)}
                className="form-checkbox h-4 w-4 text-green-600"
              />
            </div>

            {/* Class description */}
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-gray-700">Description: </span>
              {classInfo.description}
            </p>

            {/* Participant limit */}
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-gray-700">
                Participant Limit:{" "}
              </span>
              {classInfo.participantLimit}
            </p>

            {/* Price range */}
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Price Range: </span>
              {classInfo.priceRange}
            </p>
          </div>
        ))}
      </div>

      {/* Submit Button: Save selections and proceed */}
      <div className="flex justify-center items-center w-full py-4">
        <CommonButton
          type="button"
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
          clickEvent={handleSubmit}
        />
      </div>
    </div>
  );
};

// Prop validation
TrainerAddModalScheduleClassSelector.propTypes = {
  onNextStep: PropTypes.func.isRequired,
};
export default TrainerAddModalScheduleClassSelector;
