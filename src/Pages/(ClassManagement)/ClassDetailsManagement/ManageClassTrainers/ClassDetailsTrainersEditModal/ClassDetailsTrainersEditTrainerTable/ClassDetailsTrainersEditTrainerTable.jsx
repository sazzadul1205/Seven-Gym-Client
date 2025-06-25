import { useState } from "react";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";
import ValidationMessage from "./ValidationMessage/ValidationMessage";

const convertTo12Hour = (time24) => {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const amps = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${amps}`;
};

const validateTrainerAvailability = (
  trainerScheduleData,
  classScheduleData
) => {
  const unavailableTimes = [];
  const occupiedTimes = [];
  const availableTimes = [];

  for (const classSlot of classScheduleData) {
    const { day, startTime } = classSlot;

    const daySchedule = trainerScheduleData.trainerSchedule?.[day];

    if (!daySchedule || !daySchedule[startTime]) {
      unavailableTimes.push({ day, time: convertTo12Hour(startTime) });
      continue;
    }

    const trainerSlot = daySchedule[startTime];
    const hasParticipants =
      trainerSlot.participant &&
      Object.keys(trainerSlot.participant).length > 0;

    if (hasParticipants) {
      occupiedTimes.push({ day, time: convertTo12Hour(startTime) });
    } else {
      availableTimes.push({ day, time: convertTo12Hour(startTime) });
    }
  }

  if (unavailableTimes.length === 0 && occupiedTimes.length === 0) {
    return {
      valid: true,
      message: "Trainer is fully available for this class schedule.",
    };
  }

  const issues = [];

  if (unavailableTimes.length > 0) {
    issues.push(
      `Not available at: ${unavailableTimes
        .map((slot) => `${slot.day} ${slot.time}`)
        .join(", ")}`
    );
  }

  if (occupiedTimes.length > 0) {
    issues.push(
      `Already occupied at: ${occupiedTimes
        .map((slot) => `${slot.day} ${slot.time}`)
        .join(", ")}`
    );
  }

  if (availableTimes.length > 0) {
    issues.push(
      `Available at: ${availableTimes
        .map((slot) => `${slot.day} ${slot.time}`)
        .join(", ")}`
    );
  }

  return { valid: false, message: issues.join(" | ") };
};

const removeMatchingClassType = (scheduleData, moduleName) => {
  const classToRemove = `${moduleName} Class`;

  // Deep clone to avoid mutating the original if needed
  const transformed = JSON.parse(JSON.stringify(scheduleData));

  for (const day in transformed.trainerSchedule) {
    const timeSlots = transformed.trainerSchedule[day];

    for (const time in timeSlots) {
      const slot = timeSlots[time];
      if (slot.classType === classToRemove) {
        slot.classType = "";
        slot.participantLimit = 0;
        slot.classPrice = 0;
      }
    }
  }

  return transformed;
};

const ClassDetailsTrainersEditTrainerTable = ({
  ClassScheduleData,
  TrainerBasicData,
  selectedClass,
  Refetch,
}) => {
  const axiosPublic = useAxiosPublic();

  // Page Control
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New states for validation feedback and pending add
  const [currentTrainerSchedule, setCurrentTrainerSchedule] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [pendingTrainer, setPendingTrainer] = useState(null);

  const handleTrainerAction = async (trainer, isSelected) => {
    const { data: scheduleData } = await axiosPublic.get(
      `/Trainers_Schedule/TrainerId/${trainer._id}`
    );

    const modifiedScheduleData = removeMatchingClassType(
      scheduleData,
      selectedClass?.module
    );

    if (isSelected) {
      await axiosPublic.put("/Class_Details/trainer", {
        module: selectedClass?.module,
        trainer: { _id: trainer?._id, name: trainer?.name },
        action: "remove",
      });

      // Update the trainer's schedule (remove relevant classType)
      await axiosPublic.put("/Trainers_Schedule/Update", {
        trainerName: scheduleData.trainerName,
        trainerSchedule: modifiedScheduleData.trainerSchedule,
      });

      Refetch();
      setValidationMessage("");
      setPendingTrainer(null);
      setCurrentTrainerSchedule(null);
    } else {
      try {
        setCurrentTrainerSchedule(scheduleData);

        const validation = validateTrainerAvailability(
          scheduleData,
          ClassScheduleData
        );

        if (!validation.valid) {
          setValidationMessage(validation.message);
          setPendingTrainer(trainer);
          return;
        }

        console.log("Trainer can be added:", trainer._id);
        setValidationMessage("");
        setPendingTrainer(null);
      } catch (error) {
        console.error("Error fetching trainer schedule:", error);
        setValidationMessage("Failed to fetch trainer schedule.");
        setPendingTrainer(null);
        setCurrentTrainerSchedule(null);
      }
    }
  };

  const totalPages = Math.ceil(TrainerBasicData?.length / itemsPerPage);
  const currentData = TrainerBasicData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Validation Message & Confirm Buttons */}
      {validationMessage && (
        <ValidationMessage
          setValidationMessage={setValidationMessage}
          scheduleData={currentTrainerSchedule}
          validationMessage={validationMessage}
          setPendingTrainer={setPendingTrainer}
          pendingTrainer={pendingTrainer}
          selectedClass={selectedClass}
          Refetch={Refetch}
        />
      )}

      {/* Trainer Tables */}
      <div className="overflow-x-auto mt-6 px-5 pb-6">
        <table className="min-w-full text-sm text-left border border-gray-400 rounded-md overflow-hidden">
          <thead className="bg-gray-300 text-gray-900">
            <tr>
              <th className="px-4 py-2 border-r">#</th>
              <th className="px-4 py-2 border-r">Image</th>
              <th className="px-4 py-2 border-r">Name</th>
              <th className="px-4 py-2 border-r">Specialization</th>
              <th className="px-4 py-2 border-r">Experience</th>
              <th className="px-4 py-2 border-r">Age</th>
              <th className="px-4 py-2 border-r">Available Days</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData?.map((trainer, index) => {
              const isSelected = selectedClass?.trainers.some(
                (t) => t._id === trainer._id
              );

              return (
                <tr
                  key={trainer._id}
                  className={`border-t ${
                    isSelected ? "bg-green-100" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 border-r">{index + 1}</td>
                  <td className="px-4 py-2 border-r">
                    <img
                      src={trainer.imageUrl}
                      alt={trainer.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2 border-r font-semibold">
                    {trainer.name}
                  </td>
                  <td className="px-4 py-2 border-r">
                    {trainer.specialization}
                  </td>
                  <td className="px-4 py-2 border-r">
                    {trainer.experience} yrs
                  </td>
                  <td className="px-4 py-2 border-r">{trainer.age}</td>
                  <td className="px-4 py-2 border-r text-xs text-gray-700">
                    {trainer.availableDays.join(", ")}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`text-white px-3 py-1 rounded-md text-xs font-semibold ${
                        isSelected
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      onClick={() => handleTrainerAction(trainer, isSelected)}
                    >
                      {isSelected ? "Remove" : "Add"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <div className="join">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-100 text-blue-600"
            }`}
          >
            <FaAnglesLeft />
          </button>
          <span className="join-item h-10 px-5 text-sm flex items-center justify-center border border-gray-300 bg-white text-gray-800 font-semibold">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`join-item bg-white btn btn-sm h-10 px-5 text-sm transition-all duration-200 ${
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-100 text-blue-600"
            }`}
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default ClassDetailsTrainersEditTrainerTable;
