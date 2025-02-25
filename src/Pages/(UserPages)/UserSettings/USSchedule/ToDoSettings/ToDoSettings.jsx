/* eslint-disable react/prop-types */
import { useState } from "react";
import Swal from "sweetalert2";
import { FaRegTrashAlt } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../../Hooks/useAuth";

const ToDoSettings = ({ MyToDo, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [selectedToDos, setSelectedToDos] = useState(new Set());

  // Select All Handler
  const handleSelectAll = () => {
    if (selectedToDos.size === MyToDo.length) {
      setSelectedToDos(new Set()); // Deselect all
    } else {
      setSelectedToDos(new Set(MyToDo.map((priority) => priority.id))); // Select all
    }
  };

  // Toggle Individual Selection
  const handleCheckboxChange = (id) => {
    setSelectedToDos((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  // Delete Selected ToDos
  const handleDeleteSelected = async () => {
    if (selectedToDos.size === 0) return;

    // Show SweetAlert confirmation
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the selected ToDos?",
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
      await axiosPublic.delete("/Schedule/DeleteToDo", {
        data: { email, todoIDs: Array.from(selectedToDos) },
      });

      setSelectedToDos(new Set()); // Clear selection after successful deletion
      refetch(); // Refresh data
      Swal.fire(
        "Deleted!",
        "The selected priorities have been deleted.",
        "success"
      );
    } catch (error) {
      console.error("Error deleting ToDos:", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the ToDos.",
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
                checked={selectedToDos.size === MyToDo.length}
                aria-label="Select all ToDos"
              />
              <label>Select All</label>
            </div>

            {/* Delete Selected Button */}
            <div>
              <button
                className={`text-lg px-3 py-2 rounded-lg flex items-center ${
                  selectedToDos.size > 0
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                disabled={selectedToDos.size === 0}
                onClick={handleDeleteSelected}
                data-tooltip-id="deleteTooltip"
              >
                <FaRegTrashAlt />
              </button>
              <Tooltip
                id="deleteTooltip"
                place="top"
                content="Delete Selected ToDos"
              />
            </div>
          </div>
        </div>
      </div>

      {/* List of ToDos */}
      <div className="space-y-4">
        {MyToDo?.length > 0 ? (
          MyToDo.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-md shadow-md flex items-start gap-4 ${
                todo.priority === "High"
                  ? "bg-red-100 border-red-400 border-l-4"
                  : todo.priority === "Medium"
                  ? "bg-yellow-100 border-yellow-400 border-l-4"
                  : "bg-green-100 border-green-400 border-l-4"
              }`}
            >
              {/* Checkbox for selecting To-Do */}
              <div className="pt-2">
                <input
                  type="checkbox"
                  className="checkbox-md cursor-pointer"
                  onChange={() => handleCheckboxChange(todo.id)}
                  checked={selectedToDos?.has(todo.id) || false}
                  aria-label={`Select to-do: ${todo.task}`}
                />
              </div>

              {/* To-Do Details */}
              <div className="flex-1 border-l border-gray-400 pl-5">
                {/* Task Title */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {todo.task}
                </h3>

                {/* Description */}
                <p className="text-gray-600">{todo.description}</p>

                {/* Due Date */}
                <p className="text-sm text-gray-500">
                  <strong>Due Date:</strong>{" "}
                  {new Date(todo.dueDate).toLocaleDateString("en-GB")}
                </p>

                {/* Estimated Time */}
                <p className="text-sm text-gray-500">
                  <strong>Estimated Time:</strong> {todo.estimatedTime}
                </p>

                {/* Category */}
                <p className="text-sm text-gray-500">
                  <strong>Category:</strong> {todo.category}
                </p>

                {/* Tags */}
                {todo.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {todo.tags.map((tag, index) => (
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
          <p className="text-gray-500">No To-Dos available</p>
        )}
      </div>
    </div>
  );
};

export default ToDoSettings;
