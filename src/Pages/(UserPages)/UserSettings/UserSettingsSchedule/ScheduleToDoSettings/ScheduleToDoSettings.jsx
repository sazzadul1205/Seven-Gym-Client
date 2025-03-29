import { useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// import Icons
import { FaRegTrashAlt } from "react-icons/fa";

// Import Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Modal
import AddToDoModal from "../../../UserSchedulePlanner/ExtraLists/ExtraToDoList/AddToDoModal/AddToDoModal";

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

const ScheduleToDoSettings = ({ UserToDoData, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State to track selected To Do
  const [selectedToDos, setSelectedToDos] = useState(new Set());

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
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "To-Do's deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
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
    <div>
      {/* Header: Title & Controls */}
      <div className="bg-gray-400/50 p-3">
        <h3 className="text-xl font-semibold text-black py-1">
          All To-Do&apos;s
        </h3>

        {/* Divider */}
        <div className="bg-white h-[2px] w-1/2 my-2"></div>

        {/* Delete Button */}
        <div className="flex justify-between items-center">
          {/* Delete priority Button */}
          <button
            className={`flex items-center rounded-lg text-xl font-semibold gap-3 px-6 py-2 ${
              selectedToDos.size > 0
                ? "bg-gradient-to-bl from-red-300 to-red-600 hover:from-red-400 hover:to-red-700 cursor-pointer"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={selectedToDos.size === 0}
            onClick={handleDeleteSelected}
          >
            Delete <FaRegTrashAlt />
          </button>

          {/* Add To Do Button */}
          <CommonButton
            text="Add To Do"
            bgColor="green"
            px="px-10"
            clickEvent={() =>
              document.getElementById("Add_To-Do_Modal").showModal()
            }
          />
        </div>
      </div>

      {/* To Do List Section */}
      <div className="bg-gray-400/50 text-black p-3 mt-4">
        <h3 className="text-black font-semibold text-lg pb-3">To Do List</h3>

        {UserToDoData?.length > 0 ? (
          UserToDoData.map((todo) => {
            const isSelected = selectedToDos.has(todo.id);

            return (
              <div
                key={todo.id}
                className={`flex rounded-md shadow-md items-start p-4 gap-4 transition-colors mb-2 ${
                  isSelected ? "bg-red-100" : "bg-white"
                }`}
              >
                {/* Checkbox for selecting To-Do */}
                <div className="pt-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-error border-black mt-1"
                    onChange={() => handleCheckboxChange(todo.id)}
                    checked={selectedToDos?.has(todo.id) || false}
                    aria-label={`Select to-do: ${todo.task}`}
                  />
                </div>

                {/* To-Do Details */}
                <div className="flex-1 border-l border-gray-400 pl-5">
                  {/* Task Title */}
                  <div className="flex gap-5">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {todo.task}
                    </h3>

                    <div
                      className={`flex items-center gap-2 font-semibold px-5 text-white rounded-xl ${
                        todo.priority === "High"
                          ? "bg-red-500"
                          : todo.priority === "Medium"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    >
                      <p>{todo.priority}</p>
                    </div>
                  </div>

                  {/* Due Date */}
                  <p className="text-sm flex justify-between w-1/4">
                    <strong>Due Date:</strong>{" "}
                    {new Date(todo.dueDate).toLocaleDateString("en-GB")}
                  </p>

                  {/* Estimated Time */}
                  <p className="text-sm flex justify-between w-1/4">
                    <strong>Estimated Time:</strong> {todo.estimatedTime}
                  </p>

                  {/* Category */}
                  <p className="text-sm flex justify-between w-1/4">
                    <strong>Category:</strong> {todo.category}
                  </p>

                  {/* Description */}
                  <p className="py-2">{todo.description}</p>

                  {/* Tags Display */}
                  <div className="py-2">
                    {todo?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-white font-semibold rounded-full text-sm ml-1 ${
                          tagColors[index % tagColors.length]
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-black font-semibold text-center py-3 bg-white">
            No To-Do&apos;s found.
          </p>
        )}
      </div>

      {/* Add To Do */}
      <dialog id="Add_To-Do_Modal" className="modal">
        <AddToDoModal refetch={refetch} />
      </dialog>
    </div>
  );
};

ScheduleToDoSettings.propTypes = {
  UserToDoData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Ensure 'id' is a string
      task: PropTypes.string.isRequired,
      priority: PropTypes.oneOf(["Low", "Medium", "High"]).isRequired, // Priority must be one of these values
      dueDate: PropTypes.string.isRequired, // Assuming it's an ISO date string
      estimatedTime: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      description: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string), // Array of tag strings
    })
  ).isRequired,
  refetch: PropTypes.func.isRequired, // Ensure refetch is a function
};

export default ScheduleToDoSettings;
