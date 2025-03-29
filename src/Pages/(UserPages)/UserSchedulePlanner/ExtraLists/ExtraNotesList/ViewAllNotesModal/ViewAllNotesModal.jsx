import { useState, useRef } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import icons
import { ImCross } from "react-icons/im";
import { FaEdit, FaRegTrashAlt, FaCheck, FaTimes } from "react-icons/fa";

// Import Hooks
import useAuth from "../../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

// Tags Colors
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

const ViewAllNotesModal = ({ refetch, note }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // state Management
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use a reference to the modal
  const modalRef = useRef(null);

  // Handle delete confirmation click
  const handleDeleteClick = (note) => {
    setSelectedNote(note);
    setShowDeleteConfirm(true);

    // Scroll to the top of the modal (to keep it centered if necessary)
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  };

  // Cancel delete confirmation
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedNote(null);
  };

  // Confirm delete (send request)
  const handleConfirmDelete = async () => {
    if (!selectedNote) return;

    try {
      const email = user?.email;
      if (!email) return;

      await axiosPublic.delete("/User_Schedule/DeleteNote", {
        data: { email, noteID: selectedNote.id },
      });

      setShowDeleteConfirm(false);
      setSelectedNote(null);
      refetch();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div
      className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black"
      ref={modalRef}
    >
      {/* Top Section */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">All Notes</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("View_All_Note_Modal")?.close()
          }
        />
      </div>

      {/* Delete Confirmation Banner */}
      {showDeleteConfirm && selectedNote && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-3 rounded-t-lg flex justify-between items-center animate-fadeIn">
          <p className="font-semibold">
            ⚠️ Are you sure you want to delete this event?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleConfirmDelete} // Confirm delete action
              className="p-2 bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 rounded-lg cursor-pointer"
            >
              <FaCheck className="text-white" /> {/* Confirm button */}
            </button>
            <button
              onClick={handleCancelDelete} // Cancel delete action
              className="p-2 bg-linear-to-bl hover:bg-linear-to-tr from-gray-300 to-gray-600 rounded-lg cursor-pointer"
            >
              <FaTimes className="text-white" /> {/* Cancel button */}
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="p-4 space-y-3">
        {note?.length > 0 ? (
          note
            // Sort by importance first, then by reminder date (latest first)
            .sort(
              (a, b) =>
                b.isImportant - a.isImportant ||
                new Date(b.reminder) - new Date(a.reminder)
            )
            .map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg shadow-md bg-gray-100 relative space-y-3"
              >
                {/* Priority Title & Reminder */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">
                    {item.title}
                    {item.isImportant && (
                      <span className="text-red-500 font-bold ml-2">★</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(item.reminder).toLocaleString()}
                  </p>
                </div>

                {/* Priority Content */}
                <p className="text-gray-700 mt-2">{item.content}</p>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 text-white text-xs rounded-full ${
                          tagColors[tagIndex % tagColors.length]
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Edit & Delete Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    className="bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer py-2 px-6"
                    onClick={() => alert("Edit functionality is coming soon!")}
                  >
                    <FaEdit className="text-lg text-white" />
                  </button>

                  <button
                    className=" bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer p-2 px-6"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <FaRegTrashAlt className="text-lg text-white" />
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500">No notes found.</p>
        )}
      </div>
    </div>
  );
};

/** PropTypes for type validation */
ViewAllNotesModal.propTypes = {
  refetch: PropTypes.func.isRequired, // Function to refresh data
  note: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      reminder: PropTypes.string.isRequired,
      isImportant: PropTypes.bool.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of tags for the priority
    })
  ).isRequired,
};

export default ViewAllNotesModal;
