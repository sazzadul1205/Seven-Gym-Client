import { useEffect, useRef, useState } from "react";

// Import Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@tanstack/react-query";

// import Icons
import { ImCross } from "react-icons/im";
import { FaRegTrashAlt } from "react-icons/fa";

// Import Shared
import Loading from "../../../../../Shared/Loading/Loading";
import FetchingError from "../../../../../Shared/Component/FetchingError";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Import Utility
import { fetchTierBadge } from "../../../../../Utility/fetchTierBadge";

// import Table Component
import ClassDetailsTrainersEditTrainerTable from "./ClassDetailsTrainersEditTrainerTable/ClassDetailsTrainersEditTrainerTable";

const ClassDetailsTrainersEditModal = ({
  selectedClass,
  ClassTrainersData,
  ClassScheduleData,
  Refetch,
}) => {
  const errorRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  const [deleteTrainerError, setDeleteTrainerError] = useState(null);

  useEffect(() => {
    if (deleteTrainerError && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [deleteTrainerError]);

  // Fetch Trainers Data
  const {
    data: TrainerBasicData,
    isLoading: TrainerBasicIsLoading,
    error: TrainerBasicError,
  } = useQuery({
    queryKey: ["TrainersBasicInfo"],
    queryFn: async () =>
      axiosPublic.get(`/Trainers/BasicInfo`).then((res) => res.data),
  });

  // Handle Loading State
  if (TrainerBasicIsLoading) {
    return <Loading />;
  }

  // Handle Errors
  if (TrainerBasicError) {
    return <FetchingError />;
  }

  // Handle Delete Trainer
  const handleDeleteTrainer = async (trainer) => {
    try {
      // Clear any previous error message
      setDeleteTrainerError(null);

      // Fetch the trainer's current schedule data from the server
      const { data: scheduleData } = await axiosPublic.get(
        `/Trainers_Schedule/TrainerId/${trainer?._id}`
      );

      // Remove the class type from the trainer's schedule for the selected class
      const modifiedScheduleData = removeMatchingClassType(
        scheduleData,
        selectedClass?.module
      );

      // Remove the trainer from the class in the class details
      await axiosPublic.put("/Class_Details/trainer", {
        module: selectedClass?.module,
        trainer: { _id: trainer?._id, name: trainer?.name },
        action: "remove",
      });

      // Update the trainer's schedule on the server
      await axiosPublic.put("/Trainers_Schedule/Update", {
        trainerName: scheduleData.trainerName,
        trainerSchedule: modifiedScheduleData.trainerSchedule,
      });

      // Refetch data to update the UI
      Refetch();
    } catch (error) {
      // Log the error and set the error message for display
      console.error("handleDeleteTrainer error:", error);
      setDeleteTrainerError(
        error?.response?.data || error?.message || "Unknown error occurred"
      );
    }
  };

  return (
    <div className="modal-box max-w-7xl p-0 bg-gradient-to-b from-white to-gray-300 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">
          Edit: {selectedClass?.module} Class Trainers
        </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document.getElementById("Class_Trainers_Edit_Modal")?.close()
          }
        />
      </div>

      {deleteTrainerError && (
        <div
          ref={errorRef}
          className="bg-red-100 text-red-700 p-3 rounded shadow-sm border border-red-300 mb-4"
        >
          <strong>Error:</strong> {deleteTrainerError}
        </div>
      )}

      {/* Trainers Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
        {ClassTrainersData.map((trainer) => (
          <div
            key={trainer.id || trainer.name}
            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden relative flex flex-col border border-gray-900"
          >
            {/* Delete Button */}
            <>
              <button
                id={`delete-trainer-btn-${trainer._id}`}
                className="absolute top-3 right-3 border-2 border-red-500 bg-red-100 rounded-full p-2 cursor-pointer hover:scale-105 transition-transform duration-200 z-10"
                onClick={() => handleDeleteTrainer(trainer)}
              >
                <FaRegTrashAlt className="text-red-500" />
              </button>
              <Tooltip
                anchorSelect={`#delete-trainers-btn-${trainer._id}`}
                content="Delete trainer"
              />
            </>

            {/* Tier Badge */}
            {trainer?.tier && (
              <span
                className={`absolute top-3 left-3 z-10 cursor-default ${fetchTierBadge(
                  trainer.tier
                )} px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md`}
              >
                {trainer.tier} Tier
              </span>
            )}

            {/* Trainer Image */}
            <div className="relative">
              <img
                src={trainer?.imageUrl}
                alt={trainer?.name}
                className="w-full h-[260px] object-cover object-top"
              />
            </div>

            {/* Card Content */}
            <div className="flex flex-col flex-1 justify-between bg-gradient-to-bl hover:bg-gradient-to-tr from-gray-100 to-gray-300 p-4 space-y-4">
              {/* Name & Specialization */}
              <div>
                {/* Trainer Name */}
                <h4 className="text-2xl font-bold text-gray-800">
                  {trainer?.name}
                </h4>

                {/* Trainer Specialization */}
                <p className="text-gray-600 italic text-sm">
                  {trainer?.specialization}
                </p>
              </div>

              {/* Experience & Age */}
              <div className="text-sm text-gray-700 space-y-1 border-t pt-1 border-gray-400">
                {/* Experience */}
                <div className="flex justify-between">
                  <span className="font-medium">Experience:</span>
                  <span className="font-semibold">
                    {trainer?.experience} yrs
                  </span>
                </div>

                {/* Age */}
                <div className="flex justify-between">
                  <span className="font-medium">Age:</span>
                  <span className="font-semibold text-green-700">
                    {trainer?.age} yrs old
                  </span>
                </div>
              </div>

              {/* Available Days */}
              <div className="text-center border-t border-gray-400 pt-2">
                {/* Title */}
                <p className="text-gray-800 font-bold text-sm mb-1">
                  Available Days
                </p>
                {/* Days */}
                <p className="font-semibold text-xs text-gray-600">
                  [{trainer?.availableDays.join(", ")}]
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trainer Table */}
      <ClassDetailsTrainersEditTrainerTable
        setDeleteTrainerError={setDeleteTrainerError}
        ClassScheduleData={ClassScheduleData}
        TrainerBasicData={TrainerBasicData}
        selectedClass={selectedClass}
        Refetch={Refetch}
      />
    </div>
  );
};

// Prop Validation
ClassDetailsTrainersEditModal.propTypes = {
  selectedClass: PropTypes.shape({
    module: PropTypes.string,
  }),
  ClassTrainersData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      tier: PropTypes.string,
      imageUrl: PropTypes.string,
      specialization: PropTypes.string,
      experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      availableDays: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  ClassScheduleData: PropTypes.array,
  Refetch: PropTypes.func.isRequired,
};

export default ClassDetailsTrainersEditModal;

// Removes the specified class type from a trainer's schedule data
const removeMatchingClassType = (scheduleData, moduleName) => {
  // Build the class type string to remove
  const classToRemove = `${moduleName} Class`;

  // Deep clone the schedule data to avoid mutating the original
  const transformed = JSON.parse(JSON.stringify(scheduleData));

  // Loop through each day in the trainer's schedule
  for (const day in transformed.trainerSchedule) {
    const timeSlots = transformed.trainerSchedule[day];

    // Loop through each time slot for the day
    for (const time in timeSlots) {
      const slot = timeSlots[time];
      // If the slot matches the class type, clear its details
      if (slot.classType === classToRemove) {
        slot.classType = "";
        slot.participantLimit = 0;
        slot.classPrice = 0;
      }
    }
  }

  // Return the updated schedule data
  return transformed;
};
