import { FcHighPriority } from "react-icons/fc";
import { RiCalendarTodoLine } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";

const TodaysNotes = () => {
  // Default placeholders
  const defaultEvents = ["No Event", "No Event", "No Event"];

  return (
    <div className="p-4 space-y-6">
      {/* Top Priority */}
      <div className="space-y-3">
        <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
          TOP PRIORITY
        </p>

        {defaultEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-3 w-full">
            <FcHighPriority className="text-3xl" />
            <p className="bg-blue-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105 transition">
              {event}
            </p>
          </div>
        ))}
      </div>

      {/* To-Do List */}
      <div className="space-y-3">
        <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
          TO-DO LIST
        </p>

        {defaultEvents.map((task, index) => (
          <div key={index} className="flex items-center gap-3 w-full">
            <RiCalendarTodoLine className="text-3xl text-green-500" />
            <p className="bg-blue-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105 transition">
              {task}
            </p>
          </div>
        ))}
      </div>

      {/* Notes / Reminders */}
      <div className="space-y-3">
        <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
          NOTES / REMINDERS
        </p>

        <div className="p-4 bg-gray-200 rounded-xl shadow-md min-h-[250px] flex flex-col gap-3">
          {defaultEvents.map((note, index) => (
            <div key={index} className="flex items-center gap-3 w-full">
              <IoIosCreate className="text-2xl text-purple-500" />
              <p className="bg-white text-gray-800 px-4 py-2 w-full rounded-lg shadow-md border">
                {note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysNotes;
