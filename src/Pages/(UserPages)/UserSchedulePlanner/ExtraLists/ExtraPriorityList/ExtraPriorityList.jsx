import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { FaList } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";
import { FcHighPriority } from "react-icons/fc";

// Import Modals
import AddPriorityModal from "./AddPriorityModal/AddPriorityModal";
import ViewPriorityModal from "./ViewPriorityModal/ViewPriorityModal";
import ViewAllPriorityModal from "./ViewAllPriorityModal/ViewAllPriorityModal";

const ExtraPriorityList = ({ priority, refetch }) => {
  // State to store the selected priority for viewing
  const [selectedPriority, setSelectedPriority] = useState(null);

  // Sort priorities: Important ones first, then by most recent reminder
  const sortedPriorities = priority
    ? [...priority].sort(
        (a, b) =>
          b.isImportant - a.isImportant ||
          new Date(b.reminder) - new Date(a.reminder)
      )
    : [];

  // Get top 5 priorities
  const topPriorities = sortedPriorities?.slice(0, 5);

  return (
    <div className="space-y-3 bg-gray-200 rounded-xl">
      {/* Title Bar with Action Buttons */}
      <div className="flex justify-between items-center font-semibold rounded-xl text-black bg-linear-to-b from-yellow-300 to-yellow-600 px-3">
        {/* Add Priority Button */}
        <button
          className="rounded-full bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 cursor-pointer p-[3px]"
          onClick={() =>
            document.getElementById("Add_Priority_Modal").showModal()
          }
          data-tooltip-id="Add_Modal_Button_Tooltip_Priorities"
        >
          <MdAddToPhotos className="text-white text-3xl font-bold p-1" />
          <Tooltip
            id="Add_Modal_Button_Tooltip_Priorities"
            place="top"
            content="Add Priority"
          />
        </button>

        {/* Title */}
        <p className="text-center py-3">PRIORITY LIST</p>

        {/* View All Priorities Button */}
        <button
          className="rounded-full bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-600 cursor-pointer p-[3px]"
          onClick={() =>
            document.getElementById("View_All_Priority_Modal").showModal()
          }
          data-tooltip-id="View_List_Button_Tooltip_Priorities"
        >
          <FaList className="text-white text-3xl font-bold p-[6px]" />
          <Tooltip
            id="View_List_Button_Tooltip_Priorities"
            place="top"
            content="View All Priorities"
          />
        </button>
      </div>

      {/* Priority List Display */}
      <div className="space-y-3 px-2 pb-3 text-black">
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
              {/* Priority Icon */}
              <FcHighPriority className="text-3xl text-red-500 border border-red-500 rounded-full p-1" />

              {/* Priority Details */}
              <div className="w-full flex flex-row justify-between bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-500 rounded-xl px-4 py-3 cursor-pointer ">
                {/* Priority Title */}
                <p className="flex font-bold md:font-semibold">
                  {event.title}
                  {event.isImportant && (
                    <span className="text-yellow-500 font-bold ml-4">★</span>
                  )}
                </p>

                {/* Separator (Desktop Only) */}
                <p className="hidden md:flex">-</p>

                {/* Reminder Date */}
                <p className="font-bold">
                  {new Date(event.reminder).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          // Empty State: Add Priority Button
          <div className="flex min-h-[100px] justify-center items-center py-16">
            <button
              className="px-16 py-2 bg-linear-to-br hover:bg-linear-to-tl from-green-300 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
              onClick={() =>
                document.getElementById("Add_Priority_Modal").showModal()
              }
            >
              + Add Priority
            </button>
          </div>
        )}
      </div>

      {/* Modal's */}

      {/* Add Priority */}
      <dialog id="Add_Priority_Modal" className="modal">
        <AddPriorityModal refetch={refetch} />
      </dialog>

      {/* View Selected Priority */}
      <dialog id="View_Priority_Modal" className="modal">
        <ViewPriorityModal refetch={refetch} Priority={selectedPriority} />
      </dialog>

      {/* View All priority's */}
      <dialog id="View_All_Priority_Modal" className="modal">
        <ViewAllPriorityModal refetch={refetch} priority={priority} />
      </dialog>
    </div>
  );
};

// PropTypes for type checking
ExtraPriorityList.propTypes = {
  priority: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      isImportant: PropTypes.bool.isRequired,
      reminder: PropTypes.string.isRequired,
    })
  ),
  refetch: PropTypes.func.isRequired,
};

export default ExtraPriorityList;
