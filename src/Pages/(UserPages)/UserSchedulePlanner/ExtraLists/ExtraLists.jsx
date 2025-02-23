/* eslint-disable react/prop-types */
import { FaPlus, FaList } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { useState } from "react";

// View Modal
import ViewPriorityModal from "./ViewPriorityModal/ViewPriorityModal";
import ViewNotesModal from "./ViewNotesModal/ViewNotesModal";
import ViewToDoModal from "./ViewToDoModal/ViewToDoModal";

// Add Modal
import AddPriorityModal from "./AddPriorityModal/AddPriorityModal";
import AddNotesModal from "./AddNotesModal/AddNotesModal";
import AddToDoModal from "./AddToDoModal/AddToDoModal";

// View All Modal
import ViewAllPriorityModal from "./ViewAllPriorityModal/ViewAllPriorityModal";
import ViewAllNotesModal from "./ViewAllNotesModal/ViewAllNotesModal";
import ViewAllToDoModal from "./ViewAllToDoModal/ViewAllToDoModal";

const ExtraList = ({ priority, notes, todo, refetch }) => {
  // State to store the selected priority item for viewing
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedToDo, setSelectedToDo] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  return (
    <div className="p-4 space-y-6">
      {/* Priority List */}
      <div className="space-y-3">
        {/* Title Bar with Buttons on the Right */}
        <div className="flex justify-between items-center bg-yellow-500 text-center py-2 px-6 font-semibold rounded-full relative">
          <p className="w-full text-center">PRIORITY LIST</p>

          {/* Buttons on the right */}
          <div className="absolute right-4 flex gap-3">
            {/* Add Button */}
            <button
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              onClick={() =>
                document.getElementById("Add_Priority_Modal").showModal()
              }
              data-tooltip-id="addTooltip"
            >
              <FaPlus />
            </button>
            <Tooltip id="addTooltip" place="top" content="Add Priority" />

            {/* Details Button */}
            <button
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              onClick={() =>
                document.getElementById("View_All_Priority_Modal").showModal()
              }
              data-tooltip-id="detailsTooltip"
            >
              <FaList />
            </button>
            <Tooltip
              id="detailsTooltip"
              place="top"
              content="View All Priorities"
            />
          </div>
        </div>

        {/* Priority List */}
        <div className="space-y-3">
          {priority?.length ? (
            [...priority]
              .sort((a, b) => new Date(b.reminder) - new Date(a.reminder)) // Sort by most recent first
              .sort((a, b) => b.isImportant - a.isImportant) // Prioritize important ones
              .slice(0, 5) // Limit to top 5
              .map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 w-full cursor-pointer"
                  onClick={() => {
                    setSelectedPriority(event);
                    document.getElementById("View_Priority_Modal").showModal();
                  }}
                >
                  <div className="flex justify-between bg-blue-300 text-gray-800 px-4 py-3 w-full rounded-full shadow-md hover:scale-105 transition">
                    <p className="font-semibold">
                      {event.title}
                      {event.isImportant && (
                        <span className="text-red-500 font-bold ml-4">★</span>
                      )}
                    </p>
                    -
                    <p className="font-semibold">
                      {new Date(event.reminder).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex min-h-[100px] justify-center items-center">
              <button
                className="px-16 py-2 bg-gradient-to-br hover:bg-gradient-to-tl from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition"
                onClick={() =>
                  document.getElementById("Add_Priority_Modal").showModal()
                }
              >
                + Add Priority
              </button>
            </div>
          )}
        </div>
      </div>

      {/* To-Do List */}
      <div className="space-y-3">
        {/* Title Bar with Buttons on the Right */}
        <div className="flex justify-between items-center bg-yellow-500 text-center py-2 px-6 font-semibold rounded-full relative">
          <p className="w-full text-center">TO-DO LIST</p>

          {/* Buttons on the right */}
          <div className="absolute right-4 flex gap-3">
            {/* Add Button */}
            <button
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              onClick={() =>
                document.getElementById("Add_To-Do_Modal").showModal()
              }
              data-tooltip-id="addToDoTooltip"
            >
              <FaPlus />
            </button>
            <Tooltip id="addToDoTooltip" place="top" content="Add To-Do" />

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

        {/* To-Do List */}
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
                  <div className="flex justify-between bg-blue-300 text-gray-800 px-4 py-3 w-full rounded-full shadow-md hover:scale-105 transition">
                    <p className="font-semibold">{task.task}</p>-
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
                className="px-16 py-2 bg-gradient-to-br hover:bg-gradient-to-tl from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition"
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
        {/* Title Bar with Buttons on the Right */}
        <div className="flex justify-between items-center bg-yellow-500 text-center py-2 px-6 font-semibold rounded-full relative">
          <p className="w-full text-center"> NOTES / REMINDERS LIST</p>

          {/* Buttons on the right */}
          <div className="absolute right-4 flex gap-3">
            {/* Add Button */}
            <button
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              onClick={() =>
                document.getElementById("Add_Notes_Modal").showModal()
              }
              data-tooltip-id="addTooltip"
            >
              <FaPlus />
            </button>
            <Tooltip id="addTooltip" place="top" content="Add Notes" />

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
                  <div className="flex justify-between bg-blue-300 text-gray-800 px-4 py-3 w-full rounded-full shadow-md hover:scale-105 transition">
                    <p className="font-semibold">
                      {event.title}
                      {event.isImportant && (
                        <span className="text-red-500 font-bold ml-4">★</span>
                      )}
                    </p>
                    -
                    <p className="font-semibold">
                      {new Date(event.reminder).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex min-h-[100px] justify-center items-center">
              <button
                className="px-16 py-2 bg-gradient-to-br hover:bg-gradient-to-tl from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition"
                onClick={() =>
                  document.getElementById("Add_Priority_Modal").showModal()
                }
              >
                + Add Notes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Priority Modal  */}
      <dialog id="Add_Priority_Modal" className="modal">
        <AddPriorityModal refetch={refetch} />
      </dialog>

      {/* Add To-Do Modal  */}
      <dialog id="Add_To-Do_Modal" className="modal">
        <AddToDoModal refetch={refetch} />
      </dialog>

      {/* Add Notes Modal  */}
      <dialog id="Add_Notes_Modal" className="modal">
        <AddNotesModal refetch={refetch} />
      </dialog>

      {/* View Priority Modal  */}
      <dialog id="View_Priority_Modal" className="modal">
        <ViewPriorityModal refetch={refetch} Priority={selectedPriority} />
      </dialog>

      {/* View To-Do Modal  */}
      <dialog id="View_To-Do_Modal" className="modal">
        <ViewToDoModal refetch={refetch} ToDo={selectedToDo} />
      </dialog>

      {/* View Notes Modal  */}
      <dialog id="View_Notes_Modal" className="modal">
        <ViewNotesModal refetch={refetch} Notes={selectedNote} />
      </dialog>

      {/* View All Priority Modal  */}
      <dialog id="View_All_Priority_Modal" className="modal">
        <ViewAllPriorityModal refetch={refetch} priority={priority} />
      </dialog>

      {/* View All To-Do Modal  */}
      <dialog id="View_All_To-Do_Modal" className="modal">
        <ViewAllToDoModal refetch={refetch} todo={todo} />
      </dialog>

      {/* View All Notes Modal  */}
      <dialog id="View_All_Notes_Modal" className="modal">
        <ViewAllNotesModal refetch={refetch} notes={notes} />
      </dialog>
    </div>
  );
};

export default ExtraList;
