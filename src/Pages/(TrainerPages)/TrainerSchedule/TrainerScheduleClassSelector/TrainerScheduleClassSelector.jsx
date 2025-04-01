import { useState, useEffect } from "react";

// Import Package
import PropTypes from "prop-types";

// Import Icons
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoMdInformationCircleOutline } from "react-icons/io";

// import class Information Data
import ClassInformation from "../../../../JSON/ClassInformation.json";

const TrainerScheduleClassSelector = ({
  trainerClassTypes,
  availableClassTypes,
}) => {
  // Local state tracks each class as an object with a status:
  // status: 'original' (from parent), 'added' (new), or 'removed' (deleted)
  const [hasChanges, setHasChanges] = useState(false); 
  const [localClasses, setLocalClasses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize localClasses from the parent prop on mount or when trainerClassTypes changes.
  useEffect(() => {
    const initialClasses = trainerClassTypes.map((ct) => ({
      classType: ct,
      status: "original",
    }));
    setLocalClasses(initialClasses);
  }, [trainerClassTypes]);

  // Track changes in localClasses to update hasChanges state
  useEffect(() => {
    const changesDetected = localClasses.some(
      (item) => item.status === "added" || item.status === "removed"
    );
    setHasChanges(changesDetected);
  }, [localClasses]);

  // Compute class types that are available to add:
  const availableToAdd = availableClassTypes.filter(
    (ct) =>
      !localClasses.find(
        (item) => item.classType === ct && item.status !== "removed"
      )
  );

  // When adding a class, if it exists with a removed status, restore it.
  const addClassType = (classType) => {
    const existing = localClasses.find((item) => item.classType === classType);
    if (existing && existing.status === "removed") {
      setLocalClasses((prev) =>
        prev.map((item) =>
          item.classType === classType ? { ...item, status: "original" } : item
        )
      );
    } else {
      setLocalClasses((prev) => [...prev, { classType, status: "added" }]);
    }
    setShowDropdown(false);
  };

  // Remove a class:
  const removeClassType = (classType) => {
    setLocalClasses((prev) =>
      prev
        .map((item) => {
          if (item.classType === classType) {
            if (item.status === "added") {
              return null; // remove added classes outright
            }
            if (item.status === "original") {
              return { ...item, status: "removed" };
            }
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  // Toggle a removed class back to original if clicked.
  const toggleClass = (classType) => {
    setLocalClasses((prev) =>
      prev.map((item) =>
        item.classType === classType && item.status === "removed"
          ? { ...item, status: "original" }
          : item
      )
    );
  };

  // Save changes: update the parent's state with the classes that are not removed,
  const handleSave = () => {
    console.log(localClasses);
  };

  if (!trainerClassTypes && !availableClassTypes) return null; // Return null if no class types are provided

  return (
    <div className="bg-gray-100 text-black p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-2">My Picked Classes:</h3>

      {/* Class Types Display */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow">
        {localClasses.map((item, index) => {
          // Set display styles based on status
          let bgColor =
            "bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-600";
          let textDecoration = "";
          if (item.status === "added") {
            bgColor =
              "bg-linear-to-bl hover:bg-linear-to-tr from-gray-300 to-gray-600";
          }
          if (item.status === "removed") {
            bgColor =
              "bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600";
            textDecoration = "line-through";
          }
          return (
            <span
              key={index}
              onClick={() =>
                item.status === "removed"
                  ? toggleClass(item.classType)
                  : removeClassType(item.classType)
              }
              className={`flex items-center px-4 py-2 text-white font-medium rounded-lg shadow-md cursor-pointer ${bgColor} ${textDecoration}`}
              title={
                item.status === "removed"
                  ? "Click to restore"
                  : "Click to remove"
              }
            >
              {item.classType} <ImCross className="ml-2" />
            </span>
          );
        })}

        {/* Add Class part */}
        <div className="relative">
          {/* Add Class Button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 text-white font-medium rounded-lg shadow-md flex items-center px-5 py-2 gap-2 cursor-pointer"
          >
            <FaPlus /> Add
          </button>

          {/* Available Classes Dropdown */}
          {showDropdown && (
            <div className="absolute top-full mt-2 bg-white border border-gray-300 shadow-lg rounded-lg w-48 max-h-60 overflow-auto z-10">
              {availableToAdd.length > 0 ? (
                availableToAdd.map((classType, index) => (
                  <button
                    key={index}
                    onClick={() => addClassType(classType)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    {classType}
                  </button>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500">All classes added</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-between items-center">
        {/* Class Information Name and Button */}
        <div className="flex items-center gap-2">
          <p className="font-semibold">Class Information Details</p>
          <IoMdInformationCircleOutline
            className="text-yellow-500 hover:text-yellow-700 text-2xl cursor-pointer"
            onClick={() =>
              document
                .getElementById("Trainer_Schedule_Class_Selector_Information")
                .showModal()
            }
          />
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleSave}
          disabled={!hasChanges} // Disable the button if no changes are detected
          className={`px-5 py-2 rounded text-lg font-semibold  ${
            hasChanges
              ? "bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 text-white cursor-pointer"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </div>

      {/* Information Modal */}
      <dialog
        id="Trainer_Schedule_Class_Selector_Information"
        className="modal"
      >
        <div className="modal-box max-w-5xl p-0 bg-linear-to-b from-white to-gray-300 text-black">
          {/* Header with title and close button */}
          <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
            <h3 className="font-bold text-lg">
              Trainer Schedule Class Selector Information
            </h3>
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={() =>
                document
                  .getElementById("Trainer_Schedule_Class_Selector_Information")
                  .close()
              }
            />
          </div>

          {/* Table to display class data */}
          <div className="overflow-x-auto p-4">
            <table className="table-auto w-full text-left border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Class Type</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Participant Limit</th>
                  <th className="px-4 py-2 border-b">Price Range</th>
                </tr>
              </thead>
              <tbody>
                {ClassInformation.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{item.classType}</td>
                    <td className="px-4 py-2 border-b">{item.description}</td>
                    <td className="px-4 py-2 border-b">
                      {item.participantLimit}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {item.priceRange || "Not available"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </dialog>
    </div>
  );
};

TrainerScheduleClassSelector.propTypes = {
  trainerClassTypes: PropTypes.arrayOf(PropTypes.string),
  availableClassTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TrainerScheduleClassSelector;
