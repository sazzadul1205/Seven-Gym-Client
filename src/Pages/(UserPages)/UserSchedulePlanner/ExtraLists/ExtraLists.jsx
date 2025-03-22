import { useState } from "react";

// Import Package
import { Tooltip } from "react-tooltip";

/* eslint-disable react/prop-types */

// Import Icons
import { IoIosCreate } from "react-icons/io";
import { FaPlus, FaList } from "react-icons/fa";
import { RiCalendarTodoLine } from "react-icons/ri";

// Modals
// View Modal
import ViewToDoModal from "./ViewToDoModal/ViewToDoModal";
import ViewNotesModal from "./ViewNotesModal/ViewNotesModal";

// Add Modal
import AddToDoModal from "./AddToDoModal/AddToDoModal";
import AddNotesModal from "./AddNotesModal/AddNotesModal";

// View All Modal
import ViewAllToDoModal from "./ViewAllToDoModal/ViewAllToDoModal";
import ViewAllNotesModal from "./ViewAllNotesModal/ViewAllNotesModal";
import ExtraPriorityList from "./ExtraPriorityList/ExtraPriorityList";

const ExtraList = ({ priority, notes, todo, refetch }) => {
  // State to store the selected priority item for viewing
  const [selectedToDo, setSelectedToDo] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  return (
    <div className="p-4 space-y-6">
      {/* Priority List */}
      <ExtraPriorityList priority={priority} refetch={refetch} />

      {/* To-Do List */}
      <div className="space-y-3">
        {/* Title Bar with Buttons on the Sides */}
        <div className="flex flex-row justify-between items-center bg-yellow-500 text-center py-2 px-6 font-semibold rounded-full">
          {/* Left Button (Mobile Only) */}
          <button
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition sm:hidden"
            onClick={() =>
              document.getElementById("Add_To-Do_Modal").showModal()
            }
            data-tooltip-id="addToDoTooltip"
          >
            <FaPlus />
          </button>
          <Tooltip id="addToDoTooltip" place="top" content="Add To-Do" />

          {/* Title in the Center */}
          <p className="text-center grow">TO-DO LIST</p>

          {/* Right Buttons */}
          <div className="flex gap-3 sm:gap-6">
            {/* Add Button (Desktop Only) */}
            <button
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition hidden sm:block"
              onClick={() =>
                document.getElementById("Add_To-Do_Modal").showModal()
              }
              data-tooltip-id="addToDoTooltip"
            >
              <FaPlus />
            </button>

            {/* Details Button */}
            <button
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              onClick={() =>
                document.getElementById("View_All_To-Do_Modal").showModal()
              }
              data-tooltip-id="detailsToDoTooltip"
            >
              <FaList />
            </button>
            <Tooltip
              id="detailsToDoTooltip"
              place="top"
              content="View All To-Dos"
            />
          </div>
        </div>

        {/* To-Do Items */}
        <div className="space-y-3">
          {todo?.length ? (
            [...todo]
              .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)) // Sort by most recent first
              .slice(0, 5) // Limit to top 5
              .map((task, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 w-full cursor-pointer"
                  onClick={() => {
                    setSelectedToDo(task);
                    document.getElementById("View_To-Do_Modal").showModal();
                  }}
                >
                  <RiCalendarTodoLine className="text-4xl text-green-500 border border-green-500 rounded-full font-semibold p-1" />
                  <div className="flex flex-col md:flex-row justify-between bg-blue-300 text-gray-800 px-4 py-3 space-y-2 w-full rounded-3xl md:rounded-full shadow-md hover:scale-105 transition">
                    <p className="flex font-bold md:font-semibold text-lg">
                      {task.task}
                    </p>
                    <p className="hidden md:flex">-</p>
                    <p className="font-semibold">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleString()
                        : "No Due Date"}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex min-h-[100px] justify-center items-center">
              <button
                className="px-16 py-2 bg-linear-to-br hover:bg-linear-to-tl from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition"
                onClick={() =>
                  document.getElementById("Add_To-Do_Modal").showModal()
                }
              >
                + Add To-Do
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes / Reminders List */}
      <div className="space-y-3 bg-gray-200 rounded-xl pb-5">
        {/* Title Bar with Buttons on the Sides */}
        <div className="flex flex-row justify-between items-center bg-yellow-500 text-center py-2 px-6 font-semibold rounded-full">
          {/* Left Button (Mobile Only) */}
          <button
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition sm:hidden"
            onClick={() =>
              document.getElementById("Add_Notes_Modal").showModal()
            }
            data-tooltip-id="addTooltip"
          >
            <FaPlus />
          </button>
          <Tooltip id="addTooltip" place="top" content="Add Notes" />

          {/* Title in the Center */}
          <p className="text-center grow">NOTES / REMINDERS LIST</p>

          {/* Right Buttons */}
          <div className="flex gap-3 sm:gap-6">
            {/* Add Button (Desktop Only) */}
            <button
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition hidden sm:block"
              onClick={() =>
                document.getElementById("Add_Notes_Modal").showModal()
              }
              data-tooltip-id="addTooltip"
            >
              <FaPlus />
            </button>

            {/* Details Button */}
            <button
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              onClick={() =>
                document.getElementById("View_All_Notes_Modal").showModal()
              }
              data-tooltip-id="detailsTooltip"
            >
              <FaList />
            </button>
            <Tooltip id="detailsTooltip" place="top" content="View All Notes" />
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3 px-2">
          {notes?.length ? (
            [...notes]
              .sort((a, b) => new Date(b.reminder) - new Date(a.reminder)) // Sort by most recent first
              .sort((a, b) => b.isImportant - a.isImportant) // Prioritize important ones
              .slice(0, 5) // Limit to top 5
              .map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 w-full cursor-pointer"
                  onClick={() => {
                    setSelectedNote(event);
                    document.getElementById("View_Notes_Modal").showModal();
                  }}
                >
                  <IoIosCreate className="text-4xl text-purple-500 border border-purple-500 rounded-full font-semibold p-1" />
                  <div className="flex flex-col md:flex-row justify-between bg-blue-300 text-gray-800 px-4 py-3 space-y-2 w-full rounded-3xl md:rounded-full shadow-md hover:scale-105 transition">
                    <p className="flex font-bold md:font-semibold text-lg">
                      {event.title}
                      {event.isImportant && (
                        <span className="text-red-500 font-bold ml-4">★</span>
                      )}
                    </p>
                    <p className="hidden md:flex">-</p>
                    <p className="font-semibold">
                      {new Date(event.reminder).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex min-h-[100px] justify-center items-center">
              <button
                className="px-16 py-2 bg-linear-to-br hover:bg-linear-to-tl from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition"
                onClick={() =>
                  document.getElementById("Add_Notes_Modal").showModal()
                }
              >
                + Add Notes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal's  */}

      {/* Add To-Do Modal  */}
      <dialog id="Add_To-Do_Modal" className="modal">
        <AddToDoModal refetch={refetch} />
      </dialog>
      {/* Add Notes Modal  */}
      <dialog id="Add_Notes_Modal" className="modal">
        <AddNotesModal refetch={refetch} />
      </dialog>
      {/* View Modal's  */}

      {/* View To-Do Modal  */}
      <dialog id="View_To-Do_Modal" className="modal">
        <ViewToDoModal refetch={refetch} ToDo={selectedToDo} />
      </dialog>
      {/* View Notes Modal  */}
      <dialog id="View_Notes_Modal" className="modal">
        <ViewNotesModal refetch={refetch} Notes={selectedNote} />
      </dialog>
      {/* View All Modal's  */}

      {/* View All To-Do Modal */}
      <dialog id="View_All_To-Do_Modal" className="modal">
        <ViewAllToDoModal refetch={refetch} todo={todo} />
      </dialog>
      {/* View All Notes Modal */}
      <dialog id="View_All_Notes_Modal" className="modal">
        <ViewAllNotesModal refetch={refetch} notes={notes} />
      </dialog>
    </div>
  );
};

export default ExtraList;
