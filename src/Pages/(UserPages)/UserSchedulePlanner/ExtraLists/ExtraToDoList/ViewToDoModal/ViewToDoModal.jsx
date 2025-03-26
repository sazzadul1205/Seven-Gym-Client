import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";

// Import Icons
import {
  FaCheck,
  FaClock,
  FaEdit,
  FaRegTrashAlt,
  FaTimes,
} from "react-icons/fa";
import { FiClock, FiEdit } from "react-icons/fi";
import { IoMdPricetag } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { ImCross } from "react-icons/im";

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

const ViewToDoModal = ({ ToDo, refetch }) => {
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
      if (!user?.email) return;

      await axiosPublic.delete("/Schedule/DeleteToDo", {
        data: { email: user.email, todoID: ToDo.id },
      });

      document.getElementById("View_To-Do_Modal")?.close();
      setShowDeleteConfirm(false);
      refetch();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Top Section */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          To Do: <span className="text-blue-600">{ToDo?.task}</span>
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("View_To-Do_Modal")?.close()}
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

      {/* Priority Importance */}
      <div
        className={`flex gap-2 bg-linear-to-r px-5 py-2 ${
          ToDo?.priority === "High"
            ? "from-red-300/80 to-red-600/80"
            : ToDo?.priority === "Medium"
            ? "from-yellow-300/80 to-yellow-600/80"
            : "from-green-300/80 to-green-600/80"
        }`}
      >
        <p className="text-xl font-semibold">{ToDo?.priority} Priority</p>
      </div>

      {/* Content Section */}
      <div className="space-y-4 py-4 px-5">
        {/* Description */}
        <div className="gap-5">
          <div className="flex items-center gap-3">
            <FiEdit className="text-blue-500 text-xl" />
            <p className="font-bold">Content:</p>
          </div>
          <p className="text-gray-700 bg-white px-5 py-3 mt-2">
            {ToDo?.description}
          </p>
        </div>

        {/* Tags Section */}
        <div className="gap-5">
          <div className="flex items-center gap-3">
            <IoMdPricetag className="text-green-500 text-xl" />
            <p className="font-bold">Tags:</p>
          </div>
          <div className="flex gap-2 flex-wrap bg-white px-5 py-3 mt-2">
            {ToDo?.tags?.map((tag, index) => (
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

        {/* Due Date */}
        <div className="flex items-center gap-2">
          <FiClock className="text-yellow-500 text-xl" />
          <p className="font-semibold">Due Date: </p>
          <p className="text-black font-semibold">
            {new Date(ToDo?.dueDate).toLocaleDateString("en-GB")}
          </p>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center gap-2">
          <FaClock className="text-gray-500 text-xl" />
          <p className="font-semibold">Estimated Time: </p>
          <p className="text-black font-semibold">{ToDo?.estimatedTime}</p>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <MdCategory className="text-green-500 text-xl" />
          <p className="font-semibold">Category: </p>
          <p className="text-black font-semibold">{ToDo?.category}</p>
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

ViewToDoModal.propTypes = {
  ToDo: PropTypes.shape({
    id: PropTypes.string,
    task: PropTypes.string,
    description: PropTypes.string,
    priority: PropTypes.oneOf(["High", "Medium", "Low"]),
    tags: PropTypes.arrayOf(PropTypes.string),
    dueDate: PropTypes.string,
    estimatedTime: PropTypes.string,
    category: PropTypes.string,
  }),
  refetch: PropTypes.func.isRequired,
};

export default ViewToDoModal;
