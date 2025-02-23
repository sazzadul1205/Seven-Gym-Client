/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { ImCross } from "react-icons/im";
import { FaEdit, FaRegTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

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

const ViewAllNotesModal = ({ refetch, notes }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
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

      await axiosPublic.delete("/Schedule/DeleteNote", {
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
    <div className="modal-box p-0" ref={modalRef}>
      {/* Delete Confirmation Banner */}
      {showDeleteConfirm && selectedNote && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-3 flex justify-between items-center animate-fadeIn">
          <p className="font-semibold">
            ⚠️ Are you sure you want to delete <b>{selectedNote.title}</b>?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleConfirmDelete}
              className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
              <FaCheck className="text-white" />
            </button>
            <button
              onClick={handleCancelDelete}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <FaTimes className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Top Section */}
      <div className="flex justify-between items-center border-b border-gray-300 px-4 py-3">
        <h3 className="font-bold text-xl">All Notes</h3>
        <ImCross
          className="hover:text-[#F72C5B] cursor-pointer transition duration-200"
          onClick={() =>
            document.getElementById("View_All_Notes_Modal")?.close()
          }
        />
      </div>

      {/* Notes List */}
      <div className="p-4 space-y-3">
        {notes.length > 0 ? (
          notes
            .sort(
              (a, b) =>
                b.isImportant - a.isImportant ||
                new Date(b.reminder) - new Date(a.reminder)
            )
            .map((note) => (
              <div
                key={note.id}
                className="border p-4 rounded-lg shadow-md bg-gray-100 relative"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">
                    {note.title}
                    {note.isImportant && (
                      <span className="text-red-500 font-bold ml-2">★</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {note.reminder
                      ? new Date(note.reminder).toLocaleString()
                      : "No reminder set"}
                  </p>
                </div>

                <p className="text-gray-700 mt-2">{note.content}</p>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mt-3">
                  {Array.isArray(note.tags) &&
                    note.tags.map((tag, tagIndex) => (
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

                {/* Edit & Delete Buttons */}
                <div className="flex justify-between items-center pt-3">
                  <button className="px-4 py-2 bg-yellow-500 rounded-xl shadow-lg hover:shadow-xl transition">
                    <FaEdit className="text-white text-lg" />
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 rounded-xl shadow-lg hover:shadow-xl transition"
                    onClick={() => handleDeleteClick(note)}
                  >
                    <FaRegTrashAlt className="text-white text-lg" />
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

export default ViewAllNotesModal;
