/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FaEdit,
  FaExclamationCircle,
  FaRegTrashAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { FiEdit, FiClock } from "react-icons/fi";
import { IoMdPricetag } from "react-icons/io";
import { ImCross } from "react-icons/im";

import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../../Hooks/useAuth";

const tagColors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-orange-400",
];

const ViewPriorityModal = ({ Priority, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle delete confirmation click
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  // Cancel delete confirmation
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Confirm delete (send request)
  const handleConfirmDelete = async () => {
    try {
      const email = user?.email;
      if (!email) return;

      await axiosPublic.delete("/Schedule/DeletePriority", {
        data: { email, priorityID: Priority.id },
      });

      document.getElementById("View_Priority_Modal")?.close();
      setShowDeleteConfirm(false);
      refetch();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div className="modal-box p-0 relative">
      {/* Top Section */}
      <div className="flex justify-between items-center border-b border-gray-300 px-4 py-3">
        <h3 className="font-bold text-2xl">
          Priority: <span className="text-blue-600">{Priority?.title}</span>
        </h3>
        <ImCross
          className="hover:text-[#F72C5B] cursor-pointer transition duration-200"
          onClick={() =>
            document.getElementById("View_Priority_Modal")?.close()
          }
        />
      </div>

      {/* Delete Confirmation Ribbon */}
      <div className="p-0">
        {showDeleteConfirm && (
          <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-3 flex justify-between items-center animate-fadeIn">
            <p className="font-semibold">
              ⚠️ Are you sure you want to delete this event?
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
      </div>

      {/* Priority Importance */}
      <div className="flex items-center gap-2 bg-red-200 px-5 py-2 rounded-xl">
        {Priority?.isImportant && (
          <FaExclamationCircle className="text-red-500 text-2xl" />
        )}
        <p className="text-xl font-semibold">
          {Priority?.isImportant ? "High Importance" : "Normal Priority"}
        </p>
      </div>

      {/* Content Section */}
      <div className="space-y-4 py-4 px-5">
        {/* Content */}
        <div className="flex items-center gap-2">
          <FiEdit className="text-blue-500 text-xl" />
          <div>
            <span className="font-semibold">Content: </span>
            <p className="text-gray-700">{Priority?.content}</p>
          </div>
        </div>

        {/* Reminder Section */}
        <div className="flex items-center gap-2">
          <FiClock className="text-yellow-500 text-xl" />
          <div>
            <span className="font-semibold">Reminder: </span>
            <p className="text-gray-700">
              {new Date(Priority?.reminder).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex items-center gap-2">
          <IoMdPricetag className="text-green-500 text-xl" />
          <div>
            <span className="font-semibold">Tags: </span>
            <div className="flex gap-2 flex-wrap">
              {Priority?.tags?.map((tag, index) => (
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
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-between items-center mt-4 px-5 pb-4">
        <button className="p-3 bg-yellow-500 rounded-xl shadow-xl hover:shadow-2xl transition">
          <FaEdit className="text-xl text-white" />
        </button>
        <button
          className="p-3 bg-red-500 rounded-xl shadow-xl hover:shadow-2xl transition"
          onClick={handleDeleteClick}
        >
          <FaRegTrashAlt className="text-xl text-white" />
        </button>
      </div>
    </div>
  );
};

export default ViewPriorityModal;
