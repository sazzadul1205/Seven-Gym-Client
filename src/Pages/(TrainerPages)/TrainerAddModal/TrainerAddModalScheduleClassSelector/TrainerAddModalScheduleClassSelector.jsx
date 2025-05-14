import { useState, useEffect } from "react";

// Import JSON
import ClassInformation from "../../../../JSON/ClassInformation.json";

// Import Button
import CommonButton from "../../../../Shared/Buttons/CommonButton";

// Import Icons
import { FaArrowRight } from "react-icons/fa";

// Component: TrainerAddModalScheduleClassSelector
const TrainerAddModalScheduleClassSelector = () => {
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
  };

  return (
    <div className="p-4">
      {/* Page Title */}
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Trainer Schedule Class Selector
      </h3>

      {/* Table displaying available class options */}
      <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
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

          {/* Table Body: List of classes */}
          <tbody className="bg-white divide-y divide-gray-200">
            {ClassInformation.map((classInfo, index) => (
              <tr
                key={index}
                className={`transition-colors ${
                  selectedClasses.includes(classInfo.classType)
                    ? "bg-green-100"
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

                {/* Display class details */}
                <td className="px-4 py-2 text-sm font-medium text-gray-800">
                  {classInfo.classType}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {classInfo.description}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {classInfo.participantLimit}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {classInfo.priceRange}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default TrainerAddModalScheduleClassSelector;
