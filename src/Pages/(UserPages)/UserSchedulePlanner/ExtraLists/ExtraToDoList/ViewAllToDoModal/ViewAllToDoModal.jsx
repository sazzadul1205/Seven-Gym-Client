import { useState, useRef } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import icons
import {
  FaEdit,
  FaRegTrashAlt,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { MdCategory } from "react-icons/md";

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

const ViewAllToDoModal = ({ refetch, todo }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // state Management
  const [selectedToDo, setSelectedToDo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use a reference to the modal
  const modalRef = useRef(null);

  // Handle delete confirmation click
  const handleDeleteClick = (todoItem) => {
    setSelectedToDo(todoItem);
    setShowDeleteConfirm(true);

    // Scroll to the top of the modal (to keep it centered if necessary)
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  };

  // Cancel delete confirmation
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedToDo(null);
  };

  // Confirm delete (send request)
  const handleConfirmDelete = async () => {
    if (!selectedToDo) return;

    try {
      const email = user?.email;
      if (!email) return;

      await axiosPublic.delete("/Schedule/DeleteToDo", {
        data: { email, todoID: selectedToDo.id },
      });

      setShowDeleteConfirm(false);
      setSelectedToDo(null);
      refetch();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div
      className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black"
      ref={modalRef}
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-xl">All Tasks</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("View_All_To-Do_Modal")?.close()
          }
        />
      </div>

      {/* Delete Confirmation Ribbon */}
      {showDeleteConfirm && selectedToDo && (
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

      {/* To-Do List */}
      <div className="p-4 space-y-3">
        {todo?.length ? (
          todo
            // Sort by most recent
            .sort((a, b) => new Date(b.reminder) - new Date(a.reminder))
            .map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded-lg shadow-md bg-gray-100 relative space-y-3"
              >
                {/* Task Title */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">
                    {item.task}
                    {item.isImportant && (
                      <span className="text-red-500 font-bold ml-2">★</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(item?.dueDate).toLocaleDateString("en-GB")}
                  </p>
                </div>

                {/* Priority Level */}
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-semibold ${
                    item.priority === "High"
                      ? "bg-red-200 text-red-600"
                      : item.priority === "Medium"
                      ? "bg-yellow-200 text-yellow-600"
                      : "bg-green-200 text-green-600"
                  }`}
                >
                  <p className="font-semibold">{item?.priority} Priority</p>
                </div>

                {/* Description */}
                <p className="text-gray-700 mt-2">{item.description}</p>

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

                {/* Estimated Time */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-5">
                    <FaClock className="text-gray-500 text-xl" />
                    <p className="font-semibold">Estimated Time:</p>
                  </div>
                  <p> {item.estimatedTime || "Not specified"}</p>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-5">
                    <MdCategory className="text-green-500 text-xl" />
                    <p className="font-semibold">Category:</p>
                  </div>
                  <p> {item.category}</p>
                </div>

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
          <p className="text-center text-gray-500">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

ViewAllToDoModal.propTypes = {
  refetch: PropTypes.func.isRequired,
  todo: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      task: PropTypes.string.isRequired,
      isImportant: PropTypes.bool,
      dueDate: PropTypes.string.isRequired,
      priority: PropTypes.oneOf(["High", "Medium", "Low"]).isRequired,
      description: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      estimatedTime: PropTypes.string,
      category: PropTypes.string,
      reminder: PropTypes.string, // Make reminder optional
    })
  ).isRequired,
};

export default ViewAllToDoModal;
