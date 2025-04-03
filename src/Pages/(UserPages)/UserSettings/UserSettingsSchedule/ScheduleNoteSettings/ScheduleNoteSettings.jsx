import { useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// import Icons
import { FaExclamationCircle, FaRegTrashAlt } from "react-icons/fa";

// Import Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";
import AddNotesModal from "../../../UserSchedulePlanner/ExtraLists/ExtraNotesList/AddNotesModal/AddNotesModal";

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

const ScheduleNoteSettings = ({ UserNoteData, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State to track selected Notes
  const [selectedNotes, setSelectedNotes] = useState(new Set());

  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedNotes((prevSelected) => {
      const updatedSet = new Set(prevSelected);
      updatedSet.has(id) ? updatedSet.delete(id) : updatedSet.add(id);
      return updatedSet;
    });
  };

  // Delete Selected Notes
  const handleDeleteSelected = async () => {
    if (selectedNotes.size === 0) return;

    // Show SweetAlert confirmation
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the selected Notes?",
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
      await axiosPublic.delete("/User_Schedule/DeleteNote", {
        data: { email, noteIDs: Array.from(selectedNotes) },
      });

      setSelectedNotes(new Set()); // Clear selection after successful deletion
      refetch(); // Refresh data
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Notes deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting Notes:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the Notes.",
        "error"
      ); // Error alert
    }
  };

  return (
    <div>
      {/* Header: Title & Controls */}
      <div className="bg-gray-400/50 p-3">
        <h3 className="text-xl font-semibold text-black py-1">All Notes</h3>

        {/* Divider */}
        <div className="bg-white h-[2px] w-1/2 my-2"></div>

        {/* Delete Button */}
        <div className="flex justify-between items-center">
          {/* Delete Notes Button */}
          <button
            className={`flex items-center rounded-lg text-xl font-semibold gap-3 px-6 py-2 ${
              selectedNotes.size > 0
                ? "bg-gradient-to-bl from-red-300 to-red-600 hover:from-red-400 hover:to-red-700 cursor-pointer"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={selectedNotes.size === 0}
            onClick={handleDeleteSelected}
          >
            Delete <FaRegTrashAlt />
          </button>

          {/* Add Notes Button */}
          <CommonButton
            text="Add Notes"
            bgColor="green"
            px="px-10"
            clickEvent={() =>
              document.getElementById("Add_Note_Modal").showModal()
            }
          />
        </div>
      </div>
      {/* Notes List Section */}
      <div className="bg-gray-400/50 text-black p-3 mt-4">
        <h3 className="text-black font-semibold text-lg pb-3">Notes List</h3>

        {/* Notes Items */}
        {UserNoteData?.length > 0 ? (
          UserNoteData.map((Notes) => {
            const isSelected = selectedNotes.has(Notes.id);

            return (
              <div
                key={Notes.id}
                className={`flex rounded-md shadow-md items-start p-4 gap-4 transition-colors mb-2 ${
                  isSelected ? "bg-red-100" : "bg-white"
                }`}
              >
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  className="checkbox checkbox-error border-black mt-1"
                  onChange={() => handleCheckboxChange(Notes.id)}
                  checked={isSelected}
                  aria-label={`Select Notes: ${Notes.title}`}
                />

                {/* Notes Details */}
                <div className="flex-1 border-l border-gray-400 space-y-2 pl-5">
                  {/* Title & Importance */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <p className="font-medium text-black">{Notes.title}</p>

                    {/* High Importance Indicator */}
                    {Notes?.isImportant && (
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
                      {new Date(Notes.reminder).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true, // Enables AM/PM format
                      })}
                    </span>
                  </p>

                  {/* Notes Content */}
                  <p>{Notes.content}</p>

                  {/* Tags Display */}
                  <div className="flex flex-wrap py-0 md:py-2 space-y-2">
                    {Notes?.tags?.map((tag, index) => (
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
              </div>
            );
          })
        ) : (
          <p className="text-black font-semibold text-center py-3 bg-white">
            No Notes found.
          </p>
        )}
      </div>

      {/* Add Notes */}
      <dialog id="Add_Note_Modal" className="modal">
        <AddNotesModal refetch={refetch} />
      </dialog>
    </div>
  );
};

ScheduleNoteSettings.propTypes = {
  UserNoteData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      isImportant: PropTypes.bool,
      reminder: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ScheduleNoteSettings;
