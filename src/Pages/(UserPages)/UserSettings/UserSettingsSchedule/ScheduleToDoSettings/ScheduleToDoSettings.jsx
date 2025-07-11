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
      await axiosPublic.delete("/User_Schedule/DeleteToDo", {
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
            className={`flex items-center rounded-lg gap-3 px-5 md:px-10 py-2 md:py-3 ${
              selectedToDos.size > 0
                ? "bg-gradient-to-bl from-red-300 to-red-600 hover:from-red-400 hover:to-red-700 cursor-pointer"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={selectedToDos.size === 0}
            onClick={handleDeleteSelected}
          >
            <p className="font-semibold hidden md:block">Delete</p>{" "}
            <FaRegTrashAlt className="text-lg" />
          </button>

          {/* Add Priority Button */}
          <CommonButton
            text="Add Priority"
            bgColor="green"
            px="px-5 md:px-10"
            py="py-2 md:py-3"
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
                <div className="flex-1 border-l border-gray-400 pl-4 md:pl-5">
                  {/* Task Title & Priority */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <h3 className="text-lg font-semibold text-gray-800 break-words sm:break-normal">
                      {todo.task}
                    </h3>

                    {/* Priority Badge */}
                    <div
                      className={`flex items-center justify-center px-4 py-1 text-white font-semibold rounded-xl text-sm sm:text-base ${
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

                  {/* Due Date, Estimated Time, Category */}
                  <div className="block gap-2 sm:gap-4 mt-2">
                    {/* Due Date */}
                    <p className="flex items-center pb-1">
                      <strong className="pr-5 md:0 md:w-[150px]">
                        Due Date:
                      </strong>
                      {new Date(todo.dueDate).toLocaleDateString("en-GB")}
                    </p>
                    {/* Category */}
                    <p className="flex items-center pb-1">
                      <strong className="pr-5 md:0 md:w-[150px]">
                        Category:
                      </strong>{" "}
                      {todo.category}
                    </p>
                    {/* Estimated Time */}
                    <p className="flex items-center pb-1">
                      <strong className="pr-5 md:0 md:w-[150px]">
                        Estimated Time:
                      </strong>{" "}
                      {todo.estimatedTime}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="py-2 text-sm md:text-base">
                    {todo.description}
                  </p>

                  {/* Tags Display */}
                  <div className="flex flex-wrap py-0 md:py-2 space-y-2">
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
      id: PropTypes.string,
      task: PropTypes.string,
      priority: PropTypes.oneOf(["Low", "Medium", "High"]),
      dueDate: PropTypes.string,
      estimatedTime: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  refetch: PropTypes.func,
};

export default ScheduleToDoSettings;
