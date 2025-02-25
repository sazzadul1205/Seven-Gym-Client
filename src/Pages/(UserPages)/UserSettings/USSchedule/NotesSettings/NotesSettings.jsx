/* eslint-disable react/prop-types */
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";
import { FaRegTrashAlt } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const NotesSettings = ({ MyNote, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [selectedNotes, setSelectedNotes] = useState(new Set());

  // Select All Handler
  const handleSelectAll = () => {
    if (selectedNotes.size === MyNote.length) {
      setSelectedNotes(new Set()); // Deselect all
    } else {
      setSelectedNotes(new Set(MyNote.map((note) => note.id))); // Select all
    }
  };

  // Toggle Individual Selection
  const handleCheckboxChange = (id) => {
    setSelectedNotes((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
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
      await axiosPublic.delete("/Schedule/DeleteNote", {
        data: { email, noteIDs: Array.from(selectedNotes) },
      });

      setSelectedNotes(new Set()); // Clear selection after successful deletion
      refetch(); // Refresh data
      Swal.fire(
        "Deleted!",
        "The selected priorities have been deleted.",
        "success"
      );
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
    <div className="bg-gray-100 shadow-md mx-2 p-4 rounded-md">
      {/* Top Section */}
      <div className="bg-gray-300 border border-gray-300 px-4 py-4 rounded-md mb-4">
        <h5 className="text-xl font-semibold border-b-2 border-black pb-2">
          To Do
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
                checked={selectedNotes.size === MyNote.length}
                aria-label="Select all Notes"
              />
              <label>Select All</label>
            </div>

            {/* Delete Selected Button */}
            <div>
              <button
                className={`text-lg px-3 py-2 rounded-lg flex items-center ${
                  selectedNotes.size > 0
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                disabled={selectedNotes.size === 0}
                onClick={handleDeleteSelected}
                data-tooltip-id="deleteTooltip"
              >
                <FaRegTrashAlt />
              </button>
              <Tooltip
                id="deleteTooltip"
                place="top"
                content="Delete Selected Notes"
              />
            </div>
          </div>
        </div>
      </div>

      {/* List of Notes */}
      <div className="space-y-4">
        {MyNote?.length > 0 ? (
          MyNote.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-md shadow-md flex items-start gap-4 ${
                note.isImportant
                  ? "bg-red-100 border-red-400 border-l-4"
                  : "bg-white"
              }`}
            >
              {/* Checkbox for selecting Note */}
              <div className="pt-2">
                <input
                  type="checkbox"
                  className="checkbox-md cursor-pointer"
                  onChange={() => handleCheckboxChange(note.id)}
                  checked={selectedNotes?.has(note.id) || false}
                  aria-label={`Select Note: ${note.task}`}
                />
              </div>

              {/* note Details */}
              <div className="flex-1 border-l border-gray-400 pl-5">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {note.title}
                </h3>

                {/* Content */}
                <p className="text-gray-600">{note.content}</p>

                {/* Reminder */}
                <p className="text-sm text-gray-500">
                  <strong>Reminder:</strong>{" "}
                  {new Date(note.reminder).toLocaleString("en-GB")}
                </p>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
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
          ))
        ) : (
          <p className="text-gray-500">No Notes available</p>
        )}
      </div>
    </div>
  );
};

export default NotesSettings;
