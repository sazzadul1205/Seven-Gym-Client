/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";

const PrioritySettings = ({ MyPriority, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [selectedPriorities, setSelectedPriorities] = useState(new Set());

  // Select All Handler
  const handleSelectAll = () => {
    if (selectedPriorities.size === MyPriority.length) {
      setSelectedPriorities(new Set()); // Deselect all
    } else {
      setSelectedPriorities(new Set(MyPriority.map((priority) => priority.id))); // Select all
    }
  };

  // Toggle Individual Selection
  const handleCheckboxChange = (id) => {
    setSelectedPriorities((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  // Delete Selected Priorities
  const handleDeleteSelected = async () => {
    if (selectedPriorities.size === 0) return;

    // Show SweetAlert confirmation
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the selected priorities?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const email = user?.email;
      if (!email) return;

      // Send all selected IDs for deletion
      await axiosPublic.delete("/Schedule/DeletePriority", {
        data: { email, priorityIDs: Array.from(selectedPriorities) },
      });

      setSelectedPriorities(new Set()); // Clear selection after successful deletion
      refetch(); // Refresh data
      Swal.fire(
        "Deleted!",
        "The selected priorities have been deleted.",
        "success"
      ); // Success alert
    } catch (error) {
      console.error("Error deleting priorities:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the priorities.",
        "error"
      ); // Error alert
    }
  };

  return (
    <div className="bg-gray-100 shadow-md mx-2 p-4 rounded-md">
      {/* Top Section */}
      <div className="bg-gray-300 border border-gray-300 px-4 py-4 rounded-md mb-4">
        <h5 className="text-xl font-semibold border-b-2 border-black pb-2">
          Priorities
        </h5>

        <div className="flex justify-between items-center gap-4 pt-2">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            {/* Select All Checkbox */}
            <div className="flex items-center gap-2 border-r-2 border-black pr-4">
              <input
                type="checkbox"
                className="checkbox-sm cursor-pointer"
                onChange={handleSelectAll}
                checked={selectedPriorities.size === MyPriority.length}
                aria-label="Select all priorities"
              />
              <label>Select All</label>
            </div>

            {/* Delete Selected Button */}
            <div>
              <button
                className={`text-lg px-3 py-2 rounded-lg flex items-center ${
                  selectedPriorities.size > 0
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                disabled={selectedPriorities.size === 0}
                onClick={handleDeleteSelected}
                data-tooltip-id="deleteTooltip"
              >
                <FaRegTrashAlt />
              </button>
              <Tooltip
                id="deleteTooltip"
                place="top"
                content="Delete Selected Priorities"
              />
            </div>
          </div>
        </div>
      </div>

      {/* List of Priorities */}
      <div className="space-y-4">
        {MyPriority.map((priority) => (
          <div
            key={priority.id}
            className={`p-4 rounded-md shadow-md flex items-start gap-4 ${
              priority.isImportant
                ? "bg-red-100 border-red-400 border-l-4"
                : "bg-white"
            }`}
          >
            {/* Checkbox for selecting priority */}
            <div className="pt-2">
              <input
                type="checkbox"
                className="checkbox-md cursor-pointer"
                onChange={() => handleCheckboxChange(priority.id)}
                checked={selectedPriorities.has(priority.id)}
                aria-label={`Select priority: ${priority.title}`}
              />
            </div>

            {/* Priority Details */}
            <div className="flex-1 border-l border-gray-400 pl-5">
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {priority.title}
              </h3>

              {/* Content */}
              <p className="text-gray-600">{priority.content}</p>

              {/* Reminder */}
              <p className="text-sm text-gray-500">
                <strong>Reminder:</strong>{" "}
                {new Date(priority.reminder).toLocaleString("en-GB")}
              </p>

              {/* Tags */}
              {priority.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {priority.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrioritySettings;
