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

  // Local Shared State
  const [schedule, setSchedule] = useState([...ClassScheduleData]);
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Weekday order
  const dayOrder = {
    Friday: 1,
    Saturday: 2,
    Sunday: 3,
    Monday: 4,
    Tuesday: 5,
    Wednesday: 6,
    Thursday: 7,
  };

  // Sort schedule by weekday order
  const sortedSchedule = [...schedule].sort(
    (a, b) => dayOrder[a.day] - dayOrder[b.day]
  );

  // Normalize time to ensure startTime ends with :00 and endTime ends with :59
  const normalizeTime = (value, type) => {
    const [hour] = value.split(":");
    return `${hour}:${type === "startTime" ? "00" : "59"}`;
  };

  // Handle time input changes for startTime and endTime
  const handleTimeChange = (index, key, value) => {
    const updated = [...schedule];
    updated[index][key] = normalizeTime(value, key);
    setSchedule(updated);
  };

  // Handles saving the edited schedule to the server
  const handleSaveChanges = async () => {
    setLoading(true);
    setModalError(null);

    try {
      // Ensure the selected class has a module name
      if (!selectedClass?.module) {
        setModalError("Module name is missing.");
        setLoading(false);
        return;
      }

      // Send updated schedule to the server
      await axiosPublic.put(
        `/Our_Classes_Schedule/UpdateClassTime/${selectedClass?.module}`,
        schedule
      );

      // Refresh data after successful update
      Refetch();

      // Close the modal
      document.getElementById("Class_Schedule_Edit_Modal")?.close();
    } catch (err) {
      // Handle errors and display message
      console.error("Update failed:", err);
      setModalError(
        err?.response?.data || "Failed to update class schedule. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle closing the modal and resetting state
  const handleCloseModal = () => {
    setSchedule([...ClassScheduleData]);
    setModalError(null);
    document.getElementById("Class_Schedule_Edit_Modal")?.close();
  };

  return (
    <div className="modal-box max-w-xl p-0 bg-gradient-to-b from-white to-gray-300 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit: {selectedClass?.module} Class Schedule
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={handleCloseModal}
        />
      </div>

      {/* Error Display */}
      {modalError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm m-5">
          {modalError}
        </div>
      )}

      {/* Schedule Editor */}
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

      {/* Save Button */}
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
  }),
  Refetch: PropTypes.func,
};

export default ClassDetailsScheduleEditModal;
