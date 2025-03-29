import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import {
  FaEdit,
  FaExclamationCircle,
  FaRegTrashAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { FiClock, FiEdit } from "react-icons/fi";
import { IoMdPricetag } from "react-icons/io";
import { ImCross } from "react-icons/im";

// Import Hooks
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../../Hooks/useAuth";

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

const ViewNotesModal = ({ Note, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // state Management
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle delete confirmation click
  const handleDeleteClick = () => setShowDeleteConfirm(true);

  // Cancel delete confirmation
  const handleCancelDelete = () => setShowDeleteConfirm(false);

  // Confirm delete (send request)
  const handleConfirmDelete = async () => {
    try {
      const email = user?.email;
      if (!email) return;

      await axiosPublic.delete("/User_Schedule/DeleteNote", {
        data: { email: user.email, noteID: Note.id },
      });

      document.getElementById("View_Note_Modal")?.close();
      setShowDeleteConfirm(false);
      refetch();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Note: <span className="text-blue-600">{Note?.title}</span>
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("View_Note_Modal")?.close()}
        />
      </div>

      {/* Delete Confirmation Banner */}
      {showDeleteConfirm && (
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

      {/* Importance Section */}
      {Note?.isImportant && (
        <div className="flex items-center gap-2 bg-linear-to-r from-red-300/80 to-red-600/80 px-5 py-2">
          <FaExclamationCircle className="text-red-500 text-2xl" />
          <p className="text-xl font-semibold">High Importance</p>
        </div>
      )}

      {/* Content Section */}
      <div className="space-y-4 py-4 px-5">
        {/* Note Content */}
        <div className="gap-5">
          <div className="flex items-center gap-3">
            <FiEdit className="text-blue-500 text-xl" />
            <p className="font-bold">Content:</p>
          </div>
          <p className="text-gray-700 bg-white px-5 py-3 mt-2">
            {Note?.content}
          </p>
        </div>

        {/* Tags Section */}
        <div className="gap-5">
          <div className="flex items-center gap-3">
            <IoMdPricetag className="text-green-500 text-xl" />
            <p className="font-bold">Tags:</p>
          </div>
          <div className="flex gap-2 flex-wrap bg-white px-5 py-3 mt-2">
            {Note?.tags?.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-white font-semibold rounded-full text-sm ${
                  tagColors[index % tagColors.length]
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reminder Section */}
        <div className="flex items-center gap-2">
          <FiClock className="text-yellow-500 text-xl" />
          <p className="font-semibold">Reminder:</p>
          <p className="text-black font-semibold">
            {new Date(Note?.reminder).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action buttons for editing and deleting the event */}
      <div className="flex justify-between items-center py-4 px-5">
        <button
          className="bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer p-3 px-6"
          onClick={() => alert("Edit functionality is coming soon!")}
        >
          <FaEdit className="text-xl text-white" />
        </button>

        <button
          className=" bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer p-3 px-6"
          onClick={handleDeleteClick}
        >
          <FaRegTrashAlt className="text-xl text-white" />
        </button>
      </div>
    </div>
  );
};

// PropTypes for type validation
ViewNotesModal.propTypes = {
  Note: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    isImportant: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string),
    reminder: PropTypes.string,
  }),
  refetch: PropTypes.func.isRequired,
};

export default ViewNotesModal;
