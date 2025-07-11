import { useState } from "react";

// Import Package
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { FaList } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";
import { RiCalendarTodoLine } from "react-icons/ri";

// Import Modals
import AddToDoModal from "./AddToDoModal/AddToDoModal";
import ViewToDoModal from "./ViewToDoModal/ViewToDoModal";
import ViewAllToDoModal from "./ViewAllToDoModal/ViewAllToDoModal";

const ExtraToDoList = ({ todo, refetch }) => {
  // State to store the selected To Do for viewing
  const [selectedToDo, setSelectedToDo] = useState(null);

  // Filter tasks to ensure they have a dueDate
  const filteredTasks = todo?.filter((task) => task.dueDate);

  // Sort tasks by dueDate in descending order (most recent first)
  const sortedTasks = filteredTasks?.sort(
    (a, b) => new Date(b.dueDate) - new Date(a.dueDate)
  );

  // Limit to the top 5 most recent tasks
  const topTasks = sortedTasks?.slice(0, 5);

  return (
    <div className="space-y-3 bg-gray-200 rounded-xl p-2">
      {/* Header with Add & View All Buttons */}
      <div className="flex justify-between items-center flex-wrap gap-2 font-semibold rounded-xl text-black bg-gradient-to-b from-yellow-300 to-yellow-600 px-3 py-2">
        {/* Add To-Do Button */}
        <button
          className="rounded-full bg-gradient-to-bl hover:bg-gradient-to-tr from-green-300 to-green-600 cursor-pointer p-[3px]"
          onClick={() => document.getElementById("Add_To-Do_Modal").showModal()}
          data-tooltip-id="Add_Modal_Button_Tooltip_To-Do"
        >
          <MdAddToPhotos className="text-white text-2xl md:text-3xl font-bold p-1" />
          <Tooltip
            id="Add_Modal_Button_Tooltip_To-Do"
            place="top"
            content="Add To Do"
          />
        </button>

        {/* Title */}
        <p className="text-center text-sm md:text-base py-1 grow text-black">
          TO-DO LIST
        </p>

        {/* View All To-Do Button */}
        <button
          className="rounded-full bg-gradient-to-bl hover:bg-gradient-to-tr from-blue-300 to-blue-600 cursor-pointer p-[3px]"
          onClick={() =>
            document.getElementById("View_All_To-Do_Modal").showModal()
          }
          data-tooltip-id="View_List_Button_Tooltip_To-Do"
        >
          <FaList className="text-white text-2xl md:text-3xl font-bold p-[6px]" />
          <Tooltip
            id="View_List_Button_Tooltip_To-Do"
            place="top"
            content="View All To Do"
          />
        </button>
      </div>

      {/* To-Do Items List */}
      <div className="space-y-3 px-1 pb-3 text-black">
        {topTasks?.length ? (
          topTasks.map((task, index) => (
            <div
              key={task.id || index}
              className="flex items-center gap-2 sm:gap-3 w-full cursor-pointer flex-wrap sm:flex-nowrap"
              onClick={() => {
                setSelectedToDo(task);
                document.getElementById("View_To-Do_Modal").showModal();
              }}
            >
              {/* To-Do Icon */}
              <RiCalendarTodoLine className="text-2xl sm:text-3xl text-green-500 border border-green-500 rounded-full p-1" />

              {/* Task Details */}
              <div className="w-full flex flex-col sm:flex-row justify-between bg-gradient-to-bl hover:bg-gradient-to-tr from-green-300 to-green-500 rounded-xl px-4 py-3 text-sm sm:text-base">
                <div className="font-bold">
                  {task.task}
                  <span className="ml-2">({task.priority})</span>
                </div>
                <div className="mt-1 sm:mt-0 font-semibold">
                  {new Date(task.dueDate).toLocaleDateString("en-GB")}
                </div>
              </div>
            </div>
          ))
        ) : (
          // No Tasks: Show Add To-Do Button
          <div className="flex min-h-[100px] justify-center items-center py-16">
            <button
              className="px-10 py-2 bg-gradient-to-br hover:bg-gradient-to-tl from-green-300 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition cursor-pointer text-sm md:text-base"
              onClick={() =>
                document.getElementById("Add_To-Do_Modal").showModal()
              }
            >
              + Add To Do
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <dialog id="Add_To-Do_Modal" className="modal">
        <AddToDoModal refetch={refetch} />
      </dialog>

      <dialog id="View_To-Do_Modal" className="modal">
        <ViewToDoModal refetch={refetch} ToDo={selectedToDo} />
      </dialog>

      <dialog id="View_All_To-Do_Modal" className="modal">
        <ViewAllToDoModal refetch={refetch} todo={todo} />
      </dialog>
    </div>
  );
};

// Prop Types for validation
ExtraToDoList.propTypes = {
  todo: PropTypes.arrayOf(
    PropTypes.shape({
      task: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    })
  ),
  refetch: PropTypes.func.isRequired,
};

export default ExtraToDoList;
