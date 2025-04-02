import { useEffect, useState } from "react";

// Import Package
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Import hooks
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";

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

const TrainerSchedule = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State to manage the temporary schedule and changes made before saving
  const [tempSchedule, setTempSchedule] = useState({});
  const [changesMade, setChangesMade] = useState(false);

  // Fetch trainer data
  const {
    data: TrainerData = [],
    isLoading: TrainerDataIsLoading,
    error: TrainerDataError,
    refetch: refetchTrainerData,
  } = useQuery({
    queryKey: ["TrainerData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Trainers?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Extract trainer profile data
  const TrainerProfileData = TrainerData?.[0] || null;

  // Fetch trainer Class preferences
  const TrainersClassType = TrainerProfileData?.preferences?.classTypes || null;

  // Fetch trainer schedule data
  const {
    data: TrainerScheduleData = [],
    isLoading: TrainerScheduleIsLoading,
    error: TrainerScheduleError,
  } = useQuery({
    queryKey: ["TrainerScheduleData", TrainerProfileData?.name],
    queryFn: () =>
      axiosPublic
        .get(
          `/Trainers_Schedule/ByTrainerName?trainerName=${encodeURIComponent(
            TrainerProfileData?.name
          )}`
        )
        .then((res) => res.data),
    enabled: !!TrainerProfileData?.name,
  });

  // Fetch available class types
  const {
    data: availableClassTypes = [],
    isLoading: classTypesLoading,
    error: classTypesError,
  } = useQuery({
    queryKey: ["TrainerClassTypes"],
    queryFn: () =>
      axiosPublic.get(`/Trainers/classTypes`).then((res) => res.data),
  });

  // Extract schedule data
  const TrainerProfileScheduleData = TrainerScheduleData?.[0] || null;

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
  }, [TrainerScheduleData, TrainerProfileData]);

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
    availableClassTypes.includes(classType);

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

  // Loading state
  if (TrainerDataIsLoading || TrainerScheduleIsLoading || classTypesLoading)
    return <Loading />;

  // Error state
  if (TrainerDataError || TrainerScheduleError || classTypesError)
    return <FetchingError />;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <h2 className="text-center text-black font-semibold text-2xl">
          {TrainerProfileData?.name || "Trainer"}&apos;s Schedule Management
        </h2>

        {/* Divider */}
        <div className="mx-auto w-1/2 h-1 bg-black my-2"></div>

        {/* Trainer Schedule Class Selector Component */}
        <TrainerScheduleClassSelector
          refetch={refetchTrainerData}
          trainerClassTypes={TrainersClassType}
          availableClassTypes={availableClassTypes}
        />

        {/* Trainer Schedule Display Component */}
        <div className="bg-gray-100 border border-gray-300 p-2">
          <div className="flex justify-between items-center text-black font-semibold text-lg">
            {/* Text */}
            <h3>Schedule Control</h3>

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

export default TrainerSchedule;
