import { FcHighPriority } from "react-icons/fc";
import { RiCalendarTodoLine } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import AddPriorityModal from "./AddPriorityModal/AddPriorityModal";
import AddNotesModal from "./AddNotesModal/AddNotesModal";
import AddToDoModal from "./AddToDoModal/AddToDoModal";

const TodaysNotes = ({ priority = [], notes = [], todo = [] }) => {
  return (
    <div className="p-4 space-y-6">
      {/* Priority */}
      <div className="space-y-3">
        <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
          PRIORITY
        </p>

        {priority.length ? (
          priority.map((event, index) => (
            <div key={index} className="flex items-center gap-3 w-full">
              <FcHighPriority className="text-3xl" />
              <p className="bg-blue-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105 transition">
                {event}
              </p>
            </div>
          ))
        ) : (
          <div className="flex min-h-[100px] justify-center items-center ">
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

      {/* To-Do List */}
      <div className="space-y-3">
        <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
          TO-DO LIST
        </p>

        {todo.length ? (
          todo.map((task, index) => (
            <div key={index} className="flex items-center gap-3 w-full">
              <RiCalendarTodoLine className="text-3xl text-green-500" />
              <p className="bg-blue-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105 transition">
                {task}
              </p>
            </div>
          ))
        ) : (
          <div className="flex min-h-[100px] justify-center items-center ">
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

      {/* Notes / Reminders */}
      <div className="space-y-3">
        <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
          NOTES / REMINDERS
        </p>

        <div className="p-4 bg-gray-200 rounded-xl shadow-md min-h-[250px] flex flex-col gap-3">
          {notes.length ? (
            notes.map((note, index) => (
              <div key={index} className="flex items-center gap-3 w-full">
                <IoIosCreate className="text-2xl text-purple-500" />
                <p className="bg-white text-gray-800 px-4 py-2 w-full rounded-lg shadow-md border">
                  {note}
                </p>
              </div>
            ))
          ) : (
            <div className="flex min-h-[100px] justify-center items-center ">
              <button
                className="px-16 py-2 bg-gradient-to-br hover:bg-gradient-to-tl from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition"
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

      {/* Add Priority Modal  */}
      <dialog id="Add_Priority_Modal" className="modal">
        <AddPriorityModal />
      </dialog>

      {/* Add To-Do Modal  */}
      <dialog id="Add_To-Do_Modal" className="modal">
        <AddToDoModal />
      </dialog>

      {/* Add Notes Modal  */}
      <dialog id="Add_Notes_Modal" className="modal">
        <AddNotesModal />
      </dialog>
    </div>
  );
};

export default TodaysNotes;
