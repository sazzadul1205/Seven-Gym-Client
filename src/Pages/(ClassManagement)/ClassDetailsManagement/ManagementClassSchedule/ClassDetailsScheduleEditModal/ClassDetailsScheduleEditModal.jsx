import { useState } from "react";

// Import Icon
import { ImCross } from "react-icons/im";

// Import Packages
import PropTypes from "prop-types";

// Import Shared
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const ClassDetailsScheduleEditModal = ({
  ClassScheduleData,
  selectedClass,
  Refetch,
}) => {
  const axiosPublic = useAxiosPublic();

  // Local state for schedule, loading indicator, and error message
  const [schedule, setSchedule] = useState([...ClassScheduleData]);
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Weekday order to sort schedule properly
  const dayOrder = {
    Friday: 1,
    Saturday: 2,
    Sunday: 3,
    Monday: 4,
    Tuesday: 5,
    Wednesday: 6,
    Thursday: 7,
  };

  // Sort the schedule by the predefined weekday order
  const sortedSchedule = [...schedule].sort(
    (a, b) => dayOrder[a.day] - dayOrder[b.day]
  );

  // Normalize time input to have :00 for startTime and :59 for endTime
  const normalizeTime = (value, type) => {
    const [hour] = value.split(":");
    return `${hour}:${type === "startTime" ? "00" : "59"}`;
  };

  // Handle changes to time inputs and update schedule state accordingly
  const handleTimeChange = (index, key, value) => {
    const updated = [...schedule];
    updated[index][key] = normalizeTime(value, key);
    setSchedule(updated);
  };

  // Handle saving the changes
  const handleSaveChanges = async () => {
    setLoading(true); // Show loading spinner
    setModalError(null); // Clear any previous error

    try {
      // Validate if the class module exists
      if (!selectedClass?.module) {
        setModalError("Module name is missing.");
        setLoading(false);
        return;
      }

      // *** New validation: prevent saving if there are assigned trainers ***
      if (selectedClass?.trainers?.length > 0) {
        setModalError(
          "Please remove all trainers from this class before changing the schedule."
        );
        setLoading(false);
        return; // Block the save operation
      }

      // Send the updated schedule to the backend
      await axiosPublic.put(
        `/Our_Classes_Schedule/UpdateClassTime/${selectedClass?.module}`,
        schedule
      );

      // Refresh the data after successful save
      Refetch();

      // Close the modal
      document.getElementById("Class_Schedule_Edit_Modal")?.close();
    } catch (err) {
      // Handle errors during update
      console.error("Update failed:", err);
      setModalError(
        err?.response?.data || "Failed to update class schedule. Try again."
      );
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Reset the schedule and error state when modal closes
  const handleCloseModal = () => {
    setSchedule([...ClassScheduleData]); // Reset to initial data
    setModalError(null); // Clear error
    document.getElementById("Class_Schedule_Edit_Modal")?.close(); // Close modal
  };

  return (
    <div className="modal-box max-w-xl p-0 bg-gradient-to-b from-white to-gray-300 text-black">
      {/* Modal header with title and close button */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit: {selectedClass?.module} Class Schedule
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={handleCloseModal}
        />
      </div>

      {/* Display error message if any */}
      {modalError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm m-5">
          {modalError}
        </div>
      )}

      {/* Schedule inputs list */}
      <div className="px-5 py-4 max-h-[60vh] overflow-y-auto space-y-4">
        {sortedSchedule.map((entry) => (
          <div
            key={entry.day}
            className="flex items-center justify-between border p-2 rounded bg-white shadow"
          >
            <span className="font-semibold w-24">{entry.day}</span>
            <input
              type="time"
              step="3600"
              value={entry.startTime}
              onChange={(e) =>
                handleTimeChange(
                  schedule.findIndex((s) => s.day === entry.day),
                  "startTime",
                  e.target.value
                )
              }
              className="border rounded px-2 py-1"
            />
            <span>to</span>
            <input
              type="time"
              step="3600"
              value={entry.endTime}
              onChange={(e) =>
                handleTimeChange(
                  schedule.findIndex((s) => s.day === entry.day),
                  "endTime",
                  e.target.value
                )
              }
              className="border rounded px-2 py-1"
            />
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="md:col-span-2 flex justify-end px-6 pb-6">
        <CommonButton
          clickEvent={handleSaveChanges}
          text="Save Changes"
          bgColor="green"
          isLoading={loading}
          loadingText="Saving..."
          disabled={loading}
        />
      </div>
    </div>
  );
};

// Prop Validation
ClassDetailsScheduleEditModal.propTypes = {
  ClassScheduleData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
    })
  ),
  selectedClass: PropTypes.shape({
    module: PropTypes.string,
    trainers: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
      })
    ),
  }),
  Refetch: PropTypes.func,
};

export default ClassDetailsScheduleEditModal;
