import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import FetchingError from "../../../Shared/Component/FetchingError";
import TrainerScheduleDisplay from "./TrainerScheduleDisplay/TrainerScheduleDisplay";
import TrainerScheduleClassSelector from "./TrainerScheduleClassSelector/TrainerScheduleClassSelector";

// Convert 24-hour time to 12-hour AM/PM format
const formatTimeTo12Hour = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const amPm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${amPm}`;
};

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
    setTempSchedule(initialSchedule);
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
          trainerClassTypes={TrainersClassType}
          availableClassTypes={availableClassTypes}
          refetch={refetchTrainerData}
        />

        <div className="flex justify-end mb-4">
          <button
            onClick={handleSave}
            disabled={!changesMade}
            className={`px-5 py-2 font-semibold rounded ${
              changesMade
                ? "bg-blue-500 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>

        <TrainerScheduleDisplay
          handleClear={handleClear}
          tempSchedule={tempSchedule}
          isValidClassType={isValidClassType}
          formatTimeTo12Hour={formatTimeTo12Hour}
        />
      </div>
    </div>
  );
};

export default TrainerSchedule;
