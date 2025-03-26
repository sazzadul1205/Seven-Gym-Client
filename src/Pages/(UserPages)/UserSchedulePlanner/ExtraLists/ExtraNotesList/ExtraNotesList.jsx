import { useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

// Import Icons
import { FaList } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";

// Import Modals
import AddNotesModal from "./AddNotesModal/AddNotesModal";
import ViewNotesModal from "./ViewNotesModal/ViewNotesModal";
import ViewAllNotesModal from "./ViewAllNotesModal/ViewAllNotesModal";

const ExtraNotesList = ({ note, refetch }) => {
  // State to store the selected note for viewing
  const [selectedNote, setSelectedNote] = useState(null);

  // Sort Notes: Important ones first, then by most recent reminder
  const sortedNotes = note
    ? [...note].sort(
        (a, b) =>
          b.isImportant - a.isImportant ||
          new Date(b.reminder) - new Date(a.reminder)
      )
    : [];

  // Get top 5 Notes
  const topNotes = sortedNotes?.slice(0, 5);

  return (
    <div className="space-y-3 bg-gray-200 rounded-xl">
      {/* Title Bar with Action Buttons */}
      <div className="flex justify-between items-center font-semibold rounded-xl text-black bg-linear-to-b from-yellow-300 to-yellow-600 px-3">
        {/* Add Note Button */}
        <button
          className="rounded-full bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 cursor-pointer p-[3px]"
          onClick={() => document.getElementById("Add_Note_Modal").showModal()}
          data-tooltip-id="Add_Modal_Button_Tooltip_Notes"
        >
          <MdAddToPhotos className="text-white text-3xl font-bold p-1" />
          <Tooltip
            id="Add_Modal_Button_Tooltip_Notes"
            place="top"
            content="Add Note"
          />
        </button>

        {/* Title */}
        <p className="text-center py-3">NOTE LIST</p>

        {/* View All Notes Button */}
        <button
          className="rounded-full bg-linear-to-bl hover:bg-linear-to-tr from-blue-300 to-blue-600 cursor-pointer p-[3px]"
          onClick={() =>
            document.getElementById("View_All_Note_Modal").showModal()
          }
          data-tooltip-id="View_List_Button_Tooltip_Notes"
        >
          <FaList className="text-white text-3xl font-bold p-[6px]" />
          <Tooltip
            id="View_List_Button_Tooltip_Notes"
            place="top"
            content="View All Notes"
          />
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-3 px-2 pb-3 text-black">
        {note?.length ? (
          topNotes.map((event, index) => (
            <div
              key={index}
              className="flex items-center gap-3 w-full cursor-pointer"
              onClick={() => {
                setSelectedNote(event);
                document.getElementById("View_Note_Modal").showModal();
              }}
            >
              {/* Priority Icon */}
              <IoIosCreate className="text-4xl text-yellow-500 border border-yellow-500 rounded-full font-semibold p-1" />

              {/* Priority Details */}
              <div className="w-full flex flex-row justify-between bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-500 rounded-xl px-4 py-3 cursor-pointer ">
                {/* Priority Title */}
                <p className="flex font-bold md:font-semibold">
                  {event.title}
                  {event.isImportant && (
                    <span className="text-red-500 font-bold ml-4">★</span>
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
                document.getElementById("Add_Note_Modal").showModal()
              }
            >
              + Add Note
            </button>
          </div>
        )}
      </div>

      {/* Modal's */}

      {/* Add Note  */}
      <dialog id="Add_Note_Modal" className="modal">
        <AddNotesModal refetch={refetch} />
      </dialog>

      {/* View Selected Note  */}
      <dialog id="View_Note_Modal" className="modal">
        <ViewNotesModal refetch={refetch} Note={selectedNote} />
      </dialog>

      {/* View All Notes Modal */}
      <dialog id="View_All_Note_Modal" className="modal">
        <ViewAllNotesModal refetch={refetch} note={note} />
      </dialog>
    </div>
  );
};

// PropTypes for type checking
ExtraNotesList.propTypes = {
  note: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      isImportant: PropTypes.bool.isRequired,
      reminder: PropTypes.string.isRequired,
    })
  ),
  refetch: PropTypes.func.isRequired,
};

export default ExtraNotesList;
