/* eslint-disable react/prop-types */
import { useState } from "react";
import { ImCross } from "react-icons/im";
import Loading from "../../../../../Shared/Loading/Loading";
import { BiCalendarCheck, BiMap, BiNotepad } from "react-icons/bi";
import { FaEdit, FaRegTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const ViewPlanModal = ({ eventDetails, isLoading, refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scheduleIDs, setScheduleIDs] = useState([]);

  // Open delete confirmation
  const handleDeleteClick = (id) => {
    setScheduleIDs([id]); // Set the schedule ID for deletion
    setShowDeleteConfirm(true);
  };

  // Close delete confirmation
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setScheduleIDs([]); // Clear selected schedule IDs
  };

  // Confirm delete (send request)
  const handleConfirmDelete = async () => {
    const email = user?.email;
    if (!email || !scheduleIDs.length) return; // Guard clause for safety

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axiosPublic.put("/Schedule/DeleteSchedules", {
        email,
        scheduleIDs,
      });
      document.getElementById("Details_view_Modal").close();
      setShowDeleteConfirm(false);
      refetch();
      setScheduleIDs([]); // Clear the list after deletion
    } catch (error) {
      console.error("Error deleting schedules:", error);
    }
  };

  // Render event details or fallback UI
  const renderEventDetails = () => {
    if (isLoading) return <Loading />;
    if (!eventDetails?.length) return renderNoEventUI();

    const event = eventDetails[0]; // Since we're only using the first event
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BiCalendarCheck className="text-blue-500 text-2xl" />
          {event.title}
        </h2>
        <p className="text-gray-700 flex items-center gap-2">
          <BiNotepad className="text-green-500 text-xl" />
          <strong>Notes:</strong> {event.notes}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <BiMap className="text-red-500 text-xl" />
          <strong>Location:</strong> {event.location}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <strong>Status:</strong>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              event.status === "planned"
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-black"
            }`}
          >
            {event.status}
          </span>
        </p>

        {/* Buttons Section */}
        <div className="flex justify-between items-center mt-4">
          <button className="p-3 bg-yellow-500 rounded-xl shadow-xl hover:shadow-2xl transition">
            <FaEdit className="text-xl text-white" />
          </button>
          <button
            className="p-3 bg-red-500 rounded-xl shadow-xl hover:shadow-2xl transition"
            onClick={() => handleDeleteClick(event.id)}
          >
            <FaRegTrashAlt className="text-xl text-white" />
          </button>
        </div>
      </div>
    );
  };

  // Render no event details UI
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
    <div className="modal-box p-6 rounded-lg shadow-lg bg-white bg-gradient-to-br from-gray-300 to-gray-200 relative">
      {/* Title Part */}
      <div className="flex justify-between items-center border-b border-gray-300 pb-3">
        <h3 className="font-bold text-xl text-gray-800">📅 View Plans</h3>
        <ImCross
          className="text-2xl text-gray-600 hover:text-[#F72C5B] cursor-pointer transition duration-200"
          onClick={() => document.getElementById("Details_view_Modal").close()}
        />
      </div>

      {/* Delete Confirmation Ribbon */}
      {showDeleteConfirm && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-3 rounded-t-lg flex justify-between items-center animate-fadeIn">
          <p className="font-semibold">
            ⚠️ Are you sure you want to delete this event?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleConfirmDelete}
              className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
              <FaCheck className="text-white" />
            </button>
            <button
              onClick={handleCancelDelete}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition"
            >
              <FaTimes className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Content */}
      <div className="py-4">{renderEventDetails()}</div>
    </div>
  );
};

export default ViewPlanModal;
