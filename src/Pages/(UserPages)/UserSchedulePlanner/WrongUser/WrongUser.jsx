import { FcHighPriority } from "react-icons/fc";
import { IoIosCreate } from "react-icons/io";
import { RiCalendarTodoLine } from "react-icons/ri";

const WrongUser = () => {
  // Generate time slots from 12:00 AM to 11:00 PM in 12-hour format
  const timeSlots = Array.from({ length: 24 }, (_, index) => {
    const hour = index % 12 || 12; // Convert 0 to 12 for AM format
    const period = index < 12 ? "AM" : "PM";
    return `${hour}:00 ${period}`;
  });

  // Weekday labels
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const defaultEvents = ["No Event", "No Event", "No Event"];
  return (
    <div className="bg-white min-h-screen relative">
      {/* Header */}
      <div className="bg-[#F72C5B] py-12"></div>

      {/* Title */}
      <div className="text-center">
        <p className="text-3xl font-semibold py-2 underline underline-offset-4">
          DAILY SCHEDULE PLANNER
        </p>
        <p className="text-2xl font-bold text-gray-500">03:14:33 PM</p>
      </div>

      {/* Week & Date Selector */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center p-4 border-b border-gray-300">
        {/* Today's Date */}
        <div className="flex gap-2 items-center md:items-start">
          <p className="text-lg font-semibold text-gray-800">Date:</p>
          <p className="text-lg text-gray-600 font-semibold underline underline-offset-4">
            Sunday, February 9, 2025
          </p>
        </div>

        {/* Week Selector */}
        <div className="flex gap-2 mt-4 md:mt-0">
          {weekdays.map((day, index) => {
            return (
              <p
                key={index}
                className={`rounded-full border border-black w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-400 cursor-pointer`}
              >
                {day}
              </p>
            );
          })}
        </div>
      </div>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto flex gap-5">
        {/* Todays schedule */}
        <div className="w-1/2">
          <div className="p-4">
            {/* Title */}
            <p className="bg-yellow-500 text-center py-2 font-semibold rounded-full">
              TODAY&apos;S SCHEDULE
            </p>

            {/* Schedule List */}
            <div className="pt-4 space-y-3">
              {timeSlots.map((time, index) => (
                <div key={index} className="flex items-center gap-3 w-full">
                  {/* Time Label */}
                  <p className="font-semibold text-gray-700 w-20 text-right">
                    {time}
                  </p>

                  {/* Event Placeholder (Can be dynamic) */}
                  <p className="bg-blue-300 text-gray-800 px-4 py-2 w-full rounded-full shadow-md hover:scale-105">
                    No Event
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority, To-Do, Notes  */}
        <div className="w-1/2">
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
        </div>
      </main>

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        {/* Modal - Not Your Schedule Message */}
        <dialog id="Not_Your_Schedule" className="modal " open>
          <div className="modal-box bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <h3 className="font-bold text-xl text-red-500">
              This is not your schedule
            </h3>
            <p className="py-4 text-gray-700">
              Please go back and check your own schedule.
            </p>

            {/* Modal Actions */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Back to Previous Page
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default WrongUser;
