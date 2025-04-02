import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";
import TrainerScheduleDisplay from "./TrainerScheduleDisplay/TrainerScheduleDisplay";
import TrainerScheduleClassSelector from "./TrainerScheduleClassSelector/TrainerScheduleClassSelector";

const TrainerSchedule = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

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
  const initialSchedule = TrainerProfileScheduleData?.trainerSchedule || {};

  useEffect(() => {
    if (JSON.stringify(tempSchedule) !== JSON.stringify(initialSchedule)) {
      setTempSchedule(initialSchedule);
    }
  }, [TrainerScheduleData, TrainerProfileData]);

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

  const isValidClassType = (classType) =>
    availableClassTypes.includes(classType);

  // Inside TrainerSchedule component...
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

  const handleSave = () => {
    console.log("Saving changes:", tempSchedule);
    setChangesMade(false);
  };

  if (TrainerDataIsLoading || TrainerScheduleIsLoading || classTypesLoading)
    return <Loading />;
  if (TrainerDataError || TrainerScheduleError || classTypesError)
    return (
      <FetchingError
        error={TrainerDataError || TrainerScheduleError || classTypesError}
      />
    );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-center text-black font-semibold text-2xl">
          {TrainerProfileData?.name || "Trainer"}&apos;s Schedule Management
        </h2>
        <div className="mx-auto w-1/2 h-1 bg-black my-2"></div>

        <TrainerScheduleClassSelector
          refetch={refetchTrainerData}
          trainerClassTypes={TrainersClassType}
          availableClassTypes={availableClassTypes}
        />

        <div className="bg-gray-100 border border-gray-300 p-2">
          <div className="flex justify-between items-center text-black font-semibold text-lg">
            <h3>Schedule Control</h3>
            <button
              onClick={handleSave}
              disabled={!changesMade}
              className={`px-5 py-2 font-semibold rounded ${
                changesMade
                  ? "bg-blue-500 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              Save Schedule
            </button>
          </div>

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
