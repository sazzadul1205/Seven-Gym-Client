/* eslint-disable react/prop-types */
import {
  FaCheck,
  FaClock,
  FaEdit,
  FaExclamationCircle,
  FaRegTrashAlt,
  FaTimes,
} from "react-icons/fa";
import { FiClock, FiEdit } from "react-icons/fi";
import { IoMdPricetag } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { useState } from "react";

import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";

const tagColors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-orange-400",
];

const ViewToDoModal = ({ ToDo, refetch }) => {
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

      await axiosPublic.delete("/Schedule/DeleteToDo", {
        data: { email, todoID: ToDo.id },
      });

      document.getElementById("View_To-Do_Modal")?.close();
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
          Task: <span className="text-blue-600">{ToDo?.task}</span>
        </h3>
        <ImCross
          className="hover:text-[#F72C5B] cursor-pointer transition duration-200"
          onClick={() => document.getElementById("View_To-Do_Modal")?.close()}
        />
      </div>

      {/* Delete Confirmation Ribbon */}
      <div className="p-0">
        {showDeleteConfirm && (
          <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-3 flex justify-between items-center animate-fadeIn">
            <p className="font-semibold">
              ⚠️ Are you sure you want to delete this task?
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
      <div
        className={`flex items-center gap-2 mb-4 px-5 py-2 rounded-xl ${
          ToDo?.priority === "High"
            ? "bg-red-200"
            : ToDo?.priority === "Medium"
            ? "bg-yellow-200"
            : "bg-green-200"
        }`}
      >
        {ToDo?.priority === "High" && (
          <FaExclamationCircle className="text-red-500 text-2xl" />
        )}
        <p className="text-xl font-semibold">{ToDo?.priority} Priority</p>
      </div>

      {/* Content Section */}
      <div className="space-y-4 py-4 px-5">
        {/* Description */}
        <div className="flex items-center gap-2">
          <FiEdit className="text-blue-500 text-xl" />
          <div>
            <span className="font-semibold">Description: </span>
            <p className="text-gray-700">
              {ToDo?.description || "No description available"}
            </p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2">
          <FiClock className="text-yellow-500 text-xl" />
          <div>
            <span className="font-semibold">Due Date: </span>
            <p className="text-gray-700">
              {ToDo?.dueDate
                ? new Date(ToDo?.dueDate).toLocaleString()
                : "No due date"}
            </p>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center gap-2">
          <FaClock className="text-gray-500 text-xl" />
          <div>
            <span className="font-semibold">Estimated Time: </span>
            <p className="text-gray-700">
              {ToDo?.estimatedTime || "Not specified"}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <IoMdPricetag className="text-green-500 text-xl" />
          <div>
            <span className="font-semibold">Category: </span>
            <p className="text-gray-700">{ToDo?.category || "No category"}</p>
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex items-center gap-2">
          <IoMdPricetag className="text-green-500 text-xl" />
          <div>
            <span className="font-semibold">Tags: </span>
            <div className="flex gap-2 flex-wrap">
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

export default ViewToDoModal;
