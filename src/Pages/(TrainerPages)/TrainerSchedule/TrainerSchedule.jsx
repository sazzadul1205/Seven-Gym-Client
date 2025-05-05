import { useEffect, useState } from "react";

// Import Package
import Swal from "sweetalert2";
import PropTypes from "prop-types"; // Import PropTypes

// Import hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Components
import TrainerScheduleDisplay from "./TrainerScheduleDisplay/TrainerScheduleDisplay";
import TrainerScheduleClassSelector from "./TrainerScheduleClassSelector/TrainerScheduleClassSelector";

// Helper function to remove "edited" flags from a schedule object
const removeEditedFlags = (schedule) => {
  const cleaned = {};
  for (const day in schedule) {
    cleaned[day] = {};
    for (const time in schedule[day]) {
      // Copy the time slot without the "edited" flag
      // eslint-disable-next-line no-unused-vars
      const { edited, ...rest } = schedule[day][time];
      cleaned[day][time] = rest;
    }
  }
  return cleaned;
};

const TrainerSchedule = ({
  refetch,
  TrainerProfileData,
  AvailableClassTypesData,
  TrainerProfileScheduleData,
}) => {
  const axiosPublic = useAxiosPublic();

  // State to manage the temporary schedule and changes made before saving
  const [tempSchedule, setTempSchedule] = useState({});
  const [changesMade, setChangesMade] = useState(false);

  // Fetch trainer Class preferences
  const TrainersClassType = TrainerProfileData?.preferences?.classTypes || null;

  // Initialize tempSchedule with the trainer's schedule data (without "edited" flags)
  const initialSchedule = TrainerProfileScheduleData?.trainerSchedule || {};

  // Set the initial schedule when TrainerScheduleData changes,
  // and remove any "edited" flags so they don't persist after refresh.
  useEffect(() => {
    const cleanedSchedule = removeEditedFlags(initialSchedule);
    if (JSON.stringify(tempSchedule) !== JSON.stringify(cleanedSchedule)) {
      setTempSchedule(cleanedSchedule);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TrainerProfileScheduleData, TrainerProfileData]);

  // Function to handle clearing a class slot
  const handleClear = (day, time) => {
    setTempSchedule((prev) => {
      const updated = { ...prev };
      if (updated[day] && updated[day][time]) {
        updated[day][time] = {
          ...updated[day][time],
          classType: "",
          participantLimit: "",
          classPrice: "",
        };
      }
      return updated;
    });
    setChangesMade(true);
  };

  // Function to check if a class type is valid
  const isValidClassType = (classType) =>
    AvailableClassTypesData?.includes(classType);

  // Function to handle updating a class slot from the modal
  const handleUpdate = (updatedClass) => {
    setTempSchedule((prev) => {
      const newSchedule = { ...prev };
      const { day, time } = updatedClass;
      newSchedule[day] = { ...newSchedule[day] };
      // Mark the updated slot with "edited: true"
      newSchedule[day][time] = { ...updatedClass, edited: true };
      return newSchedule;
    });
    setChangesMade(true);
  };

  // Function to handle saving changes to the schedule
  const handleSave = async () => {
    try {
      // Make a PUT request to update the trainer's schedule
      await axiosPublic.put("/Trainers_Schedule/Update", {
        trainerName: TrainerProfileData?.name,
        trainerSchedule: tempSchedule,
      });

      // On success, show a success message using Swal
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Trainer schedule updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      // Remove "edited" flags so that after reloading the page they won't reappear
      setTempSchedule((prev) => removeEditedFlags(prev));

      // Reset the changesMade flag
      setChangesMade(false);
    } catch (error) {
      console.error("Error saving schedule:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while saving the schedule.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="bg-gradient-to-t from-gray-200 to-gray-400 min-h-screen">
      {/* Section heading */}
      <div className="text-center py-1">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manage Trainer Schedule
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          Customize class types, availability, and session details
        </p>
      </div>

      <div className="mx-auto px-1 py-2">
        {/* Trainer Schedule Class Selector Component */}
        <TrainerScheduleClassSelector
          refetch={refetch}
          trainerClassTypes={TrainersClassType}
          availableClassTypes={AvailableClassTypesData}
        />

        {/* Trainer Schedule Display Component */}
        <div className="bg-gray-100 border border-gray-300 p-1 mt-1">
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-3 px-5">
            {/* Text */}
            <h3 className="font-semibold text-lg text-black">
              Schedule Control
            </h3>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!changesMade}
              className={`px-10 py-2 rounded-lg font-medium shadow-md flex items-center ${
                changesMade
                  ? "bg-linear-to-bl hover:bg-linear-to-tr from-green-300 to-green-600 text-white cursor-pointer"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Save Schedule
            </button>
          </div>

          {/* Trainer Schedule Display Component */}
          <TrainerScheduleDisplay
            handleClear={handleClear}
            tempSchedule={tempSchedule}
            handleUpdate={handleUpdate}
            isValidClassType={isValidClassType}
            TrainersClassType={TrainersClassType}
          />
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for TrainerSchedule
TrainerSchedule.propTypes = {
  refetch: PropTypes.func,
  TrainerProfileData: PropTypes.shape({
    name: PropTypes.string,
    preferences: PropTypes.shape({
      classTypes: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  AvailableClassTypesData: PropTypes.arrayOf(PropTypes.string),
  TrainerProfileScheduleData: PropTypes.shape({
    trainerSchedule: PropTypes.objectOf(
      PropTypes.objectOf(
        PropTypes.shape({
          classType: PropTypes.string,
          participantLimit: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          classPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          edited: PropTypes.bool, // Optional flag for tracking changes
        })
      )
    ),
  }),
};
export default TrainerSchedule;
