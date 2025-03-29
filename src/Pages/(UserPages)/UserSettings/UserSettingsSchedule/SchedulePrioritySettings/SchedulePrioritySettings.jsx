import { useState } from "react";
import PropTypes from "prop-types";
import { FaExclamationCircle, FaRegTrashAlt } from "react-icons/fa";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import AddPriorityModal from "../../../UserSchedulePlanner/ExtraLists/ExtraPriorityList/AddPriorityModal/AddPriorityModal";
import Swal from "sweetalert2";

const tagColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const SchedulePrioritySettings = ({ UserPriorityData, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State to track selected priorities
  const [selectedPriorities, setSelectedPriorities] = useState(new Set());

  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedPriorities((prevSelected) => {
      const updatedSet = new Set(prevSelected);
      updatedSet.has(id) ? updatedSet.delete(id) : updatedSet.add(id);
      return updatedSet;
    });
  };

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
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Priority deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
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
    <div>
      {/* Header: Title & Controls */}
      <div className="bg-gray-400/50 p-3">
        <h3 className="text-xl font-semibold text-black py-1">
          All Priorities
        </h3>

        {/* Divider */}
        <div className="bg-white h-[2px] w-1/2 my-2"></div>

        {/* Delete Button */}
        <div className="flex justify-between items-center">
          {/* Delete priority Button */}
          <button
            className={`flex items-center rounded-lg text-xl font-semibold gap-3 px-6 py-2 ${
              selectedPriorities.size > 0
                ? "bg-gradient-to-bl from-red-300 to-red-600 hover:from-red-400 hover:to-red-700 cursor-pointer"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={selectedPriorities.size === 0}
            onClick={handleDeleteSelected}
          >
            Delete <FaRegTrashAlt />
          </button>

          {/* Add Priority Button */}
          <CommonButton
            text="Add Priority"
            bgColor="green"
            px="px-10"
            clickEvent={() =>
              document.getElementById("Add_Priority_Modal").showModal()
            }
          />
        </div>
      </div>

      {/* Priority List Section */}
      <div className="bg-gray-400/50 text-black p-3 mt-4">
        <h3 className="text-black font-semibold text-lg pb-3">Priority List</h3>

        {/* Priority Items */}
        {UserPriorityData?.length > 0 ? (
          UserPriorityData.map((priority) => {
            const isSelected = selectedPriorities.has(priority.id);

            return (
              <div
                key={priority.id}
                className={`flex rounded-md shadow-md items-start p-4 gap-4 transition-colors mb-2 ${
                  isSelected ? "bg-red-100" : "bg-white"
                }`}
              >
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  className="checkbox checkbox-error border-black mt-1"
                  onChange={() => handleCheckboxChange(priority.id)}
                  checked={isSelected}
                  aria-label={`Select priority: ${priority.title}`}
                />

                {/* Priority Details */}
                <div className="flex-1 border-l border-gray-400 space-y-2 pl-5">
                  {/* Title & Importance */}
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-black">{priority.title}</p>

                    {/* High Importance Indicator */}
                    {priority?.isImportant && (
                      <div className="flex items-center gap-2 text-red-500">
                        <FaExclamationCircle className="text-2xl" />
                        <p className="text-sm font-semibold">High Importance</p>
                      </div>
                    )}
                  </div>

                  {/* Reminder Date */}
                  <p className="text-sm gap-5">
                    <strong>Reminder:</strong>{" "}
                    <span>
                      {new Date(priority.reminder).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // Enables AM/PM format
                      })}
                    </span>
                  </p>

                  {/* Priority Content */}
                  <p>{priority.content}</p>

                  {/* Tags Display */}
                  {priority?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-white font-semibold rounded-full text-sm ml-1 ${
                        tagColors[index % tagColors.length]
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-3">No priorities found.</p>
        )}
      </div>

      {/* Add Priority */}
      <dialog id="Add_Priority_Modal" className="modal">
        <AddPriorityModal refetch={refetch} />
      </dialog>
    </div>
  );
};

// 🔹 PropTypes Definition
SchedulePrioritySettings.propTypes = {
  UserPriorityData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string,
      isImportant: PropTypes.bool,
      reminder: PropTypes.string, // Expected in ISO format
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  refetch: PropTypes.func.isRequired,
};

export default SchedulePrioritySettings;
