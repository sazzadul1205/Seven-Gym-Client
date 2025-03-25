/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import {
  FaEdit,
  FaRegTrashAlt,
  FaCheck,
  FaTimes,
  FaExclamationCircle,
  FaClock,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FiEdit, FiClock } from "react-icons/fi";
import { IoMdPricetag } from "react-icons/io";

import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../../Hooks/useAuth";

const ViewAllToDoModal = ({ refetch, todo }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const modalRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState(null);

  const tagColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  // Handle delete confirmation click
  const handleDeleteClick = (todoItem) => {
    setSelectedToDo(todoItem);
    setShowDeleteConfirm(true);
    modalRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="modal-box p-0 relative" ref={modalRef}>
      {/* Delete Confirmation Ribbon */}
      {showDeleteConfirm && selectedToDo && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-3 flex justify-between items-center animate-fadeIn">
          <p className="font-semibold">
            ⚠️ Are you sure you want to delete{" "}
            <strong>{selectedToDo.title}</strong>?
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

      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-300 px-4 py-3">
        <h3 className="font-bold text-xl">All Tasks</h3>
        <ImCross
          className="hover:text-[#F72C5B] cursor-pointer transition duration-200"
          onClick={() =>
            document.getElementById("View_All_To-Do_Modal")?.close()
          }
        />
      </div>

      {/* To-Do List */}
      <div className="p-4 space-y-4">
        {todo?.length ? (
          todo
            .sort((a, b) => new Date(b.reminder) - new Date(a.reminder)) // Sort by most recent
            .map((ToDo) => (
              <div
                key={ToDo.id}
                className="border p-4 rounded-lg shadow-md bg-gray-100 relative"
              >
                {/* Task Title */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">
                    {ToDo.task}
                    {ToDo.isImportant && (
                      <span className="text-red-500 font-bold ml-2">★</span>
                    )}
                  </h3>
                </div>

                {/* Priority Level */}
                <div
                  className={`flex items-center gap-2 mt-3 px-3 py-1 rounded-md text-sm font-semibold ${
                    ToDo.priority === "High"
                      ? "bg-red-200 text-red-600"
                      : ToDo.priority === "Medium"
                      ? "bg-yellow-200 text-yellow-600"
                      : "bg-green-200 text-green-600"
                  }`}
                >
                  {ToDo.priority === "High" && (
                    <FaExclamationCircle className="text-red-500" />
                  )}
                  {ToDo.priority} Priority
                </div>

                {/* Description */}
                <div className="mt-3 flex items-center gap-2">
                  <FiEdit className="text-blue-500 text-xl" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Description:</span>{" "}
                    {ToDo.description || "No description available"}
                  </p>
                </div>

                {/* Due Date */}
                <div className="mt-3 flex items-center gap-2">
                  <FiClock className="text-yellow-500 text-xl" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Due Date:</span>{" "}
                    {ToDo.dueDate
                      ? new Date(ToDo.dueDate).toLocaleString()
                      : "No due date"}
                  </p>
                </div>

                {/* Estimated Time */}
                <div className="mt-3 flex items-center gap-2">
                  <FaClock className="text-gray-500 text-xl" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Estimated Time:</span>{" "}
                    {ToDo.estimatedTime || "Not specified"}
                  </p>
                </div>

                {/* Category */}
                <div className="mt-3 flex items-center gap-2">
                  <IoMdPricetag className="text-green-500 text-xl" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Category:</span>{" "}
                    {ToDo.category || "No category"}
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-3 flex items-center gap-2">
                  <IoMdPricetag className="text-green-500 text-xl" />
                  <div className="flex gap-2 flex-wrap">
                    {ToDo.tags?.map((tag, index) => (
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

                {/* Edit & Delete Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <button className="p-3 bg-yellow-500 rounded-xl shadow-lg hover:shadow-xl transition">
                    <FaEdit className="text-xl text-white" />
                  </button>
                  <button
                    className="p-3 bg-red-500 rounded-xl shadow-lg hover:shadow-xl transition"
                    onClick={() => handleDeleteClick(ToDo)}
                  >
                    <FaRegTrashAlt className="text-xl text-white" />
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

export default ViewAllToDoModal;
