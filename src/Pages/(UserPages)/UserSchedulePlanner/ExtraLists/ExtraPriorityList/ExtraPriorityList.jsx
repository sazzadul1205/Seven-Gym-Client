import { useState } from "react";
import { FaList, FaPlus } from "react-icons/fa";
import { FcHighPriority } from "react-icons/fc";
import { Tooltip } from "react-tooltip";
import AddPriorityModal from "./AddPriorityModal/AddPriorityModal";
import ViewPriorityModal from "./ViewPriorityModal/ViewPriorityModal";
import ViewAllPriorityModal from "./ViewAllPriorityModal/ViewAllPriorityModal";
import { IoMdAdd } from "react-icons/io";

const ExtraPriorityList = ({ priority, refetch }) => {
  const [selectedPriority, setSelectedPriority] = useState(null); // Store the selected priority for viewing

  // Combined sort: Important ones first, then by most recent reminder
  const sortedPriorities = priority
    ? [...priority].sort((a, b) => {
        if (b.isImportant !== a.isImportant) {
          return b.isImportant - a.isImportant;
        }
        return new Date(b.reminder) - new Date(a.reminder);
      })
    : [];

  // Get top 5 priorities
  const topPriorities = sortedPriorities.slice(0, 5);

  return (
    <div className="space-y-3">
      {/* Title Bar with Buttons */}
      <div className="flex text-center py-3 font-semibold rounded-xl text-black bg-linear-to-b from-yellow-300 to-yellow-600">
        {/* Left Button (Mobile Only) */}
        <button
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition sm:hidden"
          onClick={() =>
            document.getElementById("Add_Priority_Modal").showModal()
          }
          data-tooltip-id="addTooltip"
        >
          <FaPlus />
        </button>
        <Tooltip id="addTooltip" place="top" content="Add Priority" />

        {/* Title in the Center */}
        <p className="text-center grow">PRIORITY LIST</p>

        {/* Right Buttons (Desktop & Mobile) */}
        <div className="flex gap-3 sm:gap-6">
          {/* Add Button (Visible on Desktop) */}
          <button
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition hidden sm:block"
            onClick={() =>
              document.getElementById("Add_Priority_Modal").showModal()
            }
            data-tooltip-id="addTooltip"
          >
            <FaPlus />
          </button>

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

      <div className="flex justify-between items-center font-semibold rounded-xl text-black bg-linear-to-b from-yellow-300 to-yellow-600 px-3">
        <IoMdAdd className="text-3xl font-bold bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 rounded-full cursor-pointer" />

        <p className="text-center py-3">PRIORITY LIST</p>
        <button></button>
      </div>

      {/* Priority List */}
      <div className="space-y-3">
        {priority?.length ? (
          topPriorities.map((event, index) => (
            <div
              key={index}
              className="flex items-center gap-3 w-full cursor-pointer"
              onClick={() => {
                setSelectedPriority(event);
                document.getElementById("View_Priority_Modal").showModal();
              }}
            >
              <FcHighPriority className="text-4xl border border-red-500 rounded-full p-1" />
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
                document.getElementById("Add_Priority_Modal").showModal()
              }
            >
              + Add Priority
            </button>
          </div>
        )}
      </div>

      {/* Add Priority Modal */}
      <dialog id="Add_Priority_Modal" className="modal">
        <AddPriorityModal refetch={refetch} />
      </dialog>
      {/* View Priority Modal */}
      <dialog id="View_Priority_Modal" className="modal">
        <ViewPriorityModal refetch={refetch} Priority={selectedPriority} />
      </dialog>
      {/* View All Priority Modal */}
      <dialog id="View_All_Priority_Modal" className="modal">
        <ViewAllPriorityModal refetch={refetch} priority={priority} />
      </dialog>
    </div>
  );
};

export default ExtraPriorityList;
