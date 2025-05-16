import { useState, useEffect } from "react";

// Import Libraries
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Import Icons
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoMdInformationCircleOutline } from "react-icons/io";

// Custom Hooks
import useAuth from "../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const TrainerScheduleClassSelector = ({
  refetch,
  ClassTypesData,
  trainerClassTypes,
}) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State for tracking changes, current class list, and dropdown
  const [hasChanges, setHasChanges] = useState(false);
  const [localClasses, setLocalClasses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize local class types from trainerClassTypes
  useEffect(() => {
    const initialClasses = trainerClassTypes?.map((type) => {
      const fullInfo = ClassTypesData.find((ct) => ct.classType === type);
      return {
        classType: fullInfo?.classType || type,
        status: "original",
      };
    });
    setLocalClasses(initialClasses || []);
  }, [trainerClassTypes, ClassTypesData]);

  // Check if there are any changes
  useEffect(() => {
    const changesDetected = localClasses?.some(
      (item) => item.status === "added" || item.status === "removed"
    );
    setHasChanges(changesDetected);
  }, [localClasses]);

  // Classes that can be added (not already in the list or not removed)
  const availableToAdd = ClassTypesData.filter(
    (ct) =>
      !localClasses?.find(
        (item) => item.classType === ct.classType && item.status !== "removed"
      )
  );

  // Add new class type to the list
  const addClassType = (classObj) => {
    const existing = localClasses.find(
      (item) => item.classType === classObj.classType
    );
    if (existing && existing.status === "removed") {
      // Restore removed class
      setLocalClasses((prev) =>
        prev.map((item) =>
          item.classType === classObj.classType
            ? { ...item, status: "original" }
            : item
        )
      );
    } else {
      // Add new class
      setLocalClasses((prev) => [
        ...prev,
        { classType: classObj.classType, status: "added" },
      ]);
    }
    setShowDropdown(false);
  };

  // Remove class type from the list
  const removeClassType = (classType) => {
    setLocalClasses((prev) =>
      prev
        .map((item) => {
          if (item.classType === classType) {
            if (item.status === "added") return null; // Remove new class
            if (item.status === "original")
              return { ...item, status: "removed" }; // Mark original as removed
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Restore removed class
  const toggleClass = (classType) => {
    setLocalClasses((prev) =>
      prev.map((item) =>
        item.classType === classType && item.status === "removed"
          ? { ...item, status: "original" }
          : item
      )
    );
  };

  // Save changes to the backend
  const handleSave = async () => {
    const updatedClassTypes = localClasses
      .filter((item) => item.status !== "removed")
      .map((item) => item.classType);

    if (!user?.email) {
      Swal.fire({
        icon: "warning",
        title: "Missing Email",
        text: "User email is required to update class types.",
      });
      return;
    }

    try {
      const response = await axiosPublic.put(
        "/Trainers/UpdateTrainerClassTypes",
        {
          email: user.email,
          classTypes: updatedClassTypes,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Updated Successfully!",
          text: "Trainer class types have been updated!",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
        setHasChanges(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response.data.error || "Failed to update trainer class types.",
        });
      }
    } catch (error) {
      console.error("Error updating trainer class types:", error);
      Swal.fire({
        icon: "error",
        title: "Error Occurred",
        text: "Something went wrong while updating class types.",
      });
    }
  };

  // Prevent render if data is missing
  if (!trainerClassTypes) return null;

  return (
    <div className="bg-gray-100 text-black p-4 shadow">
      {/* Header */}
      <h3 className="font-semibold text-lg mb-2">My Selected Classes:</h3>

      {/* Class badges */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 bg-white p-4 rounded-lg shadow">
        {localClasses?.map((item, index) => {
          // Style based on status
          let bgColor =
            "bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-300 to-blue-600";
          let textDecoration = "";
          if (item.status === "added") {
            bgColor =
              "bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-300 to-gray-600";
          }
          if (item.status === "removed") {
            bgColor =
              "bg-gradient-to-bl hover:bg-gradient-to-tr from-red-300 to-red-600";
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
              className={`flex justify-between items-center px-4 py-2 text-white font-medium rounded-lg shadow-md cursor-pointer ${bgColor} ${textDecoration}`}
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

        {/* Add button with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-gradient-to-bl hover:bg-gradient-to-tr from-green-300 to-green-600 text-white font-medium rounded-lg shadow-md flex items-center px-5 py-2 gap-2 cursor-pointer"
          >
            <FaPlus /> Add
          </button>

          {/* Dropdown list */}
          {showDropdown && (
            <div className="absolute top-full mt-2 bg-white border border-gray-300 shadow-lg rounded-lg w-48 max-h-60 overflow-auto z-10">
              {availableToAdd.length > 0 ? (
                availableToAdd.map((classObj, index) => (
                  <button
                    key={index}
                    onClick={() => addClassType(classObj)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    {classObj.classType}
                  </button>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500">All classes added</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info and Save buttons */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Show Information */}
        <div className="flex items-center gap-2">
          <p className="font-semibold">Class type Details</p>
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
          disabled={!hasChanges}
          className={`px-5 py-2 rounded text-lg font-semibold  ${
            hasChanges
              ? "bg-gradient-to-bl hover:bg-gradient-to-tr from-green-300 to-green-600 text-white cursor-pointer"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </div>

      {/* Modal for Class Information */}
      <dialog
        id="Trainer_Schedule_Class_Selector_Information"
        className="modal"
      >
        <div className="modal-box max-w-5xl p-0 bg-gradient-to-b from-white to-gray-300 text-black">
          {/* Title and Close */}
          <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
            {/* Title */}
            <h3 className="font-bold text-lg">
              Trainer Schedule Class Selector Information
            </h3>
            {/* Close */}
            <ImCross
              className="text-xl hover:text-[#F72C5B] cursor-pointer"
              onClick={() =>
                document
                  .getElementById("Trainer_Schedule_Class_Selector_Information")
                  .close()
              }
            />
          </div>

          {/* Table showing class info */}
          <div className="p-2 md:p-4">
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
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
                  {ClassTypesData.map((item, index) => (
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

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4 px-1">
              {ClassTypesData.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-2xl p-4 shadow-md bg-white"
                >
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-gray-800">
                      {item.classType}
                    </h3>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mt-1">Description</p>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mt-1">
                      Participant Limit
                    </p>
                    <p className="text-sm text-gray-700">
                      {item.participantLimit}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mt-1">Price Range :</p>

                    <p className="text-sm text-gray-700">
                      {item.priceRange || "Not available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

// Prop validation
TrainerScheduleClassSelector.propTypes = {
  refetch: PropTypes.func.isRequired,
  ClassTypesData: PropTypes.arrayOf(
    PropTypes.shape({
      classType: PropTypes.string.isRequired,
    })
  ).isRequired,
  trainerClassTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TrainerScheduleClassSelector;
