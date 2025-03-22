import { useState } from "react";

// Import Package
import PropTypes from "prop-types";

// Import Icons
import { ImCross } from "react-icons/im";
import { FaEdit, FaRegTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { BiCalendarCheck, BiMap, BiNotepad, BiTime } from "react-icons/bi";

// import Utility
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const ViewPlanModal = ({ eventDetails, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [scheduleID, setScheduleID] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Open delete confirmation modal with the selected schedule ID
  const handleDeleteClick = (id) => {
    setScheduleID(id);
    setShowDeleteConfirm(true);
  };

  // Close delete confirmation modal without deleting
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setScheduleID(null);
  };

  // Confirm delete action and send request to delete the schedule
  const handleConfirmDelete = async () => {
    if (!user?.email || !scheduleID) return;
    try {
      // Send delete request to API
      await axiosPublic.put("/Schedule/DeleteSchedules", {
        email: user.email,
        scheduleIDs: [scheduleID],
      });
      document.getElementById("Details_view_Modal").close();
      setShowDeleteConfirm(false);
      setScheduleID(null);
      refetch();
    } catch (error) {
      console.error("Error deleting schedules:", error);
    }
  };

  // Extract the time from the event ID (last part of the ID)
  const extractTimeFromId = (id) => {
    const parts = id.split("-");
    return parts[parts.length - 1];
  };

  // Convert a 24-hour time string (e.g., "14:00") to 12-hour format (e.g., "2:00 PM")
  const convert24To12Format = (time) => {
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${period}`;
  };

  // Render event details or fallback UI when no event is available
  const renderEventDetails = () => {
    if (!eventDetails?.length) return renderNoEventUI();
    const event = eventDetails[0];
    // Extract time from event id and convert to 12-hour format
    const eventTime = convert24To12Format(extractTimeFromId(event.id));
    return (
      <div className="space-y-4 px-5">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BiCalendarCheck className="text-blue-500 text-2xl" />
          <p>Title :</p>
          {event.title}
        </h2>

        {/* Notes */}
        <div className="text-gray-700 space-y-2">
          <p className="flex items-center gap-2">
            <BiNotepad className="text-green-500 text-2xl" />
            <strong>Notes:</strong>
          </p>
          <p className="bg-white border border-gray-300 p-2">{event.notes}</p>
        </div>

        {/* Location */}
        <p className="text-gray-700 flex items-center gap-2">
          <BiMap className="text-red-500 text-2xl" />
          <strong>Location:</strong> {event.location}
        </p>

        {/* Time */}
        <p className="text-gray-700 flex items-center gap-2">
          <BiTime className="text-purple-500 text-2xl" />
          <strong>Time:</strong> {eventTime}
        </p>

        {/* Action buttons for editing and deleting the event */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="bg-linear-to-bl hover:bg-linear-to-tr from-yellow-300 to-yellow-600 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer p-3 px-6"
            onClick={() => alert("Edit functionality is coming soon!")}
          >
            <FaEdit className="text-xl text-white" />
          </button>

          <button
            className=" bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer p-3 px-6"
            onClick={() => handleDeleteClick(event.id)}
          >
            <FaRegTrashAlt className="text-xl text-white" />
          </button>
        </div>
      </div>
    );
  };

  // Render UI when there are no event details available
  const renderNoEventUI = () => (
    <div className="flex flex-col justify-center items-center h-40 text-center text-gray-500">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
        alt="No Event"
        className="w-16 h-16 opacity-50 mb-2"
      />
      <p>No event details available.</p>
    </div>
  );

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Modal Header with title and close button */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-xl text-gray-800">📅 View Plans</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => document.getElementById("Details_view_Modal").close()} // Close the modal
        />
      </div>

      {/* Delete Confirmation Ribbon (visible when delete is triggered) */}
      {showDeleteConfirm && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-3 rounded-t-lg flex justify-between items-center animate-fadeIn">
          <p className="font-semibold">
            ⚠️ Are you sure you want to delete this event?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleConfirmDelete} // Confirm delete action
              className="p-2 bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 rounded-lg cursor-pointer"
            >
              <FaCheck className="text-white" /> {/* Confirm button */}
            </button>
            <button
              onClick={handleCancelDelete} // Cancel delete action
              className="p-2 bg-linear-to-bl hover:bg-linear-to-tr from-gray-300 to-gray-600 rounded-lg cursor-pointer"
            >
              <FaTimes className="text-white" /> {/* Cancel button */}
            </button>
          </div>
        </div>
      )}

      {/* Modal Content */}
      <div className="py-4">{renderEventDetails()}</div>
    </div>
  );
};

ViewPlanModal.propTypes = {
  eventDetails: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      notes: PropTypes.string,
      location: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  refetch: PropTypes.func.isRequired,
};

export default ViewPlanModal;
